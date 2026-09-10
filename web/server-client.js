// Client API pentru Mișcare — comunicare cu serverul și fallback offline

import { t } from './i18n.js';

const TOKEN_KEY = 'miscare_token';
const PROFILE_KEY = 'miscare_local_profile';
const ROUTINE_KEY = 'miscare_cached_routine';
const LOGS_KEY = 'miscare_local_logs';

export const state = {
  linked: false,
  checked: false,
  device: null,
  profile: null,
  isOffline: !navigator.onLine,
  token: localStorage.getItem(TOKEN_KEY) || null
};

window.addEventListener('online', () => { state.isOffline = false; });
window.addEventListener('offline', () => { state.isOffline = true; });

async function api(path, opts = {}) {
  const headers = { ...opts.headers };
  if (state.token) {
    headers['Authorization'] = `Bearer ${state.token}`;
  }
  const res = await fetch(path, { ...opts, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || `Eroare HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return data;
}

/** Răspunsul la propunere. Refuzul e la fel de valid ca acceptul. */
export async function answerProposal(kind, accepted, daysSinceLast = 0) {
  const path = accepted ? '/api/progression/accept' : '/api/progression/decline';
  return api(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ kind, days_since_last: daysSinceLast })
  });
}

/** Înapoi la cum era înainte de ultima schimbare acceptată. */
export async function revertProgression() {
  return api('/api/progression/revert', { method: 'POST' });
}

/** Șterge o sesiune. Totalurile vin recalculate în răspuns. */
export async function deleteLog(id) {
  return api(`/api/logs/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export async function probe() {
  state.isOffline = !navigator.onLine;

  try {
    await api('/api/health');
  } catch {
    state.isOffline = true;
  }

  try {
    const me = await api('/api/auth/me');
    state.linked = true;
    state.device = me.device;
    if (me.profile) {
      state.profile = me.profile;
      localStorage.setItem(PROFILE_KEY, JSON.stringify(me.profile));
    }
  } catch (err) {
    if (err.status === 401) {
      state.linked = false;
      state.token = null;
      localStorage.removeItem(TOKEN_KEY);
    }
  }

  // Încarcă profilul local dacă nu e deja setat
  if (!state.profile) {
    try {
      const cached = localStorage.getItem(PROFILE_KEY);
      if (cached) state.profile = JSON.parse(cached);
    } catch {}
  }

  if (!state.profile) {
    state.profile = {
      level: 'zero',
      daily_time: 10,
      limitations: [],
      equipment: ['bodyweight', 'chair', 'wall'],
      total_active_days: 0,
      total_minutes: 0,
      last_feedback: null
    };
    localStorage.setItem(PROFILE_KEY, JSON.stringify(state.profile));
  }

  state.checked = true;
  return state;
}

export async function redeem(code) {
  const data = await api('/api/auth/redeem', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code })
  });

  if (data.token) {
    state.token = data.token;
    localStorage.setItem(TOKEN_KEY, data.token);
  }
  return probe();
}

export async function getProfile() {
  if (state.linked) {
    try {
      const data = await api('/api/profile');
      state.profile = data.profile;
      localStorage.setItem(PROFILE_KEY, JSON.stringify(data.profile));
      return data.profile;
    } catch {}
  }
  return state.profile;
}

export async function updateProfile(updates) {
  state.profile = { ...state.profile, ...updates };
  localStorage.setItem(PROFILE_KEY, JSON.stringify(state.profile));
  if (updates.level || updates.equipment) {
    localStorage.removeItem(ROUTINE_KEY);
  }

  if (state.linked) {
    try {
      await api('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state.profile)
      });
    } catch {}
  }
  return state.profile;
}

/**
 * Sesiunile pentru când nu se poate ajunge la server.
 *
 * Doar identificatori. Textul exercițiilor -- nume, descriere, sfat -- se ia
 * din catalogul limbii, ca peste tot: era scris aici a treia oară, cu formulări
 * care apucaseră deja să difere de cele din catalog, iar de tradus ar fi cerut
 * încă un rând de muncă pentru fiecare din cele douăsprezece limbi.
 *
 * Efortul e structurat din același motiv pentru care e structurat peste tot:
 * unitatea trebuie să rămână un câmp, nu un cuvânt dintr-o limbă anume.
 */
const FALLBACK_ROUTINES = {
  zero: {
    titleKey: t('Mișcarea ta de azi — Nivel 0 (De la 0)'),
    messageKey: t('Fiecare pas contează. Fără grabă și fără comparații.'),
    exercises: [
      { id: 'wall_pushups', reps: { lo: 8, hi: 10, unit: 'reps' } },
      { id: 'chair_sit_to_stand', reps: { lo: 6, hi: 8, unit: 'reps' } },
      { id: 'shoulder_rolls_and_reach', reps: { lo: 30, hi: 30, unit: 'seconds' } }
    ]
  },
  beginner: {
    titleKey: t('Mișcarea ta de azi — Nivel 1 (Începător)'),
    messageKey: t('Construiești forță și mobilitate zi de zi. Menține ritmul!'),
    exercises: [
      { id: 'incline_pushups', reps: { lo: 8, hi: 10, unit: 'reps' } },
      { id: 'box_squat_touch', reps: { lo: 10, hi: 12, unit: 'reps' } },
      { id: 'bird_dog_gentle', reps: { lo: 6, hi: 8, unit: 'reps', note: 'eachSide' } }
    ]
  },
  intermediate: {
    titleKey: t('Mișcarea ta de azi — Nivel 2 (Intermediar)'),
    messageKey: t('Pregătit pentru o sesiune activă și energică? Forță solidă la podea!'),
    exercises: [
      { id: 'standard_pushups', reps: { lo: 10, hi: 15, unit: 'reps' } },
      { id: 'full_squats', reps: { lo: 12, hi: 16, unit: 'reps' } },
      { id: 'forearm_plank', reps: { lo: 35, hi: 50, unit: 'seconds' } }
    ]
  },
  advanced: {
    titleKey: t('Mișcarea ta de azi — Nivel 3 (Avansat)'),
    messageKey: t('Intensitate maximă, control total. Dă tot ce ai!'),
    exercises: [
      { id: 'diamond_pushups', reps: { lo: 10, hi: 12, unit: 'reps' } },
      { id: 'jump_squats', reps: { lo: 10, hi: 14, unit: 'reps' } },
      { id: 'plank_shoulder_taps', reps: { lo: 16, hi: 20, unit: 'taps' } }
    ]
  }
};

export function saveCachedRoutine(routine) {
  try {
    const todayStr = new Date().toISOString().slice(0, 10);
    const toSave = { ...routine, cached_date: todayStr };
    localStorage.setItem(ROUTINE_KEY, JSON.stringify(toSave));
  } catch {}
}

export async function getTodayRoutine(duration = null, forceRefresh = false) {
  const currentLevel = state.profile?.level || 'zero';
  const todayStr = new Date().toISOString().slice(0, 10);

  // Cache-ul e pentru offline, nu pentru a scuti o cerere.
  //
  // Înainte, o rutină pusă deoparte pentru ziua curentă scurtcircuita apelul
  // și se întorcea direct. Exercițiile erau corecte -- ele chiar nu se schimbă
  // în cursul zilei -- dar tot ce se schimbă venea în același răspuns:
  // întrebarea zilei și ce s-a bifat deja. A doua oară când se deschidea
  // aplicația, ecranul „azi" arăta aceleași exerciții ca și cum nimeni n-ar fi
  // făcut nimic, fiindcă starea proaspătă nu mai era cerută niciodată.
  //
  // Deci se întreabă serverul cât timp se poate, iar cache-ul rămâne ce a fost
  // gândit să fie: plasa pentru momentele fără semnal, mai jos.
  const cachedFor = (why) => {
    const cached = localStorage.getItem(ROUTINE_KEY);
    if (!cached) return null;
    try {
      const parsed = JSON.parse(cached);
      const levelOk = parsed.level === currentLevel || (!parsed.level && currentLevel === 'zero');
      if (parsed && levelOk && (why !== 'today' || parsed.cached_date === todayStr)) return parsed;
    } catch {}
    return null;
  };

  if (state.linked) {
    try {
      const query = duration ? `?duration=${duration}` : '';
      const data = await api(`/api/routine/today${query}`);
      const routineWithDate = {
        ...data.routine,
        level: data.routine.level || currentLevel,
        cached_date: todayStr
      };
      // Rutina se pune în cache, întrebarea nu. O propunere veche, arătată a
      // doua zi din cache, ar întreba despre sesiuni pe care serverul le-a
      // uitat deja -- și ar putea fi acceptată de două ori.
      localStorage.setItem(ROUTINE_KEY, JSON.stringify(routineWithDate));
      return {
        ...routineWithDate,
        __proposal: data.proposal || null,
        __can_revert: Boolean(data.can_revert),
        __done_today: data.done_today || null
      };
    } catch {}
  }

  // Fallback offline: rutina de azi dacă există, altfel ultima potrivită.
  const fallback = cachedFor('today') || cachedFor('any');
  if (fallback) return fallback;

  const tmpl = FALLBACK_ROUTINES[currentLevel] || FALLBACK_ROUTINES.zero;

  const fallbackRoutine = {
    id: 'local_today',
    title: tmpl.title,
    level: currentLevel,
    target_minutes: duration || state.profile?.daily_time || 10,
    supportive_message: tmpl.supportiveMessage,
    adjustment_note: null,
    is_reentry: false,
    cached_date: todayStr,
    exercises: tmpl.exercises
  };
  localStorage.setItem(ROUTINE_KEY, JSON.stringify(fallbackRoutine));
  return fallbackRoutine;
}

export async function logWorkout(payload) {
  const minutesAdded = Math.max(1, Math.round((payload.duration_seconds || 600) / 60));
  state.profile.total_active_days = (state.profile.total_active_days || 0) + 1;
  state.profile.total_minutes = (state.profile.total_minutes || 0) + minutesAdded;
  state.profile.last_feedback = payload.feedback || 'just_right';
  localStorage.setItem(PROFILE_KEY, JSON.stringify(state.profile));

  // Salvează în istoricul local
  let localLogs = [];
  try {
    localLogs = JSON.parse(localStorage.getItem(LOGS_KEY) || '[]');
  } catch {}
  localLogs.unshift({
    id: 'local_' + Date.now(),
    date: new Date().toISOString().slice(0, 10),
    routine_title: payload.routine_title || t('Mișcare de zi cu zi'),
    duration_seconds: payload.duration_seconds || 600,
    completion_status: payload.completion_status || 'completed',
    feedback: payload.feedback || 'just_right',
    exercises_done: payload.exercises_done || [],
    created_at: new Date().toISOString()
  });
  localStorage.setItem(LOGS_KEY, JSON.stringify(localLogs.slice(0, 30)));

  if (state.linked) {
    try {
      return await api('/api/routine/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch {}
  }

  return {
    success: true,
    celebration: t('Felicitări pentru mișcarea de azi! Fiecare pas se adună.')
  };
}

export async function getLogs() {
  if (state.linked) {
    try {
      const data = await api('/api/logs');
      return data;
    } catch {}
  }

  let localLogs = [];
  try {
    localLogs = JSON.parse(localStorage.getItem(LOGS_KEY) || '[]');
  } catch {}

  return {
    logs: localLogs,
    totals: {
      active_days: state.profile.total_active_days || 0,
      total_minutes: state.profile.total_minutes || 0
    }
  };
}

