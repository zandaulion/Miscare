import { createLocalStore } from './local-store.js';
import { generateDailyRoutine } from './engine/routine.js';
import { applyFeedback, proposeChange, LEVELS } from './engine/progression.js';

export function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
function calendarDay(date) { return Date.parse(`${date}T00:00:00Z`) / 86400000; }
function defaults() {
  return { level: 'zero', daily_time: 10, limitations: [], equipment: ['bodyweight', 'chair', 'wall'],
    preferred_days: [], rep_step: 0, easy_streak: 0, prev_level: null, prev_rep_step: null,
    total_active_days: 0, total_sessions: 0, total_minutes: 0, last_feedback: null };
}
function totals(data) {
  data.logs.sort((a, b) => b.created_at.localeCompare(a.created_at));
  const profile = data.profile;
  profile.total_active_days = new Set(data.logs.map(log => log.date)).size;
  profile.total_sessions = data.logs.length;
  profile.total_minutes = data.logs.reduce((sum, log) => sum + Math.max(1, Math.round(log.duration_seconds / 60)), 0);
  profile.last_feedback = data.logs[0]?.feedback || null;
  profile.last_session_date = data.logs[0]?.date || null;
  return { active_days: profile.total_active_days, total_minutes: profile.total_minutes, total_sessions: profile.total_sessions };
}
function daysSince(data, now) {
  return data.logs.length ? Math.max(0, calendarDay(localDate(now)) - calendarDay(data.logs[0].date)) : 0;
}
function proposal(data, now) {
  const p = data.profile;
  const today = localDate(now);
  if (p.proposal_answered_date === today) return null;
  return proposeChange({ level: p.level, repStep: p.rep_step, easyStreak: p.easy_streak,
    daysSinceLastSession: daysSince(data, now) });
}

export function createLocalClient({ store = createLocalStore(), now = () => new Date(), uuid = () => crypto.randomUUID() } = {}) {
  const state = { local: true, linked: true, checked: false, device: null, profile: null, isOffline: false, token: null };
  async function write(operation) {
    const result = await store.transaction(data => {
      data.profile ||= defaults();
      const value = operation(data);
      return { value, profile: data.profile };
    });
    // Publish state only after the durable transaction commits.
    state.profile = result.profile;
    return result.value;
  }
  return {
    state,
    async probe() {
      await write(() => {});
      state.checked = true;
      return state;
    },
    async getProfile() {
      const data = await store.transaction();
      state.profile = data.profile || defaults();
      return state.profile;
    },
    updateProfile(updates) {
      return write(data => {
        const allowed = ['level', 'daily_time', 'limitations', 'equipment', 'preferred_days'];
        for (const key of allowed) if (key in updates) data.profile[key] = structuredClone(updates[key]);
        if (!LEVELS.includes(data.profile.level)) throw new Error('Nivel invalid');
        if (![5, 10, 15].includes(data.profile.daily_time)) throw new Error('Durată invalidă');
        if (updates.level) {
          data.profile.prev_level = null;
          data.profile.prev_rep_step = null;
        }
        data.routine = null;
        return data.profile;
      });
    },
    getTodayRoutine(duration = null, forceRefresh = false) {
      return write(data => {
        const date = now();
        const today = localDate(date);
        const p = data.profile;
        const days = daysSince(data, date);
        const key = JSON.stringify([today, p.level, p.rep_step, p.total_sessions, p.daily_time, p.equipment, p.limitations, duration]);
        if (forceRefresh || data.routine?.key !== key) {
          const avoid = days <= 1 ? new Set((data.logs[0]?.exercises_done || []).map(ex => ex.id)) : null;
          data.routine = { key, value: generateDailyRoutine(p, { forceDurationMinutes: duration,
            daysSinceLastSession: days, lastFeedback: p.last_feedback, repStep: p.rep_step,
            rotation: p.total_sessions, avoid }) };
        }
        const done = data.logs.filter(log => log.date === today);
        return { ...data.routine.value, __proposal: proposal(data, date),
          __can_revert: p.prev_level !== null || p.prev_rep_step !== null,
          __days_since_last: days,
          __done_today: { sessions: done.length, minutes: Math.round(done.reduce((sum, log) => sum + log.duration_seconds, 0) / 60), last_at: done[0]?.created_at || null } };
      });
    },
    saveCachedRoutine(routine) {
      return write(data => { if (data.routine) data.routine.value = structuredClone(routine); });
    },
    logWorkout(payload) {
      return write(data => {
        const date = now();
        const id = payload.id || uuid();
        if (data.logs.some(log => log.id === id)) return { success: true, log_id: id };
        const seconds = Number(payload.duration_seconds ?? 0);
        if (!Number.isFinite(seconds) || seconds < 0) throw new Error('Durată invalidă');
        const feedback = payload.feedback || 'just_right';
        if (!['easy', 'hard', 'just_right', 'partial'].includes(feedback)) throw new Error('Feedback invalid');
        data.logs.unshift({ id, date: localDate(date), timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          created_at: date.toISOString(), routine_title: payload.routine_title || 'Mișcare de zi cu zi',
          duration_seconds: seconds, completion_status: payload.completion_status || 'completed', feedback,
          exercises_done: structuredClone(payload.exercises_done || []), adjustment_note: payload.adjustment_note || null });
        Object.assign(data.profile, applyFeedback(data.profile, feedback));
        delete data.profile.proposal_answered_date;
        totals(data);
        data.routine = null;
        data.activeWorkout = null;
        return { success: true, log_id: id, celebration: 'Felicitări pentru mișcarea de azi! Fiecare pas se adună.' };
      });
    },
    getLogs() { return write(data => ({ logs: data.logs, totals: totals(data) })); },
    deleteLog(id) {
      return write(data => {
        if (!data.logs.some(log => log.id === id)) throw new Error('Sesiunea nu există');
        data.logs = data.logs.filter(log => log.id !== id);
        data.routine = null;
        return { ok: true, deleted: id, totals: totals(data) };
      });
    },
    answerProposal(kind, accepted) {
      return write(data => {
        const proposed = proposal(data, now());
        if (!proposed || proposed.kind !== kind) throw new Error('Propunerea nu mai este valabilă');
        const p = data.profile;
        if (accepted) {
          p.prev_level = p.level;
          p.prev_rep_step = p.rep_step;
          p.level = proposed.to.level ?? p.level;
          p.rep_step = proposed.to.rep_step ?? p.rep_step;
        }
        p.easy_streak = 0;
        p.proposal_answered_date = localDate(now());
        data.routine = null;
        return { ok: true, level: p.level, rep_step: p.rep_step, can_revert: p.prev_level !== null };
      });
    },
    revertProgression() {
      return write(data => {
        const p = data.profile;
        if (p.prev_level === null && p.prev_rep_step === null) throw new Error('Nu există o schimbare de anulat');
        p.level = p.prev_level ?? p.level;
        p.rep_step = p.prev_rep_step ?? p.rep_step;
        p.prev_level = null; p.prev_rep_step = null; p.easy_streak = 0;
        data.routine = null;
        return { ok: true, level: p.level, rep_step: p.rep_step };
      });
    },
    async getActiveWorkout() { return (await store.transaction()).activeWorkout || null; },
    saveActiveWorkout(workout) { return write(data => { data.activeWorkout = structuredClone(workout); }); },
    exportData() { return store.transaction(); },
    importData(input) {
      // Versioned, bounded input: never silently import a partial or future schema.
      if (input?.version !== 1 || !input.profile || !Array.isArray(input.logs)) throw new Error('Fișier de backup invalid');
      if (!LEVELS.includes(input.profile.level) || ![5, 10, 15].includes(input.profile.daily_time)
        || !['equipment', 'limitations', 'preferred_days'].every(key => Array.isArray(input.profile[key]))
        || !Number.isInteger(input.profile.rep_step) || input.profile.rep_step < -3 || input.profile.rep_step > 4
        || input.logs.some(log => !log || typeof log !== 'object')
        || new Set(input.logs.map(log => log.id)).size !== input.logs.length
        || input.logs.some(log => !log || typeof log.id !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(log.date)
          || typeof log.created_at !== 'string' || !Number.isFinite(Date.parse(log.created_at)) || !Number.isFinite(log.duration_seconds)
          || log.duration_seconds < 0 || !Array.isArray(log.exercises_done))) throw new Error('Fișier de backup invalid');
      return write(data => {
        data.profile = { ...defaults(), ...structuredClone(input.profile) };
        data.logs = structuredClone(input.logs);
        data.routine = null; data.activeWorkout = null;
        totals(data);
      });
    },
    resetData() {
      return write(data => {
        data.profile = defaults(); data.logs = []; data.routine = null; data.activeWorkout = null;
      });
    },
    async redeem() { throw new Error('Aplicația locală nu necesită activare'); },
    async updateDeviceLabel() { return { ok: true }; }
  };
}
