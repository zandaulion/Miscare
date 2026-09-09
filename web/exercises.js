// Catalogul complet de exerciții pentru client (32 exerciții)
// Pictograme SVG curate, cu biomecanică anatomică clară și accente dinamice

export const CLIENT_EXERCISES = [
  // =========================================================================
  // NIVEL 0 (De la 0 absolut — fără impact, sprijin scaun / perete)
  // =========================================================================
  {
    id: 'wall_pushups',
    name: 'Flotări la perete',
    category: 'upper',
    level: 0,
    equipment: ['wall', 'bodyweight'],
    default_reps: '8-10 repetări',
    duration_s: 45,
    image: '/images/exercises/wall_pushups.jpg',
    description: 'Stai la o lungime de braț de un perete liber. Așază palmele la nivelul pieptului. Îndoaie coatele controlat, apropie pieptul, apoi împinge înapoi.',
    focus: 'Piept, brațe și umeri',
    tip: 'Păstrează corpul drept ca o scândură, fără să lași bazinul să cadă în față.',
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
    name: 'Ridicări de pe scaun',
    category: 'lower',
    level: 0,
    equipment: ['chair', 'bodyweight'],
    default_reps: '6-8 repetări',
    duration_s: 50,
    image: '/images/exercises/chair_sit_to_stand.jpg',
    description: 'Așază-te pe marginea unui scaun stabil. Ridică-te în picioare împingând ferm în călcâie, apoi așază-te la loc lent și controlat.',
    focus: 'Picioare, coapse și stabilitate',
    tip: 'Nu te lăsa să cazi pe scaun; coborârea lentă lucrează mușchii cel mai eficient.',
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
    name: 'Ridicări pe vârfuri (cu sprijin)',
    category: 'lower',
    level: 0,
    equipment: ['wall', 'chair', 'bodyweight'],
    default_reps: '10-12 repetări',
    duration_s: 40,
    image: '/images/exercises/standing_calf_raises.jpg',
    description: 'Cu mâinile sprijinite lejer pe perete sau spătarul scaunului, ridică-te pe vârfuri cât mai sus, menține 1 secundă și coboară lent.',
    focus: 'Glezne, gambe și circulație',
    tip: 'Excelent pentru activarea pompei circulatorii după perioade lungi de stat jos.',
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
    name: 'Rotiri de umeri și întindere',
    category: 'mobility',
    level: 0,
    equipment: ['bodyweight'],
    default_reps: '30-40 secunde',
    duration_s: 35,
    image: '/images/exercises/shoulder_rolls_and_reach.jpg',
    description: 'Rotește umerii în cercuri mari spre spate, respirând adânc. Apoi întinde brațele ușor spre tavan ca la trezire.',
    focus: 'Eliberare tensiune gât, umeri și postură',
    tip: 'Lasă umerii să coboare departe de urechi la fiecare expir.',
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
    name: 'Podul fesier blând',
    category: 'core_glutes',
    level: 0,
    equipment: ['bodyweight'],
    default_reps: '8-10 repetări',
    duration_s: 50,
    image: '/images/exercises/glute_bridge_gentle.jpg',
    description: 'Întins pe spate cu genunchii îndoiți și tălpile pe sol. Ridică bazinul până când corpul formează o linie dreaptă de la genunchi la umeri.',
    focus: 'Fesieri, coapse și protecție lombară',
    tip: 'Strânge ușor abdomenul și fesierii în partea de sus, fără să curbezi exagerat spatele.',
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
    name: 'Ridicări de genunchi din așezat',
    category: 'core',
    level: 0,
    equipment: ['chair', 'bodyweight'],
    default_reps: '10 repetări alternativ',
    duration_s: 40,
    image: '/images/exercises/seated_knee_lifts.jpg',
    description: 'Stai pe scaun cu spatele drept. Ridică un genunchi spre piept ținând abdomenul activ, coboară și repetă cu celălalt.',
    focus: 'Abdomen inferior și mobilitate șolduri',
    tip: 'Nu te lăsa pe spate când ridici genunchiul.',
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
    name: 'Deschidere de piept la perete sau ușă',
    category: 'mobility',
    level: 0,
    equipment: ['wall', 'bodyweight'],
    default_reps: '30 secunde',
    duration_s: 30,
    image: '/images/exercises/chest_opener_stretch.jpg',
    description: 'Așază antebrațul pe tocul unei uși sau pe perete și rotește ușor trunchiul în partea opusă până simți o întindere plăcută în piept.',
    focus: 'Postură și mobilitate cutie toracică',
    tip: 'Respiră calm și profund, nu forța întinderea.',
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
    name: 'Depărtări cu prosopul',
    category: 'upper',
    level: 0,
    equipment: ['bodyweight'],
    default_reps: '10-12 repetări (menținere 2s)',
    description: 'În picioare sau așezat, ține un prosop întins între mâini, la nivelul pieptului. Trage de capete în lateral ca și cum ai vrea să-l rupi, strângând omoplații, apoi relaxează lent.',
    focus: 'Spate superior, omoplați și postură',
    tip: 'Ține coatele aproape întinse și umerii jos, departe de urechi.',
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
    name: 'Îngerași întorși la sol',
    category: 'upper',
    level: 0,
    equipment: ['bodyweight'],
    default_reps: '8-10 repetări',
    description: 'Întins pe burtă, cu fruntea sprijinită și brațele pe lângă corp. Ridică ușor brațele de pe podea și plimbă-le încet până deasupra capului, apoi înapoi lângă șolduri.',
    focus: 'Spate superior, umeri și postură',
    tip: 'Mișcarea e mică și lentă; important e ca brațele să nu atingă podeaua pe traseu.',
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
    name: 'Ramat la tocul ușii',
    category: 'upper',
    level: 1,
    equipment: ['bodyweight', 'wall'],
    default_reps: '8-10 repetări',
    description: 'Stai în fața unui toc de ușă solid, apucă marginea cu ambele mâini și pune vârfurile picioarelor aproape de prag. Lasă-te pe spate cu brațele întinse, apoi trage-te înapoi în picioare strângând omoplații.',
    focus: 'Spate, bicepși și forță de tragere',
    tip: 'Cu cât te lași mai pe spate, cu atât e mai greu — reglează dificultatea din unghi, nu din repetări.',
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
    name: 'Depărtări de bandă pentru spate',
    category: 'upper',
    level: 0,
    equipment: ['resistance_band'],
    default_reps: '10-12 repetări',
    duration_s: 45,
    image: '/images/exercises/band_pull_apart.jpg',
    description: 'Ține banda cu ambele mâini în fața pieptului cu brațele întinse. Depărtează mâinile trăgând banda până atinge pieptul.',
    focus: 'Spate superior, postură și umeri',
    tip: 'Excelent pentru corectarea umerilor aduși în față.',
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
    name: 'Flotări înclinate (pe birou sau spătar)',
    category: 'upper',
    level: 0,
    equipment: ['chair', 'bodyweight'],
    default_reps: '8-10 repetări',
    duration_s: 50,
    image: '/images/exercises/incline_pushups.jpg',
    description: 'Sprijină palmele pe o suprafață stabilă (masă rezistentă sau spătar). Coboară pieptul controlat și împinge ferm.',
    focus: 'Piept, triceps și forță trunchi',
    tip: 'Cu cât suprafața e mai înaltă, cu atât e mai ușor.',
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
    name: 'Flotări pe genunchi',
    category: 'upper',
    level: 1,
    equipment: ['bodyweight'],
    default_reps: '8-12 repetări',
    duration_s: 45,
    image: '/images/exercises/knee_pushups.jpg',
    description: 'Sprijin pe palme și genunchi, cu trunchiul formând o linie dreaptă. Coboară pieptul spre podea îndoind coatele la 45°, apoi împinge ferm.',
    focus: 'Piept, umeri și triceps',
    tip: 'Ține abdomenul activ; nu lăsa zona lombară să se lase în jos.',
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
    name: 'Genuflexiune cu atingerea scaunului',
    category: 'lower',
    level: 1,
    equipment: ['chair', 'bodyweight'],
    default_reps: '8-10 repetări',
    duration_s: 50,
    image: '/images/exercises/box_squat_touch.jpg',
    description: 'Coboară într-o genuflexiune până când atingi ușor scaunul cu bazinul, apoi te ridici imediat fără să te așezi complet.',
    focus: 'Coapse, fesieri și control',
    tip: 'Genunchii urmăresc direcția degetelor de la picioare.',
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
    name: 'Scaunul invizibil la perete (Wall Sit)',
    category: 'lower',
    level: 1,
    equipment: ['wall'],
    default_reps: '20-30 secunde menținere',
    duration_s: 40,
    image: '/images/exercises/wall_sit.jpg',
    description: 'Lipește spatele de perete și coboară ca pe un scaun până când genunchii sunt la 90°. Menține poziția nemișcat.',
    focus: 'Cvadricepși (coapse) și anduranță musculară',
    tip: 'Presează călcâiele ferm în podea și respiră constant.',
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
    name: 'Cobra blândă (Extensii de spate la sol)',
    category: 'mobility',
    level: 1,
    equipment: ['bodyweight'],
    default_reps: '8-10 repetări (menținere 2s)',
    duration_s: 45,
    image: '/images/exercises/prone_cobra.jpg',
    description: 'Întins pe burtă cu brațele pe lângă corp. Ridică ușor pieptul de pe podea trăgând omoplații spre spate și rotind degetele mari spre tavan.',
    focus: 'Partea superioară a spatelui, romboizi și postură',
    tip: 'Privește spre podea pentru a păstra gâtul relaxat și aliniat.',
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
    name: 'Bird-dog (stabilitate pe genunchi și palme)',
    category: 'core_glutes',
    level: 1,
    equipment: ['bodyweight'],
    default_reps: '6-8 pe fiecare parte',
    duration_s: 55,
    image: '/images/exercises/bird_dog_gentle.jpg',
    description: 'În patru labe pe sol. Întinde simultan brațul drept în față și piciorul stâng în spate, menține 2 secunde, apoi schimbă.',
    focus: 'Stabilitate lombară, coordonare și fesieri',
    tip: 'Imaginează-ți că ții un pahar cu apă pe spate și nu vrei să-l verși.',
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
    name: 'Deadbug asistat',
    category: 'core',
    level: 1,
    equipment: ['bodyweight'],
    default_reps: '8 repetări alternativ',
    duration_s: 45,
    image: '/images/exercises/deadbug_assisted.jpg',
    description: 'Pe spate cu genunchii la 90 de grade. Coboară un călcâi spre sol păstrând spatele lipit de podea, apoi revino.',
    focus: 'Abdomen profund și protecție lombară',
    tip: 'Dacă simți că spatele se arcuiește de pe podea, nu coborî călcâiul până jos.',
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
    name: 'Abdomene clasice (Crunches la sol)',
    category: 'core',
    level: 1,
    equipment: ['bodyweight'],
    default_reps: '10-15 repetări',
    duration_s: 45,
    image: '/images/exercises/crunches_standard.jpg',
    description: 'Întins pe spate cu genunchii îndoiți și tălpile pe podea. Ridică doar omoplații contractând abdomenul, menține o secundă sus și coboară lent.',
    focus: 'Mușchii abdominali (dreptul abdominal)',
    tip: 'Nu trage de ceafă cu mâinile; ține coatele deschise și privirea la 45° spre tavan.',
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
    name: 'Plank lateral pe genunchi (Scândură laterală)',
    category: 'core',
    level: 1,
    equipment: ['bodyweight'],
    default_reps: '15-20 secunde pe fiecare parte',
    duration_s: 50,
    image: '/images/exercises/side_plank.jpg',
    description: 'Pe o parte, sprijină-te pe antebraț cu cotul sub umăr și genunchii îndoiți la 90°. Ridică bazinul formând o linie dreaptă de la genunchi la umeri.',
    focus: 'Abdomen oblic, talie și stabilitate laterală',
    tip: 'Ține gâtul drept și nu lăsa șoldul să cadă spre sol.',
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
    name: 'Flexii pentru bicepși (cu gantere)',
    category: 'upper',
    level: 1,
    equipment: ['dumbbells', 'chair'],
    default_reps: '10-12 repetări',
    duration_s: 50,
    image: '/images/exercises/dumbbell_seated_bicep_curl.jpg',
    description: 'Așezat pe scaun cu o ganteră în fiecare mână. Îndoaie brațele ridicând greutățile spre umeri, apoi coboară lent.',
    focus: 'Brațe (biceps)',
    tip: 'Păstrează coatele fixe pe lângă corp.',
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
    name: 'Împins pentru umeri din așezat (cu gantere)',
    category: 'upper',
    level: 1,
    equipment: ['dumbbells', 'chair'],
    default_reps: '8-10 repetări',
    duration_s: 50,
    image: '/images/exercises/dumbbell_seated_shoulder_press.jpg',
    description: 'Din așezat cu spatele drept, împinge ganterele de la nivelul urechilor spre tavan fără să blochezi brusc coatele.',
    focus: 'Umeri și postură',
    tip: 'Nu curba spatele.',
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
    name: 'Ramat din așezat cu bandă elastică',
    category: 'upper',
    level: 1,
    equipment: ['resistance_band'],
    default_reps: '10-12 repetări',
    duration_s: 50,
    image: '/images/exercises/band_seated_row.jpg',
    description: 'Cu picioarele întinse, trece banda pe sub tălpi. Trage de capetele benzii spre abdomen strângând omopații la spate.',
    focus: 'Mușchii spatelui și postură',
    tip: 'Păstrează pieptul deschis și umerii coborâți.',
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
    name: 'Atârnare activă la bară (Active Hang)',
    category: 'mobility',
    level: 1,
    equipment: ['pullup_bar'],
    default_reps: '20-30 secunde',
    duration_s: 35,
    image: '/images/exercises/active_hang.jpg',
    description: 'Prinde bara ferm și lasă corpul să atârne, dar trage omopații în jos și depărtează umerii de urechi. Respiră calm.',
    focus: 'Decompresie lombară, stabilitate umeri și forță priză',
    tip: 'Eliberează presiunea din coloană și pregătește umerii pentru tracțiuni.',
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
    name: 'Flotări clasice la podea',
    category: 'upper',
    level: 2,
    equipment: ['bodyweight'],
    default_reps: '10-15 repetări',
    duration_s: 50,
    image: '/images/exercises/standard_pushups.jpg',
    description: 'Sprijin în palme și vârfuri de picioare. Coboară pieptul controlat până la 5 cm de sol, menținând corpul drept ca o scândură, apoi împinge ferm.',
    focus: 'Piept, triceps, umeri și forță trunchi',
    tip: 'Coatele formează o săgeată la 45 grade față de trunchi, nu deschise complet lateral.',
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
    name: 'Genuflexiuni libere (adânci)',
    category: 'lower',
    level: 2,
    equipment: ['bodyweight'],
    default_reps: '12-16 repetări',
    duration_s: 50,
    image: '/images/exercises/full_squats.jpg',
    description: 'Picioarele la lățimea umerilor. Coboară bazinul sub nivelul genunchilor, păstrând călcâiele lipite de sol și pieptul mândru.',
    focus: 'Coapse, fesieri și mobilitate glezne',
    tip: 'Respiră adânc la coborâre și împinge în călcâie la urcare.',
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
    name: 'Scândură / Plank pe antebrațe',
    category: 'core',
    level: 2,
    equipment: ['bodyweight'],
    default_reps: '35-50 secunde',
    duration_s: 45,
    image: '/images/exercises/forearm_plank.jpg',
    description: 'Sprijin pe antebrațe și vârfurile picioarelor. Corpul formează o linie rigidă de la călcâie la creștet. Strânge abdomenul și fesierii.',
    focus: 'Stabilitate trunchi, centură abdominală și umeri',
    tip: 'Nu lăsa bazinul să cadă și nu îl ridica în formă de cort.',
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
    name: 'Fandări în spate (alternativ)',
    category: 'lower',
    level: 2,
    equipment: ['bodyweight'],
    default_reps: '10-12 repetări / picior',
    duration_s: 55,
    image: '/images/exercises/reverse_lunges.jpg',
    description: 'Fă un pas mare în spate și coboară genunchiul spre sol la 90 de grade. Revino împingând în călcâiul piciorului din față.',
    focus: 'Fesieri, coapse și stabilitate unilaterală',
    tip: 'Păstrează trunchiul vertical și genunchiul din față aliniat cu glezna.',
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
    name: 'Flotări inverse la scaun (Dips)',
    category: 'upper',
    level: 2,
    equipment: ['chair', 'bodyweight'],
    default_reps: '10-12 repetări',
    duration_s: 50,
    image: '/images/exercises/chair_dips.jpg',
    description: 'Cu spatele la scaun, sprijină palmele pe marginea șezutului. Coboară bazinul pe lângă scaun îndoind coatele la 90 de grade, apoi împinge înapoi sus.',
    focus: 'Triceps, piept și deltoizi anteriori',
    tip: 'Păstrează spatele aproape de marginea scaunului pe toată durata mișcării.',
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
    name: 'Mountain climbers (tempo dinamic)',
    category: 'core',
    level: 2,
    equipment: ['bodyweight'],
    default_reps: '30-40 secunde',
    duration_s: 40,
    image: '/images/exercises/mountain_climbers.jpg',
    description: 'Din poziția de flotare, trage genunchii spre piept în mod alternativ într-un ritm rapid și controlat, fără balans al bazinului.',
    focus: 'Condiționare cardio, abdomen și umeri',
    tip: 'Menține umerii direct deasupra palmelor.',
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
    name: 'Ramat cu gantere din aplecat',
    category: 'upper',
    level: 2,
    equipment: ['dumbbells'],
    default_reps: '10-12 repetări',
    duration_s: 50,
    image: '/images/exercises/dumbbell_bent_over_row.jpg',
    description: 'Trunchiul aplecat înainte la 45 de grade, spatele perfect drept. Trage ganterele spre șolduri contractând puternic mușchii spatelui.',
    focus: 'Spate, bicepși și deltoizi posteriori',
    tip: 'Nu trage din brațe, inițiază mișcarea din omopați.',
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
    name: 'Pod fesier pe un singur picior',
    category: 'core_glutes',
    level: 2,
    equipment: ['bodyweight'],
    default_reps: '8-10 / picior',
    duration_s: 50,
    image: '/images/exercises/single_leg_glute_bridge.jpg',
    description: 'Pe spate, întinde un picior în aer și împinge în călcâiul celuilalt pentru a ridica bazinul. Menține 1 secundă sus.',
    focus: 'Fesieri profunzi, biceps femural și stabilitate pelviană',
    tip: 'Păstrează șoldurile paralele, nu lăsa o parte să cadă.',
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
    name: 'Tracțiuni în supinație (Chin-ups)',
    category: 'upper',
    level: 2,
    equipment: ['pullup_bar'],
    default_reps: '4-8 repetări',
    duration_s: 50,
    image: '/images/exercises/chin_ups.jpg',
    description: 'Prinde bara cu palmele orientate spre tine la lățimea umerilor. Trage corpul în sus până când bărbia trece peste nivelul barei, apoi coboară lent.',
    focus: 'Bicepși, dorsali și forță de tragere',
    tip: 'Priza în supinație folosește mai mult forța bicepșilor, fiind mai accesibilă la nivel intermediar.',
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
    name: 'Tracțiuni negative (coborâre controlată)',
    category: 'upper',
    level: 2,
    equipment: ['pullup_bar'],
    default_reps: '5-6 repetări (coborâre 3-4s)',
    duration_s: 50,
    image: '/images/exercises/negative_pullups.jpg',
    description: 'Sari ușor sau folosește un scaun pentru a ajunge cu bărbia deasupra barei. Coboară cât mai lent posibil (3-4 secunde) până la întinderea completă a brațelor.',
    focus: 'Forță excentrică, spate, brațe și priză',
    tip: 'Coborârea controlată crește cel mai rapid numărul de tracțiuni complete.',
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
    name: 'Ridicări de genunchi din atârnat la bară',
    category: 'core',
    level: 2,
    equipment: ['pullup_bar'],
    default_reps: '8-12 repetări',
    duration_s: 45,
    image: '/images/exercises/hanging_knee_raises.jpg',
    description: 'Din atârnat la bară cu brațele drepte și umerii fermi, ridică genunchii controlat spre piept fără balans, ține o fracțiune de secundă și coboară lent.',
    focus: 'Abdomen inferior, flexori șold și anduranță priză',
    tip: 'Evită balansul trunchiului — mișcarea trebuie să fie strict din contracția abdomenului.',
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
    name: 'Genuflexiuni Goblet (cu ganteră la piept)',
    category: 'lower',
    level: 2,
    equipment: ['adjustable_dumbbells'],
    default_reps: '10-12 repetări',
    duration_s: 50,
    image: '/images/exercises/dumbbell_goblet_squat.jpg',
    description: 'Ține o ganteră pe verticală, lipită de piept cu ambele palme. Coboară într-o genuflexiune adâncă menținând pieptul ridicat și coatele între genunchi, apoi împinge ferm în călcâie.',
    focus: 'Cvadricepși, fesieri, mobilitate șolduri și stabilitate trunchi',
    tip: 'Greutatea ținută în față activează abdomenul și te ajută să cobori adânc fără a rotunji spatele.',
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
    name: 'Îndreptări românești (RDL cu gantere)',
    category: 'lower',
    level: 2,
    equipment: ['adjustable_dumbbells'],
    default_reps: '10-12 repetări',
    duration_s: 50,
    image: '/images/exercises/dumbbell_romanian_deadlift.jpg',
    description: 'Picioarele la lățimea șoldurilor, ganterele în față. Împinge bazinul în spate flexând doar ușor genunchii, coborând ganterele până sub genunchi cu spatele perfect drept, apoi strânge fesierii la ridicare.',
    focus: 'Biceps femural, fesieri și lanț posterior',
    tip: 'Mișcarea este o împingere a fundului spre peretele din spate, nu o aplecare din talie.',
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
    name: 'Împins de la podea cu gantere',
    category: 'upper',
    level: 2,
    equipment: ['adjustable_dumbbells'],
    default_reps: '10-12 repetări',
    duration_s: 50,
    image: '/images/exercises/dumbbell_floor_press.jpg',
    description: 'Întins pe spate cu genunchii îndoiți. Împinge ganterele deasupra pieptului până când brațele sunt întinse, apoi coboară lent până când tricepșii ating ușor podeaua.',
    focus: 'Piept, triceps și stabilitate articulară umeri',
    tip: 'Podeaua blochează coborârea exagerată a coatelor, protejând articulațiile umerilor chiar și cu greutăți mari.',
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
    name: 'Ramat cu un braț sprijinit pe scaun',
    category: 'upper',
    level: 2,
    equipment: ['adjustable_dumbbells', 'chair'],
    default_reps: '8-10 / braț',
    duration_s: 50,
    image: '/images/exercises/dumbbell_single_arm_row.jpg',
    description: 'Sprijină un genunchi și o mână pe scaun, cu spatele orizontal. Cu cealaltă mână, trage gantera grea spre șold contractând omoplatul, ține o fracțiune de secundă și coboară controlat.',
    focus: 'Dorsali, romboizi, bicepși și forță unilaterală spate',
    tip: 'Nu roti trunchiul; menține umerii paraleli cu podeaua.',
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
    name: 'Mersul fermierului (Farmer\'s Carry)',
    category: 'core',
    level: 2,
    equipment: ['adjustable_dumbbells'],
    default_reps: '35-45 secunde',
    duration_s: 45,
    description: 'Ține o ganteră grea în fiecare mână pe lângă corp. Menține umerii trași în spate, pieptul sus și pășește lent și controlat (sau menține postura fermă pe loc).',
    focus: 'Priză, antebrațe, trapez, abdomen și stabilitate posturală',
    tip: 'Menține corpul perfect vertical; nu lăsa greutățile să te tragă în față sau lateral.',
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
    name: 'Flotări diamant (palme apropiate)',
    category: 'upper',
    level: 3,
    equipment: ['bodyweight'],
    default_reps: '10-12 repetări',
    duration_s: 50,
    description: 'Așază palmele la sol sub piept, cu degetele mari și arătătoare atingându-se în formă de diamant. Coboară și împinge exploziv.',
    focus: 'Triceps intens și piept interior',
    tip: 'Păstrează coatele apropiate de trunchi.',
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
    name: 'Genuflexiuni cu săritură explozivă',
    category: 'lower',
    level: 3,
    equipment: ['bodyweight'],
    default_reps: '10-14 repetări',
    duration_s: 45,
    description: 'Coboară într-o genuflexiune adâncă și explodează într-o săritură verticală. Aterizează lin pe vârfuri și continuă în următoarea coborâre.',
    focus: 'Putere explozivă picioare și anduranță cardiovasculară',
    tip: 'Aterizarea trebuie să fie silențioasă și elastică pentru a proteja articulațiile.',
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
    name: 'Plank cu atingeri rapide de umeri',
    category: 'core',
    level: 3,
    equipment: ['bodyweight'],
    default_reps: '16-20 atingeri',
    duration_s: 45,
    description: 'Din poziția de flotare, ridică mâna dreaptă și atinge umărul stâng fără a mișca sau balansa bazinul. Repetă alternativ.',
    focus: 'Anti-rotație trunchi, stabilitate umeri și abdomen',
    tip: 'Depărtează picioarele puțin mai mult pentru stabilitate optimă.',
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
    name: 'Burpees curate (fără pauză)',
    category: 'core',
    level: 3,
    equipment: ['bodyweight'],
    default_reps: '8-12 repetări',
    duration_s: 50,
    description: 'Din picioare, coboară în genuflexiune, aruncă picioarele în spate în poziție de flotare, execută o flotare, revino și sari în sus.',
    focus: 'Capacitate anaerobă și forță totală a corpului',
    tip: 'Găsește un tempo ritmic constant.',
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
    name: 'Tracțiuni la bară',
    category: 'upper',
    level: 3,
    equipment: ['pullup_bar'],
    default_reps: '6-10 repetări',
    duration_s: 50,
    description: 'Prinde bara de tracțiuni cu palmele spre înainte la lățime mai mare decât umerii. Trage corpul până când bărbia trece peste bară.',
    focus: 'Dorsali, bicepși și forță de tragere',
    tip: 'Inițiază mișcarea trăgând coatele în jos și în spate.',
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
