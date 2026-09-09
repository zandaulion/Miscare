import { getExerciseById, CLIENT_EXERCISES } from './exercises.js';
import { getTodayRoutine, logWorkout, state } from './server-client.js';

let currentRoutine = null;
let guidedState = {
  active: false,
  stepIndex: 0,
  timerSeconds: 45,
  timerInterval: null,
  isPaused: false,
  elapsedSeconds: 0,
  exercisesDone: []
};

// Subtle Web Audio chime for timer finish
function playGentleChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  } catch {}
}

export async function renderRoutineView(container, { forceDuration = null } = {}) {
  container.innerHTML = `
    <div style="text-align: center; padding: 40px 20px;">
      <div class="brand-tagline">Pregătim mișcarea de azi...</div>
    </div>
  `;

  currentRoutine = await getTodayRoutine(forceDuration);

  const isReentry = currentRoutine.is_reentry;
  const note = currentRoutine.adjustment_note;

  let html = `
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
        <div class="exercise-visual">
          ${full.svg || '🏃'}
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

      <div class="actions-stack">
        <button id="btn-start-guided" class="btn btn-primary">
          ▶️ Ghidează-mă pas cu pas
        </button>
        <button id="btn-quick-log" class="btn btn-secondary">
          ✅ Am făcut deja! Bifează rapid
        </button>
      </div>
    </div>
  `;

  container.innerHTML = html;

  // Event handlers
  container.querySelector('#btn-shorten')?.addEventListener('click', () => {
    renderRoutineView(container, { forceDuration: 5 });
  });

  container.querySelector('#btn-start-guided')?.addEventListener('click', () => {
    startGuidedWorkout(currentRoutine);
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

function swapExercise(index, container) {
  if (!currentRoutine || !currentRoutine.exercises[index]) return;
  const current = currentRoutine.exercises[index];
  const userEquipment = state.profile?.equipment || ['bodyweight', 'chair', 'wall'];

  // Găsește un înlocuitor compatibil
  const candidates = CLIENT_EXERCISES.filter((e) => {
    if (e.id === current.id) return false;
    if (currentRoutine.exercises.some((ce) => ce.id === e.id)) return false;
    // Verifică echipamentul
    return e.equipment.every((eq) => userEquipment.includes(eq));
  });

  if (candidates.length > 0) {
    const next = candidates[Math.floor(Math.random() * candidates.length)];
    currentRoutine.exercises[index] = {
      ...next,
      adjusted_reps: next.default_reps
    };
    renderRoutineView(container);
  }
}

// ---------------------------------------------------------------- Guided Workout Runner

function startGuidedWorkout(routine) {
  guidedState = {
    active: true,
    stepIndex: 0,
    timerSeconds: 45,
    timerInterval: null,
    isPaused: false,
    elapsedSeconds: 0,
    exercisesDone: []
  };

  const overlay = document.createElement('div');
  overlay.id = 'guided-overlay';
  overlay.className = 'guided-overlay';
  document.body.appendChild(overlay);

  renderGuidedStep(routine);
}

function renderGuidedStep(routine) {
  const overlay = document.getElementById('guided-overlay');
  if (!overlay) return;

  const currentEx = routine.exercises[guidedState.stepIndex];
  const full = getExerciseById(currentEx.id) || currentEx;
  const progressPercent = Math.round(((guidedState.stepIndex) / routine.exercises.length) * 100);

  guidedState.timerSeconds = currentEx.duration_s || 45;
  clearInterval(guidedState.timerInterval);

  overlay.innerHTML = `
    <div class="guided-header">
      <button id="guided-close" class="btn btn-secondary btn-sm">✕ Ieși</button>
      <div style="font-weight: 700; font-size: 0.9rem;">
        Exercițiul ${guidedState.stepIndex + 1} din ${routine.exercises.length}
      </div>
      <div style="width: 50px;"></div>
    </div>

    <div class="guided-progress-bar">
      <div class="guided-progress-fill" style="width: ${progressPercent}%;"></div>
    </div>

    <div class="guided-body">
      <div class="guided-visual">
        ${full.svg || '🏃'}
      </div>

      <h2 class="guided-name">${escapeHtml(currentEx.name)}</h2>
      <div class="guided-target">${escapeHtml(currentEx.adjusted_reps || currentEx.default_reps)}</div>

      <div class="guided-timer" id="guided-timer-display">
        ${formatSeconds(guidedState.timerSeconds)}
      </div>

      <p class="exercise-desc" style="max-width: 400px; margin: 8px 0;">
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
          ${guidedState.stepIndex + 1 === routine.exercises.length ? '🎉 Am terminat!' : '➡️ Următorul'}
        </button>
      </div>
    </div>
  `;

  // Start countdown timer
  startTimer();

  overlay.querySelector('#guided-close')?.addEventListener('click', () => {
    if (confirm('Vrei să oprești sesiunea? Ce ai făcut până acum contează!')) {
      stopTimer();
      overlay.remove();
      if (guidedState.stepIndex > 0) {
        openFeedbackModal(routine, guidedState.elapsedSeconds, guidedState.exercisesDone);
      }
    }
  });

  const pauseBtn = overlay.querySelector('#guided-pause-btn');
  pauseBtn?.addEventListener('click', () => {
    guidedState.isPaused = !guidedState.isPaused;
    pauseBtn.innerHTML = guidedState.isPaused ? '▶️ Continuă' : '⏸️ Pauză';
  });

  overlay.querySelector('#guided-done-btn')?.addEventListener('click', () => {
    completeCurrentStep(routine);
  });
}

function startTimer() {
  const display = document.getElementById('guided-timer-display');
  clearInterval(guidedState.timerInterval);

  guidedState.timerInterval = setInterval(() => {
    if (guidedState.isPaused) return;

    guidedState.elapsedSeconds++;
    if (guidedState.timerSeconds > 0) {
      guidedState.timerSeconds--;
      if (display) display.textContent = formatSeconds(guidedState.timerSeconds);

      if (guidedState.timerSeconds === 0) {
        playGentleChime();
        if (display) display.textContent = 'Gata!';
      }
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(guidedState.timerInterval);
}

function completeCurrentStep(routine) {
  stopTimer();
  const currentEx = routine.exercises[guidedState.stepIndex];
  guidedState.exercisesDone.push({
    id: currentEx.id,
    name: currentEx.name,
    reps: currentEx.adjusted_reps || currentEx.default_reps
  });

  guidedState.stepIndex++;
  if (guidedState.stepIndex < routine.exercises.length) {
    renderGuidedStep(routine);
  } else {
    // Finished all!
    const overlay = document.getElementById('guided-overlay');
    if (overlay) overlay.remove();
    openFeedbackModal(routine, guidedState.elapsedSeconds, guidedState.exercisesDone);
  }
}

// ---------------------------------------------------------------- Feedback & Celebration Modal

function openFeedbackModal(routine, durationSeconds, exercisesDone) {
  const modal = document.createElement('div');
  modal.id = 'feedback-modal';
  modal.className = 'guided-overlay';

  const minutesDone = Math.max(1, Math.round(durationSeconds / 60));

  modal.innerHTML = `
    <div class="guided-body">
      <div style="font-size: 3.5rem; margin-bottom: 10px;">🌟</div>
      <h2 style="font-size: 1.6rem; font-weight: 800; margin-bottom: 6px;">
        Bravo! Ai făcut mișcare azi.
      </h2>
      <p style="color: var(--text-muted); margin-bottom: 20px;">
        Aproximativ <strong>${minutesDone} minute</strong> dedicate stării tale de bine.
      </p>

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
