import { getLogs, state, updateProfile, deleteLog } from './server-client.js';
import { t, exText, repWords } from './i18n.js';

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
          const feedbackText = log.feedback === 'easy' ? t('Ușor') : log.feedback === 'hard' ? 'Cam greu' : log.feedback === 'partial' ? t('Parțial') : 'Tocmai bine';

          let exercisesList = [];
          if (Array.isArray(log.exercises_done)) {
            exercisesList = log.exercises_done;
          } else if (typeof log.exercises_done_json === 'string') {
            try { exercisesList = JSON.parse(log.exercises_done_json); } catch {}
          }

          const grouped = {};
          exercisesList.forEach((ex) => {
            const name = ex.name || ex.id;
            if (!name) return;
            if (!grouped[name]) grouped[name] = [];
            if (ex.actual_reps !== undefined) {
              grouped[name].push(`${ex.actual_reps} ${ex.unit || 'rep'}`);
            } else if (ex.reps) {
              grouped[name].push(ex.reps);
            }
          });

          const groupKeys = Object.keys(grouped);

          return `
            <div class="log-item" data-log-id="${escapeHtml(log.id)}">
              <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 8px;">
                <div class="log-title">${escapeHtml(log.routine_title)}</div>
                <div style="display: flex; align-items: center; gap: 8px; flex-shrink: 0;">
                  <div class="log-date">${escapeHtml(log.date)}</div>
                  <button class="log-del" type="button" data-del-log="${escapeHtml(log.id)}"
                          aria-label="${t('Șterge sesiunea')} ${escapeHtml(log.date)}">&times;</button>
                </div>
              </div>
              <div style="display: flex; gap: 8px; align-items: center; margin-top: 4px;">
                <span class="badge badge-reps">⏱️ ${minutes} min</span>
                <span class="badge">${emoji} ${feedbackText}</span>
                ${log.adjustment_note ? `<span class="adjustment-tag">${escapeHtml(log.adjustment_note)}</span>` : ''}
              </div>
              ${groupKeys.length > 0 ? `
                <div class="log-exercises-summary">
                  ${groupKeys.map((name) => {
                    const setsInfo = grouped[name];
                    const setsLabel = setsInfo.length > 1
                      ? `${setsInfo.length} serii (${setsInfo.join(', ')})`
                      : setsInfo[0] || '1 serie';
                    return `
                      <div class="log-exercise-item">
                        <span class="log-exercise-name">✓ ${escapeHtml(name)}</span>
                        <span class="log-exercise-reps">${escapeHtml(setsLabel)}</span>
                      </div>
                    `;
                  }).join('')}
                </div>
              ` : ''}
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
          <option value="intermediate" ${profile.level === 'intermediate' ? 'selected' : ''}>
            Nivel 2 — Intermediar / Activ (flotări la podea, genuflexiuni libere, plank, fandări)
          </option>
          <option value="advanced" ${profile.level === 'advanced' ? 'selected' : ''}>
            Nivel 3 — Avansat / Intens (flotări diamant, jump squats, burpees, tracțiuni)
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

  /**
   * Ștergerea unei sesiuni.
   *
   * Confirmare, fiindcă e singurul loc din aplicație unde se pierde ceva ce a
   * fost făcut cu adevărat. Formularea spune ce dispare și ce nu: minutele și
   * ziua se recalculează, dar nivelul și treapta de efort rămân unde sunt --
   * cine corectează o înregistrare greșită nu cere să fie recalibrat.
   */
  container.querySelectorAll('[data-del-log]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.delLog;
      const item = container.querySelector(`.log-item[data-log-id="${CSS.escape(id)}"]`);
      const when = item?.querySelector('.log-date')?.textContent?.trim() || '';
      if (!confirm(`Ștergi sesiunea din ${when}?\n\nMinutele și ziua se scad la loc. Nivelul și intensitatea rămân neschimbate.`)) return;

      btn.disabled = true;
      try {
        await deleteLog(id);
        renderLogView(container);
      } catch (err) {
        btn.disabled = false;
        alert(err.message || t('Nu am putut șterge sesiunea.'));
      }
    });
  });

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
    btn.textContent = t('✅ Preferințe salvate!');
    setTimeout(() => { btn.textContent = t('💾 Salvează preferințele'); }, 1500);
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
