// Catalogul de exerciții pentru client, cu ghiduri vizuale SVG și sfaturi în limba română

export const CLIENT_EXERCISES = [
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
    tip: 'Păstrează corpul drept ca o scândură, respiră adânc când cobori și expiră când împingi.',
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
    tip: 'Nu te lăsa să cazi pe scaun; coborârea lentă dezvoltă forța fără niciun risc.',
    swaps: ['standing_calf_raises', 'box_squat_touch'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg">
      <!-- Chair -->
      <path d="M 65,45 L 65,70 M 65,55 L 80,55 M 80,55 L 80,70" stroke="#888" stroke-width="4" fill="none" stroke-linecap="round" />
      <!-- Person sitting/rising -->
      <circle cx="45" cy="25" r="8" fill="currentColor" />
      <line x1="45" y1="33" x2="52" y2="55" stroke="currentColor" stroke-width="5" stroke-linecap="round" />
      <line x1="52" y1="55" x2="48" y2="70" stroke="currentColor" stroke-width="5" stroke-linecap="round" />
      <line x1="48" y1="70" x2="48" y2="90" stroke="currentColor" stroke-width="5" stroke-linecap="round" />
      <line x1="20" y1="90" x2="90" y2="90" stroke="currentColor" stroke-width="3" opacity="0.3" />
      <!-- Motion arrow -->
      <path d="M 30,55 Q 30,40 38,35" fill="none" stroke="#2A7B4C" stroke-width="3" stroke-linecap="round" marker-end="url(#arrow)" />
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
    tip: 'Activează pompa circulatorie din picioare. Excelent după ore de stat jos.',
    swaps: ['chair_sit_to_stand', 'seated_knee_lifts'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg">
      <circle cx="45" cy="20" r="8" fill="currentColor" />
      <line x1="45" y1="28" x2="45" y2="60" stroke="currentColor" stroke-width="5" />
      <line x1="45" y1="38" x2="70" y2="45" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
      <line x1="70" y1="35" x2="70" y2="75" stroke="#888" stroke-width="3" stroke-linecap="round" />
      <!-- Legs lifted on toes -->
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
    equipment: ['yoga_mat', 'bodyweight'],
    default_reps: '8-10 repetări',
    duration_s: 50,
    description: 'Întins pe spate pe saltea sau pe pat. Cu genunchii îndoiți, ridică ușor bazinul până formează o pantă dreaptă. Ține 1 secundă și coboară.',
    focus: 'Fesieri, coapse și protecție lombară',
    tip: 'Nu forța arcuirea spre tavan; ridică doar până simți fesierii activi.',
    swaps: ['seated_knee_lifts', 'bird_dog_gentle'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg">
      <circle cx="25" cy="65" r="7" fill="currentColor" />
      <path d="M 30,65 L 50,50 L 70,68 L 72,85" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" />
      <line x1="15" y1="85" x2="85" y2="85" stroke="currentColor" stroke-width="3" opacity="0.3" />
      <!-- Arrow under hips -->
      <path d="M 50,68 L 50,56" stroke="#2A7B4C" stroke-width="3" stroke-linecap="round" />
    </svg>`
  },
  {
    id: 'seated_knee_lifts',
    name: 'Ridicări de genunchi din așezat',
    category: 'core',
    level: 0,
    equipment: ['chair', 'bodyweight'],
    default_reps: '10 repetări (alternativ)',
    duration_s: 40,
    description: 'Stai pe scaun cu spatele drept. Ridică un genunchi spre piept ținând abdomenul strâns ușor, coboară și repetă cu celălalt.',
    focus: 'Abdomen și mobilitatea șoldurilor',
    tip: 'Păstrează spatele drept, fără să te lași pe spate.',
    swaps: ['deadbug_assisted', 'standing_calf_raises'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg">
      <path d="M 60,40 L 60,65 M 60,55 L 75,55 M 75,55 L 75,75" stroke="#888" stroke-width="3" fill="none" />
      <circle cx="48" cy="22" r="7" fill="currentColor" />
      <line x1="48" y1="29" x2="48" y2="55" stroke="currentColor" stroke-width="4" />
      <line x1="48" y1="55" x2="40" y2="45" stroke="#2A7B4C" stroke-width="4" stroke-linecap="round" />
      <line x1="40" y1="45" x2="40" y2="65" stroke="#2A7B4C" stroke-width="4" stroke-linecap="round" />
    </svg>`
  },
  {
    id: 'chest_opener_stretch',
    name: 'Deschidere de piept la ușă',
    category: 'mobility',
    level: 0,
    equipment: ['wall', 'bodyweight'],
    default_reps: '30 secunde',
    duration_s: 30,
    description: 'Sprijină antebrațul pe tocul unei uși sau pe un perete. Fă un pas mic în față până simți o întindere plăcută în piept și umeri.',
    focus: 'Postură deschisă și respirație liberă',
    tip: 'O întindere ușoară e suficientă; nu forța niciodată.',
    swaps: ['shoulder_rolls_and_reach'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg">
      <line x1="80" y1="10" x2="80" y2="90" stroke="#888" stroke-width="4" />
      <circle cx="45" cy="22" r="7" fill="currentColor" />
      <line x1="45" y1="29" x2="45" y2="60" stroke="currentColor" stroke-width="4" />
      <line x1="45" y1="38" x2="80" y2="38" stroke="#2A7B4C" stroke-width="4" />
      <line x1="45" y1="60" x2="35" y2="85" stroke="currentColor" stroke-width="4" />
      <line x1="45" y1="60" x2="55" y2="85" stroke="currentColor" stroke-width="4" />
    </svg>`
  },
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
    swaps: ['wall_pushups'],
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
    swaps: ['chair_sit_to_stand'],
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
    equipment: ['yoga_mat', 'cushion', 'bodyweight'],
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
      <line x1="10" y1="75" x2="90" y2="75" stroke="currentColor" stroke-width="3" opacity="0.3" />
    </svg>`
  },
  {
    id: 'dumbbell_seated_bicep_curl',
    name: 'Flexii bicepși cu gantere',
    category: 'upper',
    level: 1,
    equipment: ['dumbbells', 'chair'],
    default_reps: '10-12 repetări',
    duration_s: 50,
    description: 'Așezat pe scaun cu ganterele în mâini. Ridică greutățile spre umeri flexând coatele, apoi coboară lent.',
    focus: 'Bicepși și forță brațe',
    tip: 'Ține coatele lipite de corp, fără balans.',
    swaps: ['band_pull_apart', 'wall_pushups'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg">
      <circle cx="50" cy="22" r="7" fill="currentColor" />
      <line x1="50" y1="29" x2="50" y2="60" stroke="currentColor" stroke-width="4" />
      <!-- Arms holding dumbbells -->
      <path d="M 50,38 L 40,48 L 42,36" fill="none" stroke="#2A7B4C" stroke-width="4" stroke-linecap="round" />
      <circle cx="42" cy="35" r="3" fill="#2A7B4C" />
      <path d="M 50,38 L 60,48 L 58,36" fill="none" stroke="#2A7B4C" stroke-width="4" stroke-linecap="round" />
      <circle cx="58" cy="35" r="3" fill="#2A7B4C" />
    </svg>`
  },
  {
    id: 'band_pull_apart',
    name: 'Depărtări de bandă elastică',
    category: 'upper',
    level: 0,
    equipment: ['resistance_band'],
    default_reps: '10-12 repetări',
    duration_s: 45,
    description: 'Ține banda cu ambele mâini în fața pieptului. Depărtează brațele lateral până când banda atinge ușor pieptul.',
    focus: 'Postură, umeri și spate superior',
    tip: 'Omopații se strâng la spate la fiecare mișcare.',
    swaps: ['shoulder_rolls_and_reach', 'wall_pushups'],
    svg: `<svg viewBox="0 0 100 100" class="ex-svg">
      <circle cx="50" cy="22" r="7" fill="currentColor" />
      <line x1="50" y1="29" x2="50" y2="65" stroke="currentColor" stroke-width="4" />
      <!-- Arms wide holding band -->
      <line x1="25" y1="40" x2="75" y2="40" stroke="#2A7B4C" stroke-width="4" stroke-linecap="round" />
      <circle cx="25" cy="40" r="3" fill="#2A7B4C" />
      <circle cx="75" cy="40" r="3" fill="#2A7B4C" />
    </svg>`
  }
];

export function getExerciseById(id) {
  return CLIENT_EXERCISES.find((e) => e.id === id) || null;
}
