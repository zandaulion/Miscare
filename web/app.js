import { installUpdates } from '/pwa-update.js';
import { probe, redeem, state, updateProfile } from './server-client.js';
import { renderRoutineView } from './routine-view.js';
import { renderEquipmentView } from './equipment-view.js';
import { renderLogView } from './log-view.js';

// Setup pwa-kit updates
installUpdates({
  appName: 'Mișcare',
  toast: (message) => showToast(message),
  isBusy: () => Boolean(document.getElementById('guided-overlay'))
});

export function showToast(message) {
  const container = document.querySelector('.toast-container') || document.body;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

// Check if running as installed PWA
export function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true ||
         document.referrer.includes('android-app://');
}

async function init() {
  await probe();
  updateDeviceBadge();

  // Check URL query parameters for invite code
  const params = new URLSearchParams(window.location.search);
  const inviteCode = params.get('code') || params.get('invite');

  if (inviteCode && !state.linked) {
    if (isStandalone()) {
      try {
        await redeem(inviteCode);
        showToast('Aplicație activată cu succes!');
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (err) {
        showToast(err.message || 'Eroare la activare');
      }
    } else {
      // Opened in browser: show install banner with prefilled code
      showInstallInvitePrompt(inviteCode);
    }
  }

  // Bind Navigation Tabs
  const navButtons = document.querySelectorAll('.nav-item');
  navButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      navButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.dataset.tab;
      switchTab(tab);
    });
  });

  // Device badge click -> opens access / settings modal
  document.getElementById('device-badge')?.addEventListener('click', () => {
    openSettingsModal();
  });

  // Default view
  switchTab('today');
}

function updateDeviceBadge() {
  const badge = document.getElementById('device-badge');
  if (!badge) return;

  if (state.linked) {
    badge.className = 'device-badge linked';
    badge.innerHTML = `🟢 ${escapeHtml(state.device?.label || 'Conectat')}`;
  } else {
    badge.className = 'device-badge';
    badge.innerHTML = `🔒 Activează cod`;
  }
}

function switchTab(tab) {
  const main = document.getElementById('main-content');
  if (!main) return;

  window.scrollTo({ top: 0, behavior: 'instant' });

  switch (tab) {
    case 'today':
      renderRoutineView(main);
      break;
    case 'equipment':
      renderEquipmentView(main);
      break;
    case 'progress':
      renderLogView(main);
      break;
    case 'settings':
      renderSettingsView(main);
      break;
  }
}

function renderSettingsView(container) {
  container.innerHTML = `
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Acces & Dispozitiv</h2>
      </div>

      ${state.linked ? `
        <div class="support-banner">
          <div class="support-banner-icon">📱</div>
          <div>
            <div style="font-weight: 700;">Dispozitiv activat</div>
            <div style="font-size: 0.85rem; color: var(--text-muted);">
              Nume: <strong>${escapeHtml(state.device?.label || 'Telefonul meu')}</strong><br>
              ID: <code style="font-size: 0.78rem;">${escapeHtml(state.device?.id)}</code>
            </div>
          </div>
        </div>

        <div style="margin-top: 14px;">
          <label style="display: block; font-weight: 600; font-size: 0.9rem; margin-bottom: 6px;">
            Redenumește dispozitivul:
          </label>
          <div style="display: flex; gap: 8px;">
            <input type="text" id="device-label-input" class="btn btn-secondary" style="flex: 1; text-align: left; padding: 10px 14px;" value="${escapeHtml(state.device?.label || '')}" />
            <button id="btn-save-label" class="btn btn-primary" style="width: auto;">Salvează</button>
          </div>
        </div>
      ` : `
        <div class="support-banner" style="background: var(--surface-subtle); border-color: var(--border);">
          <div class="support-banner-icon">🔑</div>
          <div>
            <div style="font-weight: 700;">Activează cu cod de invitație</div>
            <p style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.4;">
              Introdu codul primit din consola de administrare (format: ABCD-EFGH-JKLM).
            </p>
          </div>
        </div>

        <div style="margin-top: 14px;">
          <input type="text" id="invite-code-input" class="btn btn-secondary" placeholder="ABCD-EFGH-JKLM" style="width: 100%; text-align: center; font-size: 1.1rem; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 10px;" />
          <button id="btn-redeem" class="btn btn-primary">Activează acum</button>
        </div>
      `}
    </div>

    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Instalare & Service Worker</h2>
      </div>
      <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 12px; line-height: 1.4;">
        Stare PWA: <strong>${isStandalone() ? 'Instalat pe ecranul principal ✅' : 'Rulare în browser'}</strong>
      </p>

      ${!isStandalone() ? `
        <div class="support-banner" style="background: var(--surface); border-color: var(--border); margin-bottom: 14px;">
          <div style="font-size: 0.82rem; line-height: 1.4;">
            <strong>Cum adaugi pe ecranul principal:</strong><br>
            • <strong>iPhone (Safari):</strong> Apasă butonul de partajare (pătratul cu săgeată în sus) → „Add to Home Screen”.<br>
            • <strong>Android (Chrome):</strong> Meniul ⋮ → „Instalează aplicația” sau „Adaugă la ecranul principal”.
          </div>
        </div>
      ` : ''}

      <div style="border-top: 1px solid var(--border); padding-top: 14px;">
        <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 8px;">
          Dacă întâmpini probleme de afișare sau vrei să golești memoria cache:
        </div>
        <a href="/bust" class="btn btn-secondary btn-sm" style="display: inline-block;">
          🧹 Curăță memoria cache (/bust)
        </a>
      </div>
    </div>
  `;

  // Bind redeem
  container.querySelector('#btn-redeem')?.addEventListener('click', async () => {
    const code = container.querySelector('#invite-code-input')?.value.trim();
    if (!code) return;
    try {
      await redeem(code);
      showToast('Dispozitiv activat!');
      updateDeviceBadge();
      renderSettingsView(container);
    } catch (err) {
      showToast(err.message || 'Eroare la activare');
    }
  });

  // Bind label change
  container.querySelector('#btn-save-label')?.addEventListener('click', async () => {
    const label = container.querySelector('#device-label-input')?.value.trim();
    if (!label) return;
    try {
      const res = await fetch('/api/auth/label', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`
        },
        body: JSON.stringify({ label })
      });
      if (res.ok) {
        state.device.label = label;
        updateDeviceBadge();
        showToast('Nume actualizat!');
      }
    } catch {}
  });
}

function openSettingsModal() {
  document.querySelector('[data-tab="settings"]')?.click();
}

function showInstallInvitePrompt(code) {
  const modal = document.createElement('div');
  modal.className = 'guided-overlay';
  modal.innerHTML = `
    <div class="guided-body" style="max-width: 440px; margin: 0 auto;">
      <div style="font-size: 3rem; margin-bottom: 10px;">📲</div>
      <h2 style="font-size: 1.4rem; font-weight: 800; margin-bottom: 8px;">
        Adaugă Mișcare pe ecranul principal
      </h2>
      <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 16px; line-height: 1.4;">
        Pentru cea mai bună experiență și notificări optime, instalează aplicația înainte de activare.
      </p>

      <div class="card" style="text-align: left; margin-bottom: 16px;">
        <div style="font-size: 0.85rem; line-height: 1.5;">
          1) Adaugă pagina pe ecranul principal:<br>
          • <strong>iPhone:</strong> Butonul Share → <em>Add to Home Screen</em><br>
          • <strong>Android:</strong> Meniul ⋮ → <em>Instalează</em><br><br>
          2) Deschide aplicația de pe ecranul principal și apasă linkul din nou, sau folosește codul:
        </div>
        <div style="font-size: 1.2rem; font-weight: 800; letter-spacing: 2px; text-align: center; padding: 10px; background: var(--surface-subtle); border-radius: 8px; margin: 10px 0;">
          ${escapeHtml(code)}
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 10px; width: 100%;">
        <button id="btn-activate-anyway" class="btn btn-primary">
          Activează direct în browser
        </button>
        <button id="btn-dismiss-invite" class="btn btn-secondary">
          Am înțeles, o voi instala
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  modal.querySelector('#btn-activate-anyway')?.addEventListener('click', async () => {
    try {
      await redeem(code);
      showToast('Activat cu succes!');
      modal.remove();
      updateDeviceBadge();
    } catch (err) {
      showToast(err.message || 'Eroare');
    }
  });

  modal.querySelector('#btn-dismiss-invite')?.addEventListener('click', () => {
    modal.remove();
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

window.addEventListener('DOMContentLoaded', init);
