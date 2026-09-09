import { getLogs, state, updateProfile } from './server-client.js';

export async function renderLogView(container) {
  container.innerHTML = `
    <div style="text-align: center; padding: 40px 20px;">
      <div class="brand-tagline">Se încarcă jurnalul...</div>
    </div>
  `;

  const data = await getLogs();
  const profile = state.profile || {};
  const logs = data.logs || [];
  const totals = data.totals || { active_days: 0, total_minutes: 0 };

  const limitations = profile.limitations || [];

  container.innerHTML = `
    <div class="stats-row">
      <div class="stat-box">
        <div class="stat-number">${totals.active_days}</div>
        <div class="stat-label">Zile cu mișcare</div>
      </div>
      <div class="stat-box">
        <div class="stat-number">${totals.total_minutes}</div>
        <div class="stat-label">Minute câștigate</div>
      </div>
    </div>

    <div class="support-banner" style="background: var(--surface); border-color: var(--border);">
      <div class="support-banner-icon">🌿</div>
      <div>
        <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 2px;">
          Filosofia „No Shaming”
        </div>
        <div style="font-size: 0.83rem; color: var(--text-muted); line-height: 1.4;">
          Aici nu pierzi niciun „streak”. Dacă iei o pauză de 3 sau 30 de zile, tot ce ai acumulat rămâne câștigat. Te întâmpinăm oricând cu o sesiune blândă de reacomodare.
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Istoric recent</h2>
        <span style="font-size: 0.8rem; color: var(--text-muted);">${logs.length} înregistrări</span>
      </div>

      <div id="logs-list">
        ${logs.length === 0 ? `
          <div style="text-align: center; padding: 24px; color: var(--text-muted); font-size: 0.9rem;">
            Încă nu ai înregistrat nicio sesiune.<br>
            Începe azi cu o sesiune scurtă de 5 sau 10 minute!
          </div>
        ` : logs.map((log) => {
          const minutes = Math.max(1, Math.round((log.duration_seconds || 600) / 60));
          const emoji = log.feedback === 'easy' ? '😊' : log.feedback === 'hard' ? '🥵' : log.feedback === 'partial' ? '⏱️' : '👍';
          const feedbackText = log.feedback === 'easy' ? 'Ușor' : log.feedback === 'hard' ? 'Cam greu' : log.feedback === 'partial' ? 'Parțial' : 'Tocmai bine';

          return `
            <div class="log-item">
              <div style="display: flex; justify-content: space-between; align-items: baseline;">
                <div class="log-title">${escapeHtml(log.routine_title)}</div>
                <div class="log-date">${escapeHtml(log.date)}</div>
              </div>
              <div style="display: flex; gap: 8px; align-items: center; margin-top: 4px;">
                <span class="badge badge-reps">⏱️ ${minutes} min</span>
                <span class="badge">${emoji} ${feedbackText}</span>
                ${log.adjustment_note ? `<span class="adjustment-tag">${escapeHtml(log.adjustment_note)}</span>` : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Reglaje & Punct de pornire</h2>
      </div>

      <div style="margin-bottom: 16px;">
        <label style="display: block; font-weight: 600; font-size: 0.9rem; margin-bottom: 6px;">
          Nivelul tău actual:
        </label>
        <select id="select-level" class="btn btn-secondary" style="width: 100%; text-align: left; padding: 10px 14px;">
          <option value="zero" ${profile.level === 'zero' ? 'selected' : ''}>
            Nivel 0 — De la zero absolut (scaun, perete, mobilitate ușoară)
          </option>
          <option value="beginner" ${profile.level === 'beginner' ? 'selected' : ''}>
            Nivel 1 — Începător confortabil (flotări înclinate, podea, gantere)
          </option>
        </select>
      </div>

      <div style="margin-bottom: 16px;">
        <label style="display: block; font-weight: 600; font-size: 0.9rem; margin-bottom: 6px;">
          Durată țintă zilnică:
        </label>
        <div style="display: flex; gap: 10px;">
          ${[5, 10, 15].map((mins) => `
            <button class="btn ${profile.daily_time === mins ? 'btn-primary' : 'btn-secondary'} btn-duration" data-mins="${mins}" style="flex: 1;">
              ${mins} min
            </button>
          `).join('')}
        </div>
      </div>

      <div style="margin-bottom: 16px;">
        <label style="display: block; font-weight: 600; font-size: 0.9rem; margin-bottom: 6px;">
          Zone sensibile / Protecție:
        </label>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <label style="display: flex; align-items: center; gap: 10px; font-size: 0.88rem;">
            <input type="checkbox" id="limit-knees" value="knees" ${limitations.includes('knees') ? 'checked' : ''} />
            Genunchi sensibili (fără genuflexiuni adânci sau sărituri)
          </label>
          <label style="display: flex; align-items: center; gap: 10px; font-size: 0.88rem;">
            <input type="checkbox" id="limit-back" value="back" ${limitations.includes('back') ? 'checked' : ''} />
            Spate sensibil (exclusiv posturi sigure de protecție lombară)
          </label>
          <label style="display: flex; align-items: center; gap: 10px; font-size: 0.88rem;">
            <input type="checkbox" id="limit-wrists" value="wrists" ${limitations.includes('wrists') ? 'checked' : ''} />
            Încheieturi sensibile (fără sprijin direct pe palme pe podea)
          </label>
        </div>
      </div>

      <button id="btn-save-profile" class="btn btn-primary">
        💾 Salvează preferințele
      </button>
    </div>
  `;

  // Handle duration selection
  let selectedDuration = profile.daily_time || 10;
  container.querySelectorAll('.btn-duration').forEach((btn) => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.btn-duration').forEach((b) => {
        b.classList.remove('btn-primary');
        b.classList.add('btn-secondary');
      });
      btn.classList.add('btn-primary');
      btn.classList.remove('btn-secondary');
      selectedDuration = parseInt(btn.dataset.mins, 10);
    });
  });

  // Handle save profile
  container.querySelector('#btn-save-profile')?.addEventListener('click', async () => {
    const level = container.querySelector('#select-level').value;
    const limits = [];
    if (container.querySelector('#limit-knees').checked) limits.push('knees');
    if (container.querySelector('#limit-back').checked) limits.push('back');
    if (container.querySelector('#limit-wrists').checked) limits.push('wrists');

    await updateProfile({
      level,
      daily_time: selectedDuration,
      limitations: limits
    });

    const btn = container.querySelector('#btn-save-profile');
    btn.textContent = '✅ Preferințe salvate!';
    setTimeout(() => { btn.textContent = '💾 Salvează preferințele'; }, 1500);
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
