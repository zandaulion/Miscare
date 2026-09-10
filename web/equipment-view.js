import { state, updateProfile } from './server-client.js';
import { t, exText, repWords } from './i18n.js';

// Tabelul ține chei, nu texte.
//
// Aici se chema `t()` direct în literal, iar literalul e evaluat o singură
// dată, la importul modulului -- adică înainte ca limba să fie încărcată.
// Rezultatul: numele rămâneau în română oricare ar fi fost limba, și nu se
// schimbau nici după ce omul alegea alta, fiindcă nu se mai recalculau
// niciodată. Traducerea se face acum la desenare, de fiecare dată.
const ALL_EQUIPMENT = [
  { id: 'bodyweight', name: 'Greutatea corpului', icon: '🧘', desc: 'Întotdeauna disponibilă' },
  { id: 'chair', name: 'Scaun stabil', icon: '🪑', desc: 'Pentru sprijin și așezare' },
  { id: 'wall', name: 'Perete liber', icon: '🧱', desc: 'Pentru flotări și postură' },
  { id: 'yoga_mat', name: 'Saltea / Covoraș', icon: '🟩', desc: 'Pentru confort la sol' },
  { id: 'dumbbells', name: 'Gantere mici', icon: '🏋️', desc: '1 - 5 kg (brațe & mobilitate)' },
  { id: 'adjustable_dumbbells', name: 'Gantere reglabile', icon: '🏋️‍♂️', desc: '5 - 20 kg (forță & picioare)' },
  { id: 'resistance_band', name: 'Bandă elastică', icon: '🎗️', desc: 'Textilă sau cauciuc' },
  { id: 'kettlebell', name: 'Kettlebell', icon: '🔔', desc: 'Greutate cu mâner' },
  { id: 'pullup_bar', name: 'Bară de tracțiuni', icon: '🪜', desc: 'Montată la ușă/perete' },
  { id: 'foam_roller', name: 'Rolă de spumă', icon: '🪵', desc: 'Masaj și relaxare' },
  { id: 'cushion', name: 'Pernă moale', icon: '🛋️', desc: 'Protecție genunchi' }
];

export function renderEquipmentView(container) {
  const currentEquipment = state.profile?.equipment || ['bodyweight', 'chair', 'wall'];

  container.innerHTML = `
    <div class="card">
      <div class="card-header">
        <div>
          <h2 class="card-title">${t('Echipamentul tău')}</h2>
          <p class="card-subtitle">${t('Bifează ce ai la dispoziție acasă. Rutina se adaptează instantaneu.')}</p>
        </div>
        <button id="btn-no-equipment" class="btn btn-secondary btn-sm" title="${t('Păstrează doar corpul, scaunul și peretele')}">
          ${t('Doar greutatea corpului')}
        </button>
      </div>

      <div class="equipment-grid" id="equipment-checkboxes">
        ${ALL_EQUIPMENT.map((eq) => {
          const isChecked = currentEquipment.includes(eq.id);
          return `
            <label class="equipment-pill ${isChecked ? 'active' : ''}" data-eq-id="${eq.id}">
              <input type="checkbox" value="${eq.id}" ${isChecked ? 'checked' : ''} />
              <div>
                <div style="font-size: 0.95rem; font-weight: 600;">${eq.icon} ${escapeHtml(t(eq.name))}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">${escapeHtml(t(eq.desc))}</div>
              </div>
            </label>
          `;
        }).join('')}
      </div>

      <div class="actions-stack" style="margin-top: 20px;">
        <button id="btn-save-equipment" class="btn btn-primary">
          ${t('💾 Salvează selecția')}
        </button>
      </div>
    </div>
  `;

  // Toggle pills on click
  container.querySelectorAll('#equipment-checkboxes label').forEach((label) => {
    label.addEventListener('change', (e) => {
      if (e.target.checked) {
        label.classList.add('active');
      } else {
        label.classList.remove('active');
      }
    });
  });

  // Quick reset to bodyweight only
  container.querySelector('#btn-no-equipment')?.addEventListener('click', () => {
    container.querySelectorAll('#equipment-checkboxes input[type="checkbox"]').forEach((cb) => {
      if (['bodyweight', 'chair', 'wall'].includes(cb.value)) {
        cb.checked = true;
        cb.closest('.equipment-pill')?.classList.add('active');
      } else {
        cb.checked = false;
        cb.closest('.equipment-pill')?.classList.remove('active');
      }
    });
  });

  // Save selection
  container.querySelector('#btn-save-equipment')?.addEventListener('click', async () => {
    const selected = [];
    container.querySelectorAll('#equipment-checkboxes input[type="checkbox"]:checked').forEach((cb) => {
      selected.push(cb.value);
    });

    if (!selected.includes('bodyweight')) selected.unshift('bodyweight');

    await updateProfile({ equipment: selected });

    const btn = container.querySelector('#btn-save-equipment');
    btn.textContent = '✅ Salvat!';
    setTimeout(() => { btn.textContent = t('💾 Salvează selecția'); }, 1500);

    showAppToast('Echipamentul a fost actualizat!');
  });
}

function showAppToast(msg) {
  const container = document.querySelector('.toast-container') || document.body;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
