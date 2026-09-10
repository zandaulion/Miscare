// Compendiu de exerciții — Mișcare
// Afișează toate cele 37 de exerciții din aplicație structurate pe niveluri (0 - 3),
// cu filtre avansate, căutare live, verificarea compatibilității cu echipamentul și mod de practică rapidă.

import { CLIENT_EXERCISES, getExerciseById } from './exercises.js';
import { t, exText, repWords } from './i18n.js';
import { formatReps } from './format-reps.js';
import { state } from './server-client.js';

// Tabelele țin chei, nu texte traduse.
//
// `t()` chemat direct în literalul unui `const` de modul se evaluează o
// singură dată, la import -- înaintea încărcării limbii -- și nu se mai
// recalculează niciodată. De aceea compendiul rămânea în română pe un ecran
// arab, chiar și pentru textele care păreau deja traduse. Traducerea se face
// la desenare.
const LEVEL_INFO = {
  0: {
    name: 'Nivel 0 — De la 0 absolut',
    shortName: 'De la 0',
    icon: '🟢',
    badgeClass: 'level-0',
    desc: 'Fără impact articular, adaptat pentru sedentarism sau reacomodare blândă (scaun / perete).'
  },
  1: {
    name: 'Nivel 1 — Începător',
    shortName: 'Începător',
    icon: '🔵',
    badgeClass: 'level-1',
    desc: 'Construirea formei de bază, mișcări la sol, gantere ușoare și benzi elastice.'
  },
  2: {
    name: 'Nivel 2 — Intermediar',
    shortName: 'Intermediar',
    icon: '🟡',
    badgeClass: 'level-2',
    desc: 'Flotări clasice la podea, gantere reglabile (5-20 kg), greutăți compuse și bară de tracțiuni.'
  },
  3: {
    name: 'Nivel 3 — Avansat',
    shortName: 'Avansat',
    icon: '🔴',
    badgeClass: 'level-3',
    desc: 'Exerciții compuse de forță și explozie: flotări diamant, jump squats, tracțiuni libere.'
  }
};

const CATEGORY_NAMES = {
  upper: { label: 'Partea de sus', icon: '💪' },
  lower: { label: 'Picioare', icon: '🦵' },
  core: { label: 'Trunchi & Core', icon: '🛡️' },
  core_glutes: { label: 'Trunchi & Fesieri', icon: '🛡️' },
  mobility: { label: 'Mobilitate', icon: '🧘' },
  total: { label: 'Corp complet', icon: '⚡' }
};

const EQUIPMENT_ICONS = {
  bodyweight: { name: 'Corp liber', icon: '🧘' },
  chair: { name: 'Scaun', icon: '🪑' },
  wall: { name: 'Perete', icon: '🧱' },
  yoga_mat: { name: 'Saltea', icon: '🟩' },
  dumbbells: { name: 'Gantere mici', icon: '🏋️' },
  adjustable_dumbbells: { name: 'Gantere 5-20kg', icon: '🏋️‍♂️' },
  resistance_band: { name: 'Bandă elastică', icon: '🎗️' },
  pullup_bar: { name: 'Bară tracțiuni', icon: '🪜' },
  kettlebell: { name: 'Kettlebell', icon: '🔔' },
  foam_roller: { name: 'Rolă spumă', icon: '🪵' },
  cushion: { name: 'Pernă', icon: '🛋️' }
};

// Stare internă pentru compendiu
let currentFilter = {
  level: 'all', // 'all', '0', '1', '2', '3'
  category: 'all', // 'all', 'upper', 'lower', 'core', 'mobility'
  searchQuery: '',
  onlyMyEquipment: false,
  expandedIds: new Set()
};

let practiceTimerInterval = null;
let practiceSecondsRemaining = 45;
let practiceIsRunning = false;
let currentPracticeExercise = null;

export function renderCompendiumView(container, options = {}) {
  if (options.level !== undefined) {
    currentFilter.level = String(options.level);
  }

  const userEquipment = state.profile?.equipment || ['bodyweight', 'chair', 'wall'];

  container.innerHTML = `
    <div class="compendium-view">
      <!-- Header -->
      <div class="card compendium-hero">
        <div class="card-header" style="margin-bottom: 6px;">
          <div>
            <h1 class="card-title" style="font-size: 1.4rem; display: flex; align-items: center; gap: 8px;">
              <span>📖</span> ${t('Compendiu de Exerciții')}
            </h1>
            <p class="card-subtitle">
              ${t('Toate cele {n} de mișcări structurate pe niveluri, cu ghid biomecanic și sfaturi', { n: CLIENT_EXERCISES.length })}
            </p>
          </div>
        </div>

        <!-- Căutare live -->
        <div class="compendium-search-wrapper" style="margin-top: 14px;">
          <span class="search-icon">🔍</span>
          <input
            type="search"
            id="compendium-search-input"
            class="compendium-search-input"
            placeholder="${t('Caută după nume, mușchi sau echipament...')}"
            value="${escapeHtml(currentFilter.searchQuery)}"
            autocomplete="off"
          />
          ${currentFilter.searchQuery ? `
            <button id="btn-clear-search" class="search-clear-btn" aria-label="${t('Șterge căutarea')}">✕</button>
          ` : ''}
        </div>

        <!-- Filtre Nivel (Chips principale) -->
        <div class="compendium-filters-section" style="margin-top: 14px;">
          <div class="filter-label">${t('Nivel de intensitate:')}</div>
          <div class="level-chips-container" role="tablist">
            <button class="level-chip ${currentFilter.level === 'all' ? 'active' : ''}" data-level="all">
              ${t('Toate')} (${CLIENT_EXERCISES.length})
            </button>
            <button class="level-chip level-chip-0 ${currentFilter.level === '0' ? 'active' : ''}" data-level="0">
              🟢 ${t('De la 0')} (${countByLevel(0)})
            </button>
            <button class="level-chip level-chip-1 ${currentFilter.level === '1' ? 'active' : ''}" data-level="1">
              🔵 ${t('Începător')} (${countByLevel(1)})
            </button>
            <button class="level-chip level-chip-2 ${currentFilter.level === '2' ? 'active' : ''}" data-level="2">
              🟡 ${t('Intermediar')} (${countByLevel(2)})
            </button>
            <button class="level-chip level-chip-3 ${currentFilter.level === '3' ? 'active' : ''}" data-level="3">
              🔴 ${t('Avansat')} (${countByLevel(3)})
            </button>
          </div>
        </div>

        <!-- Sub-filtre Categorii & Echipament -->
        <div class="compendium-subfilters" style="margin-top: 12px; display: flex; flex-wrap: wrap; gap: 8px; justify-content: space-between; align-items: center;">
          <div class="category-chips-container">
            <button class="cat-chip ${currentFilter.category === 'all' ? 'active' : ''}" data-category="all">
              ${t('Toate')}
            </button>
            <button class="cat-chip ${currentFilter.category === 'upper' ? 'active' : ''}" data-category="upper">
              ${t('💪 Partea de sus')}
            </button>
            <button class="cat-chip ${currentFilter.category === 'lower' ? 'active' : ''}" data-category="lower">
              ${t('🦵 Picioare')}
            </button>
            <button class="cat-chip ${currentFilter.category === 'core' ? 'active' : ''}" data-category="core">
              ${t('🛡️ Trunchi / Core')}
            </button>
            <button class="cat-chip ${currentFilter.category === 'mobility' ? 'active' : ''}" data-category="mobility">
              ${t('🧘 Mobilitate')}
            </button>
          </div>

          <label class="equipment-toggle-pill ${currentFilter.onlyMyEquipment ? 'active' : ''}" title="${t('Filtrează doar exercițiile ce pot fi făcute cu echipamentul tău actual')}">
            <input type="checkbox" id="toggle-only-my-equipment" ${currentFilter.onlyMyEquipment ? 'checked' : ''} style="display: none;" />
            <span>${t('✨ Doar echipamentul meu')}</span>
          </label>
        </div>
      </div>

      <!-- Containerul de rezultate -->
      <div id="compendium-results-container">
        ${renderExerciseSections(userEquipment)}
      </div>

      <!-- Modal de practică rapidă -->
      <div id="practice-modal" class="practice-modal-overlay hidden" aria-modal="true" role="dialog">
        <div class="practice-modal-card">
          <div class="practice-modal-header">
            <div style="font-weight: 700; font-size: 1.1rem;" id="practice-title">${t('Exersează mișcarea')}</div>
            <button id="btn-close-practice" class="btn-close-circle" aria-label="${t('Închide')}">✕</button>
          </div>
          <div class="practice-modal-body">
            <div id="practice-svg-wrapper" class="practice-svg-box"></div>
            <div id="practice-cue-text" class="practice-cue-box"></div>
            <div class="practice-timer-display" id="practice-timer-display">00:45</div>
            <div class="practice-controls">
              <button id="btn-toggle-practice" class="btn btn-primary" style="flex: 1;">${t('⏸️ Pauză')}</button>
              <button id="btn-reset-practice" class="btn btn-secondary" style="width: auto;">${t('🔄 Reset')}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  bindCompendiumEvents(container);
}

function countByLevel(lvl) {
  return CLIENT_EXERCISES.filter((e) => e.level === lvl).length;
}

function getFilteredExercises(userEquipment) {
  return CLIENT_EXERCISES.filter((ex) => {
    // Nivel
    if (currentFilter.level !== 'all' && ex.level !== parseInt(currentFilter.level, 10)) {
      return false;
    }
    // Categorie
    if (currentFilter.category !== 'all' && ex.category !== currentFilter.category) {
      return false;
    }
    // Căutare query
    if (currentFilter.searchQuery) {
      const q = currentFilter.searchQuery.toLowerCase().trim();
      // Se caută în limba de pe ecran. Altfel cineva care vede „Push-ups"
      // ar trebui să tasteze „Flotări" ca să-l găsească.
      const matchName = exText(ex.id, 'name').toLowerCase().includes(q);
      const matchFocus = exText(ex.id, 'focus').toLowerCase().includes(q);
      const matchDesc = exText(ex.id, 'description').toLowerCase().includes(q);
      const matchTip = exText(ex.id, 'tip').toLowerCase().includes(q);
      const matchEq = ex.equipment.some((eq) => {
        const info = EQUIPMENT_ICONS[eq];
        return Boolean(info) && t(info.name).toLowerCase().includes(q);
      });
      if (!matchName && !matchFocus && !matchDesc && !matchTip && !matchEq) {
        return false;
      }
    }
    // Doar echipamentul meu
    if (currentFilter.onlyMyEquipment) {
      const hasAll = ex.equipment.every((eq) => userEquipment.includes(eq));
      if (!hasAll) return false;
    }
    return true;
  });
}

function renderExerciseSections(userEquipment) {
  const filtered = getFilteredExercises(userEquipment);

  if (filtered.length === 0) {
    return `
      <div class="card" style="text-align: center; padding: 36px 20px;">
        <div style="font-size: 2.2rem; margin-bottom: 10px;">🔍</div>
        <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 6px;">${t('Niciun exercițiu găsit')}</h3>
        <p style="font-size: 0.88rem; color: var(--text-muted); max-width: 320px; margin: 0 auto 16px;">
          ${t('Încearcă să relaxezi filtrele sau debifează „Doar echipamentul meu”.')}
        </p>
        <button id="btn-reset-filters" class="btn btn-secondary" style="display: inline-block; width: auto;">
          ${t('Resetează filtrele')}
        </button>
      </div>
    `;
  }

  // Dacă utilizatorul a selectat un nivel anume (sau căutare specifică), grupăm sau listăm
  const levelsToRender = currentFilter.level === 'all' ? [0, 1, 2, 3] : [parseInt(currentFilter.level, 10)];

  let html = `
    <div class="compendium-stats-bar">
      <span>${t('Afișez {shown} din {total} exerciții', { shown: filtered.length, total: CLIENT_EXERCISES.length })}</span>
      ${currentFilter.onlyMyEquipment ? `<span class="badge-accent">${t('✨ Compatibile cu echipamentul tău')}</span>` : ''}
    </div>
  `;

  for (const lvl of levelsToRender) {
    const levelExercises = filtered.filter((e) => e.level === lvl);
    if (levelExercises.length === 0) continue;

    const info = LEVEL_INFO[lvl];

    html += `
      <div class="compendium-level-section">
        <div class="compendium-level-header ${info.badgeClass}">
          <div class="level-header-title">
            <span class="level-header-icon">${info.icon}</span>
            <span class="level-header-name">${t(info.name)}</span>
            <span class="level-header-count">(${levelExercises.length})</span>
          </div>
          <p class="level-header-desc">${t(info.desc)}</p>
        </div>

        <div class="compendium-cards-list">
          ${levelExercises.map((ex) => renderExerciseCard(ex, userEquipment)).join('')}
        </div>
      </div>
    `;
  }

  return html;
}

function renderExerciseCard(ex, userEquipment) {
  const isExpanded = currentFilter.expandedIds.has(ex.id);
  const cat = CATEGORY_NAMES[ex.category] || { label: ex.category, icon: '⚡' };
  const levelMeta = LEVEL_INFO[ex.level];

  // Verificare compatibilitate echipament
  const hasEquipment = ex.equipment.every((eq) => userEquipment.includes(eq));
  const missingEquipment = ex.equipment.filter((eq) => !userEquipment.includes(eq));

  return `
    <div class="compendium-card ${isExpanded ? 'expanded' : ''}" id="card-ex-${ex.id}" data-id="${ex.id}">
      <!-- Antetul cardului (clickabil pentru extindere) -->
      <div class="compendium-card-summary" role="button" tabindex="0" aria-expanded="${isExpanded}">
        <div class="compendium-card-svg-col">
          <div class="compendium-svg-frame ${ex.image ? 'has-photo' : ''}">
            ${ex.image ? `<img src="${ex.image}" alt="${escapeHtml(exText(ex.id, 'name'))}" class="ex-img" />` : ex.svg}
          </div>
        </div>

        <div class="compendium-card-main-col">
          <div class="compendium-card-badges">
            <span class="badge-level ${levelMeta.badgeClass}">${t(levelMeta.shortName)}</span>
            <span class="badge-category">${cat.icon} ${t(cat.label)}</span>
            ${hasEquipment ? `
              <span class="badge-available" title="${t('Disponibil cu echipamentul tău actual')}">${t('✓ Disponibil')}</span>
            ` : `
              <span class="badge-needs-equip" title="${t('Necesită echipament suplimentar')}">⚠️ ${t('Necesită {items}', { items: missingEquipment.map((eq) => t(EQUIPMENT_ICONS[eq]?.name || eq)).join(', ') })}</span>
            `}
          </div>

          <h3 class="compendium-card-name">${escapeHtml(exText(ex.id, 'name'))}</h3>
          
          <div class="compendium-card-focus">
            <span class="focus-icon">🎯</span> ${escapeHtml(ex.focus || t('Mușchi principali'))}
          </div>

          <div class="compendium-card-equipment-list">
            ${ex.equipment.map((eq) => {
              const eqInfo = EQUIPMENT_ICONS[eq] || { name: eq, icon: '📦' };
              const userHas = userEquipment.includes(eq);
              return `<span class="eq-pill ${userHas ? 'has-it' : 'missing'}">${eqInfo.icon} ${t(eqInfo.name)}</span>`;
            }).join('')}
          </div>
        </div>

        <div class="compendium-card-arrow-col">
          <span class="expand-chevron ${isExpanded ? 'rotated' : ''}">▼</span>
        </div>
      </div>

      <!-- Corp detaliat expandabil -->
      ${isExpanded ? `
        <div class="compendium-card-details">
          ${(ex.animation || ex.image) ? `
            <div class="detail-photo-banner">
              <img src="${ex.animation || ex.image}" alt="${escapeHtml(exText(ex.id, 'name'))}" class="detail-full-photo" />
            </div>
          ` : ''}
          <div class="detail-block">
            <div class="detail-label">${t('📖 Cum se execută corect:')}</div>
            <p class="detail-text">${escapeHtml(exText(ex.id, 'description'))}</p>
          </div>

          ${exText(ex.id, 'tip') ? `
            <div class="detail-tip-box">
              <span class="tip-bulb">💡</span>
              <div>
                <strong>${t('Sfatul antrenorului:')}</strong>
                <p style="margin-top: 2px;">${escapeHtml(exText(ex.id, 'tip'))}</p>
              </div>
            </div>
          ` : ''}

          <div class="detail-metrics-row">
            <div class="metric-chip">
              <span class="metric-chip-icon">🔢</span>
              <div>
                <div class="metric-chip-label">${t('Volum uzual')}</div>
                <div class="metric-chip-val">${escapeHtml(formatReps(ex.reps, repWords()))}</div>
              </div>
            </div>
            <div class="metric-chip">
              <span class="metric-chip-icon">⏱️</span>
              <div>
                <div class="metric-chip-label">${t('Timp per serie')}</div>
                <div class="metric-chip-val">~${ex.duration_s || 45} secunde</div>
              </div>
            </div>
          </div>

          <!-- Alternative / Progresii (Swaps) -->
          ${ex.swaps && ex.swaps.length > 0 ? `
            <div class="detail-block" style="margin-top: 14px;">
              <div class="detail-label">${t('🔄 Mișcări înrudite / Alternative:')}</div>
              <div class="swaps-chip-list">
                ${ex.swaps.map((swapId) => {
                  const swapEx = getExerciseById(swapId);
                  if (!swapEx) return '';
                  return `
                    <button class="swap-jump-btn" data-target-id="${swapEx.id}">
                      ${exText(swapEx.id, 'name')} (${t(LEVEL_INFO[swapEx.level]?.shortName || '')})
                    </button>
                  `;
                }).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Buton de practică rapidă -->
          <div class="detail-actions-row">
            <button class="btn btn-primary btn-practice" data-id="${ex.id}">
              ${t('▶️ Exersează mișcarea (45 secunde)')}
            </button>
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

function bindCompendiumEvents(container) {
  // Căutare în timp real
  const searchInput = container.querySelector('#compendium-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentFilter.searchQuery = e.target.value;
      updateResults(container);
      const clearBtn = container.querySelector('#btn-clear-search');
      if (clearBtn) {
        clearBtn.style.display = e.target.value ? 'block' : 'none';
      }
    });
  }

  const clearBtn = container.querySelector('#btn-clear-search');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      currentFilter.searchQuery = '';
      if (searchInput) searchInput.value = '';
      clearBtn.remove();
      updateResults(container);
    });
  }

  // Filtrare pe nivel
  container.querySelectorAll('.level-chip').forEach((btn) => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.level-chip').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter.level = btn.dataset.level;
      updateResults(container);
    });
  });

  // Filtrare pe categorii
  container.querySelectorAll('.cat-chip').forEach((btn) => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.cat-chip').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter.category = btn.dataset.category;
      updateResults(container);
    });
  });

  // Toggle "Doar echipamentul meu"
  const equipToggle = container.querySelector('#toggle-only-my-equipment');
  if (equipToggle) {
    equipToggle.addEventListener('change', (e) => {
      currentFilter.onlyMyEquipment = e.target.checked;
      const parentPill = equipToggle.closest('.equipment-toggle-pill');
      if (parentPill) {
        parentPill.classList.toggle('active', e.target.checked);
      }
      updateResults(container);
    });
  }

  // Resetare filtre dacă niciun rezultat nu e găsit
  container.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'btn-reset-filters') {
      currentFilter.level = 'all';
      currentFilter.category = 'all';
      currentFilter.searchQuery = '';
      currentFilter.onlyMyEquipment = false;
      renderCompendiumView(container);
    }
  });

  bindCardInteractions(container);
}

function bindCardInteractions(container) {
  // Click pe card summary -> expand / collapse
  container.querySelectorAll('.compendium-card-summary').forEach((summary) => {
    summary.addEventListener('click', () => {
      const card = summary.closest('.compendium-card');
      const id = card.dataset.id;
      if (currentFilter.expandedIds.has(id)) {
        currentFilter.expandedIds.delete(id);
      } else {
        currentFilter.expandedIds.add(id);
      }
      updateResults(container);
    });

    summary.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        summary.click();
      }
    });
  });

  // Click pe buton de swap jump
  container.querySelectorAll('.swap-jump-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetId = btn.dataset.targetId;
      if (!targetId) return;

      currentFilter.level = 'all';
      currentFilter.category = 'all';
      currentFilter.searchQuery = '';
      currentFilter.expandedIds.add(targetId);

      renderCompendiumView(container);

      setTimeout(() => {
        const targetEl = document.getElementById(`card-ex-${targetId}`);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          targetEl.classList.add('highlight-pulse');
          setTimeout(() => targetEl.classList.remove('highlight-pulse'), 1800);
        }
      }, 100);
    });
  });

  // Click pe butonul de practică (45s)
  container.querySelectorAll('.btn-practice').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const exId = btn.dataset.id;
      const ex = getExerciseById(exId);
      if (ex) {
        openPracticeModal(ex, container);
      }
    });
  });
}

function updateResults(container) {
  const resultsContainer = container.querySelector('#compendium-results-container');
  if (!resultsContainer) return;

  const userEquipment = state.profile?.equipment || ['bodyweight', 'chair', 'wall'];
  resultsContainer.innerHTML = renderExerciseSections(userEquipment);
  bindCardInteractions(container);
}

// ---------------------------------------------------------------------------
// MODAL DE PRACTICĂ RAPIDĂ
// ---------------------------------------------------------------------------
function openPracticeModal(exercise, container) {
  currentPracticeExercise = exercise;
  const modal = container.querySelector('#practice-modal');
  if (!modal) return;

  modal.classList.remove('hidden');

  container.querySelector('#practice-title').textContent = exText(exercise.id, 'name');
  const practiceBox = container.querySelector('#practice-svg-wrapper');
  if (practiceBox) {
    const visualSrc = exercise.animation || exercise.image;
    practiceBox.className = `practice-svg-box ${visualSrc ? 'has-photo' : ''}`;
    practiceBox.innerHTML = visualSrc
      ? `<img src="${visualSrc}" alt="${escapeHtml(exText(exercise.id, 'name'))}" class="practice-photo" />`
      : exercise.svg;
  }
  container.querySelector('#practice-cue-text').innerHTML = `
    <strong>${escapeHtml(exercise.focus || '')}</strong><br>
    <span style="font-size: 0.85rem; color: var(--text-muted);">${escapeHtml(exText(exercise.id, 'tip') || exText(exercise.id, 'description'))}</span>
  `;

  practiceSecondsRemaining = exercise.duration_s || 45;
  practiceIsRunning = true;

  updatePracticeDisplay(container);
  startPracticeCountdown(container);

  playPracticeBeep(520, 0.12);
  speakVoicePrompt(`${t('Pregătește-te pentru')} ${exText(exercise.id, 'name')}. ${t('Începem.')}`);

  const btnClose = container.querySelector('#btn-close-practice');
  const btnToggle = container.querySelector('#btn-toggle-practice');
  const btnReset = container.querySelector('#btn-reset-practice');

  btnClose.onclick = () => closePracticeModal(modal);
  btnToggle.onclick = () => {
    practiceIsRunning = !practiceIsRunning;
    btnToggle.innerHTML = practiceIsRunning ? t('⏸️ Pauză') : t('▶️ Continuă');
  };
  btnReset.onclick = () => {
    practiceSecondsRemaining = exercise.duration_s || 45;
    practiceIsRunning = true;
    btnToggle.innerHTML = t('⏸️ Pauză');
    updatePracticeDisplay(container);
  };
}

function closePracticeModal(modal) {
  clearInterval(practiceTimerInterval);
  practiceTimerInterval = null;
  practiceIsRunning = false;
  currentPracticeExercise = null;
  modal.classList.add('hidden');
}

function startPracticeCountdown(container) {
  clearInterval(practiceTimerInterval);
  practiceTimerInterval = setInterval(() => {
    if (!practiceIsRunning) return;

    practiceSecondsRemaining -= 1;
    updatePracticeDisplay(container);

    if (practiceSecondsRemaining <= 3 && practiceSecondsRemaining > 0) {
      playPracticeBeep(440, 0.08);
    }

    if (practiceSecondsRemaining <= 0) {
      clearInterval(practiceTimerInterval);
      playPracticeChime();
      speakVoicePrompt('Bravo! Mișcare finalizată cu succes.');
      const btnToggle = container.querySelector('#btn-toggle-practice');
      if (btnToggle) btnToggle.innerHTML = '✓ Finalizat';
      practiceIsRunning = false;
    }
  }, 1000);
}

function updatePracticeDisplay(container) {
  const display = container.querySelector('#practice-timer-display');
  if (!display) return;
  const mins = Math.floor(practiceSecondsRemaining / 60);
  const secs = practiceSecondsRemaining % 60;
  display.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function playPracticeBeep(freq = 440, duration = 0.08) {
  if (typeof window === 'undefined') return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {}
}

function playPracticeChime() {
  if (typeof window === 'undefined') return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.35);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.7);
  } catch {}
}

function speakVoicePrompt(text) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ro-RO';
    utterance.rate = 1.05;
    const voices = window.speechSynthesis.getVoices();
    const roVoice = voices.find((v) => v.lang && v.lang.toLowerCase().startsWith('ro'));
    if (roVoice) utterance.voice = roVoice;
    window.speechSynthesis.speak(utterance);
  } catch {}
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
