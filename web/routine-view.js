import { getExerciseById, CLIENT_EXERCISES } from './exercises.js';
import { getTodayRoutine, logWorkout, updateProfile, saveCachedRoutine, state } from './server-client.js';

let currentRoutine = null;
let userSelectedSets = 2; // Implicit 2 serii

let wakeLockSentinel = null;
async function requestWakeLock() {
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
  if (wakeLockSentinel) {
    try { wakeLockSentinel.release(); } catch {}
    wakeLockSentinel = null;
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (guidedState.active && document.visibilityState === 'visible') {
      requestWakeLock();
    }
  });
}

let soundEnabled = typeof localStorage !== 'undefined'
  ? localStorage.getItem('miscare_sound_enabled') !== 'false'
  : true;

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
    btn.setAttribute('aria-label', soundEnabled ? 'Dezactivează sunetul' : 'Activează sunetul');
  });
}

function playBeep(freq = 440, duration = 0.08) {
  if (!soundEnabled || typeof window === 'undefined') return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
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
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
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
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
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
    utterance.lang = 'ro-RO';
    utterance.rate = 1.05;
    const voices = window.speechSynthesis.getVoices();
    const roVoice = voices.find((v) => v.lang && v.lang.toLowerCase().startsWith('ro'));
    if (roVoice) utterance.voice = roVoice;
    window.speechSynthesis.speak(utterance);
  } catch {}
}

function parseDefaultReps(repsStr) {
  if (!repsStr) return { count: 10, unit: 'repetări' };
  const str = String(repsStr).toLowerCase();
  const isSeconds = str.includes('secund') || str.includes('sec');
  const isPerSide = str.includes('pe parte');

  const match = str.match(/(\d+)\s*-\s*(\d+)/);
  let count = 10;
  if (match) {
    count = parseInt(match[1], 10);
  } else {
    const single = str.match(/(\d+)/);
    if (single) count = parseInt(single[1], 10);
  }

  const unit = isSeconds ? 'secunde' : isPerSide ? 'pe parte' : 'repetări';
  return { count: Math.max(1, count), unit };
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
  repUnit: 'repetări',
  exercisesDone: []
};

export async function renderRoutineView(container, { forceDuration = null, routine = null, forceRefresh = false } = {}) {
  if (routine) {
    currentRoutine = routine;
  } else {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px 20px;">
        <div class="brand-tagline">Pregătim mișcarea de azi...</div>
      </div>
    `;

    currentRoutine = await getTodayRoutine(forceDuration, forceRefresh);
  }

  const currentLevel = state.profile?.level || currentRoutine.level || 'zero';
  const isReentry = currentRoutine.is_reentry;
  const note = currentRoutine.adjustment_note;

  let html = `
    <!-- Selector rapid de nivel -->
    <div style="margin-bottom: 14px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
        <span style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">
          Nivel de intensitate:
        </span>
      </div>
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px;">
        <button class="btn ${currentLevel === 'zero' ? 'btn-primary' : 'btn-secondary'} btn-sm btn-level-pill" data-level="zero" style="padding: 6px 2px; font-size: 0.75rem;">
          De la 0
        </button>
        <button class="btn ${currentLevel === 'beginner' ? 'btn-primary' : 'btn-secondary'} btn-sm btn-level-pill" data-level="beginner" style="padding: 6px 2px; font-size: 0.75rem;">
          Începător
        </button>
        <button class="btn ${currentLevel === 'intermediate' ? 'btn-primary' : 'btn-secondary'} btn-sm btn-level-pill" data-level="intermediate" style="padding: 6px 2px; font-size: 0.75rem;">
          Intermediar
        </button>
        <button class="btn ${currentLevel === 'advanced' ? 'btn-primary' : 'btn-secondary'} btn-sm btn-level-pill" data-level="advanced" style="padding: 6px 2px; font-size: 0.75rem;">
          Avansat
        </button>
      </div>
    </div>

    <div class="support-banner">
      <div class="support-banner-icon">${isReentry ? '🌱' : '✨'}</div>
      <div>
        <div class="support-banner-text">${escapeHtml(currentRoutine.supportive_message)}</div>
        ${note ? `<div class="adjustment-tag">${escapeHtml(note)}</div>` : ''}
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div>
          <h2 class="card-title">${escapeHtml(currentRoutine.title)}</h2>
          <p class="card-subtitle">Durată estimată: aprox. ${currentRoutine.target_minutes} minute</p>
        </div>
        <button id="btn-shorten" class="btn btn-secondary btn-sm">
          ⏱️ Fă-o de 5 min
        </button>
      </div>

      <div id="exercise-list">
  `;

  currentRoutine.exercises.forEach((ex, idx) => {
    const full = getExerciseById(ex.id) || ex;
    html += `
      <div class="exercise-card" data-index="${idx}">
        <div class="exercise-visual ${full.image ? 'has-photo' : ''}">
          ${full.image ? `<img src="${full.image}" alt="${escapeHtml(ex.name)}" class="ex-img" />` : (full.svg || '🏃')}
        </div>
        <div class="exercise-content">
          <div class="exercise-name">${idx + 1}. ${escapeHtml(ex.name)}</div>
          <div class="exercise-meta">
            <span class="badge badge-reps">${escapeHtml(ex.adjusted_reps || ex.default_reps)}</span>
            <span class="badge">${escapeHtml(ex.focus || 'Tonifiere')}</span>
          </div>
          <p class="exercise-desc">${escapeHtml(ex.description)}</p>
          ${ex.tip ? `<div class="exercise-tip">💡 ${escapeHtml(ex.tip)}</div>` : ''}
          <button class="btn-swap" data-swap-index="${idx}">
            🔄 Schimbă cu altul
          </button>
        </div>
      </div>
    `;
  });

  html += `
      </div>

      <!-- Selector număr de serii -->
      <div class="sets-selector-box">
        <div class="sets-selector-title">Câte serii vrei să faci azi?</div>
        <div class="sets-selector-group">
          <button type="button" class="btn-set-choice ${userSelectedSets === 1 ? 'active' : ''}" data-sets="1">
            1 Serie
            <span class="set-sub">Rapid (5 min)</span>
          </button>
          <button type="button" class="btn-set-choice ${userSelectedSets === 2 ? 'active' : ''}" data-sets="2">
            2 Serii
            <span class="set-sub">Optim (10 min)</span>
          </button>
          <button type="button" class="btn-set-choice ${userSelectedSets === 3 ? 'active' : ''}" data-sets="3">
            3 Serii
            <span class="set-sub">Intens (15 min)</span>
          </button>
        </div>
      </div>

      <div class="actions-stack">
        <button id="btn-start-guided" class="btn btn-primary">
          ▶️ Ghidează-mă pas cu pas (${userSelectedSets} ${userSelectedSets === 1 ? 'serie' : 'serii'})
        </button>
        <button id="btn-quick-log" class="btn btn-secondary">
          ✅ Am făcut deja! Bifează rapid
        </button>
      </div>

      <div style="margin-top: 14px; text-align: center;">
        <button id="btn-explore-compendium" class="btn btn-secondary" style="font-size: 0.85rem; width: 100%; border-style: dashed; display: flex; align-items: center; justify-content: center; gap: 6px;">
          <span>📖</span> Explorează compendiul de exerciții (37 mișcări pe niveluri)
        </button>
      </div>
    </div>
  `;

  container.innerHTML = html;

  // Event handlers
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
        startBtn.textContent = `▶️ Ghidează-mă pas cu pas (${userSelectedSets} ${userSelectedSets === 1 ? 'serie' : 'serii'})`;
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
    adjusted_reps: next.default_reps
  };

  saveCachedRoutine(currentRoutine);

  renderRoutineView(container, { routine: currentRoutine });

  // Evidențiere vizuală card schimbat
  const updatedCard = container.querySelector(`.exercise-card[data-index="${index}"]`);
  if (updatedCard) {
    updatedCard.classList.add('swapped');
  }

  notifyToast(`🔄 Schimbat cu: ${next.name}`);
}

// ---------------------------------------------------------------- Guided Workout Runner

function startGuidedWorkout(routine, sets = userSelectedSets) {
  guidedState = {
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
    repUnit: 'repetări',
    exercisesDone: []
  };

  requestWakeLock();

  const overlay = document.createElement('div');
  overlay.id = 'guided-overlay';
  overlay.className = 'guided-overlay';
  document.body.appendChild(overlay);

  renderGuidedStep();
}

function renderGuidedStep() {
  guidedState.isResting = false;
  const overlay = document.getElementById('guided-overlay');
  if (!overlay || !guidedState.routine) return;

  const currentEx = guidedState.routine.exercises[guidedState.exerciseIndex];
  const full = getExerciseById(currentEx.id) || currentEx;

  // Reps parsing
  const repInfo = parseDefaultReps(currentEx.adjusted_reps || currentEx.default_reps);
  guidedState.currentActualReps = repInfo.count;
  guidedState.repUnit = repInfo.unit;

  // Step progress
  const totalSteps = guidedState.routine.exercises.length * guidedState.totalSets;
  const currentStepNum = guidedState.exerciseIndex * guidedState.totalSets + (guidedState.currentSet - 1);
  const progressPercent = Math.round((currentStepNum / totalSteps) * 100);

  guidedState.timerSeconds = currentEx.duration_s || 45;
  clearInterval(guidedState.timerInterval);

  overlay.innerHTML = `
    <div class="guided-header">
      <button id="guided-close" class="btn btn-secondary btn-sm">✕ Ieși</button>
      <div style="text-align: center;">
        <div style="font-weight: 700; font-size: 0.92rem; color: var(--text);">
          Exercițiul ${guidedState.exerciseIndex + 1} din ${guidedState.routine.exercises.length}
        </div>
        <div style="font-size: 0.78rem; font-weight: 700; color: var(--primary);">
          Seria ${guidedState.currentSet} din ${guidedState.totalSets}
        </div>
      </div>
      <button id="guided-sound-toggle" class="btn-sound-toggle" title="Comută sunetul">
        ${soundEnabled ? '🔊' : '🔇'}
      </button>
    </div>

    <div class="guided-progress-bar">
      <div class="guided-progress-fill" style="width: ${progressPercent}%;"></div>
    </div>

    <div class="guided-body">
      <div class="guided-visual ${full.image ? 'has-photo' : ''}">
        ${full.image ? `<img src="${full.image}" alt="${escapeHtml(currentEx.name)}" class="guided-photo" />` : (full.svg || '🏃')}
      </div>

      <h2 class="guided-name">${escapeHtml(currentEx.name)}</h2>
      <div class="guided-target">${escapeHtml(currentEx.adjusted_reps || currentEx.default_reps)}</div>

      <div class="guided-timer" id="guided-timer-display">
        ${formatSeconds(guidedState.timerSeconds)}
      </div>

      <!-- Rep Counter Interactive -->
      <div class="rep-counter-container">
        <div class="rep-counter-label">Repetări realizate în această serie:</div>
        <div class="rep-counter-box">
          <button id="rep-minus-btn" class="rep-btn" aria-label="Scade repetări">−</button>
          <div class="rep-display">
            <span id="rep-value" class="rep-value">${guidedState.currentActualReps}</span>
            <span class="rep-unit">${guidedState.repUnit}</span>
          </div>
          <button id="rep-plus-btn" class="rep-btn" aria-label="Crește repetări">+</button>
        </div>
      </div>

      <p class="exercise-desc" style="max-width: 400px; margin: 4px 0 8px 0;">
        ${escapeHtml(currentEx.description)}
      </p>

      ${currentEx.tip ? `<div class="exercise-tip" style="max-width: 400px;">💡 ${escapeHtml(currentEx.tip)}</div>` : ''}
    </div>

    <div class="guided-footer">
      <div style="display: flex; gap: 10px;">
        <button id="guided-pause-btn" class="btn btn-secondary" style="flex: 1;">
          ⏸️ Pauză
        </button>
        <button id="guided-done-btn" class="btn btn-primary" style="flex: 2;">
          ${(guidedState.exerciseIndex === guidedState.routine.exercises.length - 1 && guidedState.currentSet === guidedState.totalSets)
            ? '🎉 Finalizează antrenamentul'
            : '➡️ Serie terminată'}
        </button>
      </div>
    </div>
  `;

  // Start voice prompt
  speakVoice(`${currentEx.name}, seria ${guidedState.currentSet}`);

  // Sound toggle button
  overlay.querySelector('#guided-sound-toggle')?.addEventListener('click', () => {
    toggleSound();
  });

  // Rep counter handlers
  const repValueEl = overlay.querySelector('#rep-value');
  overlay.querySelector('#rep-minus-btn')?.addEventListener('click', () => {
    if (guidedState.currentActualReps > 0) {
      guidedState.currentActualReps--;
      if (repValueEl) repValueEl.textContent = guidedState.currentActualReps;
      playBeep(330, 0.04);
    }
  });

  overlay.querySelector('#rep-plus-btn')?.addEventListener('click', () => {
    guidedState.currentActualReps++;
    if (repValueEl) repValueEl.textContent = guidedState.currentActualReps;
    playBeep(520, 0.04);
  });

  startExerciseTimer();

  // Close handler
  overlay.querySelector('#guided-close')?.addEventListener('click', () => {
    if (confirm('Vrei să oprești sesiunea? Ce ai făcut până acum contează!')) {
      stopTimer();
      releaseWakeLock();
      overlay.remove();
      if (guidedState.exercisesDone.length > 0) {
        openFeedbackModal(guidedState.routine, guidedState.elapsedSeconds, guidedState.exercisesDone);
      }
    }
  });

  // Pause handler
  const pauseBtn = overlay.querySelector('#guided-pause-btn');
  pauseBtn?.addEventListener('click', () => {
    guidedState.isPaused = !guidedState.isPaused;
    pauseBtn.innerHTML = guidedState.isPaused ? '▶️ Continuă' : '⏸️ Pauză';
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
        if (display) display.textContent = 'Gata seria!';
      }
    }
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
    name: currentEx.name,
    set: guidedState.currentSet,
    totalSets: guidedState.totalSets,
    target_reps: currentEx.adjusted_reps || currentEx.default_reps,
    actual_reps: guidedState.currentActualReps,
    unit: guidedState.repUnit
  });

  const isLastSetOfLastExercise =
    guidedState.exerciseIndex === guidedState.routine.exercises.length - 1 &&
    guidedState.currentSet === guidedState.totalSets;

  if (isLastSetOfLastExercise) {
    releaseWakeLock();
    const overlay = document.getElementById('guided-overlay');
    if (overlay) overlay.remove();
    playGentleChime();
    speakVoice('Felicitări! Ai terminat antrenamentul!');
    openFeedbackModal(guidedState.routine, guidedState.elapsedSeconds, guidedState.exercisesDone);
  } else {
    renderRestStep();
  }
}

function renderRestStep() {
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
  guidedState.timerSeconds = sameExerciseNext ? 30 : 40;
  clearInterval(guidedState.timerInterval);

  const totalSteps = guidedState.routine.exercises.length * guidedState.totalSets;
  const currentStepNum = guidedState.exerciseIndex * guidedState.totalSets + guidedState.currentSet;
  const progressPercent = Math.round((currentStepNum / totalSteps) * 100);

  overlay.innerHTML = `
    <div class="guided-header">
      <button id="guided-close" class="btn btn-secondary btn-sm">✕ Ieși</button>
      <div style="font-weight: 700; font-size: 0.92rem; color: var(--text);">
        Odihnă & Respirație
      </div>
      <button id="guided-sound-toggle" class="btn-sound-toggle" title="Comută sunetul">
        ${soundEnabled ? '🔊' : '🔇'}
      </button>
    </div>

    <div class="guided-progress-bar">
      <div class="guided-progress-fill" style="width: ${progressPercent}%;"></div>
    </div>

    <div class="guided-body">
      <div class="guided-rest-card">
        <div class="rest-badge">
          🧘 Trage-ți sufletul & bea o gură de apă
        </div>

        <div class="rest-timer-display" id="guided-rest-timer">
          ${formatSeconds(guidedState.timerSeconds)}
        </div>

        <div class="rest-preview-card">
          <div class="rest-preview-thumb ${nextFull.image ? 'has-photo' : ''}">
            ${nextFull.image ? `<img src="${nextFull.image}" alt="${escapeHtml(nextEx.name)}" class="ex-img" />` : (nextFull.svg || '🏃')}
          </div>
          <div class="rest-preview-info">
            <div class="rest-preview-sub">Urmează:</div>
            <div class="rest-preview-name">${escapeHtml(nextEx.name)}</div>
            <div class="rest-preview-target">Seria ${nextSetNum} din ${guidedState.totalSets} • ${escapeHtml(nextEx.adjusted_reps || nextEx.default_reps)}</div>
          </div>
        </div>

        <div class="rest-actions-row">
          <button id="rest-add-time-btn" class="btn btn-secondary" style="flex: 1;">
            +15s Pauză
          </button>
          <button id="rest-skip-btn" class="btn btn-primary" style="flex: 1.5;">
            ▶️ Începe acum
          </button>
        </div>
      </div>
    </div>

    <div class="guided-footer">
      <p style="text-align: center; font-size: 0.8rem; color: var(--text-muted); margin: 0;">
        Ecranul va trece automat la seria următoare când timpul expiră.
      </p>
    </div>
  `;

  playRestStartSound();
  speakVoice('Pauză de odihnă');

  overlay.querySelector('#guided-sound-toggle')?.addEventListener('click', () => {
    toggleSound();
  });

  overlay.querySelector('#rest-add-time-btn')?.addEventListener('click', () => {
    guidedState.timerSeconds += 15;
    const restTimerEl = document.getElementById('guided-rest-timer');
    if (restTimerEl) restTimerEl.textContent = formatSeconds(guidedState.timerSeconds);
    playBeep(440, 0.05);
  });

  overlay.querySelector('#rest-skip-btn')?.addEventListener('click', () => {
    advanceToNextSet();
  });

  overlay.querySelector('#guided-close')?.addEventListener('click', () => {
    if (confirm('Vrei să oprești sesiunea? Ce ai făcut până acum contează!')) {
      stopTimer();
      releaseWakeLock();
      overlay.remove();
      if (guidedState.exercisesDone.length > 0) {
        openFeedbackModal(guidedState.routine, guidedState.elapsedSeconds, guidedState.exercisesDone);
      }
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
        speakVoice('Pregătește-te!');
        advanceToNextSet();
      }
    }
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
  const modal = document.createElement('div');
  modal.id = 'feedback-modal';
  modal.className = 'guided-overlay';

  const minutesDone = Math.max(1, Math.round(durationSeconds / 60));
  const totalSets = Array.isArray(exercisesDone) ? exercisesDone.length : 0;
  const totalReps = Array.isArray(exercisesDone)
    ? exercisesDone.reduce((acc, curr) => acc + (parseInt(curr.actual_reps, 10) || 0), 0)
    : 0;

  modal.innerHTML = `
    <div class="guided-body">
      <div style="font-size: 3.5rem; margin-bottom: 10px;">🌟</div>
      <h2 style="font-size: 1.6rem; font-weight: 800; margin-bottom: 6px;">
        Bravo! Ai făcut mișcare azi.
      </h2>
      <p style="color: var(--text-muted); margin-bottom: 12px;">
        Aproximativ <strong>${minutesDone} minute</strong> dedicate stării tale de bine.
      </p>

      ${totalSets > 0 ? `
        <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; margin-bottom: 20px;">
          <span class="badge badge-reps">🔁 ${totalSets} ${totalSets === 1 ? 'serie finalizată' : 'serii finalizate'}</span>
          ${totalReps > 0 ? `<span class="badge">🔢 ${totalReps} repetări totale</span>` : ''}
        </div>
      ` : ''}

      <div class="card" style="width: 100%; max-width: 440px; text-align: left;">
        <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 10px;">
          Cum s-a simțit sesiunea?
        </h3>
        <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 14px;">
          Fără note sau judecată — doar ne ajuți să calibrăm intensitatea următoare.
        </p>

        <div class="feedback-grid">
          <div class="feedback-btn selected" data-feedback="just_right">
            <span class="feedback-emoji">👍</span>
            <span class="feedback-label">Tocmai bine</span>
          </div>
          <div class="feedback-btn" data-feedback="easy">
            <span class="feedback-emoji">😊</span>
            <span class="feedback-label">Ușor & revigorant</span>
          </div>
          <div class="feedback-btn" data-feedback="hard">
            <span class="feedback-emoji">🥵</span>
            <span class="feedback-label">Cam greu</span>
          </div>
          <div class="feedback-btn" data-feedback="partial">
            <span class="feedback-emoji">⏱️</span>
            <span class="feedback-label">Doar o parte</span>
          </div>
        </div>

        <div id="feedback-hint" style="font-size: 0.82rem; color: var(--primary); font-weight: 500; min-height: 24px;">
          Menținem același ritm prietenos și data viitoare.
        </div>
      </div>

      <button id="btn-save-log" class="btn btn-primary" style="max-width: 440px; margin-top: 14px;">
        Salvează în jurnal
      </button>
    </div>
  `;

  document.body.appendChild(modal);

  let selectedFeedback = 'just_right';
  const hintEl = modal.querySelector('#feedback-hint');

  const hints = {
    just_right: 'Menținem același ritm prietenos și data viitoare.',
    easy: 'Super! Putem adăuga subtil o repetare în plus data viitoare.',
    hard: 'Nicio problemă! Data viitoare reducem automat numărul de repetări.',
    partial: 'Și 2-3 minute contează enorm. Ai făcut un pas excelent!'
  };

  modal.querySelectorAll('.feedback-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      modal.querySelectorAll('.feedback-btn').forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedFeedback = btn.dataset.feedback;
      if (hintEl) hintEl.textContent = hints[selectedFeedback] || '';
    });
  });

  modal.querySelector('#btn-save-log')?.addEventListener('click', async () => {
    const btn = modal.querySelector('#btn-save-log');
    btn.disabled = true;
    btn.textContent = 'Se salvează...';

    await logWorkout({
      routine_title: routine.title,
      duration_seconds: durationSeconds,
      completion_status: selectedFeedback === 'partial' ? 'partial' : 'completed',
      exercises_done: exercisesDone || routine.exercises,
      feedback: selectedFeedback,
      adjustment_note: selectedFeedback === 'hard'
        ? 'Ajustat automat mai blând pentru data viitoare.'
        : null
    });

    modal.remove();

    // Redirecționează spre tab-ul Progres
    document.querySelector('[data-tab="progress"]')?.click();
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
