import { getExerciseById, CLIENT_EXERCISES } from './exercises.js';
import { t, tn, exText, repWords, locale } from './i18n.js';
import { levelBadge } from './levels.js';
import { makeDismissable } from './dismissable.js';
import { equipmentForExercises, comfortForExercises, equipmentInfo } from './equipment.js';
import { formatReps, unitKey } from '/format-reps.js';
import { getTodayRoutine, logWorkout, updateProfile, saveCachedRoutine, state, answerProposal,
  revertProgression, getActiveWorkout, saveActiveWorkout } from './client.js';

let currentRoutine = null;
let userSelectedSets = 2; // Implicit 2 serii

let wakeLockSentinel = null;
async function requestWakeLock() {
  if (state.local) window.MiscareNative?.keepAwake(true).catch(() => {});
  if (typeof navigator !== 'undefined' && 'wakeLock' in navigator) {
    try {
      wakeLockSentinel = await navigator.wakeLock.request('screen');
      wakeLockSentinel.addEventListener('release', () => {
        wakeLockSentinel = null;
      });
    } catch {}
  }
}

function releaseWakeLock() {
  if (state.local) window.MiscareNative?.keepAwake(false).catch(() => {});
  if (wakeLockSentinel) {
    try { wakeLockSentinel.release(); } catch {}
    wakeLockSentinel = null;
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (guidedState.active && document.visibilityState === 'hidden') {
      // Background time is a pause, never exercise time the user did not do.
      guidedState.isPaused = true;
      const button = document.getElementById('guided-pause-btn');
      if (button) button.textContent = t('▶️ Continuă');
      checkpoint();
      releaseWakeLock();
    }
    if (guidedState.active && document.visibilityState === 'visible') {
      requestWakeLock();
    }
  });
}

let soundEnabled = typeof localStorage !== 'undefined'
  ? localStorage.getItem('miscare_sound_enabled') !== 'false'
  : true;

let audioContext;
function audio() {
  audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
  if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
  return audioContext;
}

/**
 * Cât durează sesiunea ghidată cu atâtea serii, în minute.
 *
 * Aceeași socoteală ca sesiunea însăși: timpul fiecărei serii, 30 de secunde
 * de pauză între seriile aceluiași exercițiu, 40 între exerciții. Estimarea
 * din motor presupune mereu două serii, așa că „aprox. 6 minute" stătea lângă
 * „2 serii (10 min)" și nu se potrivea cu niciuna.
 */
function estimateMinutes(exercises = [], sets = 2) {
  if (!exercises.length) return 0;
  const work = exercises.reduce((acc, ex) => acc + (ex.duration_s || 45) * sets, 0);
  const rest = exercises.length * (sets - 1) * 30 + (exercises.length - 1) * 40;
  return Math.max(1, Math.round((work + rest) / 60));
}

/** „2 serii", în limba curentă. Pluralul vine din catalog, nu dintr-un `if`. */
function setsLabel(n) {
  return tn('{n} serii', n);
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  try {
    localStorage.setItem('miscare_sound_enabled', soundEnabled ? 'true' : 'false');
  } catch {}
  updateSoundButtons();
  if (soundEnabled) {
    playBeep(660, 0.1);
  }
}

function updateSoundButtons() {
  document.querySelectorAll('.btn-sound-toggle').forEach((btn) => {
    btn.innerHTML = soundEnabled ? '🔊' : '🔇';
    btn.setAttribute('aria-label', soundEnabled ? t('Dezactivează sunetul') : t('Activează sunetul'));
  });
}

function playBeep(freq = 440, duration = 0.08) {
  if (!soundEnabled || typeof window === 'undefined') return;
  try {
    const ctx = audio();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {}
}

function playGentleChime() {
  if (!soundEnabled || typeof window === 'undefined') return;
  try {
    const ctx = audio();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.35); // A5
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.7);
  } catch {}
}

function playRestStartSound() {
  if (!soundEnabled || typeof window === 'undefined') return;
  try {
    const ctx = audio();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(392, ctx.currentTime + 0.4);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch {}
}

function speakVoice(text) {
  if (!soundEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = locale();
    utterance.rate = 1.05;
    const voices = window.speechSynthesis.getVoices();
    const roVoice = voices.find((v) => v.localService && v.lang?.toLowerCase().startsWith(locale()));
    if (state.local && !roVoice) return;
    if (roVoice) utterance.voice = roVoice;
    window.speechSynthesis.speak(utterance);
  } catch {}
}

/**
 * Ținta unui exercițiu pentru contorul din sesiunea ghidată.
 *
 * Unitatea vine din câmpul `reps.unit`, nu din text. Înainte se căuta
 * „secund" în efortul deja tradus: în germană „Sekunden" nu se potrivea, deci
 * o ținere de 30 de secunde ajungea numărată ca 30 de repetări -- iar în
 * română unitatea se afișa „secunde" orice limbă ar fi fost aleasă.
 */
function effortTarget(reps) {
  if (reps && typeof reps === 'object') {
    return { count: Math.max(1, Number(reps.lo) || 10), unit: unitKey(reps.unit) };
  }
  const match = String(reps ?? '').match(/(\d+)/);
  return { count: match ? Math.max(1, parseInt(match[1], 10)) : 10, unit: unitKey(reps) };
}

/** Cuvântul unității, în limba curentă. */
function unitWord(key) {
  return repWords()?.reps?.unit?.[key] ?? key;
}

let guidedState = {
  active: false,
  routine: null,
  totalSets: 2,
  exerciseIndex: 0,
  currentSet: 1,
  isResting: false,
  timerSeconds: 45,
  timerInterval: null,
  isPaused: false,
  elapsedSeconds: 0,
  currentActualReps: 10,
  // Cheia unității (`reps`, `seconds`, `taps`), nu cuvântul: se traduce la
  // desenare, iar sumarul trebuie să știe ce adună.
  repUnit: 'reps',
  exercisesDone: []
};

function checkpoint() {
  if (!state.local) return;
  const { timerInterval, ...snapshot } = guidedState;
  saveActiveWorkout(snapshot).catch(err => {
    // A failed checkpoint must not masquerade as a saved session.
    guidedState.isPaused = true;
    const button = document.getElementById('guided-pause-btn');
    if (button) button.textContent = t('▶️ Continuă');
    let notice = document.getElementById('checkpoint-error');
    if (!notice) {
      notice = document.createElement('p'); notice.id = 'checkpoint-error'; notice.setAttribute('role', 'alert');
      document.querySelector('#guided-overlay .guided-body')?.prepend(notice);
    }
    notice.textContent = t('Nu am putut salva datele. Încearcă din nou.');
    console.error('Workout checkpoint failed', err);
  });
}

export async function restoreWorkout() {
  const saved = await getActiveWorkout();
  if (!saved?.routine) return;
  guidedState = { ...saved, timerInterval: null, isPaused: true };
  if (saved.feedback) {
    openFeedbackModal(saved.routine, saved.elapsedSeconds, saved.exercisesDone);
  } else if (saved.active) {
    const overlay = document.createElement('div');
    overlay.id = 'guided-overlay'; overlay.className = 'guided-overlay';
    document.body.appendChild(overlay);
    if (saved.isResting) renderRestStep(true);
    else renderGuidedStep(true);
    requestWakeLock();
  }
}

/**
 * Întrebarea zilei, când există una.
 *
 * Sesiunea de dedesubt e completă fără ea. Cardul se poate ignora, iar dacă e
 * ignorat nu se schimbă nimic -- de asta „mai târziu" nu e un buton: e ce se
 * întâmplă oricum dacă nu atingi nimic.
 *
 * Cele două răspunsuri arată la fel de disponibile. Un „nu" scris mai mic
 * decât un „da" e tot o împingere, doar mai politicoasă.
 */
/**
 * Ce s-a făcut deja azi.
 *
 * Apare deasupra sesiunii, nu în locul ei. Aplicația nu spune niciodată „ajunge
 * pe ziua de azi" -- cine vrea să mai facă o repriză o face, iar a-i pune un
 * ecran gol în față ar fi exact genul de restricție pe care aplicația asta n-o
 * practică. Dar nici nu se poate preface că nu s-a întâmplat nimic: aceleași
 * exerciții, neschimbate după ce au fost bifate, arată ca și cum bifarea n-ar
 * fi contat.
 */
function renderDoneToday(done) {
  if (!done || !done.sessions) return '';
  const n = done.sessions;
  const sub = done.minutes >= 1
    ? tn('{n} sesiuni bifate — aproximativ {m} min. Ziua e câștigată.', n, { m: done.minutes })
    : tn('{n} sesiuni bifate. Ziua e câștigată.', n);
  return `
    <div class="card done-today-card">
      <div class="done-today-icon">✅</div>
      <div>
        <div class="done-today-title">${t('Ai făcut mișcare azi.')}</div>
        <div class="done-today-sub">${sub}</div>
      </div>
    </div>`;
}

function renderProposal(proposal) {
  if (!proposal) return '';
  // Numele nivelurilor din `vars` sunt și ele chei; numerele trec neatinse.
  const vars = Object.fromEntries(Object.entries(proposal.vars || {})
    .map(([k, v]) => [k, typeof v === 'string' ? t(v) : v]));
  const say = (key) => (typeof vars.n === 'number' ? tn(key, vars.n, vars) : t(key, vars));
  return `
    <div class="card proposal-card" id="proposal-card">
      <div class="proposal-question">${escapeHtml(say(proposal.question))}</div>
      <div class="proposal-note">${escapeHtml(proposal.note ? say(proposal.note) : '')}</div>
      <div class="proposal-actions">
        <button class="btn btn-primary btn-sm" data-proposal="accept">${escapeHtml(say(proposal.accept_label))}</button>
        <button class="btn btn-secondary btn-sm" data-proposal="decline">${escapeHtml(say(proposal.decline_label))}</button>
      </div>
    </div>`;
}

export async function renderRoutineView(container, { forceDuration = null, routine = null, forceRefresh = false } = {}) {
  if (routine) {
    currentRoutine = routine;
  } else {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px 20px;">
        <div class="brand-tagline">${t('Pregătim mișcarea de azi...')}</div>
      </div>
    `;

    currentRoutine = await getTodayRoutine(forceDuration, forceRefresh);
  }

  const currentLevel = state.profile?.level || currentRoutine.level || 'zero';
  const currentProposal = currentRoutine.__proposal || null;
  const doneToday = currentRoutine.__done_today || null;
  const alreadyDone = Boolean(doneToday && doneToday.sessions > 0);
  const isReentry = currentRoutine.is_reentry;
  const note = currentRoutine.adjustment_note;

  let html = `
    <!-- Selector rapid de nivel -->
    <div style="margin-bottom: 14px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
        <span style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">
          ${t('Nivel de intensitate:')}
        </span>
      </div>
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px;">
        <button class="btn ${currentLevel === 'zero' ? 'btn-primary' : 'btn-secondary'} btn-sm btn-level-pill" data-level="zero" style="padding: 6px 2px; font-size: 0.75rem;">
          ${t('De la 0')}
        </button>
        <button class="btn ${currentLevel === 'beginner' ? 'btn-primary' : 'btn-secondary'} btn-sm btn-level-pill" data-level="beginner" style="padding: 6px 2px; font-size: 0.75rem;">
          ${t('Începător')}
        </button>
        <button class="btn ${currentLevel === 'intermediate' ? 'btn-primary' : 'btn-secondary'} btn-sm btn-level-pill" data-level="intermediate" style="padding: 6px 2px; font-size: 0.75rem;">
          ${t('Intermediar')}
        </button>
        <button class="btn ${currentLevel === 'advanced' ? 'btn-primary' : 'btn-secondary'} btn-sm btn-level-pill" data-level="advanced" style="padding: 6px 2px; font-size: 0.75rem;">
          ${t('Avansat')}
        </button>
      </div>
    </div>

    <div class="support-banner">
      <div class="support-banner-icon">${isReentry ? '🌱' : '✨'}</div>
      <div>
        <div class="support-banner-text">${escapeHtml(t(currentRoutine.supportive_message))}</div>
        ${note ? `<div class="adjustment-tag">${escapeHtml(t(note))}</div>` : ''}
      </div>
    </div>

    ${renderDoneToday(doneToday)}
    ${renderProposal(currentProposal)}
    ${currentRoutine.__can_revert ? `<button id="revert-progression" class="btn btn-secondary">${t('Revino la intensitatea anterioară')}</button>` : ''}

    <div class="card">
      <div class="card-header">
        <div>
          <h2 class="card-title">${alreadyDone ? t('Încă o rundă?') : escapeHtml(t(currentRoutine.title))}</h2>
          <p class="card-subtitle">${alreadyDone
            ? t('Opțional, dacă mai ai chef. Nimic nu se pierde dacă te oprești aici.')
            : `<span id="routine-estimate">${tn('Durată estimată: aprox. {n} minute', estimateMinutes(currentRoutine.exercises, userSelectedSets))}</span>`}</p>
        </div>
        <button id="btn-shorten" class="btn btn-secondary btn-sm">
          ${t('⏱️ Fă-o de 5 min')}
        </button>
      </div>

      ${renderGearCard(currentRoutine.exercises)}

      <div id="exercise-list">
  `;

  currentRoutine.exercises.forEach((ex, idx) => {
    const full = getExerciseById(ex.id) || ex;
    html += `
      <div class="exercise-card" data-index="${idx}">
        <div class="exercise-visual ${full.image ? 'has-photo' : ''}">
          ${full.image ? `<img src="${full.image}" alt="${escapeHtml(exText(ex.id, 'name'))}" class="ex-img" />` : (full.svg || '🏃')}
        </div>
        <div class="exercise-content">
          <div class="exercise-name">${idx + 1}. ${escapeHtml(exText(ex.id, 'name'))}</div>
          <div class="exercise-meta">
            ${levelBadge(full.level)}
            <span class="badge badge-reps">${escapeHtml(formatReps(ex.reps, repWords()))}</span>
            <span class="badge">${escapeHtml(exText(ex.id, 'focus'))}</span>
          </div>
          <p class="exercise-desc">${escapeHtml(exText(ex.id, 'description'))}</p>
          ${exText(ex.id, 'tip') ? `<div class="exercise-tip">💡 ${escapeHtml(exText(ex.id, 'tip'))}</div>` : ''}
          <button class="btn-swap" data-swap-index="${idx}">
            ${t('🔄 Schimbă cu altul')}
          </button>
        </div>
      </div>
    `;
  });

  html += `
      </div>

      <!-- Selector număr de serii -->
      <div class="sets-selector-box">
        <div class="sets-selector-title">${t('Câte serii vrei să faci azi?')}</div>
        <div class="sets-selector-group">
          <button type="button" class="btn-set-choice ${userSelectedSets === 1 ? 'active' : ''}" data-sets="1">
            ${t('1 Serie')}
            <span class="set-sub">${t('Rapid')} · ${t('~{n} min', { n: estimateMinutes(currentRoutine.exercises, 1) })}</span>
          </button>
          <button type="button" class="btn-set-choice ${userSelectedSets === 2 ? 'active' : ''}" data-sets="2">
            ${t('2 Serii')}
            <span class="set-sub">${t('Optim')} · ${t('~{n} min', { n: estimateMinutes(currentRoutine.exercises, 2) })}</span>
          </button>
          <button type="button" class="btn-set-choice ${userSelectedSets === 3 ? 'active' : ''}" data-sets="3">
            ${t('3 Serii')}
            <span class="set-sub">${t('Intens')} · ${t('~{n} min', { n: estimateMinutes(currentRoutine.exercises, 3) })}</span>
          </button>
        </div>
      </div>

      <div class="actions-stack">
        <button id="btn-start-guided" class="btn btn-primary">
          ${t('▶️ Ghidează-mă pas cu pas ({sets})', { sets: setsLabel(userSelectedSets) })}
        </button>
        <button id="btn-quick-log" class="btn btn-secondary">
          ${t('✅ Am făcut deja! Bifează rapid')}
        </button>
      </div>

      <div style="margin-top: 14px; text-align: center;">
        <button id="btn-explore-compendium" class="btn btn-secondary" style="font-size: 0.85rem; width: 100%; border-style: dashed; display: flex; align-items: center; justify-content: center; gap: 6px;">
          <span>📖</span> ${t('Explorează compendiul de exerciții ({n} mișcări pe niveluri)', { n: CLIENT_EXERCISES.length })}
        </button>
      </div>
    </div>

    <!-- Modal pentru vizualizare mărită (mare = animat / foto completă) -->
    <div id="exercise-preview-modal" class="practice-modal-overlay hidden" aria-modal="true" role="dialog">
      <div class="practice-modal-card" style="max-width: 440px;">
        <div class="practice-modal-header">
          <h3 id="preview-modal-title" class="practice-modal-title" style="margin: 0; font-size: 1.1rem;"></h3>
          <button id="btn-close-preview" class="btn-close-circle" aria-label="${t('Închide')}">✕</button>
        </div>
        <div id="preview-modal-body"></div>
      </div>
    </div>
  `;

  container.innerHTML = html;

  container.querySelector('#revert-progression')?.addEventListener('click', async () => {
    try { await revertProgression(); await renderRoutineView(container); }
    catch (err) { alert(t(err.message)); }
  });

  // Event handlers
  container.querySelectorAll('.exercise-card').forEach((card) => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      if (e.target.closest('.btn-swap-exercise')) return;
      const idx = parseInt(card.dataset.index, 10);
      const ex = currentRoutine?.exercises?.[idx];
      if (!ex) return;
      const full = getExerciseById(ex.id) || ex;
      openExercisePreview(full, container);
    });
  });

  container.querySelector('#btn-explore-compendium')?.addEventListener('click', () => {
    document.querySelector('.nav-item[data-tab="compendium"]')?.click();
  });

  container.querySelectorAll('.btn-set-choice').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      userSelectedSets = parseInt(e.currentTarget.dataset.sets, 10);
      container.querySelectorAll('.btn-set-choice').forEach((b) => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      const startBtn = container.querySelector('#btn-start-guided');
      if (startBtn) {
        startBtn.textContent = t('▶️ Ghidează-mă pas cu pas ({sets})', { sets: setsLabel(userSelectedSets) });
      }
      const estimate = container.querySelector('#routine-estimate');
      if (estimate) {
        estimate.textContent = tn('Durată estimată: aprox. {n} minute', estimateMinutes(currentRoutine.exercises, userSelectedSets));
      }
    });
  });

  container.querySelectorAll('.btn-level-pill').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      const newLvl = e.currentTarget.dataset.level;
      if (newLvl === currentLevel) return;
      await updateProfile({ level: newLvl });
      renderRoutineView(container, { forceRefresh: true });
    });
  });

  container.querySelectorAll('[data-proposal]').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      const accepted = e.currentTarget.dataset.proposal === 'accept';
      const card = container.querySelector('#proposal-card');
      container.querySelectorAll('[data-proposal]').forEach((b) => { b.disabled = true; });
      try {
        await answerProposal(currentProposal.kind, accepted, currentRoutine.days_since_last || 0);
        if (accepted) {
          // Sesiunea de azi se reface pe loc, ca schimbarea acceptată să fie
          // vizibilă imediat -- altfel „da" nu pare să facă nimic.
          renderRoutineView(container, { forceRefresh: true });
        } else if (card) {
          card.remove();
        }
      } catch {
        container.querySelectorAll('[data-proposal]').forEach((b) => { b.disabled = false; });
      }
    });
  });

  container.querySelector('#btn-shorten')?.addEventListener('click', () => {
    userSelectedSets = 1;
    renderRoutineView(container, { forceDuration: 5, forceRefresh: true });
  });

  container.querySelector('#btn-start-guided')?.addEventListener('click', () => {
    startGuidedWorkout(currentRoutine, userSelectedSets);
  });

  container.querySelector('#btn-quick-log')?.addEventListener('click', () => {
    openFeedbackModal(currentRoutine, currentRoutine.target_minutes * 60, currentRoutine.exercises);
  });

  container.querySelectorAll('.btn-swap').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.currentTarget.dataset.swapIndex, 10);
      swapExercise(idx, container);
    });
  });
}

function notifyToast(message) {
  const toastContainer = document.querySelector('.toast-container') || document.body;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

function swapExercise(index, container) {
  if (!currentRoutine || !currentRoutine.exercises || !currentRoutine.exercises[index]) return;
  const current = currentRoutine.exercises[index];
  const currentDef = getExerciseById(current.id) || current;

  const routineLevel = currentRoutine.level || state.profile?.level || 'zero';
  const levelMap = { zero: 0, beginner: 1, intermediate: 2, advanced: 3 };
  const currentLevelNum = levelMap[routineLevel] ?? (levelMap[state.profile?.level] ?? 0);
  const targetLevel = Math.max(currentLevelNum, currentDef.level ?? 0);

  const profileEquipment = Array.isArray(state.profile?.equipment)
    ? state.profile.equipment
    : ['bodyweight', 'chair', 'wall'];
  const userEquipment = new Set(['bodyweight', 'chair', 'wall', ...profileEquipment]);
  if (Array.isArray(currentDef.equipment)) {
    currentDef.equipment.forEach((eq) => userEquipment.add(eq));
  }

  // Candidați compatibili (fără exercițiul curent și fără duplicate în alte sloturi)
  let eligible = CLIENT_EXERCISES.filter((e) => {
    if (e.id === current.id) return false;
    if (currentRoutine.exercises.some((ce, idx) => idx !== index && ce.id === e.id)) return false;
    if (e.level > targetLevel) return false;
    return e.equipment.every((eq) => userEquipment.has(eq));
  });

  if (eligible.length === 0) {
    // Relaxare condiție echipament la accesorii de bază fără unelte dedicate
    eligible = CLIENT_EXERCISES.filter((e) => {
      if (e.id === current.id) return false;
      if (currentRoutine.exercises.some((ce, idx) => idx !== index && ce.id === e.id)) return false;
      return e.equipment.every((eq) => ['bodyweight', 'chair', 'wall'].includes(eq));
    });
  }

  if (eligible.length === 0) {
    eligible = CLIENT_EXERCISES.filter((e) => e.id !== current.id);
  }

  if (eligible.length === 0) return;

  // 1. Prioritate maximă: alternativele declarate explicit în exercițiu (swaps)
  const swapIds = currentDef.swaps || current.swaps || [];
  const declaredSwaps = swapIds
    .map((id) => eligible.find((e) => e.id === id))
    .filter(Boolean);

  // 2. Prioritate secundară: aceeași categorie musculară (upper -> upper, lower -> lower, core -> core)
  const sameCategory = eligible.filter((e) => e.category === current.category);

  const pool = declaredSwaps.length > 0
    ? declaredSwaps
    : sameCategory.length > 0
    ? sameCategory
    : eligible;

  const next = pool[Math.floor(Math.random() * pool.length)];

  currentRoutine.exercises[index] = {
    ...next,
    reps: next.reps
  };

  saveCachedRoutine(currentRoutine);

  renderRoutineView(container, { routine: currentRoutine });

  // Evidențiere vizuală card schimbat
  const updatedCard = container.querySelector(`.exercise-card[data-index="${index}"]`);
  if (updatedCard) {
    updatedCard.classList.add('swapped');
  }

  notifyToast(`🔄 Schimbat cu: ${exText(next.id, 'name')}`);
}

/** Închide previzualizarea de pe „Azi", cât timp e deschisă. */
let closePreview = null;

/**
 * Ce trebuie strâns înainte de a începe.
 *
 * Echipamentul era scris pe fiecare exercițiu în parte, deci se afla pe rând,
 * în timpul sesiunii: ajungeai la a treia mișcare și abia atunci vedeai că-ți
 * trebuie o ganteră, te ridicai după ea și se rupea ritmul. Ce se cere se
 * adună o dată, la început.
 *
 * Greutatea corpului nu apare în listă -- nu se strânge de nicăieri. Când e
 * singura, lista iese goală, iar cardul spune exact asta în loc să rămână un
 * dreptunghi gol.
 */
function renderGearCard(exercises) {
  const full = exercises.map((ex) => getExerciseById(ex.id) || ex);
  const needed = equipmentForExercises(full);

  /*
   * Confortul nu blochează nimic.
   *
   * Salteaua și perna sunt sugestii, nu cerințe: cine are un covor poate face
   * bird-dog, iar „de la 0, cu ce ai" ar suna fals dacă mișcările la sol s-ar
   * debloca prin cumpărături. Ce are omul apare ca pastilă -- deci bifarea
   * chiar schimbă cardul -- iar ce n-are apare ca o vorbă bună, cu alternativa
   * la îndemână.
   */
  const owned = new Set(state.profile?.equipment || ['bodyweight', 'chair', 'wall']);
  const comfort = comfortForExercises(full);
  const bring = comfort.filter((id) => owned.has(id));
  const hints = comfort.filter((id) => !owned.has(id));

  const pill = (id) => {
    const info = equipmentInfo(id);
    return `<span class="gear-pill">${info.icon} ${escapeHtml(t(info.name))}</span>`;
  };
  const HINT = {
    yoga_mat: 'Azi ai mișcări la sol — o saltea sau un covor fac diferența.',
    cushion: 'O pernă sub genunchi ajută la mișcările cu sprijin pe genunchi.'
  };

  const all = [...needed, ...bring];
  return `
    <div class="gear-card">
      <div class="gear-card-title">🎒 ${t('De pregătit pentru azi')}</div>
      ${all.length ? `
        <div class="gear-list">${all.map(pill).join('')}</div>
        <p class="gear-note">${t('Strânge-le acum, ca să nu întrerupi sesiunea căutându-le.')}</p>
      ` : `
        <p class="gear-note">${t('Nimic de adus — azi lucrezi doar cu greutatea corpului.')}</p>
      `}
      ${hints.map((id) => `<p class="gear-note gear-hint">${t(HINT[id])}</p>`).join('')}
    </div>
  `;
}

function openExercisePreview(full, container) {
  const modal = container.querySelector('#exercise-preview-modal');
  if (!modal) return;
  const title = container.querySelector('#preview-modal-title');
  const body = container.querySelector('#preview-modal-body');
  if (title) title.textContent = exText(full.id, 'name');
  if (body) {
    const largeSrc = full.animation || full.image;
    body.innerHTML = `
      ${largeSrc ? `
        <div class="detail-photo-banner">
          <img src="${largeSrc}" alt="${escapeHtml(exText(full.id, 'name'))}" class="detail-full-photo" />
        </div>
      ` : `
        <div style="width: 140px; height: 140px; margin: 0 auto 14px; display: flex; align-items: center; justify-content: center;">${full.svg || '🏃'}</div>
      `}
      <div style="font-size: 0.9rem; margin-bottom: 8px;">
        <span class="badge badge-reps">${escapeHtml(formatReps(full.reps || full.default_reps, repWords()))}</span>
        <span class="badge" style="margin-left: 4px;">${escapeHtml(exText(full.id, 'focus'))}</span>
      </div>
      <p style="font-size: 0.9rem; line-height: 1.4; color: var(--text); margin-bottom: 8px;">
        ${escapeHtml(exText(full.id, 'description'))}
      </p>
      ${exText(full.id, 'tip') ? `
        <div class="exercise-tip" style="margin-top: 6px;">
          💡 ${escapeHtml(exText(full.id, 'tip'))}
        </div>
      ` : ''}
    `;
  }
  modal.classList.remove('hidden');

  // Înapoi, Escape, clic pe fundal și trasul în jos, ca la foaia din compendiu.
  ({ close: closePreview } = makeDismissable({
    name: 'preview',
    overlay: modal,
    panel: modal.querySelector('.practice-modal-card'),
    scroller: body,
    onDismiss: () => {
      modal.classList.add('hidden');
      closePreview = null;
    }
  }));

  container.querySelector('#btn-close-preview').onclick = () => closePreview?.();
}

// ---------------------------------------------------------------- Guided Workout Runner

function startGuidedWorkout(routine, sets = userSelectedSets) {
  guidedState = {
    id: crypto.randomUUID(),
    active: true,
    routine: routine,
    totalSets: Math.max(1, sets || 2),
    exerciseIndex: 0,
    currentSet: 1,
    isResting: false,
    timerSeconds: 45,
    timerInterval: null,
    isPaused: false,
    elapsedSeconds: 0,
    currentActualReps: 10,
    repUnit: 'reps',
    exercisesDone: []
  };

  requestWakeLock();

  const overlay = document.createElement('div');
  overlay.id = 'guided-overlay';
  overlay.className = 'guided-overlay';
  document.body.appendChild(overlay);

  renderGuidedStep();
}

function renderGuidedStep(restoring = false) {
  guidedState.isResting = false;
  const overlay = document.getElementById('guided-overlay');
  if (!overlay || !guidedState.routine) return;

  const currentEx = guidedState.routine.exercises[guidedState.exerciseIndex];
  const full = getExerciseById(currentEx.id) || currentEx;

  // Reps parsing
  const repInfo = effortTarget(currentEx.reps);
  if (!restoring) {
    guidedState.currentActualReps = repInfo.count;
    guidedState.repUnit = repInfo.unit;
  }
  // O sesiune întreruptă înainte de chei are aici „secunde" sau „repetări".
  guidedState.repUnit = unitKey(guidedState.repUnit);
  const timed = guidedState.repUnit === 'seconds';

  // Step progress
  const totalSteps = guidedState.routine.exercises.length * guidedState.totalSets;
  const currentStepNum = guidedState.exerciseIndex * guidedState.totalSets + (guidedState.currentSet - 1);
  const progressPercent = Math.round((currentStepNum / totalSteps) * 100);

  if (!restoring) guidedState.timerSeconds = currentEx.duration_s || 45;
  clearInterval(guidedState.timerInterval);

  overlay.innerHTML = `
    <div class="guided-header">
      <button id="guided-close" class="btn btn-secondary btn-sm">${t('✕ Ieși')}</button>
      <div style="text-align: center;">
        <div style="font-weight: 700; font-size: 0.92rem; color: var(--text);">
          ${t('Exercițiul {i} din {n}', { i: guidedState.exerciseIndex + 1, n: guidedState.routine.exercises.length })}
        </div>
        <div style="font-size: 0.78rem; font-weight: 700; color: var(--primary);">
          ${t('Seria {i} din {n}', { i: guidedState.currentSet, n: guidedState.totalSets })}
        </div>
      </div>
      <button id="guided-sound-toggle" class="btn-sound-toggle" title="${t('Comută sunetul')}">
        ${soundEnabled ? '🔊' : '🔇'}
      </button>
    </div>

    <div class="guided-progress-bar">
      <div class="guided-progress-fill" style="width: ${progressPercent}%;"></div>
    </div>

    <div class="guided-body">
      <div class="guided-visual ${(full.animation || full.image) ? 'has-photo' : ''}">
        ${(full.animation || full.image) ? `<img src="${full.animation || full.image}" alt="${escapeHtml(exText(currentEx.id, 'name'))}" class="guided-photo" />` : (full.svg || '🏃')}
      </div>

      <h2 class="guided-name">${escapeHtml(exText(currentEx.id, 'name'))}</h2>
      <div class="guided-target">${escapeHtml(formatReps(currentEx.reps, repWords()))}</div>

      <div class="guided-timer" id="guided-timer-display">
        ${formatSeconds(guidedState.timerSeconds)}
      </div>

      <!-- Rep Counter Interactive -->
      <div class="rep-counter-container">
        <div class="rep-counter-label">${timed ? t('Secunde ținute în această serie:') : t('Repetări realizate în această serie:')}</div>
        <div class="rep-counter-box">
          <button id="rep-minus-btn" class="rep-btn" aria-label="${t('Scade repetări')}">−</button>
          <div class="rep-display">
            <span id="rep-value" class="rep-value">${guidedState.currentActualReps}</span>
            <span class="rep-unit">${escapeHtml(unitWord(guidedState.repUnit))}</span>
          </div>
          <button id="rep-plus-btn" class="rep-btn" aria-label="${t('Crește repetări')}">+</button>
        </div>
      </div>

      <p class="exercise-desc" style="max-width: 400px; margin: 4px 0 8px 0;">
        ${escapeHtml(exText(currentEx.id, 'description'))}
      </p>

      ${exText(currentEx.id, 'tip') ? `<div class="exercise-tip" style="max-width: 400px;">💡 ${escapeHtml(exText(currentEx.id, 'tip'))}</div>` : ''}
    </div>

    <div class="guided-footer">
      <div style="display: flex; gap: 10px;">
        <button id="guided-pause-btn" class="btn btn-secondary" style="flex: 1;">
          ${guidedState.isPaused ? t('▶️ Continuă') : t('⏸️ Pauză')}
        </button>
        <button id="guided-done-btn" class="btn btn-primary" style="flex: 2;">
          ${(guidedState.exerciseIndex === guidedState.routine.exercises.length - 1 && guidedState.currentSet === guidedState.totalSets)
            ? t('🎉 Finalizează antrenamentul')
            : t('➡️ Serie terminată')}
        </button>
      </div>
    </div>
  `;

  // Start voice prompt
  speakVoice(t('{name}, seria {i}', { name: exText(currentEx.id, 'name'), i: guidedState.currentSet }));

  // Sound toggle button
  overlay.querySelector('#guided-sound-toggle')?.addEventListener('click', () => {
    toggleSound();
  });

  // Rep counter handlers
  const repValueEl = overlay.querySelector('#rep-value');
  overlay.querySelector('#rep-minus-btn')?.addEventListener('click', () => {
    if (guidedState.currentActualReps > 0) {
      guidedState.currentActualReps--;
      checkpoint();
      if (repValueEl) repValueEl.textContent = guidedState.currentActualReps;
      playBeep(330, 0.04);
    }
  });

  overlay.querySelector('#rep-plus-btn')?.addEventListener('click', () => {
    guidedState.currentActualReps++;
    checkpoint();
    if (repValueEl) repValueEl.textContent = guidedState.currentActualReps;
    playBeep(520, 0.04);
  });

  startExerciseTimer();
  checkpoint();

  // Close handler
  overlay.querySelector('#guided-close')?.addEventListener('click', () => {
    if (confirm(t('Vrei să oprești sesiunea? Ce ai făcut până acum contează!'))) {
      stopTimer();
      guidedState.active = false;
      releaseWakeLock();
      overlay.remove();
      if (guidedState.exercisesDone.length > 0) {
        openFeedbackModal(guidedState.routine, guidedState.elapsedSeconds, guidedState.exercisesDone);
      } else saveActiveWorkout(null).catch(err => alert(t(err.message)));
    }
  });

  // Pause handler
  const pauseBtn = overlay.querySelector('#guided-pause-btn');
  pauseBtn?.addEventListener('click', () => {
    guidedState.isPaused = !guidedState.isPaused;
    pauseBtn.innerHTML = guidedState.isPaused ? t('▶️ Continuă') : t('⏸️ Pauză');
    checkpoint();
  });

  // Done handler
  overlay.querySelector('#guided-done-btn')?.addEventListener('click', () => {
    completeExerciseStep();
  });
}

function startExerciseTimer() {
  const display = document.getElementById('guided-timer-display');
  clearInterval(guidedState.timerInterval);

  guidedState.timerInterval = setInterval(() => {
    if (guidedState.isPaused) return;

    guidedState.elapsedSeconds++;
    if (guidedState.timerSeconds > 0) {
      guidedState.timerSeconds--;
      if (display) display.textContent = formatSeconds(guidedState.timerSeconds);

      // Beeps on 3, 2, 1
      if (guidedState.timerSeconds === 3 || guidedState.timerSeconds === 2 || guidedState.timerSeconds === 1) {
        playBeep(440, 0.08);
      }

      if (guidedState.timerSeconds === 0) {
        playGentleChime();
        if (display) display.textContent = t('Gata seria!');
      }
    }
    checkpoint();
  }, 1000);
}

function stopTimer() {
  clearInterval(guidedState.timerInterval);
}

function completeExerciseStep() {
  stopTimer();
  const currentEx = guidedState.routine.exercises[guidedState.exerciseIndex];

  // Record set
  guidedState.exercisesDone.push({
    id: currentEx.id,
    name: exText(currentEx.id, 'name'),
    set: guidedState.currentSet,
    totalSets: guidedState.totalSets,
    target_reps: formatReps(currentEx.reps, repWords()),
    actual_reps: guidedState.currentActualReps,
    unit: guidedState.repUnit
  });

  const isLastSetOfLastExercise =
    guidedState.exerciseIndex === guidedState.routine.exercises.length - 1 &&
    guidedState.currentSet === guidedState.totalSets;

  if (isLastSetOfLastExercise) {
    guidedState.active = false;
    releaseWakeLock();
    const overlay = document.getElementById('guided-overlay');
    if (overlay) overlay.remove();
    playGentleChime();
    speakVoice(t('Felicitări! Ai terminat antrenamentul!'));
    openFeedbackModal(guidedState.routine, guidedState.elapsedSeconds, guidedState.exercisesDone);
  } else {
    renderRestStep();
  }
}

function renderRestStep(restoring = false) {
  guidedState.isResting = true;
  const overlay = document.getElementById('guided-overlay');
  if (!overlay || !guidedState.routine) return;

  const sameExerciseNext = guidedState.currentSet < guidedState.totalSets;
  const nextEx = sameExerciseNext
    ? guidedState.routine.exercises[guidedState.exerciseIndex]
    : guidedState.routine.exercises[guidedState.exerciseIndex + 1];
  const nextSetNum = sameExerciseNext ? guidedState.currentSet + 1 : 1;
  const nextFull = getExerciseById(nextEx.id) || nextEx;

  // 30s rest between sets of same exercise, 40s between different exercises
  if (!restoring) guidedState.timerSeconds = sameExerciseNext ? 30 : 40;
  clearInterval(guidedState.timerInterval);

  const totalSteps = guidedState.routine.exercises.length * guidedState.totalSets;
  const currentStepNum = guidedState.exerciseIndex * guidedState.totalSets + guidedState.currentSet;
  const progressPercent = Math.round((currentStepNum / totalSteps) * 100);

  overlay.innerHTML = `
    <div class="guided-header">
      <button id="guided-close" class="btn btn-secondary btn-sm">${t('✕ Ieși')}</button>
      <div style="font-weight: 700; font-size: 0.92rem; color: var(--text);">
        ${t('Odihnă & Respirație')}
      </div>
      <button id="guided-sound-toggle" class="btn-sound-toggle" title="${t('Comută sunetul')}">
        ${soundEnabled ? '🔊' : '🔇'}
      </button>
    </div>

    <div class="guided-progress-bar">
      <div class="guided-progress-fill" style="width: ${progressPercent}%;"></div>
    </div>

    <div class="guided-body">
      <div class="guided-rest-card">
        <div class="rest-badge">
          ${t('🧘 Trage-ți sufletul & bea o gură de apă')}
        </div>

        <div class="rest-timer-display" id="guided-rest-timer">
          ${formatSeconds(guidedState.timerSeconds)}
        </div>

        <div class="rest-preview-card">
          <div class="rest-preview-thumb ${nextFull.image ? 'has-photo' : ''}">
            ${nextFull.image ? `<img src="${nextFull.image}" alt="${escapeHtml(exText(nextEx.id, 'name'))}" class="ex-img" />` : (nextFull.svg || '🏃')}
          </div>
          <div class="rest-preview-info">
            <div class="rest-preview-sub">${t('Urmează:')}</div>
            <div class="rest-preview-name">${escapeHtml(exText(nextEx.id, 'name'))}</div>
            <div class="rest-preview-target">${t('Seria {i} din {n}', { i: nextSetNum, n: guidedState.totalSets })} • ${escapeHtml(formatReps(nextEx.reps, repWords()))}</div>
          </div>
        </div>

        <div class="rest-actions-row">
          <button id="guided-pause-btn" class="btn btn-secondary">${guidedState.isPaused ? t('▶️ Continuă') : t('⏸️ Pauză')}</button>
          <button id="rest-add-time-btn" class="btn btn-secondary" style="flex: 1;">
            ${t('+15s Pauză')}
          </button>
          <button id="rest-skip-btn" class="btn btn-primary" style="flex: 1.5;">
            ${t('▶️ Începe acum')}
          </button>
        </div>
      </div>
    </div>

    <div class="guided-footer">
      <p style="text-align: center; font-size: 0.8rem; color: var(--text-muted); margin: 0;">
        ${t('Ecranul va trece automat la seria următoare când timpul expiră.')}
      </p>
    </div>
  `;

  playRestStartSound();
  speakVoice(t('Pauză de odihnă'));
  checkpoint();
  overlay.querySelector('#guided-pause-btn')?.addEventListener('click', event => {
    guidedState.isPaused = !guidedState.isPaused;
    event.currentTarget.textContent = guidedState.isPaused ? t('▶️ Continuă') : t('⏸️ Pauză');
    checkpoint();
  });

  overlay.querySelector('#guided-sound-toggle')?.addEventListener('click', () => {
    toggleSound();
  });

  overlay.querySelector('#rest-add-time-btn')?.addEventListener('click', () => {
    guidedState.timerSeconds += 15;
    checkpoint();
    const restTimerEl = document.getElementById('guided-rest-timer');
    if (restTimerEl) restTimerEl.textContent = formatSeconds(guidedState.timerSeconds);
    playBeep(440, 0.05);
  });

  overlay.querySelector('#rest-skip-btn')?.addEventListener('click', () => {
    advanceToNextSet();
  });

  overlay.querySelector('#guided-close')?.addEventListener('click', () => {
    if (confirm(t('Vrei să oprești sesiunea? Ce ai făcut până acum contează!'))) {
      stopTimer();
      guidedState.active = false;
      releaseWakeLock();
      overlay.remove();
      if (guidedState.exercisesDone.length > 0) {
        openFeedbackModal(guidedState.routine, guidedState.elapsedSeconds, guidedState.exercisesDone);
      } else saveActiveWorkout(null).catch(err => alert(t(err.message)));
    }
  });

  startRestTimer();
}

function startRestTimer() {
  const display = document.getElementById('guided-rest-timer');
  clearInterval(guidedState.timerInterval);

  guidedState.timerInterval = setInterval(() => {
    if (guidedState.isPaused) return;

    guidedState.elapsedSeconds++;
    if (guidedState.timerSeconds > 0) {
      guidedState.timerSeconds--;
      if (display) display.textContent = formatSeconds(guidedState.timerSeconds);

      if (guidedState.timerSeconds === 3 || guidedState.timerSeconds === 2 || guidedState.timerSeconds === 1) {
        playBeep(520, 0.08);
      }

      if (guidedState.timerSeconds === 0) {
        playGentleChime();
        speakVoice(t('Pregătește-te!'));
        advanceToNextSet();
      }
    }
    checkpoint();
  }, 1000);
}

function advanceToNextSet() {
  stopTimer();
  if (guidedState.currentSet < guidedState.totalSets) {
    guidedState.currentSet++;
  } else {
    guidedState.exerciseIndex++;
    guidedState.currentSet = 1;
  }
  renderGuidedStep();
}

// ---------------------------------------------------------------- Feedback & Celebration Modal

function openFeedbackModal(routine, durationSeconds, exercisesDone) {
  let selectedFeedback = state.local && guidedState.feedback ? guidedState.selectedFeedback || 'just_right' : 'just_right';
  if (state.local) {
    // Keep the unsaved feedback screen recoverable too; a retry uses the same ID.
    guidedState = { ...guidedState, id: guidedState.active || guidedState.feedback ? guidedState.id : crypto.randomUUID(),
      active: false, feedback: true, selectedFeedback, routine, elapsedSeconds: durationSeconds, exercisesDone: exercisesDone || routine.exercises };
    checkpoint();
  }
  const modal = document.createElement('div');
  modal.id = 'feedback-modal';
  modal.className = 'guided-overlay';

  const minutesDone = Math.max(1, Math.round(durationSeconds / 60));
  const totalSets = Array.isArray(exercisesDone) ? exercisesDone.length : 0;
  // Repetările și secundele se adună separat. Adunate laolaltă, o ținere de
  // 30 de secunde apărea în sumar drept „30 de repetări".
  const done = Array.isArray(exercisesDone) ? exercisesDone : [];
  const sumOf = (wanted) => done
    .filter((ex) => (unitKey(ex.unit) === 'seconds') === wanted)
    .reduce((acc, ex) => acc + (parseInt(ex.actual_reps, 10) || 0), 0);
  const totalReps = sumOf(false);
  const totalHeld = sumOf(true);

  modal.innerHTML = `
    <div class="guided-body">
      <div style="font-size: 3.5rem; margin-bottom: 10px;">🌟</div>
      <h2 style="font-size: 1.6rem; font-weight: 800; margin-bottom: 6px;">
        ${t('Bravo! Ai făcut mișcare azi.')}
      </h2>
      <p style="color: var(--text-muted); margin-bottom: 12px;">
        ${t('Aproximativ')} <strong>${t('{n} min', { n: minutesDone })}</strong> ${t('dedicate stării tale de bine.')}
      </p>

      ${totalSets > 0 ? `
        <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; margin-bottom: 20px;">
          <span class="badge badge-reps">🔁 ${tn('{n} serii finalizate', totalSets)}</span>
          ${totalReps > 0 ? `<span class="badge">🔢 ${tn('{n} repetări în total', totalReps)}</span>` : ''}
          ${totalHeld > 0 ? `<span class="badge">⏱️ ${tn('{n} secunde de menținere', totalHeld)}</span>` : ''}
        </div>
      ` : ''}

      <div class="card" style="width: 100%; max-width: 440px; text-align: left;">
        <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 10px;">
          ${t('Cum s-a simțit sesiunea?')}
        </h3>
        <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 14px;">
          ${t('Fără note sau judecată — doar ne ajuți să calibrăm intensitatea următoare.')}
        </p>

        <div class="feedback-grid">
          <div class="feedback-btn selected" data-feedback="just_right">
            <span class="feedback-emoji">👍</span>
            <span class="feedback-label">${t('Tocmai bine')}</span>
          </div>
          <div class="feedback-btn" data-feedback="easy">
            <span class="feedback-emoji">😊</span>
            <span class="feedback-label">${t('Ușor & revigorant')}</span>
          </div>
          <div class="feedback-btn" data-feedback="hard">
            <span class="feedback-emoji">🥵</span>
            <span class="feedback-label">${t('Cam greu')}</span>
          </div>
          <div class="feedback-btn" data-feedback="partial">
            <span class="feedback-emoji">⏱️</span>
            <span class="feedback-label">${t('Doar o parte')}</span>
          </div>
        </div>

        <div id="feedback-hint" style="font-size: 0.82rem; color: var(--primary); font-weight: 500; min-height: 24px;">
          ${t('Menținem același ritm prietenos și data viitoare.')}
        </div>
      </div>

      <button id="btn-save-log" class="btn btn-primary" style="max-width: 440px; margin-top: 14px;">
        ${t('Salvează în jurnal')}
      </button>
    </div>
  `;

  document.body.appendChild(modal);

  const hintEl = modal.querySelector('#feedback-hint');

  const hints = {
    just_right: t('Menținem același ritm prietenos și data viitoare.'),
    easy: t('Super! Putem adăuga subtil o repetare în plus data viitoare.'),
    hard: t('Nicio problemă! Data viitoare reducem automat numărul de repetări.'),
    partial: t('Și 2-3 minute contează enorm. Ai făcut un pas excelent!')
  };

  modal.querySelectorAll('.feedback-btn').forEach((btn) => {
    btn.classList.toggle('selected', btn.dataset.feedback === selectedFeedback);
    btn.addEventListener('click', () => {
      modal.querySelectorAll('.feedback-btn').forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedFeedback = btn.dataset.feedback;
      guidedState.selectedFeedback = selectedFeedback;
      checkpoint();
      if (hintEl) hintEl.textContent = hints[selectedFeedback] || '';
    });
  });
  if (hintEl) hintEl.textContent = hints[selectedFeedback] || '';

  modal.querySelector('#btn-save-log')?.addEventListener('click', async () => {
    const btn = modal.querySelector('#btn-save-log');
    btn.disabled = true;
    btn.textContent = t('Se salvează...');

    try {
    await logWorkout({
      ...(state.local ? { id: guidedState.id } : {}),
      routine_title: routine.title,
      duration_seconds: durationSeconds,
      completion_status: selectedFeedback === 'partial' ? 'partial' : 'completed',
      exercises_done: exercisesDone || routine.exercises,
      feedback: selectedFeedback,
      adjustment_note: selectedFeedback === 'hard'
        ? t('Ajustat automat mai blând pentru data viitoare.')
        : null
    });
    guidedState.feedback = false;

    modal.remove();

    // Redirecționează spre tab-ul Progres
    document.querySelector('[data-tab="progress"]')?.click();
    } catch (err) {
      btn.disabled = false;
      btn.textContent = t('Salvează în jurnal');
      alert(err.message ? t(err.message) : t('Nu am putut salva datele. Încearcă din nou.'));
    }
  });
}

function formatSeconds(sec) {
  const s = Math.max(0, sec);
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${m}:${rem < 10 ? '0' : ''}${rem}`;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
