// Client API pentru Mișcare — comunicare cu serverul și fallback offline

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

export async function probe() {
  state.isOffline = !navigator.onLine;

  try {
    const health = await api('/api/health');
    state.geminiConfigured = Boolean(health.gemini_configured);
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

const FALLBACK_ROUTINES = {
  zero: {
    title: 'Mișcarea ta de azi — Nivel 0 (De la 0)',
    supportiveMessage: 'Fiecare pas contează. Fără grabă și fără comparații.',
    exercises: [
      {
        id: 'wall_pushups',
        name: 'Flotări la perete',
        category: 'upper',
        adjusted_reps: '8-10 repetări',
        duration_s: 45,
        description: 'Palmele pe perete la nivelul pieptului. Coboară pieptul și împinge înapoi.',
        focus: 'Piept, brațe și umeri',
        tip: 'Menține corpul aliniat.'
      },
      {
        id: 'chair_sit_to_stand',
        name: 'Ridicări de pe scaun',
        category: 'lower',
        adjusted_reps: '6-8 repetări',
        duration_s: 50,
        description: 'Ridică-te în picioare de pe marginea scaunului, apoi așază-te controlat.',
        focus: 'Picioare și stabilitate',
        tip: 'Coborârea lentă te face mai puternic.'
      },
      {
        id: 'shoulder_rolls_and_reach',
        name: 'Rotiri de umeri și întindere',
        category: 'mobility',
        adjusted_reps: '30 secunde',
        duration_s: 35,
        description: 'Cercuri mari cu umerii spre spate, apoi brațele sus.',
        focus: 'Eliberare tensiune gât și umeri',
        tip: 'Respiră adânc.'
      }
    ]
  },
  beginner: {
    title: 'Mișcarea ta de azi — Nivel 1 (Începător)',
    supportiveMessage: 'Construiești forță și mobilitate zi de zi. Menține ritmul!',
    exercises: [
      {
        id: 'incline_pushups',
        name: 'Flotări înclinate (pe spătar/masă)',
        category: 'upper',
        adjusted_reps: '8-10 repetări',
        duration_s: 50,
        description: 'Sprijină palmele pe marginea unei mese sau pe spătarul unui scaun rezistent. Coboară pieptul și împinge controlat.',
        focus: 'Piept, brațe și stabilitate trunchi',
        tip: 'Păstrează trunchiul aliniat drept.'
      },
      {
        id: 'box_squat_touch',
        name: 'Genuflexiune cu atingerea scaunului',
        category: 'lower',
        adjusted_reps: '8-10 repetări',
        duration_s: 50,
        description: 'Coboară într-o genuflexiune până atingi ușor marginea scaunului, apoi te ridici fără să te așezi complet.',
        focus: 'Picioare, fesieri și echilibru',
        tip: 'Genunchii rămân orientați spre degetele picioarelor.'
      },
      {
        id: 'bird_dog_gentle',
        name: 'Bird-dog pe saltea',
        category: 'core_glutes',
        adjusted_reps: '6-8 pe parte',
        duration_s: 50,
        description: 'În sprijin pe palme și genunchi. Întinde un braț în față și piciorul opus în spate, ține 2 secunde și revino.',
        focus: 'Stabilitate lombară, coordonare și fesieri',
        tip: 'Păstrează spatele drept ca o masă.'
      }
    ]
  },
  intermediate: {
    title: 'Mișcarea ta de azi — Nivel 2 (Intermediar)',
    supportiveMessage: 'Pregătit pentru o sesiune activă și energică? Forță solidă la podea!',
    exercises: [
      {
        id: 'standard_pushups',
        name: 'Flotări clasice la podea',
        category: 'upper',
        adjusted_reps: '10-15 repetări',
        duration_s: 50,
        description: 'Palmele sub umeri, picioarele întinse. Coboară pieptul până aproape de podea, menținând corpul drept ca o scândură, apoi împinge ferm.',
        focus: 'Piept, triceps, umeri și stabilitate trunchi',
        tip: 'Nu lăsa capul să cadă în față; privește la 20cm în fața palmelor.'
      },
      {
        id: 'full_squats',
        name: 'Genuflexiuni libere (adânci)',
        category: 'lower',
        adjusted_reps: '12-16 repetări',
        duration_s: 50,
        description: 'Picioarele la lățimea umerilor. Coboară bazinul sub nivelul genunchilor, păstrând călcâiele bine lipite de sol și pieptul ridicat.',
        focus: 'Cvadricepși, fesieri și mobilitate șolduri',
        tip: 'Împinge puternic în călcâie la urcare și expiră.'
      },
      {
        id: 'forearm_plank',
        name: 'Scândură / Plank pe antebrațe',
        category: 'core',
        adjusted_reps: '35-50 secunde',
        duration_s: 45,
        description: 'Sprijin pe antebrațe și vârfuri de picioare. Menține corpul perfect aliniat, cu abdomenul și fesierii contractați.',
        focus: 'Stabilitate trunchi, abdomen profund și umeri',
        tip: 'Respiră constant, nu-ți ține respirația.'
      }
    ]
  },
  advanced: {
    title: 'Mișcarea ta de azi — Nivel 3 (Avansat)',
    supportiveMessage: 'Intensitate maximă, control total. Dă tot ce ai!',
    exercises: [
      {
        id: 'diamond_pushups',
        name: 'Flotări diamant',
        category: 'upper',
        adjusted_reps: '10-12 repetări',
        duration_s: 50,
        description: 'Palmele lipite la sol sub piept cu degetele formând un diamant. Coboară pieptul și împinge exploziv.',
        focus: 'Triceps intens și piept interior',
        tip: 'Coatele rămân pe lângă corp.'
      },
      {
        id: 'jump_squats',
        name: 'Genuflexiuni sărite (Putere)',
        category: 'lower',
        adjusted_reps: '10-14 repetări',
        duration_s: 45,
        description: 'Genuflexiune adâncă urmată de o desprindere explozivă în sus. Aterizează lin pe vârfuri și coboară fluid.',
        focus: 'Putere explozivă și anduranță musculară',
        tip: 'Aterizarea trebuie să fie complet silențioasă.'
      },
      {
        id: 'plank_shoulder_taps',
        name: 'Plank cu atingeri de umeri',
        category: 'core',
        adjusted_reps: '16-20 atingeri',
        duration_s: 45,
        description: 'Din poziția de flotare, atinge umărul opus cu o mână fără a roti bazinul. Menține corpul perfect imobil.',
        focus: 'Anti-rotație, stabilitate și forță izometrică',
        tip: 'Picioarele puțin mai depărtate oferă o bază solidă.'
      }
    ]
  }
};

export async function getTodayRoutine(duration = null) {
  if (state.linked) {
    try {
      const query = duration ? `?duration=${duration}` : '';
      const data = await api(`/api/routine/today${query}`);
      localStorage.setItem(ROUTINE_KEY, JSON.stringify(data.routine));
      return data.routine;
    } catch {}
  }

  // Fallback offline: verificăm dacă avem o rutină cache potrivită nivelului curent
  const currentLevel = state.profile?.level || 'zero';
  const cached = localStorage.getItem(ROUTINE_KEY);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (parsed && (parsed.level === currentLevel || !parsed.level && currentLevel === 'zero')) {
        return parsed;
      }
    } catch {}
  }

  const tmpl = FALLBACK_ROUTINES[currentLevel] || FALLBACK_ROUTINES.zero;

  return {
    id: 'local_today',
    title: tmpl.title,
    level: currentLevel,
    target_minutes: duration || state.profile?.daily_time || 10,
    supportive_message: tmpl.supportiveMessage,
    adjustment_note: null,
    is_reentry: false,
    exercises: tmpl.exercises
  };
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
    routine_title: payload.routine_title || 'Mișcare de zi cu zi',
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
    celebration: 'Felicitări pentru mișcarea de azi! Fiecare pas se adună.'
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

export async function detectEquipment(base64Image, mimeType = 'image/jpeg') {
  if (!state.linked) {
    throw new Error('Conectează dispozitivul pentru a folosi analiza foto cu Gemini.');
  }

  return api('/api/equipment/detect', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image_base64: base64Image, mime_type: mimeType })
  });
}
