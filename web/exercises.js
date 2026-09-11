// Catalogul complet de exerciții pentru client (32 exerciții)
// Pictograme SVG curate, cu biomecanică anatomică clară și accente dinamice

export const CLIENT_EXERCISES = [
  // =========================================================================
  // NIVEL 0 (De la 0 absolut — fără impact, sprijin scaun / perete)
  // =========================================================================
  {
    id: 'wall_pushups',
    reps: {"lo":8,"hi":10,"unit":"reps"},
    category: 'upper',
    level: 0,
    equipment: ['wall', 'bodyweight'],
    duration_s: 45,
    image: '/images/exercises/wall_pushups.jpg',
    animation: '/images/exercises/wall_pushups.webp',
    swaps: ['shoulder_rolls_and_reach', 'chest_opener_stretch', 'incline_pushups'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg" xmlns="http://www.w3.org/2000/svg">
      <!-- Podea și Perete -->
      <line x1="12" y1="88" x2="88" y2="88" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" opacity="0.4" />
      <line x1="84" y1="16" x2="84" y2="88" stroke="#64748B" stroke-width="4" stroke-linecap="round" opacity="0.6" />
      <line x1="84" y1="28" x2="90" y2="28" stroke="#64748B" stroke-width="2" opacity="0.4" />
      <line x1="84" y1="48" x2="90" y2="48" stroke="#64748B" stroke-width="2" opacity="0.4" />
      <line x1="84" y1="68" x2="90" y2="68" stroke="#64748B" stroke-width="2" opacity="0.4" />
      <!-- Corp aliniat înclinat -->
      <circle cx="58" cy="28" r="5.5" fill="currentColor" />
      <line x1="28" y1="88" x2="44" y2="62" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" />
      <line x1="44" y1="62" x2="54" y2="38" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" />
      <!-- Brațe împingând în perete -->
      <path d="M 54,40 L 68,48 L 84,45" stroke="#2A7B4C" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <!-- Săgeată dinamică de mișcare -->
      <path d="M 68,58 L 56,58 M 60,54 L 56,58 L 60,62" stroke="#2A7B4C" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
    </svg>`
  },
  {
    id: 'chair_sit_to_stand',
    reps: {"lo":6,"hi":8,"unit":"reps"},
    category: 'lower',
    level: 0,
    equipment: ['chair', 'bodyweight'],
    duration_s: 50,
    image: '/images/exercises/chair_sit_to_stand.jpg',
    animation: '/images/exercises/chair_sit_to_stand.webp',
    swaps: ['standing_calf_raises', 'box_squat_touch'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg" xmlns="http://www.w3.org/2000/svg">
      <!-- Podea -->
      <line x1="12" y1="88" x2="88" y2="88" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" opacity="0.4" />
      <!-- Scaun -->
      <path d="M 76,38 L 76,64 L 56,64 M 58,64 L 58,88 M 76,64 L 76,88" stroke="#64748B" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.5" />
      <!-- Persoană în ridicare activă -->
      <circle cx="44" cy="24" r="5.5" fill="currentColor" />
      <path d="M 44,32 L 50,56 L 44,70 L 40,88" stroke="currentColor" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <!-- Brațe întinse în față pentru echilibru -->
      <path d="M 46,38 L 32,44 L 20,42" stroke="#2A7B4C" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <!-- Săgeată verticală de ridicare -->
      <path d="M 28,66 L 28,52 M 24,56 L 28,52 L 32,56" stroke="#2A7B4C" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
    </svg>`
  },
  {
    id: 'standing_calf_raises',
    reps: {"lo":10,"hi":12,"unit":"reps"},
    category: 'lower',
    level: 0,
    equipment: ['wall', 'chair', 'bodyweight'],
    duration_s: 40,
    image: '/images/exercises/standing_calf_raises.jpg',
    animation: '/images/exercises/standing_calf_raises.webp',
    swaps: ['chair_sit_to_stand'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg" xmlns="http://www.w3.org/2000/svg">
      <!-- Podea -->
      <line x1="15" y1="88" x2="85" y2="88" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" opacity="0.4" />
      <!-- Suport (spătar scaun / bară) -->
      <path d="M 72,42 L 80,42 M 76,42 L 76,88" stroke="#64748B" stroke-width="3" stroke-linecap="round" opacity="0.5" />
      <!-- Persoană ridicată pe vârfuri -->
      <circle cx="46" cy="18" r="5.5" fill="currentColor" />
      <line x1="46" y1="26" x2="46" y2="56" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" />
      <!-- Mâini pe suport -->
      <path d="M 46,34 L 62,40 L 74,42" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round" />
      <!-- Picioare ridicate pe vârfuri cu călcâi în aer -->
      <path d="M 46,56 L 46,76 L 50,88" stroke="currentColor" stroke-width="4.5" fill="none" stroke-linecap="round" />
      <!-- Călcâi suspendat + săgeată sus -->
      <line x1="46" y1="76" x2="40" y2="81" stroke="#2A7B4C" stroke-width="3.5" stroke-linecap="round" />
      <path d="M 34,88 L 34,78 M 31,81 L 34,78 L 37,81" stroke="#2A7B4C" stroke-width="2" fill="none" stroke-linecap="round" />
    </svg>`
  },
  {
    id: 'shoulder_rolls_and_reach',
    reps: {"lo":30,"hi":30,"unit":"seconds"},
    category: 'mobility',
    level: 0,
    equipment: ['bodyweight'],
    duration_s: 35,
    image: '/images/exercises/shoulder_rolls_and_reach.jpg',
    animation: '/images/exercises/shoulder_rolls_and_reach.webp',
    swaps: ['chest_opener_stretch'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg" xmlns="http://www.w3.org/2000/svg">
      <line x1="20" y1="88" x2="80" y2="88" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" opacity="0.4" />
      <circle cx="50" cy="22" r="5.5" fill="currentColor" />
      <line x1="50" y1="30" x2="50" y2="60" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" />
      <path d="M 50,60 L 42,88 M 50,60 L 58,88" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
      <!-- Brațe întinse în sus cu arc de deschidere -->
      <path d="M 50,34 L 34,22 L 28,12" stroke="#2A7B4C" stroke-width="3.5" stroke-linecap="round" />
      <path d="M 50,34 L 66,22 L 72,12" stroke="#2A7B4C" stroke-width="3.5" stroke-linecap="round" />
      <!-- Arcuri circulare de rotație a umerilor -->
      <path d="M 28,32 Q 22,38 28,44" stroke="#2A7B4C" stroke-width="2" fill="none" stroke-linecap="round" stroke-dasharray="2 1.5" />
      <path d="M 72,32 Q 78,38 72,44" stroke="#2A7B4C" stroke-width="2" fill="none" stroke-linecap="round" stroke-dasharray="2 1.5" />
    </svg>`
  },
  {
    id: 'glute_bridge_gentle',
    reps: {"lo":8,"hi":10,"unit":"reps"},
    comfort: ["mat"],
    category: 'core_glutes',
    level: 0,
    equipment: ['bodyweight'],
    duration_s: 50,
    image: '/images/exercises/glute_bridge_gentle.jpg',
    animation: '/images/exercises/glute_bridge_gentle.webp',
    swaps: ['seated_knee_lifts'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg" xmlns="http://www.w3.org/2000/svg">
      <!-- Podea -->
      <line x1="12" y1="85" x2="88" y2="85" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" opacity="0.4" />
      <!-- Cap și umeri pe sol -->
      <circle cx="22" cy="78" r="5.5" fill="currentColor" />
      <line x1="28" y1="84" x2="48" y2="84" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" />
      <!-- Punte oblică ridicată (umeri -> bazin -> genunchi) -->
      <path d="M 28,84 L 52,60 L 72,60 L 76,84" stroke="currentColor" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <!-- Săgeată ridicare bazin -->
      <path d="M 52,78 L 52,66 M 48,70 L 52,66 L 56,70" stroke="#2A7B4C" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
    </svg>`
  },
  {
    id: 'seated_knee_lifts',
    reps: {"lo":10,"hi":10,"unit":"reps","note":"alternating"},
    category: 'core',
    level: 0,
    equipment: ['chair', 'bodyweight'],
    duration_s: 40,
    image: '/images/exercises/seated_knee_lifts.jpg',
    animation: '/images/exercises/seated_knee_lifts.webp',
    swaps: ['glute_bridge_gentle'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg" xmlns="http://www.w3.org/2000/svg">
      <line x1="15" y1="88" x2="85" y2="88" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" opacity="0.4" />
      <!-- Scaun -->
      <path d="M 28,40 L 28,64 L 56,64 M 32,64 L 32,88 M 52,64 L 52,88" stroke="#64748B" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.5" />
      <!-- Trunchi drept -->
      <circle cx="40" cy="24" r="5.5" fill="currentColor" />
      <line x1="40" y1="32" x2="40" y2="62" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" />
      <!-- Picior de sprijin jos -->
      <path d="M 40,62 L 56,64 L 56,88" stroke="#94A3B8" stroke-width="3" fill="none" opacity="0.5" />
      <!-- Picior activ ridicat spre piept -->
      <path d="M 40,62 L 52,46 L 64,56" stroke="#2A7B4C" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <!-- Săgeată curbă de ridicare -->
      <path d="M 64,68 Q 68,54 58,46" stroke="#2A7B4C" stroke-width="2" fill="none" stroke-linecap="round" />
    </svg>`
  },
  {
    id: 'chest_opener_stretch',
    reps: {"lo":30,"hi":30,"unit":"seconds"},
    category: 'mobility',
    level: 0,
    equipment: ['wall', 'bodyweight'],
    duration_s: 30,
    image: '/images/exercises/chest_opener_stretch.jpg',
    animation: '/images/exercises/chest_opener_stretch.webp',
    swaps: ['shoulder_rolls_and_reach'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg" xmlns="http://www.w3.org/2000/svg">
      <line x1="15" y1="88" x2="85" y2="88" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" opacity="0.4" />
      <!-- Tocul ușii / Perete vertical -->
      <line x1="82" y1="16" x2="82" y2="88" stroke="#64748B" stroke-width="4" stroke-linecap="round" opacity="0.6" />
      <!-- Antebraț ancorat pe perete -->
      <line x1="82" y1="36" x2="82" y2="52" stroke="#2A7B4C" stroke-width="4.5" stroke-linecap="round" />
      <!-- Braț către umăr -->
      <line x1="82" y1="44" x2="68" y2="40" stroke="#2A7B4C" stroke-width="4" stroke-linecap="round" />
      <!-- Trunchi rotit în exterior -->
      <circle cx="62" cy="24" r="5.5" fill="currentColor" />
      <line x1="62" y1="32" x2="56" y2="60" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" />
      <path d="M 56,60 L 48,88 M 56,60 L 64,88" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
      <!-- Arc de întindere a pieptului -->
      <path d="M 68,44 Q 58,40 54,48" stroke="#2A7B4C" stroke-width="2.5" fill="none" stroke-linecap="round" />
    </svg>`
  },
  {
    id: 'towel_pull_apart',
    reps: {"lo":10,"hi":12,"unit":"reps","note":"hold2s"},
    category: 'upper',
    level: 0,
    equipment: ['bodyweight'],
    image: '/images/exercises/towel_pull_apart.jpg',
    animation: '/images/exercises/towel_pull_apart.webp',
    svg: `<svg viewBox="0 0 100 100" class="ex-svg" xmlns="http://www.w3.org/2000/svg">
      <line x1="10" y1="92" x2="90" y2="92" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" opacity="0.4" />
      <!-- Cap și trunchi, în picioare -->
      <circle cx="50" cy="22" r="6" fill="currentColor" />
      <line x1="50" y1="28" x2="50" y2="62" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" />
      <!-- Picioare -->
      <line x1="50" y1="62" x2="42" y2="92" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
      <line x1="50" y1="62" x2="58" y2="92" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
      <!-- Brațe întinse lateral, la nivelul pieptului -->
      <line x1="50" y1="38" x2="24" y2="38" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" />
      <line x1="50" y1="38" x2="76" y2="38" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" />
      <!-- Prosopul întins între mâini -->
      <path d="M 24,38 Q 50,33 76,38" stroke="#2A7B4C" stroke-width="3.5" fill="none" stroke-linecap="round" />
      <!-- Săgeți de tragere spre exterior -->
      <path d="M 20,48 L 12,48 M 15,45 L 12,48 L 15,51" stroke="#2A7B4C" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M 80,48 L 88,48 M 85,45 L 88,48 L 85,51" stroke="#2A7B4C" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
    </svg>`
  },
  {
    id: 'reverse_snow_angels',
    reps: {"lo":8,"hi":10,"unit":"reps"},
    comfort: ["mat"],
    category: 'upper',
    level: 0,
    equipment: ['bodyweight'],
    image: '/images/exercises/reverse_snow_angels.jpg',
    animation: '/images/exercises/reverse_snow_angels.webp',
    svg: `<svg viewBox="0 0 100 100" class="ex-svg" xmlns="http://www.w3.org/2000/svg">
      <line x1="10" y1="85" x2="90" y2="85" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" opacity="0.4" />
      <!-- Corp întins pe burtă, văzut de sus -->
      <line x1="30" y1="80" x2="76" y2="80" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" />
      <!-- Cap, cu fruntea spre podea -->
      <circle cx="24" cy="80" r="5.5" fill="currentColor" />
      <!-- Brațele ridicate, pe traseu spre cap -->
      <path d="M 36,78 Q 30,64 40,56" stroke="#2A7B4C" stroke-width="3.5" fill="none" stroke-linecap="round" />
      <path d="M 36,82 Q 34,94 46,96" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.35" />
      <!-- Arcul pe care îl parcurg brațele -->
      <path d="M 46,52 Q 34,60 33,72" stroke="#2A7B4C" stroke-width="2" fill="none" stroke-dasharray="3 3" stroke-linecap="round" />
      <path d="M 46,52 L 40,54 M 46,52 L 47,58" stroke="#2A7B4C" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
    </svg>`
  },
  {
    id: 'doorway_row',
    reps: {"lo":8,"hi":10,"unit":"reps"},
    category: 'upper',
    level: 1,
    equipment: ['bodyweight', 'wall'],
    image: '/images/exercises/doorway_row.jpg',
    animation: '/images/exercises/doorway_row.webp',
    svg: `<svg viewBox="0 0 100 100" class="ex-svg" xmlns="http://www.w3.org/2000/svg">
      <line x1="10" y1="92" x2="90" y2="92" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" opacity="0.4" />
      <!-- Tocul ușii -->
      <line x1="78" y1="8" x2="78" y2="92" stroke="#94A3B8" stroke-width="4" stroke-linecap="round" opacity="0.75" />
      <!-- Corp înclinat pe spate, sprijinit pe călcâie -->
      <line x1="40" y1="30" x2="62" y2="86" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" />
      <circle cx="38" cy="25" r="6" fill="currentColor" />
      <!-- Picioarele, aproape de prag -->
      <line x1="62" y1="86" x2="72" y2="92" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
      <!-- Brațele întinse spre toc -->
      <line x1="43" y1="38" x2="76" y2="40" stroke="#2A7B4C" stroke-width="3.5" stroke-linecap="round" />
      <!-- Săgeata de tragere spre ușă -->
      <path d="M 50,58 L 64,52 M 60,50 L 64,52 L 61,56" stroke="#2A7B4C" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
    </svg>`
  },
  {
    id: 'band_pull_apart',
    reps: {"lo":10,"hi":12,"unit":"reps"},
    category: 'upper',
    level: 0,
    equipment: ['resistance_band'],
    duration_s: 45,
    image: '/images/exercises/band_pull_apart.jpg',
    animation: '/images/exercises/band_pull_apart.webp',
    swaps: ['shoulder_rolls_and_reach', 'wall_pushups'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="24" r="5.5" fill="currentColor" />
      <line x1="50" y1="32" x2="50" y2="62" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" />
      <path d="M 50,62 L 42,88 M 50,62 L 58,88" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
      <!-- Brațe depărtate orizontal ținând banda -->
      <line x1="50" y1="38" x2="22" y2="40" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
      <line x1="50" y1="38" x2="78" y2="40" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
      <!-- Banda elastică întinsă în fața pieptului -->
      <line x1="20" y1="40" x2="80" y2="40" stroke="#EAB308" stroke-width="3" stroke-linecap="round" stroke-dasharray="3 1.5" />
      <!-- Săgeți de tragere spre lateral -->
      <path d="M 26,34 L 18,34 M 22,31 L 18,34 L 22,37" stroke="#2A7B4C" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M 74,34 L 82,34 M 78,31 L 82,34 L 78,37" stroke="#2A7B4C" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
    </svg>`
  },

  // =========================================================================
  // NIVEL 1 (Începător de bază — progresie naturală)
  // =========================================================================
  {
    id: 'incline_pushups',
    reps: {"lo":8,"hi":10,"unit":"reps"},
    category: 'upper',
    level: 0,
    equipment: ['chair', 'bodyweight'],
    duration_s: 50,
    image: '/images/exercises/incline_pushups.jpg',
    animation: '/images/exercises/incline_pushups.webp',
    swaps: ['wall_pushups', 'standard_pushups'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg" xmlns="http://www.w3.org/2000/svg">
      <line x1="12" y1="88" x2="88" y2="88" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" opacity="0.4" />
      <!-- Masă / Bancă elevată -->
      <path d="M 64,54 L 86,54 M 70,54 L 70,88 M 84,54 L 84,88" stroke="#64748B" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.5" />
      <!-- Corp înclinat în linie dreaptă -->
      <circle cx="56" cy="36" r="5.5" fill="currentColor" />
      <line x1="20" y1="88" x2="42" y2="64" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" />
      <line x1="42" y1="64" x2="52" y2="44" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" />
      <!-- Brațe îndoite la 90 grade sprijinite pe masă -->
      <path d="M 52,44 L 62,56 L 68,54" stroke="#2A7B4C" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <!-- Săgeată împingere -->
      <path d="M 48,52 L 40,44 M 45,44 L 40,44 L 40,49" stroke="#2A7B4C" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
    </svg>`
  },
  {
    id: 'knee_pushups',
    reps: {"lo":8,"hi":12,"unit":"reps"},
    comfort: ["mat","cushion"],
    category: 'upper',
    level: 1,
    equipment: ['bodyweight'],
    duration_s: 45,
    image: '/images/exercises/knee_pushups.jpg',
    animation: '/images/exercises/knee_pushups.webp',
    swaps: ['incline_pushups', 'standard_pushups', 'wall_pushups'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg" xmlns="http://www.w3.org/2000/svg">
      <line x1="12" y1="85" x2="88" y2="85" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" opacity="0.4" />
      <!-- Genunchi pe sol la x=70, picioare ridicate ușor în spate -->
      <path d="M 80,74 L 70,84" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round" />
      <!-- Trunchi în linie dreaptă de la genunchi la umeri -->
      <line x1="70" y1="84" x2="40" y2="60" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" />
      <!-- Cap privind spre podea -->
      <circle cx="30" cy="54" r="5.5" fill="currentColor" />
      <!-- Brațe îndoite la 90 grade sprijinite pe sol -->
      <path d="M 40,60 L 46,72 L 36,84" stroke="#2A7B4C" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <!-- Săgeată împingere piept -->
      <path d="M 32,70 L 32,60 M 28,64 L 32,60 L 36,64" stroke="#2A7B4C" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
    </svg>`
  },
  {
    id: 'box_squat_touch',
    reps: {"lo":8,"hi":10,"unit":"reps"},
    category: 'lower',
    level: 1,
    equipment: ['chair', 'bodyweight'],
    duration_s: 50,
    image: '/images/exercises/box_squat_touch.jpg',
    animation: '/images/exercises/box_squat_touch.webp',
    swaps: ['chair_sit_to_stand', 'full_squats'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg" xmlns="http://www.w3.org/2000/svg">
      <line x1="15" y1="88" x2="85" y2="88" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" opacity="0.4" />
      <!-- Scaun atins ușor -->
      <path d="M 68,60 L 84,60 M 72,60 L 72,88 M 82,60 L 82,88" stroke="#64748B" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.5" />
      <!-- Persoană în genuflexiune paralelă -->
      <circle cx="48" cy="24" r="5.5" fill="currentColor" />
      <path d="M 48,32 L 64,58 L 44,62 L 38,88" stroke="currentColor" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <!-- Brațe în față pentru balans -->
      <path d="M 50,38 L 36,40 L 24,38" stroke="#2A7B4C" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <!-- Punct atingere bazin scaun -->
      <circle cx="66" cy="60" r="3" fill="#2A7B4C" />
    </svg>`
  },
  {
    id: 'wall_sit',
    reps: {"lo":20,"hi":30,"unit":"seconds","note":"hold"},
    category: 'lower',
    level: 1,
    equipment: ['wall'],
    duration_s: 40,
    image: '/images/exercises/wall_sit.jpg',
    animation: '/images/exercises/wall_sit.webp',
    swaps: ['chair_sit_to_stand', 'box_squat_touch'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg" xmlns="http://www.w3.org/2000/svg">
      <!-- Podea și perete -->
      <line x1="10" y1="88" x2="90" y2="88" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" opacity="0.4" />
      <line x1="30" y1="20" x2="30" y2="88" stroke="#3B82F6" stroke-width="4" stroke-linecap="round" opacity="0.6" />
      <!-- Cap sprijinit de perete -->
      <circle cx="37" cy="30" r="5.5" fill="currentColor" />
      <!-- Trunchi vertical lipit de perete de la umăr la șold -->
      <line x1="34" y1="36" x2="34" y2="62" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" />
      <!-- Coapse orizontale la 90 grade -->
      <line x1="34" y1="62" x2="60" y2="62" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" />
      <!-- Gambe verticale la podea la 90 grade -->
      <line x1="60" y1="62" x2="60" y2="88" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" />
      <!-- Tălpi ferme pe podea -->
      <line x1="58" y1="88" x2="68" y2="88" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" />
      <!-- Mâini pe coapse sau încrucișate pe piept -->
      <path d="M 34,44 L 46,52 L 54,60" stroke="#2A7B4C" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <!-- Arc unghi 90 grade la genunchi -->
      <path d="M 52,62 A 8 8 0 0 1 60,70" stroke="#2A7B4C" stroke-width="2" fill="none" stroke-linecap="round" />
    </svg>`
  },
  {
    id: 'prone_cobra',
    reps: {"lo":8,"hi":10,"unit":"reps","note":"hold2s"},
    comfort: ["mat"],
    category: 'mobility',
    level: 1,
    equipment: ['bodyweight'],
    duration_s: 45,
    image: '/images/exercises/prone_cobra.jpg',
    animation: '/images/exercises/prone_cobra.webp',
    swaps: ['shoulder_rolls_reach', 'chest_opener_stretch'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg" xmlns="http://www.w3.org/2000/svg">
      <line x1="10" y1="85" x2="90" y2="85" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" opacity="0.4" />
      <!-- Picioare întinse pe sol -->
      <line x1="46" y1="84" x2="82" y2="84" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
      <!-- Trunchi arcuit ușor în sus de la bazin la piept -->
      <path d="M 46,84 C 38,80 30,70 24,62" stroke="currentColor" stroke-width="4.5" fill="none" stroke-linecap="round" />
      <!-- Cap privind spre podea la 45 grade -->
      <circle cx="20" cy="54" r="5.5" fill="currentColor" />
      <!-- Brațe extinse spre spate pe lângă șolduri -->
      <line x1="26" y1="64" x2="52" y2="68" stroke="#2A7B4C" stroke-width="3.5" stroke-linecap="round" />
      <!-- Săgeată de ridicare a pieptului -->
      <path d="M 18,74 L 18,65 M 15,69 L 18,65 L 21,69" stroke="#2A7B4C" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
    </svg>`
  },
  {
    id: 'bird_dog_gentle',
    reps: {"lo":6,"hi":8,"unit":"reps","note":"eachSide"},
    comfort: ["mat","cushion"],
    category: 'core_glutes',
    level: 1,
    equipment: ['bodyweight'],
    duration_s: 55,
    image: '/images/exercises/bird_dog_gentle.jpg',
    animation: '/images/exercises/bird_dog_gentle.webp',
    swaps: ['glute_bridge_gentle'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg" xmlns="http://www.w3.org/2000/svg">
      <line x1="12" y1="85" x2="88" y2="85" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" opacity="0.4" />
      <!-- Puncte de sprijin jos: palmă + genunchi -->
      <line x1="62" y1="60" x2="62" y2="85" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
      <line x1="44" y1="60" x2="44" y2="85" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
      <!-- Trunchi orizontal stabil -->
      <circle cx="70" cy="52" r="5.5" fill="currentColor" />
      <line x1="44" y1="60" x2="62" y2="60" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" />
      <!-- Braț întins înainte + picior opus întins înapoi în aceeași linie orizontală -->
      <line x1="62" y1="60" x2="88" y2="60" stroke="#2A7B4C" stroke-width="4" stroke-linecap="round" />
      <line x1="44" y1="60" x2="16" y2="60" stroke="#2A7B4C" stroke-width="4" stroke-linecap="round" />
    </svg>`
  },
  {
    id: 'deadbug_assisted',
    reps: {"lo":8,"hi":8,"unit":"reps","note":"alternating"},
    comfort: ["mat"],
    category: 'core',
    level: 1,
    equipment: ['bodyweight'],
    duration_s: 45,
    image: '/images/exercises/deadbug_assisted.jpg',
    animation: '/images/exercises/deadbug_assisted.webp',
    swaps: ['glute_bridge_gentle'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg" xmlns="http://www.w3.org/2000/svg">
      <line x1="12" y1="85" x2="88" y2="85" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" opacity="0.4" />
      <circle cx="24" cy="78" r="5.5" fill="currentColor" />
      <line x1="28" y1="84" x2="56" y2="84" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" />
      <!-- Brațe ridicate vertical la 90 grade -->
      <line x1="38" y1="84" x2="38" y2="50" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
      <!-- Un genunchi la 90 grade în aer -->
      <path d="M 56,84 L 56,60 L 72,60" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round" />
      <!-- Al doilea picior coborând activ spre sol -->
      <path d="M 56,84 L 68,76 L 80,82" stroke="#2A7B4C" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-dasharray="3 1.5" />
    </svg>`
  },
  {
    id: 'crunches_standard',
    reps: {"lo":10,"hi":15,"unit":"reps"},
    comfort: ["mat"],
    category: 'core',
    level: 1,
    equipment: ['bodyweight'],
    duration_s: 45,
    image: '/images/exercises/crunches_standard.jpg',
    animation: '/images/exercises/crunches_standard.webp',
    swaps: ['deadbug_assisted', 'forearm_plank'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg" xmlns="http://www.w3.org/2000/svg">
      <line x1="10" y1="85" x2="90" y2="85" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" opacity="0.4" />
      <!-- Bazin pe sol -->
      <line x1="38" y1="84" x2="52" y2="84" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" />
      <!-- Spate superior ridicat în flexie abdominală (crunch) -->
      <line x1="38" y1="84" x2="26" y2="70" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" />
      <!-- Cap ridicat privind spre tavan -->
      <circle cx="18" cy="62" r="5.5" fill="currentColor" />
      <!-- Mâini la tâmple / coate deschise -->
      <path d="M 26,70 L 16,68 L 22,60" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <!-- Picioare îndoite: coapse și gambe cu tălpile pe podea -->
      <path d="M 52,84 L 66,62 L 76,84" stroke="currentColor" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <!-- Evidențiere contractie musculară abdomen -->
      <circle cx="34" cy="74" r="3.5" fill="#2A7B4C" />
      <!-- Săgeată curbă de ridicare omoplați -->
      <path d="M 32,78 C 30,73 28,68 28,63 M 24,67 L 28,63 L 32,67" stroke="#2A7B4C" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
    </svg>`
  },
  {
    id: 'side_plank',
    reps: {"lo":15,"hi":20,"unit":"seconds","note":"eachSide"},
    comfort: ["mat","cushion"],
    category: 'core',
    level: 1,
    equipment: ['bodyweight'],
    duration_s: 50,
    image: '/images/exercises/side_plank.jpg',
    animation: '/images/exercises/side_plank.webp',
    swaps: ['deadbug_assisted', 'forearm_plank'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg" xmlns="http://www.w3.org/2000/svg">
      <line x1="12" y1="85" x2="88" y2="85" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" opacity="0.4" />
      <!-- Genunchi pe sol la x=70, gambe îndoite în spate -->
      <path d="M 80,74 L 70,84" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round" />
      <!-- Linie dreaptă ridicată de la genunchi la umăr -->
      <line x1="70" y1="84" x2="38" y2="56" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" />
      <!-- Cap aliniat cu trunchiul -->
      <circle cx="28" cy="50" r="5.5" fill="currentColor" />
      <!-- Braț de sprijin: antebraț pe sol și braț vertical -->
      <line x1="38" y1="56" x2="38" y2="84" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
      <line x1="38" y1="84" x2="24" y2="84" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
      <!-- Braț de sus pe șold -->
      <path d="M 40,56 L 48,50 L 54,64" stroke="#2A7B4C" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <!-- Săgeată ridicare bazin -->
      <path d="M 52,78 L 52,70 M 48,74 L 52,70 L 56,74" stroke="#2A7B4C" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
    </svg>`
  },
  {
    id: 'dumbbell_seated_bicep_curl',
    reps: {"lo":10,"hi":12,"unit":"reps"},
    category: 'upper',
    level: 1,
    equipment: ['dumbbells', 'chair'],
    duration_s: 50,
    image: '/images/exercises/dumbbell_seated_bicep_curl.jpg',
    animation: '/images/exercises/dumbbell_seated_bicep_curl.webp',
    swaps: ['band_pull_apart', 'incline_pushups'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg" xmlns="http://www.w3.org/2000/svg">
      <line x1="15" y1="88" x2="85" y2="88" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" opacity="0.4" />
      <path d="M 28,44 L 28,64 L 54,64 M 32,64 L 32,88 M 50,64 L 50,88" stroke="#64748B" stroke-width="3" fill="none" opacity="0.5" />
      <circle cx="42" cy="24" r="5.5" fill="currentColor" />
      <path d="M 42,32 L 42,64 L 58,64 L 58,88" stroke="currentColor" stroke-width="4.5" fill="none" stroke-linecap="round" />
      <!-- Braț flectând gantera spre umăr -->
      <path d="M 42,38 L 48,54 L 56,40" stroke="#2A7B4C" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <!-- Ganteră desenată la mână -->
      <circle cx="53" cy="38" r="3" fill="#2A7B4C" />
      <line x1="53" y1="38" x2="61" y2="44" stroke="#2A7B4C" stroke-width="2" />
      <circle cx="61" cy="44" r="3" fill="#2A7B4C" />
    </svg>`
  },
  {
    id: 'dumbbell_seated_shoulder_press',
    reps: {"lo":8,"hi":10,"unit":"reps"},
    category: 'upper',
    level: 1,
    equipment: ['dumbbells', 'chair'],
    duration_s: 50,
    image: '/images/exercises/dumbbell_seated_shoulder_press.jpg',
    animation: '/images/exercises/dumbbell_seated_shoulder_press.webp',
    swaps: ['incline_pushups', 'shoulder_rolls_and_reach'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg" xmlns="http://www.w3.org/2000/svg">
      <line x1="20" y1="88" x2="80" y2="88" stroke="#94A3B8" stroke-width="2.5" opacity="0.4" />
      <circle cx="50" cy="32" r="5.5" fill="currentColor" />
      <line x1="50" y1="40" x2="50" y2="70" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" />
      <path d="M 50,70 L 40,88 M 50,70 L 60,88" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
      <!-- Două brațe împingând ganterele sus -->
      <path d="M 50,44 L 34,36 L 34,18" stroke="#2A7B4C" stroke-width="4" fill="none" stroke-linecap="round" />
      <path d="M 50,44 L 66,36 L 66,18" stroke="#2A7B4C" stroke-width="4" fill="none" stroke-linecap="round" />
      <!-- Gantere deasupra capului -->
      <line x1="28" y1="18" x2="40" y2="18" stroke="#2A7B4C" stroke-width="3" stroke-linecap="round" />
      <line x1="60" y1="18" x2="72" y2="18" stroke="#2A7B4C" stroke-width="3" stroke-linecap="round" />
      <!-- Săgeți de împingere sus -->
      <path d="M 50,22 L 50,12 M 47,15 L 50,12 L 53,15" stroke="#2A7B4C" stroke-width="2" fill="none" stroke-linecap="round" />
    </svg>`
  },
  {
    id: 'band_seated_row',
    reps: {"lo":10,"hi":12,"unit":"reps"},
    category: 'upper',
    level: 1,
    equipment: ['resistance_band'],
    duration_s: 50,
    image: '/images/exercises/band_seated_row.jpg',
    animation: '/images/exercises/band_seated_row.webp',
    swaps: ['band_pull_apart', 'incline_pushups'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg" xmlns="http://www.w3.org/2000/svg">
      <line x1="12" y1="85" x2="88" y2="85" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" opacity="0.4" />
      <circle cx="34" cy="38" r="5.5" fill="currentColor" />
      <!-- Trunchi așezat drept + picioare întinse înainte -->
      <line x1="34" y1="46" x2="34" y2="84" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" />
      <line x1="34" y1="84" x2="78" y2="84" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" />
      <line x1="78" y1="84" x2="82" y2="76" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
      <!-- Brațe trăgând coatele în spate -->
      <path d="M 34,52 L 48,60 L 36,68" stroke="#2A7B4C" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <!-- Banda elastică întinsă de la tălpi la mâini -->
      <line x1="82" y1="78" x2="48" y2="60" stroke="#EAB308" stroke-width="2.5" stroke-dasharray="3 1.5" />
    </svg>`
  },
  {
    id: 'active_hang',
    reps: {"lo":20,"hi":30,"unit":"seconds"},
    category: 'mobility',
    level: 1,
    equipment: ['pullup_bar'],
    duration_s: 35,
    image: '/images/exercises/active_hang.jpg',
    animation: '/images/exercises/active_hang.webp',
    swaps: ['shoulder_rolls_and_reach', 'chest_opener_stretch'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg" xmlns="http://www.w3.org/2000/svg">
      <!-- Bara de tracțiuni de sus -->
      <line x1="16" y1="16" x2="84" y2="16" stroke="#64748B" stroke-width="4.5" stroke-linecap="round" />
      <line x1="24" y1="16" x2="24" y2="6" stroke="#64748B" stroke-width="3" opacity="0.5" />
      <line x1="76" y1="16" x2="76" y2="6" stroke="#64748B" stroke-width="3" opacity="0.5" />
      <!-- Corp atârnat cu brațele drepte -->
      <circle cx="50" cy="30" r="5.5" fill="currentColor" />
      <line x1="42" y1="16" x2="46" y2="34" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
      <line x1="58" y1="16" x2="54" y2="34" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
      <line x1="50" y1="36" x2="50" y2="64" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" />
      <path d="M 50,64 L 46,86 M 50,64 L 54,86" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
      <!-- Săgeți de activare scapulară (umeri coborâți activ) -->
      <path d="M 38,26 L 38,34 M 35,31 L 38,34 L 41,31" stroke="#2A7B4C" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M 62,26 L 62,34 M 59,31 L 62,34 L 65,31" stroke="#2A7B4C" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
    </svg>`
  },

  // =========================================================================
  // NIVEL 2 (Intermediar / Activ — forță la sol, tempo susținut)
  // =========================================================================
  {
    id: 'standard_pushups',
    reps: {"lo":10,"hi":15,"unit":"reps"},
    comfort: ["mat"],
    category: 'upper',
    level: 2,
    equipment: ['bodyweight'],
    duration_s: 50,
    image: '/images/exercises/standard_pushups.jpg',
    animation: '/images/exercises/standard_pushups.webp',
    swaps: ['incline_pushups', 'chair_dips', 'chin_ups', 'diamond_pushups'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg" xmlns="http://www.w3.org/2000/svg">
      <line x1="12" y1="85" x2="88" y2="85" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" opacity="0.4" />
      <!-- Corp orizontal aproape de podea -->
      <circle cx="76" cy="62" r="5.5" fill="currentColor" />
      <line x1="18" y1="82" x2="44" y2="74" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" />
      <line x1="44" y1="74" x2="68" y2="68" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" />
      <!-- Brațe îndoite la 90 grade împingând podeaua -->
      <path d="M 68,68 L 60,56 L 68,85" stroke="#2A7B4C" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <!-- Săgeată dinamică sus-jos -->
      <path d="M 68,46 L 68,36 M 64,40 L 68,36 L 72,40" stroke="#2A7B4C" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
    </svg>`
  },
  {
    id: 'full_squats',
    reps: {"lo":12,"hi":16,"unit":"reps"},
    category: 'lower',
    level: 2,
    equipment: ['bodyweight'],
    duration_s: 50,
    image: '/images/exercises/full_squats.jpg',
    animation: '/images/exercises/full_squats.webp',
    swaps: ['reverse_lunges', 'box_squat_touch', 'jump_squats'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg" xmlns="http://www.w3.org/2000/svg">
      <line x1="15" y1="88" x2="85" y2="88" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" opacity="0.4" />
      <circle cx="42" cy="24" r="5.5" fill="currentColor" />
      <!-- Genuflexiune adâncă: trunchi înclinat + coapse sub orizontală -->
      <path d="M 44,32 L 38,50 L 62,68 L 36,68 L 44,88" stroke="currentColor" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <!-- Brațe întinse în față pentru echilibru -->
      <path d="M 44,38 L 58,40 L 72,40" stroke="#2A7B4C" stroke-width="3.5" fill="none" stroke-linecap="round" />
      <!-- Săgeată forță în coapse -->
      <path d="M 48,78 L 48,68 M 45,72 L 48,68 L 51,72" stroke="#2A7B4C" stroke-width="2" fill="none" stroke-linecap="round" />
    </svg>`
  },
  {
    id: 'forearm_plank',
    reps: {"lo":35,"hi":50,"unit":"seconds"},
    comfort: ["mat"],
    category: 'core',
    level: 2,
    equipment: ['bodyweight'],
    duration_s: 45,
    image: '/images/exercises/forearm_plank.jpg',
    animation: '/images/exercises/forearm_plank.webp',
    swaps: ['mountain_climbers', 'hanging_knee_raises', 'plank_shoulder_taps'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg" xmlns="http://www.w3.org/2000/svg">
      <line x1="12" y1="85" x2="88" y2="85" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" opacity="0.4" />
      <!-- Linia dreaptă a corpului de la călcâie la umeri -->
      <circle cx="78" cy="62" r="5.5" fill="currentColor" />
      <line x1="20" y1="82" x2="48" y2="72" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" />
      <line x1="48" y1="72" x2="70" y2="68" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" />
      <!-- Antebraț orizontal ferm pe sol -->
      <path d="M 70,68 L 70,85 L 82,85" stroke="#2A7B4C" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <!-- Centură abdominală evidențiată -->
      <line x1="40" y1="76" x2="60" y2="73" stroke="#2A7B4C" stroke-width="3.5" stroke-linecap="round" />
    </svg>`
  },
  {
    id: 'reverse_lunges',
    reps: {"lo":10,"hi":12,"unit":"reps","note":"perLeg"},
    category: 'lower',
    level: 2,
    equipment: ['bodyweight'],
    duration_s: 55,
    image: '/images/exercises/reverse_lunges.jpg',
    animation: '/images/exercises/reverse_lunges.webp',
    swaps: ['full_squats', 'single_leg_glute_bridge'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg" xmlns="http://www.w3.org/2000/svg">
      <line x1="12" y1="88" x2="88" y2="88" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" opacity="0.4" />
      <!-- Trunchi vertical -->
      <circle cx="48" cy="22" r="5.5" fill="currentColor" />
      <line x1="48" y1="30" x2="48" y2="58" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" />
      <!-- Picior din față flectat la 90 grade -->
      <path d="M 48,58 L 66,58 L 66,88" stroke="currentColor" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <!-- Picior din spate coborât spre podea -->
      <path d="M 48,58 L 32,74 L 22,88" stroke="#2A7B4C" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <!-- Săgeată direcție pas spate -->
      <path d="M 38,62 L 26,62 M 30,58 L 26,62 L 30,66" stroke="#2A7B4C" stroke-width="2" fill="none" stroke-linecap="round" />
    </svg>`
  },
  {
    id: 'chair_dips',
    reps: {"lo":10,"hi":12,"unit":"reps"},
    category: 'upper',
    level: 2,
    equipment: ['chair', 'bodyweight'],
    duration_s: 50,
    image: '/images/exercises/chair_dips.jpg',
    animation: '/images/exercises/chair_dips.webp',
    swaps: ['standard_pushups', 'chin_ups'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg" xmlns="http://www.w3.org/2000/svg">
      <line x1="15" y1="88" x2="85" y2="88" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" opacity="0.4" />
      <!-- Scaun pe stânga -->
      <path d="M 22,46 L 22,64 L 44,64 M 26,64 L 26,88 M 42,64 L 42,88" stroke="#64748B" stroke-width="3" fill="none" opacity="0.5" />
      <!-- Mâini pe scaun + braț îndoit în unghi drept la triceps -->
      <path d="M 42,64 L 38,48 L 48,46" stroke="#2A7B4C" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <!-- Trunchi coborât în fața scaunului -->
      <circle cx="50" cy="28" r="5.5" fill="currentColor" />
      <line x1="50" y1="36" x2="50" y2="68" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" />
      <!-- Picioare întinse înainte -->
      <path d="M 50,68 L 68,76 L 80,88" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round" />
      <!-- Săgeată forță triceps sus -->
      <path d="M 38,40 L 38,30 M 35,34 L 38,30 L 41,34" stroke="#2A7B4C" stroke-width="2" fill="none" stroke-linecap="round" />
    </svg>`
  },
  {
    id: 'mountain_climbers',
    reps: {"lo":30,"hi":40,"unit":"seconds"},
    comfort: ["mat"],
    category: 'core',
    level: 2,
    equipment: ['bodyweight'],
    duration_s: 40,
    image: '/images/exercises/mountain_climbers.jpg',
    animation: '/images/exercises/mountain_climbers.webp',
    swaps: ['forearm_plank', 'hanging_knee_raises', 'burpees_clean'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg" xmlns="http://www.w3.org/2000/svg">
      <line x1="12" y1="88" x2="88" y2="88" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" opacity="0.4" />
      <circle cx="78" cy="48" r="5.5" fill="currentColor" />
      <!-- Brațe drepte în sprijin pe palme -->
      <line x1="70" y1="54" x2="70" y2="88" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" />
      <line x1="70" y1="54" x2="46" y2="56" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" />
      <!-- Un picior întins în spate -->
      <line x1="46" y1="56" x2="18" y2="88" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" />
      <!-- Al doilea genunchi tras dinamic spre piept -->
      <path d="M 46,56 L 58,68 L 48,80" stroke="#2A7B4C" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <!-- Linii de mișcare dinamică sub picior -->
      <line x1="32" y1="82" x2="42" y2="76" stroke="#2A7B4C" stroke-width="2" stroke-linecap="round" stroke-dasharray="2.5 2" />
    </svg>`
  },
  {
    id: 'dumbbell_bent_over_row',
    reps: {"lo":10,"hi":12,"unit":"reps"},
    category: 'upper',
    level: 2,
    equipment: ['dumbbells'],
    duration_s: 50,
    image: '/images/exercises/dumbbell_bent_over_row.jpg',
    animation: '/images/exercises/dumbbell_bent_over_row.webp',
    swaps: ['standard_pushups', 'chin_ups'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg" xmlns="http://www.w3.org/2000/svg">
      <line x1="15" y1="88" x2="85" y2="88" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" opacity="0.4" />
      <circle cx="68" cy="34" r="5.5" fill="currentColor" />
      <!-- Spate aplecat la 45 grade cu genunchii ușor flexați -->
      <path d="M 68,40 L 48,46 L 38,64 L 40,88" stroke="currentColor" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <!-- Braț trăgând cotul sus spre spate cu ganteră -->
      <path d="M 52,45 L 42,32 L 48,48" stroke="#2A7B4C" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="48" cy="48" r="3.5" fill="#2A7B4C" />
      <!-- Săgeată cot tras în sus -->
      <path d="M 38,28 L 34,22 M 38,22 L 34,22 L 34,26" stroke="#2A7B4C" stroke-width="2" fill="none" stroke-linecap="round" />
    </svg>`
  },
  {
    id: 'single_leg_glute_bridge',
    reps: {"lo":8,"hi":10,"unit":"reps","note":"perLeg"},
    comfort: ["mat"],
    category: 'core_glutes',
    level: 2,
    equipment: ['bodyweight'],
    duration_s: 50,
    image: '/images/exercises/single_leg_glute_bridge.jpg',
    animation: '/images/exercises/single_leg_glute_bridge.webp',
    swaps: ['glute_bridge_gentle', 'full_squats'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg" xmlns="http://www.w3.org/2000/svg">
      <line x1="12" y1="85" x2="88" y2="85" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" opacity="0.4" />
      <circle cx="22" cy="78" r="5.5" fill="currentColor" />
      <line x1="28" y1="84" x2="48" y2="84" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" />
      <!-- Punte ridicată cu un picior pe sol -->
      <path d="M 28,84 L 52,60 L 70,62 L 74,84" stroke="currentColor" stroke-width="4.5" fill="none" stroke-linecap="round" />
      <!-- Al doilea picior întins drept în sus în aer -->
      <line x1="52" y1="60" x2="78" y2="36" stroke="#2A7B4C" stroke-width="4.5" stroke-linecap="round" />
      <path d="M 72,48 L 76,42 M 72,42 L 76,42 L 76,46" stroke="#2A7B4C" stroke-width="2" fill="none" stroke-linecap="round" />
    </svg>`
  },
  {
    id: 'chin_ups',
    reps: {"lo":4,"hi":8,"unit":"reps"},
    category: 'upper',
    level: 2,
    equipment: ['pullup_bar'],
    duration_s: 50,
    image: '/images/exercises/chin_ups.jpg',
    animation: '/images/exercises/chin_ups.webp',
    swaps: ['standard_pushups', 'negative_pullups', 'chair_dips'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg" xmlns="http://www.w3.org/2000/svg">
      <!-- Bara de tracțiuni -->
      <line x1="16" y1="20" x2="84" y2="20" stroke="#64748B" stroke-width="4.5" stroke-linecap="round" />
      <!-- Capul clar ridicat deasupra barei -->
      <circle cx="50" cy="12" r="5.5" fill="currentColor" />
      <!-- Mâini cu priză spre corp + brațe flectate puternic -->
      <path d="M 44,20 L 36,32 L 44,30" stroke="#2A7B4C" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M 56,20 L 64,32 L 56,30" stroke="#2A7B4C" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <!-- Trunchi și picioare trase sus -->
      <line x1="50" y1="20" x2="50" y2="56" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" />
      <path d="M 50,56 L 46,78 M 50,56 L 54,78" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
      <!-- Bicepși evidențiați -->
      <circle cx="38" cy="28" r="2.5" fill="#2A7B4C" />
      <circle cx="62" cy="28" r="2.5" fill="#2A7B4C" />
    </svg>`
  },
  {
    id: 'negative_pullups',
    reps: {"lo":5,"hi":6,"unit":"reps","note":"lower34s"},
    category: 'upper',
    level: 2,
    equipment: ['pullup_bar'],
    duration_s: 50,
    image: '/images/exercises/negative_pullups.jpg',
    animation: '/images/exercises/negative_pullups.webp',
    swaps: ['chin_ups', 'standard_pushups', 'chair_dips'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg" xmlns="http://www.w3.org/2000/svg">
      <line x1="16" y1="18" x2="84" y2="18" stroke="#64748B" stroke-width="4.5" stroke-linecap="round" />
      <circle cx="50" cy="26" r="5.5" fill="currentColor" />
      <path d="M 42,18 L 38,30 L 46,36" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round" />
      <path d="M 58,18 L 62,30 L 54,36" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round" />
      <line x1="50" y1="34" x2="50" y2="64" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" />
      <path d="M 50,64 L 46,86 M 50,64 L 54,86" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
      <!-- Săgeată coborâre controlată lentă -->
      <path d="M 74,34 L 74,58 M 70,52 L 74,58 L 78,52" stroke="#2A7B4C" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="74" cy="28" r="2" fill="#2A7B4C" />
    </svg>`
  },
  {
    id: 'hanging_knee_raises',
    reps: {"lo":8,"hi":12,"unit":"reps"},
    category: 'core',
    level: 2,
    equipment: ['pullup_bar'],
    duration_s: 45,
    image: '/images/exercises/hanging_knee_raises.jpg',
    animation: '/images/exercises/hanging_knee_raises.webp',
    swaps: ['forearm_plank', 'mountain_climbers'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg" xmlns="http://www.w3.org/2000/svg">
      <line x1="16" y1="16" x2="84" y2="16" stroke="#64748B" stroke-width="4.5" stroke-linecap="round" />
      <circle cx="50" cy="30" r="5.5" fill="currentColor" />
      <line x1="42" y1="16" x2="46" y2="34" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
      <line x1="58" y1="16" x2="54" y2="34" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
      <line x1="50" y1="36" x2="50" y2="58" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" />
      <!-- Genunchi ridicați la 90 grade spre piept -->
      <path d="M 50,58 L 34,56 L 34,74" stroke="#2A7B4C" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <!-- Săgeată curbă de ridicare a genunchilor -->
      <path d="M 44,76 Q 30,76 34,62" stroke="#2A7B4C" stroke-width="2.5" fill="none" stroke-linecap="round" />
    </svg>`
  },

  // --- Gantere reglabile / grele (5-20 kg) - Forță compusă Nivel 2
  {
    id: 'dumbbell_goblet_squat',
    reps: {"lo":10,"hi":12,"unit":"reps"},
    category: 'lower',
    level: 2,
    equipment: ['adjustable_dumbbells'],
    duration_s: 50,
    image: '/images/exercises/dumbbell_goblet_squat.jpg',
    animation: '/images/exercises/dumbbell_goblet_squat.webp',
    swaps: ['full_squats', 'box_squat_touch', 'dumbbell_romanian_deadlift'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg" xmlns="http://www.w3.org/2000/svg">
      <line x1="15" y1="88" x2="85" y2="88" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" opacity="0.4" />
      <!-- Cap & trunchi drept coborât în squat -->
      <circle cx="48" cy="24" r="5.5" fill="currentColor" />
      <line x1="48" y1="30" x2="48" y2="52" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" />
      <!-- Picioare flectate în genuflexiune -->
      <path d="M 48,52 L 32,56 L 28,88 M 48,52 L 64,56 L 68,88" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <!-- Ganteră ținută vertical la piept -->
      <rect x="44" y="32" width="8" height="16" rx="2" fill="#64748B" />
      <rect x="41" y="30" width="14" height="4" rx="1.5" fill="#475569" />
      <rect x="41" y="46" width="14" height="4" rx="1.5" fill="#475569" />
      <!-- Brațe ținând gantera la piept -->
      <path d="M 48,34 L 40,40 L 44,38 M 48,34 L 56,40 L 52,38" stroke="#2A7B4C" stroke-width="3" fill="none" stroke-linecap="round" />
      <!-- Săgeată dinamică de adâncime squat -->
      <path d="M 76,46 L 76,64 M 72,58 L 76,64 L 80,58" stroke="#2A7B4C" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
    </svg>`
  },
  {
    id: 'dumbbell_romanian_deadlift',
    reps: {"lo":10,"hi":12,"unit":"reps"},
    category: 'lower',
    level: 2,
    equipment: ['adjustable_dumbbells'],
    duration_s: 50,
    image: '/images/exercises/dumbbell_romanian_deadlift.jpg',
    animation: '/images/exercises/dumbbell_romanian_deadlift.webp',
    swaps: ['glute_bridge_gentle', 'dumbbell_goblet_squat', 'single_leg_glute_bridge'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg" xmlns="http://www.w3.org/2000/svg">
      <line x1="15" y1="88" x2="85" y2="88" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" opacity="0.4" />
      <!-- Bazin împins în spate, spate drept înclinat -->
      <circle cx="58" cy="30" r="5.5" fill="currentColor" />
      <line x1="58" y1="35" x2="40" y2="48" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" />
      <!-- Picioare ușor îndoite -->
      <path d="M 40,48 L 44,66 L 46,88 M 40,48 L 38,66 L 36,88" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round" />
      <!-- Brațe coborând cu gantere -->
      <line x1="54" y1="38" x2="52" y2="64" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" />
      <!-- Ganteră sub genunchi -->
      <rect x="46" y="63" width="12" height="5" rx="1.5" fill="#475569" />
      <circle cx="45" cy="65.5" r="3.5" fill="#64748B" />
      <circle cx="59" cy="65.5" r="3.5" fill="#64748B" />
      <!-- Săgeată hip-hinge spre spate -->
      <path d="M 36,44 L 22,44 M 28,40 L 22,44 L 28,48" stroke="#2A7B4C" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
    </svg>`
  },
  {
    id: 'dumbbell_floor_press',
    reps: {"lo":10,"hi":12,"unit":"reps"},
    comfort: ["mat"],
    category: 'upper',
    level: 2,
    equipment: ['adjustable_dumbbells'],
    duration_s: 50,
    image: '/images/exercises/dumbbell_floor_press.jpg',
    animation: '/images/exercises/dumbbell_floor_press.webp',
    swaps: ['standard_pushups', 'incline_pushups', 'chair_dips'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg" xmlns="http://www.w3.org/2000/svg">
      <line x1="12" y1="84" x2="88" y2="84" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" opacity="0.4" />
      <!-- Corp pe spate la podea -->
      <circle cx="28" cy="78" r="5.5" fill="currentColor" />
      <line x1="33" y1="82" x2="62" y2="82" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" />
      <!-- Genunchi îndoiți pe podea -->
      <path d="M 62,82 L 72,70 L 78,84" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <!-- Brațe împingând ganterele sus -->
      <line x1="44" y1="80" x2="44" y2="50" stroke="#2A7B4C" stroke-width="4" stroke-linecap="round" />
      <!-- Gantera sus în aer -->
      <rect x="36" y="47" width="16" height="5" rx="1.5" fill="#475569" />
      <circle cx="35" cy="49.5" r="4" fill="#64748B" />
      <circle cx="53" cy="49.5" r="4" fill="#64748B" />
      <!-- Săgeată împingere în sus -->
      <path d="M 44,42 L 44,30 M 40,35 L 44,30 L 48,35" stroke="#2A7B4C" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
    </svg>`
  },
  {
    id: 'dumbbell_single_arm_row',
    reps: {"lo":8,"hi":10,"unit":"reps","note":"perArm"},
    category: 'upper',
    level: 2,
    equipment: ['adjustable_dumbbells', 'chair'],
    duration_s: 50,
    image: '/images/exercises/dumbbell_single_arm_row.jpg',
    animation: '/images/exercises/dumbbell_single_arm_row.webp',
    swaps: ['negative_pullups', 'chin_ups', 'standard_pushups', 'dumbbell_bent_over_row'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg" xmlns="http://www.w3.org/2000/svg">
      <line x1="12" y1="88" x2="88" y2="88" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" opacity="0.4" />
      <!-- Scaun conturat pe stânga -->
      <line x1="20" y1="62" x2="42" y2="62" stroke="#64748B" stroke-width="3" stroke-linecap="round" />
      <line x1="24" y1="62" x2="24" y2="88" stroke="#64748B" stroke-width="2.5" />
      <line x1="38" y1="62" x2="38" y2="88" stroke="#64748B" stroke-width="2.5" />
      <!-- Corp sprijinit orizontal -->
      <circle cx="34" cy="42" r="5" fill="currentColor" />
      <line x1="36" y1="46" x2="68" y2="48" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" />
      <!-- Braț de sprijin pe scaun -->
      <line x1="36" y1="46" x2="32" y2="62" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" />
      <!-- Genunchi pe scaun + picior la sol -->
      <path d="M 68,48 L 42,62 M 68,48 L 74,68 L 76,88" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round" />
      <!-- Braț trăgând gantera la șold -->
      <path d="M 50,48 L 56,58" stroke="#2A7B4C" stroke-width="4" stroke-linecap="round" />
      <rect x="50" y="56" width="14" height="5" rx="1.5" fill="#475569" />
      <circle cx="49" cy="58.5" r="3.5" fill="#64748B" />
      <circle cx="65" cy="58.5" r="3.5" fill="#64748B" />
      <!-- Săgeată tragere sus -->
      <path d="M 57,68 L 57,56 M 54,61 L 57,56 L 60,61" stroke="#2A7B4C" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
    </svg>`
  },
  {
    id: 'dumbbell_farmers_carry',
    reps: {"lo":35,"hi":45,"unit":"seconds"},
    category: 'core',
    level: 2,
    equipment: ['adjustable_dumbbells'],
    duration_s: 45,
    image: '/images/exercises/dumbbell_farmers_carry.jpg',
    animation: '/images/exercises/dumbbell_farmers_carry.webp',
    swaps: ['forearm_plank', 'plank_shoulder_taps', 'hanging_knee_raises'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg" xmlns="http://www.w3.org/2000/svg">
      <line x1="15" y1="88" x2="85" y2="88" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" opacity="0.4" />
      <!-- Corp drept vertical în mers cu gantere -->
      <circle cx="50" cy="18" r="5.5" fill="currentColor" />
      <line x1="50" y1="24" x2="50" y2="56" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" />
      <!-- Picioare pas ferm -->
      <line x1="50" y1="56" x2="44" y2="88" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
      <line x1="50" y1="56" x2="56" y2="88" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
      <!-- Brațe drepte în jos ținând gantere masive -->
      <line x1="48" y1="28" x2="36" y2="54" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" />
      <line x1="52" y1="28" x2="64" y2="54" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" />
      <!-- Ganteră stânga -->
      <rect x="31" y="52" width="10" height="6" rx="1.5" fill="#475569" />
      <circle cx="30" cy="55" r="4.5" fill="#64748B" />
      <circle cx="42" cy="55" r="4.5" fill="#64748B" />
      <!-- Ganteră dreapta -->
      <rect x="59" y="52" width="10" height="6" rx="1.5" fill="#475569" />
      <circle cx="58" cy="55" r="4.5" fill="#64748B" />
      <circle cx="70" cy="55" r="4.5" fill="#64748B" />
      <!-- Indicatoare postură mândră sus -->
      <path d="M 50,11 L 50,4 M 47,8 L 50,4 L 53,8" stroke="#2A7B4C" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
    </svg>`
  },

  // =========================================================================
  // NIVEL 3 (Avansat / Intens — forță compusă, explozie)
  // =========================================================================
  {
    id: 'diamond_pushups',
    reps: {"lo":10,"hi":12,"unit":"reps"},
    comfort: ["mat"],
    category: 'upper',
    level: 3,
    equipment: ['bodyweight'],
    duration_s: 50,
    image: '/images/exercises/diamond_pushups.jpg',
    animation: '/images/exercises/diamond_pushups.webp',
    swaps: ['standard_pushups', 'pullups_standard', 'chair_dips'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg" xmlns="http://www.w3.org/2000/svg">
      <line x1="12" y1="85" x2="88" y2="85" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" opacity="0.4" />
      <circle cx="76" cy="62" r="5.5" fill="currentColor" />
      <line x1="18" y1="82" x2="44" y2="74" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" />
      <line x1="44" y1="74" x2="68" y2="68" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" />
      <!-- Coate strânse pe lângă corp -->
      <path d="M 68,68 L 56,60 L 64,85" stroke="currentColor" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <!-- Simbol Diamant sub piept -->
      <polygon points="64,81 68,85 64,89 60,85" fill="#2A7B4C" />
    </svg>`
  },
  {
    id: 'jump_squats',
    reps: {"lo":10,"hi":14,"unit":"reps"},
    category: 'lower',
    level: 3,
    equipment: ['bodyweight'],
    duration_s: 45,
    image: '/images/exercises/jump_squats.jpg',
    animation: '/images/exercises/jump_squats.webp',
    swaps: ['full_squats', 'reverse_lunges', 'burpees_clean'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg" xmlns="http://www.w3.org/2000/svg">
      <!-- Sol -->
      <line x1="15" y1="90" x2="85" y2="90" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" opacity="0.4" />
      <!-- Corp în aer la înălțime de desprindere -->
      <circle cx="50" cy="20" r="5.5" fill="currentColor" />
      <line x1="50" y1="28" x2="50" y2="54" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" />
      <path d="M 50,34 L 34,44 L 26,38" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round" />
      <path d="M 50,34 L 66,44 L 74,38" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round" />
      <!-- Picioare extinse în salt cu tălpile desprinse de sol -->
      <path d="M 50,54 L 42,70 L 46,80" stroke="currentColor" stroke-width="4.5" fill="none" stroke-linecap="round" />
      <path d="M 50,54 L 58,70 L 54,80" stroke="currentColor" stroke-width="4.5" fill="none" stroke-linecap="round" />
      <!-- Linii de impuls / salt exploziv -->
      <path d="M 40,88 Q 50,82 60,88 M 44,84 Q 50,79 56,84" stroke="#2A7B4C" stroke-width="2.5" fill="none" stroke-linecap="round" />
    </svg>`
  },
  {
    id: 'plank_shoulder_taps',
    reps: {"lo":16,"hi":20,"unit":"taps"},
    comfort: ["mat"],
    category: 'core',
    level: 3,
    equipment: ['bodyweight'],
    duration_s: 45,
    image: '/images/exercises/plank_shoulder_taps.jpg',
    animation: '/images/exercises/plank_shoulder_taps.webp',
    swaps: ['forearm_plank', 'mountain_climbers'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg" xmlns="http://www.w3.org/2000/svg">
      <line x1="12" y1="88" x2="88" y2="88" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" opacity="0.4" />
      <circle cx="76" cy="48" r="5.5" fill="currentColor" />
      <!-- Braț de sprijin drept -->
      <line x1="70" y1="54" x2="70" y2="88" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" />
      <line x1="70" y1="54" x2="44" y2="60" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" />
      <line x1="44" y1="60" x2="18" y2="88" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" />
      <!-- Mână care atinge umărul opus -->
      <path d="M 68,54 L 56,66 L 68,58" stroke="#2A7B4C" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="69" cy="56" r="3" fill="#2A7B4C" />
    </svg>`
  },
  {
    id: 'burpees_clean',
    reps: {"lo":8,"hi":12,"unit":"reps"},
    comfort: ["mat"],
    category: 'core',
    level: 3,
    equipment: ['bodyweight'],
    duration_s: 50,
    image: '/images/exercises/burpees_clean.jpg',
    animation: '/images/exercises/burpees_clean.webp',
    swaps: ['mountain_climbers', 'jump_squats'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg" xmlns="http://www.w3.org/2000/svg">
      <line x1="10" y1="88" x2="90" y2="88" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" opacity="0.4" />
      <!-- Tranziție dinamică: poziție de sprijin + salt în sus -->
      <circle cx="68" cy="20" r="5" fill="currentColor" />
      <path d="M 68,26 L 68,50 L 64,74 L 64,84" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round" />
      <!-- Brațe ridicate în salt -->
      <path d="M 68,30 L 58,16 M 68,30 L 78,16" stroke="#2A7B4C" stroke-width="3.5" stroke-linecap="round" />
      <!-- Siluetă flotare jos -->
      <circle cx="44" cy="74" r="3.5" fill="#94A3B8" opacity="0.6" />
      <path d="M 18,84 L 32,80 L 42,78" stroke="#94A3B8" stroke-width="3" opacity="0.6" stroke-linecap="round" />
      <!-- Arc dinamic continuu între sol și salt -->
      <path d="M 38,72 Q 46,42 60,34" stroke="#2A7B4C" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-dasharray="3 2" />
    </svg>`
  },
  {
    id: 'pullups_standard',
    reps: {"lo":6,"hi":10,"unit":"reps"},
    category: 'upper',
    level: 3,
    equipment: ['pullup_bar'],
    duration_s: 50,
    image: '/images/exercises/pullups_standard.jpg',
    animation: '/images/exercises/pullups_standard.webp',
    swaps: ['diamond_pushups', 'chin_ups'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg" xmlns="http://www.w3.org/2000/svg">
      <!-- Bara de tracțiuni -->
      <line x1="14" y1="18" x2="86" y2="18" stroke="#64748B" stroke-width="4.5" stroke-linecap="round" />
      <line x1="22" y1="18" x2="22" y2="8" stroke="#64748B" stroke-width="3" opacity="0.5" />
      <line x1="78" y1="18" x2="78" y2="8" stroke="#64748B" stroke-width="3" opacity="0.5" />
      <!-- Capul la nivelul barei -->
      <circle cx="50" cy="18" r="5.5" fill="currentColor" />
      <!-- Priză largă în pronație (coate evazate lateral) -->
      <path d="M 28,18 L 22,30 L 42,28" stroke="#2A7B4C" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M 72,18 L 78,30 L 58,28" stroke="#2A7B4C" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <!-- Spate în formă de V (dorsali activi) -->
      <line x1="50" y1="26" x2="50" y2="58" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" />
      <path d="M 50,58 L 46,82 M 50,58 L 54,82" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
    </svg>`
  }
];

export function getExerciseById(id) {
  return CLIENT_EXERCISES.find((e) => e.id === id) || null;
}
