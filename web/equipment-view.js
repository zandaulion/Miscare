import { state, updateProfile, detectEquipment } from './server-client.js';

const ALL_EQUIPMENT = [
  { id: 'bodyweight', name: 'Greutatea corpului', icon: '🧘', desc: 'Întotdeauna disponibilă' },
  { id: 'chair', name: 'Scaun stabil', icon: '🪑', desc: 'Pentru sprijin și așezare' },
  { id: 'wall', name: 'Perete liber', icon: '🧱', desc: 'Pentru flotări și postură' },
  { id: 'yoga_mat', name: 'Saltea / Covoraș', icon: '🟩', desc: 'Pentru confort la sol' },
  { id: 'dumbbells', name: 'Gantere mici', icon: '🏋️', desc: '1 - 5 kg' },
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
          <h2 class="card-title">Foto la echipament</h2>
          <p class="card-subtitle">Fotografiază ce ai la îndemână, iar AI-ul detectează automat</p>
        </div>
      </div>

      <div class="camera-dropzone" id="camera-dropzone">
        <span class="camera-icon">📸</span>
        <div style="font-weight: 700; margin-bottom: 4px;">Fă o poză sau alege o imagine</div>
        <p style="font-size: 0.8rem; color: var(--text-muted);">
          Gantere, o bandă, o saltea sau colțul unde faci mișcare
        </p>
        <input type="file" id="file-input" accept="image/*" capture="environment" style="display: none;" />
      </div>

      <div id="photo-preview-container" class="hidden" style="margin-bottom: 16px;">
        <img id="photo-preview" style="width: 100%; max-height: 220px; object-fit: cover; border-radius: var(--radius-md); margin-bottom: 10px;" />
        <button id="btn-analyze-photo" class="btn btn-primary">
          ✨ Analizează echipamentul cu Gemini AI
        </button>
      </div>

      <div id="ai-detection-result" class="hidden" style="margin-top: 14px;"></div>
    </div>

    <div class="card">
      <div class="card-header">
        <div>
          <h2 class="card-title">Echipamentul tău activ</h2>
          <p class="card-subtitle">Bifează ce ai la dispoziție acasă</p>
        </div>
        <button id="btn-no-equipment" class="btn btn-secondary btn-sm">
          Doar greutatea corpului
        </button>
      </div>

      <div class="equipment-grid" id="equipment-checkboxes">
        ${ALL_EQUIPMENT.map((eq) => {
          const isChecked = currentEquipment.includes(eq.id);
          return `
            <label class="equipment-pill ${isChecked ? 'active' : ''}" data-eq-id="${eq.id}">
              <input type="checkbox" value="${eq.id}" ${isChecked ? 'checked' : ''} />
              <div>
                <div style="font-size: 0.9rem;">${eq.icon} ${escapeHtml(eq.name)}</div>
                <div style="font-size: 0.72rem; color: var(--text-muted);">${escapeHtml(eq.desc)}</div>
              </div>
            </label>
          `;
        }).join('')}
      </div>

      <div class="actions-stack">
        <button id="btn-save-equipment" class="btn btn-primary">
          💾 Salvează selecția
        </button>
      </div>
    </div>
  `;

  // Dropzone click
  const dropzone = container.querySelector('#camera-dropzone');
  const fileInput = container.querySelector('#file-input');
  const previewContainer = container.querySelector('#photo-preview-container');
  const previewImg = container.querySelector('#photo-preview');
  const analyzeBtn = container.querySelector('#btn-analyze-photo');
  const aiResultDiv = container.querySelector('#ai-detection-result');

  let currentPhotoBase64 = null;
  let currentMimeType = 'image/jpeg';

  dropzone?.addEventListener('click', () => fileInput?.click());

  fileInput?.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    currentMimeType = file.type || 'image/jpeg';
    const base64 = await resizeImage(file, 1200);
    currentPhotoBase64 = base64.replace(/^data:[^;]+;base64,/, '');

    previewImg.src = base64;
    previewContainer.classList.remove('hidden');
    aiResultDiv.classList.add('hidden');
  });

  analyzeBtn?.addEventListener('click', async () => {
    if (!currentPhotoBase64) return;
    analyzeBtn.disabled = true;
    analyzeBtn.textContent = '⏳ Se analizează fotografia...';

    try {
      const res = await detectEquipment(currentPhotoBase64, currentMimeType);

      aiResultDiv.classList.remove('hidden');
      aiResultDiv.innerHTML = `
        <div class="support-banner" style="flex-direction: column; align-items: flex-start;">
          <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 4px;">
            🔍 Rezultat analiză:
          </div>
          <p style="font-size: 0.85rem; margin-bottom: 6px;">${escapeHtml(res.summary_ro || 'Am identificat echipamentul.')}</p>
          ${res.recommendation_ro ? `<div style="font-size: 0.8rem; color: var(--text-muted);">💡 ${escapeHtml(res.recommendation_ro)}</div>` : ''}
        </div>
      `;

      // Bifează automat echipamentele găsite în interfață
      if (res.detected && res.detected.length > 0) {
        const detectedIds = res.detected.map((d) => d.id);
        container.querySelectorAll('#equipment-checkboxes input[type="checkbox"]').forEach((cb) => {
          if (detectedIds.includes(cb.value)) {
            cb.checked = true;
            cb.closest('.equipment-pill')?.classList.add('active');
          }
        });
      }
    } catch (err) {
      aiResultDiv.classList.remove('hidden');
      aiResultDiv.innerHTML = `
        <div style="color: #DC2626; font-size: 0.85rem; padding: 10px; background: #FEE2E2; border-radius: var(--radius-sm);">
          ⚠️ ${escapeHtml(err.message || 'Nu s-a putut efectua analiza.')}
        </div>
      `;
    } finally {
      analyzeBtn.disabled = false;
      analyzeBtn.textContent = '✨ Analizează din nou';
    }
  });

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
    setTimeout(() => { btn.textContent = '💾 Salvează selecția'; }, 1500);

    // Toast
    showAppToast('Echipamentul a fost actualizat!');
  });
}

function resizeImage(file, maxDimension = 1200) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
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
    .replace(/"/g, '&quot;');
}
