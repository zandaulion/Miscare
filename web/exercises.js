// Catalogul complet de exerciții pentru client, cu ghiduri vizuale SVG și nivele 0, 1, 2, 3

export const CLIENT_EXERCISES = [
  // --- Nivel 0 (Ultra-blând)
  {
    id: 'wall_pushups',
    name: 'Flotări la perete',
    category: 'upper',
    level: 0,
    equipment: ['wall', 'bodyweight'],
    default_reps: '8-10 repetări',
    duration_s: 45,
    description: 'Stai la o lungime de braț de un perete liber. Așază palmele la nivelul pieptului. Îndoaie coatele lent și apropie pieptul de perete, apoi împinge înapoi.',
    focus: 'Piept, brațe și umeri',
    tip: 'Păstrează corpul drept ca o scândură.',
    swaps: ['shoulder_rolls_and_reach', 'incline_pushups'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg">
      <line x1="85" y1="10" x2="85" y2="90" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
      <circle cx="45" cy="22" r="8" fill="currentColor" />
      <line x1="45" y1="30" x2="35" y2="65" stroke="currentColor" stroke-width="5" stroke-linecap="round" />
      <line x1="45" y1="38" x2="85" y2="38" stroke="#2A7B4C" stroke-width="4" stroke-linecap="round" stroke-dasharray="2 1" />
      <line x1="35" y1="65" x2="25" y2="90" stroke="currentColor" stroke-width="5" stroke-linecap="round" />
      <line x1="15" y1="90" x2="90" y2="90" stroke="currentColor" stroke-width="3" opacity="0.3" />
    </svg>`
  },
  {
    id: 'chair_sit_to_stand',
    name: 'Ridicări de pe scaun',
    category: 'lower',
    level: 0,
    equipment: ['chair', 'bodyweight'],
    default_reps: '6-8 repetări',
    duration_s: 50,
    description: 'Stai așezat pe marginea unui scaun stabil, cu tălpile bine fixate pe podea. Împinge în călcâie și ridică-te în picioare. Apoi coboară la loc lent și controlat.',
    focus: 'Picioare, coapse și stabilitate',
    tip: 'Coborârea lentă dezvoltă forța fără niciun risc.',
    swaps: ['standing_calf_raises', 'box_squat_touch'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg">
      <path d="M 65,45 L 65,70 M 65,55 L 80,55 M 80,55 L 80,70" stroke="#888" stroke-width="4" fill="none" stroke-linecap="round" />
      <circle cx="45" cy="25" r="8" fill="currentColor" />
      <line x1="45" y1="33" x2="52" y2="55" stroke="currentColor" stroke-width="5" stroke-linecap="round" />
      <line x1="52" y1="55" x2="48" y2="70" stroke="currentColor" stroke-width="5" stroke-linecap="round" />
      <line x1="48" y1="70" x2="48" y2="90" stroke="currentColor" stroke-width="5" stroke-linecap="round" />
      <line x1="20" y1="90" x2="90" y2="90" stroke="currentColor" stroke-width="3" opacity="0.3" />
    </svg>`
  },
  {
    id: 'standing_calf_raises',
    name: 'Ridicări pe vârfuri cu sprijin',
    category: 'lower',
    level: 0,
    equipment: ['wall', 'chair', 'bodyweight'],
    default_reps: '10-12 repetări',
    duration_s: 40,
    description: 'Cu mâinile sprijinite lejer pe spătarul unui scaun sau pe perete, ridică-te pe vârfuri cât mai sus. Menține 1 secundă în vârf și coboară lent.',
    focus: 'Glezne, gambe și circulație',
    tip: 'Activează pompa circulatorie din picioare.',
    swaps: ['chair_sit_to_stand'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg">
      <circle cx="45" cy="20" r="8" fill="currentColor" />
      <line x1="45" y1="28" x2="45" y2="60" stroke="currentColor" stroke-width="5" />
      <line x1="45" y1="38" x2="70" y2="45" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
      <line x1="70" y1="35" x2="70" y2="75" stroke="#888" stroke-width="3" stroke-linecap="round" />
      <line x1="45" y1="60" x2="45" y2="85" stroke="currentColor" stroke-width="5" />
      <line x1="45" y1="85" x2="52" y2="88" stroke="#2A7B4C" stroke-width="4" stroke-linecap="round" />
      <line x1="20" y1="90" x2="85" y2="90" stroke="currentColor" stroke-width="3" opacity="0.3" />
    </svg>`
  },
  {
    id: 'shoulder_rolls_and_reach',
    name: 'Rotiri de umeri și întindere',
    category: 'mobility',
    level: 0,
    equipment: ['bodyweight'],
    default_reps: '30-40 secunde',
    duration_s: 35,
    description: 'Rotește umerii în mișcări circulare ample spre spate. Apoi ridică brațele deasupra capului ca și cum te-ai întinde dimineața.',
    focus: 'Eliberare tensiune gât, umeri și postură',
    tip: 'Inspiră adânc când brațele urcă, expiră lung când coboară.',
    swaps: ['chest_opener_stretch'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg">
      <circle cx="50" cy="22" r="8" fill="currentColor" />
      <line x1="50" y1="30" x2="50" y2="65" stroke="currentColor" stroke-width="5" />
      <path d="M 28,32 Q 50,15 72,32" fill="none" stroke="#2A7B4C" stroke-width="4" stroke-linecap="round" />
      <line x1="50" y1="65" x2="42" y2="90" stroke="currentColor" stroke-width="5" />
      <line x1="50" y1="65" x2="58" y2="90" stroke="currentColor" stroke-width="5" />
    </svg>`
  },
  {
    id: 'glute_bridge_gentle',
    name: 'Podul fesier blând',
    category: 'core_glutes',
    level: 0,
    equipment: ['bodyweight'],
    default_reps: '8-10 repetări',
    duration_s: 50,
    description: 'Întins pe spate pe saltea sau pe pat. Cu genunchii îndoiți, ridică ușor bazinul până formează o pantă dreaptă. Ține 1 secundă și coboară.',
    focus: 'Fesieri, coapse și protecție lombară',
    tip: 'Nu forța arcuirea spre tavan.',
    swaps: ['seated_knee_lifts'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg">
      <circle cx="25" cy="65" r="7" fill="currentColor" />
      <path d="M 30,65 L 50,50 L 70,68 L 72,85" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" />
      <line x1="15" y1="85" x2="85" y2="85" stroke="currentColor" stroke-width="3" opacity="0.3" />
    </svg>`
  },

  // --- Nivel 1 (Începător de bază)
  {
    id: 'incline_pushups',
    name: 'Flotări înclinate (pe spătar/masă)',
    category: 'upper',
    level: 1,
    equipment: ['chair', 'bodyweight'],
    default_reps: '8-10 repetări',
    duration_s: 50,
    description: 'Sprijină palmele pe marginea unei mese sau pe spătarul unui scaun rezistent. Coboară pieptul și împinge controlat.',
    focus: 'Piept, brațe și stabilitate trunchi',
    tip: 'Păstrează trunchiul aliniat drept.',
    swaps: ['wall_pushups', 'standard_pushups'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg">
      <path d="M 70,50 L 70,85 M 70,50 L 85,50" stroke="#888" stroke-width="3" fill="none" />
      <circle cx="35" cy="28" r="7" fill="currentColor" />
      <line x1="35" y1="35" x2="25" y2="70" stroke="currentColor" stroke-width="4" />
      <line x1="35" y1="42" x2="70" y2="52" stroke="#2A7B4C" stroke-width="4" />
      <line x1="25" y1="70" x2="18" y2="88" stroke="currentColor" stroke-width="4" />
    </svg>`
  },
  {
    id: 'box_squat_touch',
    name: 'Genuflexiune cu atingerea scaunului',
    category: 'lower',
    level: 1,
    equipment: ['chair', 'bodyweight'],
    default_reps: '8-10 repetări',
    duration_s: 50,
    description: 'Coboară într-o genuflexiune până atingi ușor marginea scaunului, apoi te ridici fără să te așezi complet.',
    focus: 'Picioare, fesieri și echilibru',
    tip: 'Genunchii rămân orientați spre degetele picioarelor.',
    swaps: ['chair_sit_to_stand', 'full_squats'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg">
      <path d="M 65,55 L 65,85" stroke="#888" stroke-width="4" />
      <circle cx="45" cy="25" r="7" fill="currentColor" />
      <path d="M 45,32 L 40,55 L 50,70 L 45,88" fill="none" stroke="currentColor" stroke-width="4" />
    </svg>`
  },
  {
    id: 'bird_dog_gentle',
    name: 'Bird-dog pe saltea',
    category: 'core_glutes',
    level: 1,
    equipment: ['bodyweight'],
    default_reps: '6-8 pe parte',
    duration_s: 50,
    description: 'În sprijin pe palme și genunchi. Întinde un braț în față și piciorul opus în spate, ține 2 secunde și revino.',
    focus: 'Stabilitate lombară, coordonare și fesieri',
    tip: 'Păstrează spatele drept ca o masă.',
    swaps: ['glute_bridge_gentle'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg">
      <circle cx="70" cy="40" r="6" fill="currentColor" />
      <line x1="68" y1="46" x2="35" y2="52" stroke="currentColor" stroke-width="4" />
      <line x1="35" y1="52" x2="15" y2="48" stroke="#2A7B4C" stroke-width="4" />
      <line x1="65" y1="48" x2="88" y2="46" stroke="#2A7B4C" stroke-width="4" />
      <line x1="45" y1="52" x2="45" y2="75" stroke="currentColor" stroke-width="4" />
      <line x1="60" y1="50" x2="60" y2="75" stroke="currentColor" stroke-width="4" />
    </svg>`
  },

  // --- Nivel 2 (Intermediar / Activ)
  {
    id: 'standard_pushups',
    name: 'Flotări clasice la podea',
    category: 'upper',
    level: 2,
    equipment: ['bodyweight'],
    default_reps: '10-15 repetări',
    duration_s: 50,
    description: 'Palmele sub umeri, picioarele întinse. Coboară pieptul până aproape de podea, menținând corpul drept ca o scândură, apoi împinge ferm.',
    focus: 'Piept, triceps, umeri și stabilitate trunchi',
    tip: 'Nu lăsa capul să cadă în față; privește la 20cm în fața palmelor.',
    swaps: ['incline_pushups', 'chair_dips', 'diamond_pushups'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg">
      <circle cx="75" cy="45" r="7" fill="currentColor" />
      <line x1="72" y1="50" x2="25" y2="65" stroke="currentColor" stroke-width="5" stroke-linecap="round" />
      <line x1="68" y1="52" x2="68" y2="80" stroke="#2A7B4C" stroke-width="4" stroke-linecap="round" />
      <line x1="25" y1="65" x2="22" y2="80" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
      <line x1="15" y1="80" x2="85" y2="80" stroke="currentColor" stroke-width="3" opacity="0.3" />
    </svg>`
  },
  {
    id: 'full_squats',
    name: 'Genuflexiuni libere (adânci)',
    category: 'lower',
    level: 2,
    equipment: ['bodyweight'],
    default_reps: '12-16 repetări',
    duration_s: 50,
    description: 'Picioarele la lățimea umerilor. Coboară bazinul sub nivelul genunchilor, păstrând călcâiele bine lipite de sol și pieptul ridicat.',
    focus: 'Cvadricepși, fesieri și mobilitate șolduri',
    tip: 'Împinge puternic în călcâie la urcare și expiră.',
    swaps: ['reverse_lunges', 'jump_squats'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg">
      <circle cx="50" cy="20" r="7" fill="currentColor" />
      <line x1="50" y1="27" x2="45" y2="52" stroke="currentColor" stroke-width="5" />
      <line x1="45" y1="52" x2="60" y2="68" stroke="currentColor" stroke-width="5" />
      <line x1="60" y1="68" x2="52" y2="88" stroke="currentColor" stroke-width="5" />
      <line x1="20" y1="88" x2="80" y2="88" stroke="currentColor" stroke-width="3" opacity="0.3" />
    </svg>`
  },
  {
    id: 'forearm_plank',
    name: 'Scândură / Plank pe antebrațe',
    category: 'core',
    level: 2,
    equipment: ['bodyweight'],
    default_reps: '35-50 secunde',
    duration_s: 45,
    description: 'Sprijin pe antebrațe și vârfuri de picioare. Menține corpul perfect aliniat, cu abdomenul și fesierii contractați.',
    focus: 'Stabilitate trunchi, abdomen profund și umeri',
    tip: 'Respiră constant, nu-ți ține respirația.',
    swaps: ['mountain_climbers', 'plank_shoulder_taps'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg">
      <circle cx="75" cy="50" r="7" fill="currentColor" />
      <line x1="72" y1="54" x2="25" y2="62" stroke="currentColor" stroke-width="5" stroke-linecap="round" />
      <line x1="68" y1="56" x2="68" y2="78" stroke="#2A7B4C" stroke-width="4" stroke-linecap="round" />
      <line x1="68" y1="78" x2="78" y2="78" stroke="#2A7B4C" stroke-width="4" stroke-linecap="round" />
      <line x1="25" y1="62" x2="22" y2="78" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
      <line x1="15" y1="78" x2="85" y2="78" stroke="currentColor" stroke-width="3" opacity="0.3" />
    </svg>`
  },
  {
    id: 'reverse_lunges',
    name: 'Fandări în spate (alternativ)',
    category: 'lower',
    level: 2,
    equipment: ['bodyweight'],
    default_reps: '10-12 repetări / picior',
    duration_s: 55,
    description: 'Pas mare în spate, coboară genunchiul posterior la 90 de grade fără să atingi solul violent. Revii împingând în piciorul din față.',
    focus: 'Fesieri, coapse și echilibru unilateral',
    tip: 'Păstrează trunchiul vertical ca o coloană.',
    swaps: ['full_squats', 'single_leg_glute_bridge'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg">
      <circle cx="48" cy="20" r="7" fill="currentColor" />
      <line x1="48" y1="27" x2="48" y2="55" stroke="currentColor" stroke-width="5" />
      <path d="M 48,55 L 62,65 L 62,85" fill="none" stroke="currentColor" stroke-width="5" />
      <path d="M 48,55 L 32,68 L 32,85" fill="none" stroke="#2A7B4C" stroke-width="5" />
    </svg>`
  },
  {
    id: 'chair_dips',
    name: 'Flotări la scaun (Dips triceps)',
    category: 'upper',
    level: 2,
    equipment: ['chair', 'bodyweight'],
    default_reps: '10-12 repetări',
    duration_s: 50,
    description: 'Cu spatele la scaun, sprijină palmele pe marginea șezutului. Coboară bazinul pe lângă scaun îndoind coatele la 90 de grade, apoi împinge înapoi.',
    focus: 'Triceps și piept',
    tip: 'Ține spatele aproape de marginea scaunului.',
    swaps: ['standard_pushups'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg">
      <path d="M 35,45 L 35,75 M 35,55 L 20,55 M 20,55 L 20,75" stroke="#888" stroke-width="4" fill="none" />
      <circle cx="55" cy="30" r="7" fill="currentColor" />
      <line x1="55" y1="37" x2="52" y2="65" stroke="currentColor" stroke-width="5" />
      <path d="M 52,45 L 42,50 L 35,55" fill="none" stroke="#2A7B4C" stroke-width="4" />
      <path d="M 52,65 L 65,75 L 68,88" fill="none" stroke="currentColor" stroke-width="4" />
    </svg>`
  },
  {
    id: 'mountain_climbers',
    name: 'Mountain climbers dinamici',
    category: 'core',
    level: 2,
    equipment: ['bodyweight'],
    default_reps: '30-40 secunde',
    duration_s: 40,
    description: 'Din sprijin pe palme, adu genunchii spre piept în mod alternativ cu un tempo susținut, ținând spatele drept.',
    focus: 'Cardio, abdomen și stabilitate',
    tip: 'Păstrează umerii ficși deasupra încheieturilor.',
    swaps: ['forearm_plank', 'burpees_clean'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg">
      <circle cx="75" cy="45" r="7" fill="currentColor" />
      <line x1="72" y1="50" x2="35" y2="55" stroke="currentColor" stroke-width="5" />
      <line x1="68" y1="52" x2="68" y2="78" stroke="#2A7B4C" stroke-width="4" />
      <path d="M 35,55 L 50,65 L 48,78" fill="none" stroke="#2A7B4C" stroke-width="4" />
      <line x1="35" y1="55" x2="22" y2="78" stroke="currentColor" stroke-width="4" />
    </svg>`
  },

  // --- Nivel 3 (Avansat / Intens)
  {
    id: 'diamond_pushups',
    name: 'Flotări diamant',
    category: 'upper',
    level: 3,
    equipment: ['bodyweight'],
    default_reps: '10-12 repetări',
    duration_s: 50,
    description: 'Palmele lipite la sol sub piept cu degetele formând un diamant. Coboară pieptul și împinge exploziv.',
    focus: 'Triceps intens și piept interior',
    tip: 'Coatele rămân pe lângă corp.',
    swaps: ['standard_pushups', 'pullups_standard'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg">
      <circle cx="75" cy="45" r="7" fill="currentColor" />
      <line x1="72" y1="50" x2="25" y2="65" stroke="currentColor" stroke-width="5" />
      <line x1="65" y1="52" x2="60" y2="80" stroke="#2A7B4C" stroke-width="4" />
      <line x1="25" y1="65" x2="22" y2="80" stroke="currentColor" stroke-width="4" />
    </svg>`
  },
  {
    id: 'jump_squats',
    name: 'Genuflexiuni sărite (Putere)',
    category: 'lower',
    level: 3,
    equipment: ['bodyweight'],
    default_reps: '10-14 repetări',
    duration_s: 45,
    description: 'Genuflexiune adâncă urmată de o desprindere explozivă în sus. Aterizează lin pe vârfuri și coboară fluid.',
    focus: 'Putere explozivă și anduranță musculară',
    tip: 'Aterizarea trebuie să fie complet silențioasă.',
    swaps: ['full_squats', 'reverse_lunges'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg">
      <circle cx="50" cy="18" r="7" fill="currentColor" />
      <line x1="50" y1="25" x2="48" y2="52" stroke="currentColor" stroke-width="5" />
      <path d="M 48,52 L 40,68 L 45,82" fill="none" stroke="#2A7B4C" stroke-width="5" />
      <!-- Jump motion lines -->
      <path d="M 30,85 Q 50,75 70,85" fill="none" stroke="#2A7B4C" stroke-width="3" stroke-dasharray="3 2" />
    </svg>`
  },
  {
    id: 'plank_shoulder_taps',
    name: 'Plank cu atingeri de umeri',
    category: 'core',
    level: 3,
    equipment: ['bodyweight'],
    default_reps: '16-20 atingeri',
    duration_s: 45,
    description: 'Din poziția de flotare, atinge umărul opus cu o mână fără a roti bazinul. Menține corpul perfect imobil.',
    focus: 'Anti-rotație, stabilitate și forță izometrică',
    tip: 'Picioarele puțin mai depărtate oferă o bază solidă.',
    swaps: ['forearm_plank', 'mountain_climbers'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg">
      <circle cx="75" cy="45" r="7" fill="currentColor" />
      <line x1="72" y1="50" x2="25" y2="65" stroke="currentColor" stroke-width="5" />
      <line x1="68" y1="52" x2="68" y2="80" stroke="currentColor" stroke-width="4" />
      <path d="M 70,52 L 60,45" fill="none" stroke="#2A7B4C" stroke-width="4" stroke-linecap="round" />
    </svg>`
  },
  {
    id: 'burpees_clean',
    name: 'Burpees complete',
    category: 'core',
    level: 3,
    equipment: ['bodyweight'],
    default_reps: '8-12 repetări',
    duration_s: 50,
    description: 'Genuflexiune, palmele la sol, aruncă picioarele în flotare, coboară pieptul, împinge sus și sari vertical cu brațele sus.',
    focus: 'Forță totală și capacitate cardiovasculară',
    tip: 'Menține un tempo constant.',
    swaps: ['mountain_climbers', 'jump_squats'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg">
      <circle cx="50" cy="20" r="7" fill="currentColor" />
      <line x1="50" y1="27" x2="50" y2="60" stroke="currentColor" stroke-width="5" />
      <path d="M 30,35 L 50,25 L 70,35" fill="none" stroke="#2A7B4C" stroke-width="4" />
    </svg>`
  },
  {
    id: 'pullups_standard',
    name: 'Tracțiuni la bară',
    category: 'upper',
    level: 3,
    equipment: ['pullup_bar'],
    default_reps: '6-10 repetări',
    duration_s: 50,
    description: 'Prinde bara de tracțiuni cu palmele spre înainte. Trage pieptul spre bară până când bărbia trece deasupra barei.',
    focus: 'Dorsali, bicepși și forță de tragere',
    tip: 'Trage coatele în jos și spre spate.',
    swaps: ['diamond_pushups', 'standard_pushups'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg">
      <line x1="20" y1="20" x2="80" y2="20" stroke="#888" stroke-width="5" stroke-linecap="round" />
      <circle cx="50" cy="35" r="7" fill="currentColor" />
      <path d="M 38,20 L 45,35 M 62,20 L 55,35" stroke="#2A7B4C" stroke-width="4" />
      <line x1="50" y1="42" x2="50" y2="70" stroke="currentColor" stroke-width="5" />
      <path d="M 50,70 L 42,88 M 50,70 L 58,88" stroke="currentColor" stroke-width="4" />
    </svg>`
  }
];

export function getExerciseById(id) {
  return CLIENT_EXERCISES.find((e) => e.id === id) || null;
}
