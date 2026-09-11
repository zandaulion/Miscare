import { state, updateProfile } from './server-client.js';
import { t, exText, repWords } from './i18n.js';
import { EQUIPMENT_ORDER, equipmentInfo } from './equipment.js';

// Lista, din tabelul comun. Vederea alege forma lungă și descrierea; pastilele
// din compendiu aleg forma scurtă. Sursa e aceeași.
const ALL_EQUIPMENT = EQUIPMENT_ORDER.map((id) => ({ id, ...equipmentInfo(id) }));

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
