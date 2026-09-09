export const EXERCISES = [
  // --- Nivel 0 (Ultra-blând, fără impact, sprijin scaun / perete)
  {
    id: 'wall_pushups',
    name: 'Flotări la perete',
    category: 'upper',
    level: 0,
    equipment: ['wall', 'bodyweight'],
    safe_for: ['knees', 'back', 'wrists_moderate'],
    default_reps: '8-10 repetări',
    duration_s: 45,
    description: 'Stai la un braț distanță de perete, cu palmele la nivelul pieptului. Îndoaie coatele controlat, apoi împinge înapoi.',
    focus: 'Piept, brațe și umeri',
    tip: 'Păstrează corpul drept ca o scândură, fără să lași bazinul să cadă în față.'
  },
  {
    id: 'chair_sit_to_stand',
    name: 'Ridicări de pe scaun',
    category: 'lower',
    level: 0,
    equipment: ['chair', 'bodyweight'],
    safe_for: ['knees_mild', 'back', 'wrists'],
    default_reps: '6-8 repetări',
    duration_s: 50,
    description: 'Așază-te pe marginea unui scaun stabil. Ridică-te în picioare împingând în călcâie, apoi așază-te la loc lent.',
    focus: 'Picioare și stabilitate',
    tip: 'Nu te lăsa să cazi pe scaun; coborârea lentă lucrează mușchii cel mai bine.'
  },
  {
    id: 'standing_calf_raises',
    name: 'Ridicări pe vârfuri (cu sprijin)',
    category: 'lower',
    level: 0,
    equipment: ['wall', 'chair', 'bodyweight'],
    safe_for: ['knees', 'back', 'wrists'],
    default_reps: '10-12 repetări',
    duration_s: 40,
    description: 'Cu mâinile sprijinite ușor de perete sau spătarul scaunului, ridică-te pe vârfuri cât mai sus, menține 1 secundă și coboară.',
    focus: 'Glezne, gambe și circulație',
    tip: 'Excelent pentru activarea circulației după perioade lungi de stat pe scaun.'
  },
  {
    id: 'shoulder_rolls_and_reach',
    name: 'Rotiri de umeri și întinderi ușoare',
    category: 'mobility',
    level: 0,
    equipment: ['bodyweight'],
    safe_for: ['knees', 'back', 'wrists'],
    default_reps: '30 secunde',
    duration_s: 30,
    description: 'Rotește umerii în cercuri mari spre spate, respirând adânc. Apoi întinde brațele ușor spre tavan.',
    focus: 'Eliberare tensiune gât și umeri',
    tip: 'Lasă umerii să coboare departe de urechi.'
  },
  {
    id: 'glute_bridge_gentle',
    name: 'Podul fesier (la podea sau pat tare)',
    category: 'core_glutes',
    level: 0,
    equipment: ['bodyweight'],
    safe_for: ['knees', 'wrists'],
    default_reps: '8-10 repetări',
    duration_s: 50,
    description: 'Întins pe spate cu genunchii îndoiți și tălpile pe sol. Ridică bazinul până când corpul formează o linie dreaptă de la genunchi la umeri.',
    focus: 'Fesieri și zona lombară',
    tip: 'Strânge ușor abdomenul și fesierii în partea de sus, fără să curbezi exagerat spatele.'
  },
  {
    id: 'seated_knee_lifts',
    name: 'Ridicări de genunchi din așezat',
    category: 'core',
    level: 0,
    equipment: ['chair', 'bodyweight'],
    safe_for: ['knees', 'back', 'wrists'],
    default_reps: '10 repetări alternativ',
    duration_s: 40,
    description: 'Stai pe scaun cu spatele drept. Ridică un genunchi spre piept ținând abdomenul activ, coboară și repetă cu celălalt.',
    focus: 'Abdomen inferior și mobilitate șolduri',
    tip: 'Nu te lăsa pe spate când ridici genunchiul.'
  },
  {
    id: 'chest_opener_stretch',
    name: 'Deschidere de piept la perete sau ușă',
    category: 'mobility',
    level: 0,
    equipment: ['wall', 'bodyweight'],
    safe_for: ['knees', 'back', 'wrists'],
    default_reps: '30 secunde',
    duration_s: 30,
    description: 'Așază antebrațul pe tocul unei uși sau pe perete și rotește ușor trunchiul în partea opusă până simți o întindere plăcută în piept.',
    focus: 'Postură și mobilitate cutie toracică',
    tip: 'Respiră calm și profund, nu forța întinderea.'
  },

  // --- Nivel 1 (Începător de bază, progresie naturală)
  {
    id: 'incline_pushups',
    name: 'Flotări înclinate (pe birou sau spătar)',
    category: 'upper',
    level: 1,
    equipment: ['chair', 'bodyweight'],
    safe_for: ['knees', 'back'],
    default_reps: '8-10 repetări',
    duration_s: 50,
    description: 'Sprijină palmele pe o suprafață stabilă (masă rezistentă sau canapea). Coboară pieptul controlat și împinge ferm.',
    focus: 'Piept, triceps și forță trunchi',
    tip: 'Cu cât suprafața e mai înaltă, cu atât e mai ușor.'
  },
  {
    id: 'knee_pushups',
    name: 'Flotări pe genunchi',
    category: 'upper',
    level: 1,
    equipment: ['bodyweight'],
    safe_for: ['back'],
    default_reps: '8-12 repetări',
    duration_s: 45,
    description: 'Sprijin pe palme și genunchi, cu trunchiul formând o linie dreaptă. Coboară pieptul spre podea îndoind coatele la 45°, apoi împinge ferm.',
    focus: 'Piept, umeri și triceps',
    tip: 'Ține abdomenul activ; nu lăsa zona lombară să se lase în jos.'
  },
  {
    id: 'box_squat_touch',
    name: 'Genuflexiune cu atingerea scaunului',
    category: 'lower',
    level: 1,
    equipment: ['chair', 'bodyweight'],
    safe_for: ['back', 'wrists'],
    default_reps: '8-10 repetări',
    duration_s: 50,
    description: 'Coboară într-o genuflexiune până când atingi ușor scaunul cu bazinul, apoi te ridici imediat fără să te așezi complet.',
    focus: 'Coapse, fesieri și control',
    tip: 'Genunchii urmăresc direcția degetelor de la picioare.'
  },
  {
    id: 'wall_sit',
    name: 'Scaunul invizibil la perete (Wall Sit)',
    category: 'lower',
    level: 1,
    equipment: ['wall'],
    safe_for: ['back', 'wrists'],
    default_reps: '20-30 secunde menținere',
    duration_s: 40,
    description: 'Lipește spatele de perete și coboară ca pe un scaun până când genunchii sunt la 90°. Menține poziția nemișcat.',
    focus: 'Cvadricepși (coapse) și anduranță musculară',
    tip: 'Presează călcâiele ferm în podea și respiră constant.'
  },
  {
    id: 'prone_cobra',
    name: 'Cobra blândă (Extensii de spate la sol)',
    category: 'mobility',
    level: 1,
    equipment: ['bodyweight'],
    safe_for: ['knees', 'wrists'],
    default_reps: '8-10 repetări (menținere 2s)',
    duration_s: 45,
    description: 'Întins pe burtă cu brațele pe lângă corp. Ridică ușor pieptul de pe podea trăgând omoplații spre spate și rotind degetele mari spre tavan.',
    focus: 'Partea superioară a spatelui, romboizi și postură',
    tip: 'Privește spre podea pentru a păstra gâtul relaxat și aliniat.'
  },
  {
    id: 'bird_dog_gentle',
    name: 'Bird-dog (stabilitate pe genunchi și palme)',
    category: 'core_glutes',
    level: 1,
    equipment: ['bodyweight'],
    safe_for: ['knees_cushioned'],
    default_reps: '6-8 pe fiecare parte',
    duration_s: 55,
    description: 'În patru labe pe saltea. Întinde simultan brațul drept în față și piciorul stâng în spate, menține 2 secunde, apoi schimbă.',
    focus: 'Stabilitate lombară, coordonare și fesieri',
    tip: 'Imaginează-ți că ții un pahar cu apă pe spate și nu vrei să-l verși.'
  },
  {
    id: 'deadbug_assisted',
    name: 'Deadbug asistat',
    category: 'core',
    level: 1,
    equipment: ['bodyweight'],
    safe_for: ['knees', 'wrists'],
    default_reps: '8 repetări alternativ',
    duration_s: 45,
    description: 'Pe spate cu genunchii la 90 de grade. Coboară un călcâi spre sol păstrând spatele lipit de saltea, apoi revino.',
    focus: 'Abdomen profund și protecție lombară',
    tip: 'Dacă simți că spatele se arcuiește de pe podea, nu coborî călcâiul până jos.'
  },
  {
    id: 'crunches_standard',
    name: 'Abdomene clasice (Crunches la sol)',
    category: 'core',
    level: 1,
    equipment: ['bodyweight'],
    safe_for: ['knees', 'wrists'],
    default_reps: '10-15 repetări',
    duration_s: 45,
    description: 'Întins pe spate cu genunchii îndoiți și tălpile pe sol. Ridică doar omoplații contractând abdomenul, menține 1 secundă și coboară lent.',
    focus: 'Abdomen (dreptul abdominal)',
    tip: 'Nu trage de ceafă cu mâinile; ține bărbia depărtată de piept și privește la 45° spre tavan.'
  },
  {
    id: 'side_plank',
    name: 'Plank lateral pe genunchi (Scândură laterală)',
    category: 'core',
    level: 1,
    equipment: ['bodyweight'],
    safe_for: ['knees_cushioned'],
    default_reps: '15-20 secunde pe fiecare parte',
    duration_s: 50,
    description: 'Pe o parte, sprijină-te pe antebraț cu cotul sub umăr și genunchii îndoiți la 90°. Ridică bazinul formând o linie dreaptă de la genunchi la umeri.',
    focus: 'Abdomen oblic, talie și stabilitate laterală',
    tip: 'Ține gâtul drept și nu lăsa șoldul să cadă spre sol.'
  },
  {
    id: 'dumbbell_seated_bicep_curl',
    name: 'Flexii pentru bicepși (cu gantere)',
    category: 'upper',
    level: 1,
    equipment: ['dumbbells', 'chair'],
    safe_for: ['knees', 'back'],
    default_reps: '10-12 repetări',
    duration_s: 50,
    description: 'Așezat pe scaun cu o ganteră în fiecare mână. Îndoaie brațele ridicând greutățile spre umeri, apoi coboară lent.',
    focus: 'Brațe (biceps)',
    tip: 'Păstrează coatele fixe pe lângă corp.'
  },
  {
    id: 'dumbbell_seated_shoulder_press',
    name: 'Împins pentru umeri din așezat (cu gantere)',
    category: 'upper',
    level: 1,
    equipment: ['dumbbells', 'chair'],
    safe_for: ['knees'],
    default_reps: '8-10 repetări',
    duration_s: 50,
    description: 'Din așezat cu spatele drept, împinge ganterele de la nivelul urechilor spre tavan fără să blochezi brusc coatele.',
    focus: 'Umeri și postură',
    tip: 'Nu curba spatele.'
  },
  {
    id: 'band_pull_apart',
    name: 'Depărtări de bandă pentru spate',
    category: 'upper',
    level: 0,
    equipment: ['resistance_band'],
    safe_for: ['knees', 'back', 'wrists'],
    default_reps: '10-12 repetări',
    duration_s: 45,
    description: 'Ține banda cu ambele mâini în fața pieptului cu brațele întinse. Depărtează mâinile trăgând banda până atinge pieptul.',
    focus: 'Spate superior, postură și umeri',
    tip: 'Excelent pentru corectarea umerilor aduși în față.'
  },
  {
    id: 'band_seated_row',
    name: 'Ramat din așezat cu bandă elastică',
    category: 'upper',
    level: 1,
    equipment: ['resistance_band'],
    safe_for: ['knees', 'wrists'],
    default_reps: '10-12 repetări',
    duration_s: 50,
    description: 'Cu picioarele întinse, trece banda pe sub tălpi. Trage de capetele benzii spre abdomen strângând omopații la spate.',
    focus: 'Mușchii spatelui și postură',
    tip: 'Păstrează pieptul deschis și umerii coborâți.'
  },
  {
    id: 'active_hang',
    name: 'Atârnare activă la bară (Active Hang)',
    category: 'mobility',
    level: 1,
    equipment: ['pullup_bar'],
    safe_for: ['knees', 'back'],
    default_reps: '20-30 secunde',
    duration_s: 35,
    description: 'Prinde bara ferm și lasă corpul să atârne, dar trage omopații în jos și depărtează umerii de urechi. Respiră calm.',
    focus: 'Decompresie lombară, stabilitate umeri și forță priză',
    tip: 'Eliberează presiunea din coloană și pregătește umerii pentru tracțiuni.'
  },

  // --- Nivel 2 (Intermediar / Activ — forță solidă la sol, tempo susținut)
  {
    id: 'standard_pushups',
    name: 'Flotări clasice la podea',
    category: 'upper',
    level: 2,
    equipment: ['bodyweight'],
    safe_for: ['knees', 'back'],
    default_reps: '10-15 repetări',
    duration_s: 50,
    description: 'Sprijin în palme și vârfuri de picioare. Coboară pieptul controlat până la 5 cm de sol, menținând corpul drept ca o scândură, apoi împinge ferm.',
    focus: 'Piept, triceps, umeri și forță trunchi',
    tip: 'Coatele formează o săgeată la 45 grade față de trunchi, nu deschise complet lateral.'
  },
  {
    id: 'full_squats',
    name: 'Genuflexiuni libere (adânci)',
    category: 'lower',
    level: 2,
    equipment: ['bodyweight'],
    safe_for: ['back', 'wrists'],
    default_reps: '12-16 repetări',
    duration_s: 50,
    description: 'Picioarele la lățimea umerilor. Coboară bazinul sub nivelul genunchilor, păstrând călcâiele lipite de sol și pieptul mândru.',
    focus: 'Coapse, fesieri și mobilitate glezne',
    tip: 'Respiră adânc la coborâre și împinge în călcâie la urcare.'
  },
  {
    id: 'forearm_plank',
    name: 'Scândură / Plank pe antebrațe',
    category: 'core',
    level: 2,
    equipment: ['bodyweight'],
    safe_for: ['knees', 'wrists'],
    default_reps: '35-50 secunde',
    duration_s: 45,
    description: 'Sprijin pe antebrațe și vârfurile picioarelor. Corpul formează o linie rigidă de la călcâie la creștet. Strânge abdomenul și fesierii.',
    focus: 'Stabilitate trunchi, centură abdominală și umeri',
    tip: 'Nu lăsa bazinul să cadă și nu îl ridica în formă de cort.'
  },
  {
    id: 'reverse_lunges',
    name: 'Fandări în spate (alternativ)',
    category: 'lower',
    level: 2,
    equipment: ['bodyweight'],
    safe_for: ['back', 'wrists'],
    default_reps: '10-12 repetări / picior',
    duration_s: 55,
    description: 'Fă un pas mare în spate și coboară genunchiul spre sol la 90 de grade. Revino împingând în călcâiul piciorului din față.',
    focus: 'Fesieri, coapse și stabilitate unilaterală',
    tip: 'Păstrează trunchiul vertical și genunchiul din față aliniat cu glezna.'
  },
  {
    id: 'chair_dips',
    name: 'Flotări inverse la scaun (Dips)',
    category: 'upper',
    level: 2,
    equipment: ['chair', 'bodyweight'],
    safe_for: ['knees'],
    default_reps: '10-12 repetări',
    duration_s: 50,
    description: 'Cu spatele la scaun, sprijină palmele pe marginea șezutului. Coboară bazinul pe lângă scaun îndoind coatele la 90 de grade, apoi împinge înapoi sus.',
    focus: 'Triceps, piept și deltoizi anteriori',
    tip: 'Păstrează spatele aproape de marginea scaunului pe toată durata mișcării.'
  },
  {
    id: 'mountain_climbers',
    name: 'Mountain climbers (tempo dinamic)',
    category: 'core',
    level: 2,
    equipment: ['bodyweight'],
    safe_for: ['back'],
    default_reps: '30-40 secunde',
    duration_s: 40,
    description: 'Din poziția de flotare, trage genunchii spre piept în mod alternativ într-un ritm rapid și controlat, fără balans al bazinului.',
    focus: 'Condiționare cardio, abdomen și umeri',
    tip: 'Menține umerii direct deasupra palmelor.'
  },
  {
    id: 'dumbbell_bent_over_row',
    name: 'Ramat cu gantere din aplecat',
    category: 'upper',
    level: 2,
    equipment: ['dumbbells'],
    safe_for: ['knees'],
    default_reps: '10-12 repetări',
    duration_s: 50,
    description: 'Trunchiul aplecat înainte la 45 de grade, spatele perfect drept. Trage ganterele spre șolduri contractând puternic mușchii spatelui.',
    focus: 'Spate, bicepși și deltoizi posteriori',
    tip: 'Nu trage din brațe, inițiază mișcarea din omopați.'
  },
  {
    id: 'single_leg_glute_bridge',
    name: 'Pod fesier pe un singur picior',
    category: 'core_glutes',
    level: 2,
    equipment: ['bodyweight'],
    safe_for: ['knees', 'wrists'],
    default_reps: '8-10 / picior',
    duration_s: 50,
    description: 'Pe spate, întinde un picior în aer și împinge în călcâiul celuilalt pentru a ridica bazinul. Menține 1 secundă sus.',
    focus: 'Fesieri profunzi, biceps femural și stabilitate pelviană',
    tip: 'Păstrează șoldurile paralele, nu lăsa o parte să cadă.'
  },
  {
    id: 'chin_ups',
    name: 'Tracțiuni în supinație (Chin-ups)',
    category: 'upper',
    level: 2,
    equipment: ['pullup_bar'],
    safe_for: ['knees', 'back'],
    default_reps: '4-8 repetări',
    duration_s: 50,
    description: 'Prinde bara cu palmele orientate spre tine la lățimea umerilor. Trage pieptul spre bară până când bărbia trece peste, apoi coboară lent.',
    focus: 'Bicepși, dorsali și forță de tragere',
    tip: 'Priza în supinație folosește mai mult bicepșii, fiind o mișcare naturală și accesibilă la nivel intermediar.'
  },
  {
    id: 'negative_pullups',
    name: 'Tracțiuni negative (coborâre controlată)',
    category: 'upper',
    level: 2,
    equipment: ['pullup_bar'],
    safe_for: ['knees', 'back'],
    default_reps: '5-6 repetări (coborâre 3-4s)',
    duration_s: 50,
    description: 'Sari ușor sau folosește un scaun pentru a ajunge cu bărbia deasupra barei. Coboară cât mai lent posibil (3-4 secunde) până la întinderea completă a brațelor.',
    focus: 'Forță excentrică, spate, brațe și priză',
    tip: 'Coborârea controlată crește cel mai rapid numărul de tracțiuni complete.'
  },
  {
    id: 'hanging_knee_raises',
    name: 'Ridicări de genunchi din atârnat la bară',
    category: 'core',
    level: 2,
    equipment: ['pullup_bar'],
    safe_for: ['knees', 'back'],
    default_reps: '8-12 repetări',
    duration_s: 45,
    description: 'Din atârnat la bară cu brațele drepte și umerii fermi, ridică genunchii controlat spre piept fără balans, ține o fracțiune de secundă și coboară lent.',
    focus: 'Abdomen inferior, flexori șold și anduranță priză',
    tip: 'Evită balansul trunchiului — mișcarea trebuie să fie strict din contracția abdomenului.'
  },

  // --- Gantere reglabile / grele (5-20 kg) - Forță compusă Nivel 2
  {
    id: 'dumbbell_goblet_squat',
    name: 'Genuflexiuni Goblet (cu ganteră la piept)',
    category: 'lower',
    level: 2,
    equipment: ['adjustable_dumbbells'],
    safe_for: ['knees', 'back'],
    default_reps: '10-12 repetări',
    duration_s: 50,
    description: 'Ține o ganteră pe verticală, lipită de piept cu ambele palme. Coboară într-o genuflexiune adâncă menținând pieptul ridicat și coatele între genunchi, apoi împinge ferm în călcâie.',
    focus: 'Cvadricepși, fesieri, mobilitate șolduri și stabilitate trunchi',
    tip: 'Greutatea ținută în față activează abdomenul și te ajută să cobori adânc fără a rotunji spatele.'
  },
  {
    id: 'dumbbell_romanian_deadlift',
    name: 'Îndreptări românești (RDL cu gantere)',
    category: 'lower',
    level: 2,
    equipment: ['adjustable_dumbbells'],
    safe_for: ['knees'],
    default_reps: '10-12 repetări',
    duration_s: 50,
    description: 'Picioarele la lățimea șoldurilor, ganterele în față. Împinge bazinul în spate flexând doar ușor genunchii, coborând ganterele până sub genunchi cu spatele perfect drept, apoi strânge fesierii la ridicare.',
    focus: 'Biceps femural, fesieri și lanț posterior',
    tip: 'Mișcarea este o împingere a fundului spre peretele din spate, nu o aplecare din talie.'
  },
  {
    id: 'dumbbell_floor_press',
    name: 'Împins de la podea cu gantere',
    category: 'upper',
    level: 2,
    equipment: ['adjustable_dumbbells'],
    safe_for: ['knees', 'back'],
    default_reps: '10-12 repetări',
    duration_s: 50,
    description: 'Întins pe spate cu genunchii îndoiți. Împinge ganterele deasupra pieptului până când brațele sunt întinse, apoi coboară lent până când tricepșii ating ușor podeaua.',
    focus: 'Piept, triceps și stabilitate articulară umeri',
    tip: 'Podeaua blochează coborârea exagerată a coatelor, protejând articulațiile umerilor chiar și cu greutăți mari.'
  },
  {
    id: 'dumbbell_single_arm_row',
    name: 'Ramat cu un braț sprijinit pe scaun',
    category: 'upper',
    level: 2,
    equipment: ['adjustable_dumbbells', 'chair'],
    safe_for: ['knees'],
    default_reps: '8-10 / braț',
    duration_s: 50,
    description: 'Sprijină un genunchi și o mână pe scaun, cu spatele orizontal. Cu cealaltă mână, trage gantera grea spre șold contractând omoplatul, ține o fracțiune de secundă și coboară controlat.',
    focus: 'Dorsali, romboizi, bicepși și forță unilaterală spate',
    tip: 'Nu roti trunchiul; menține umerii paraleli cu podeaua.'
  },
  {
    id: 'dumbbell_farmers_carry',
    name: 'Mersul fermierului (Farmer\'s Carry)',
    category: 'core',
    level: 2,
    equipment: ['adjustable_dumbbells'],
    safe_for: ['knees', 'back'],
    default_reps: '35-45 secunde',
    duration_s: 45,
    description: 'Ține o ganteră grea în fiecare mână pe lângă corp. Menține umerii trași în spate, pieptul sus și pășește lent și controlat (sau menține postura fermă pe loc).',
    focus: 'Priză, antebrațe, trapez, abdomen și stabilitate posturală',
    tip: 'Menține corpul perfect vertical; nu lăsa greutățile să te tragă în față sau lateral.'
  },

  // --- Nivel 3 (Avansat / Intens — forță explozivă, variații compuse)
  {
    id: 'diamond_pushups',
    name: 'Flotări diamant (palme apropiate)',
    category: 'upper',
    level: 3,
    equipment: ['bodyweight'],
    safe_for: ['knees', 'back'],
    default_reps: '10-12 repetări',
    duration_s: 50,
    description: 'Așază palmele la sol sub piept, cu degetele mari și arătătoare atingându-se în formă de diamant. Coboară și împinge exploziv.',
    focus: 'Triceps intens și piept interior',
    tip: 'Păstrează coatele apropiate de trunchi.'
  },
  {
    id: 'jump_squats',
    name: 'Genuflexiuni cu săritură explozivă',
    category: 'lower',
    level: 3,
    equipment: ['bodyweight'],
    safe_for: ['wrists'],
    default_reps: '10-14 repetări',
    duration_s: 45,
    description: 'Coboară într-o genuflexiune adâncă și explodează într-o săritură verticală. Aterizează lin pe vârfuri și continuă în următoarea coborâre.',
    focus: 'Putere explozivă picioare și anduranță cardiovasculară',
    tip: 'Aterizarea trebuie să fie silențioasă și elastică pentru a proteja articulațiile.'
  },
  {
    id: 'plank_shoulder_taps',
    name: 'Plank cu atingeri rapide de umeri',
    category: 'core',
    level: 3,
    equipment: ['bodyweight'],
    safe_for: ['knees', 'back'],
    default_reps: '16-20 atingeri',
    duration_s: 45,
    description: 'Din poziția de flotare, ridică mâna dreaptă și atinge umărul stâng fără a mișca sau balansa bazinul. Repetă alternativ.',
    focus: 'Anti-rotație trunchi, stabilitate umeri și abdomen',
    tip: 'Depărtează picioarele puțin mai mult pentru stabilitate optimă.'
  },
  {
    id: 'burpees_clean',
    name: 'Burpees curate (fără pauză)',
    category: 'core',
    level: 3,
    equipment: ['bodyweight'],
    safe_for: ['back'],
    default_reps: '8-12 repetări',
    duration_s: 50,
    description: 'Din picioare, coboară în genuflexiune, aruncă picioarele în spate în poziție de flotare, execută o flotare, revino și sari în sus.',
    focus: 'Capacitate anaerobă și forță totală a corpului',
    tip: 'Găsește un tempo ritmic constant.'
  },
  {
    id: 'pullups_standard',
    name: 'Tracțiuni la bară',
    category: 'upper',
    level: 3,
    equipment: ['pullup_bar'],
    safe_for: ['knees', 'back', 'wrists'],
    default_reps: '6-10 repetări',
    duration_s: 50,
    description: 'Prinde bara cu palmele orientate în față la o lățime mai mare decât umerii. Trage corpul până când bărbia trece peste bară.',
    focus: 'Dorsali, bicepși și forță de tragere',
    tip: 'Inițiază mișcarea trăgând coatele în jos și în spate.'
  }
];

export function filterSafeExercises(allExercises, profile) {
  const limitations = Array.isArray(profile.limitations) ? profile.limitations : [];
  const equipment = Array.isArray(profile.equipment) ? profile.equipment : ['bodyweight', 'chair', 'wall'];

  const levelMap = {
    zero: 0,
    beginner: 1,
    intermediate: 2,
    advanced: 3
  };
  const targetLevel = levelMap[profile.level] ?? 0;

  return allExercises.filter((ex) => {
    // Verifică echipamentul
    const hasRequiredEquipment = ex.equipment.every((eq) => equipment.includes(eq));
    if (!hasRequiredEquipment) return false;

    // Verifică limitările
    if (limitations.includes('knees') && ex.category === 'lower' && !ex.safe_for.includes('knees')) {
      return false;
    }
    if (limitations.includes('back') && !ex.safe_for.includes('back')) {
      return false;
    }
    if (limitations.includes('wrists') && !ex.safe_for.includes('wrists')) {
      return false;
    }

    // Exercițiile nu trebuie să depășească nivelul utilizatorului
    if (ex.level > targetLevel) return false;

    return true;
  });
}

export function generateDailyRoutine(profile = {}, options = {}) {
  const {
    forceDurationMinutes = null,
    daysSinceLastSession = 0,
    lastFeedback = profile.last_feedback || null
  } = options;

  const targetMinutes = forceDurationMinutes || profile.daily_time || 10;
  const isShortSession = targetMinutes <= 6;
  const isReentry = daysSinceLastSession >= 4;

  const levelMap = {
    zero: 0,
    beginner: 1,
    intermediate: 2,
    advanced: 3
  };
  const targetLevel = levelMap[profile.level] ?? 0;

  let candidateExercises = filterSafeExercises(EXERCISES, profile);
  if (candidateExercises.length < 3) {
    candidateExercises = EXERCISES.filter((e) => e.level <= Math.max(1, targetLevel) && e.equipment.includes('bodyweight'));
  }

  // Sortăm favorizând nivelul țintă și echipamentele dedicate declarate (bară, gantere, bandă)
  const userEquip = Array.isArray(profile.equipment) ? profile.equipment : [];
  const specialEquipment = ['pullup_bar', 'adjustable_dumbbells', 'dumbbells', 'resistance_band', 'kettlebell'];
  const hasUserSpecial = userEquip.some((eq) => specialEquipment.includes(eq));

  candidateExercises.sort((a, b) => {
    // 1. Favorizează nivelul utilizatorului
    if (targetLevel >= 2 && b.level !== a.level) {
      return b.level - a.level;
    }
    // 2. Dacă utilizatorul are echipament dedicat, favorizează exercițiile care îl utilizează
    if (hasUserSpecial) {
      const aHas = a.equipment.some((eq) => specialEquipment.includes(eq) && userEquip.includes(eq));
      const bHas = b.equipment.some((eq) => specialEquipment.includes(eq) && userEquip.includes(eq));
      if (aHas && !bHas) return -1;
      if (!aHas && bHas) return 1;
    }
    return 0;
  });

  const exerciseCount = isShortSession ? 2 : targetMinutes <= 10 ? 3 : 4;

  const mobility = candidateExercises.filter((e) => e.category === 'mobility');
  const upper = candidateExercises.filter((e) => e.category === 'upper');
  const lower = candidateExercises.filter((e) => e.category === 'lower');
  const core = candidateExercises.filter((e) => e.category.includes('core'));

  const chosen = [];

  // 1. Warm-up / prima mișcare: dacă suntem la nivel avansat/intermediar, warm-up e opțional dacă vrea direct forță
  if (targetLevel < 2 && mobility.length) {
    chosen.push(mobility[0]);
  }

  // 2. Upper body principal
  const nextUpper = upper.find((e) => !chosen.includes(e));
  if (nextUpper && chosen.length < exerciseCount) chosen.push(nextUpper);

  // 3. Lower body principal
  const nextLower = lower.find((e) => !chosen.includes(e));
  if (nextLower && chosen.length < exerciseCount) chosen.push(nextLower);

  // 4. Core / finisher
  const nextCore = core.find((e) => !chosen.includes(e));
  if (nextCore && chosen.length < exerciseCount) chosen.push(nextCore);

  // Dacă încă nu avem suficiente exerciții, adăugăm din cele mai potrivite rămase
  for (const ex of candidateExercises) {
    if (chosen.length >= exerciseCount) break;
    if (!chosen.includes(ex)) chosen.push(ex);
  }

  // Calculăm mesaje de suport și ajustare
  let adjustmentNote = null;
  let supportiveMessage = targetLevel >= 2
    ? 'Pregătit pentru o sesiune activă și energică?'
    : 'Pregătit pentru câteva minute de mișcare revigorantă?';

  if (isReentry) {
    supportiveMessage = 'Bine ai revenit! Fără grabă și fără vinovăție — corpul tău își reamintește ritmul treptat.';
    adjustmentNote = 'Sesiune calibrată pentru reacomodare ușoară.';
  } else if (lastFeedback === 'hard') {
    supportiveMessage = 'Am calibrat mișcările de azi să fie mai blânde și confortabile.';
    adjustmentNote = 'Volum adaptat automat după ultima sesiune.';
  } else if (lastFeedback === 'easy') {
    supportiveMessage = 'Data trecută a fost ușor și plăcut. Menținem ritmul bun!';
  }

  const estimatedSeconds = chosen.reduce((acc, curr) => acc + (curr.duration_s || 50) * 2 + 30, 0);

  const levelNames = {
    zero: 'Nivel 0 (De la 0)',
    beginner: 'Nivel 1 (Începător)',
    intermediate: 'Nivel 2 (Intermediar)',
    advanced: 'Nivel 3 (Avansat)'
  };

  return {
    id: 'routine_' + Date.now().toString(36),
    title: isShortSession
      ? 'Micro-sesiune de 5 minute'
      : isReentry
      ? 'Sesiune blândă de reacomodare'
      : `Mișcarea ta de azi — ${levelNames[profile.level] || 'Nivel 0'}`,
    level: profile.level || 'zero',
    target_minutes: Math.round(estimatedSeconds / 60) || targetMinutes,
    supportive_message: supportiveMessage,
    adjustment_note: adjustmentNote,
    is_reentry: isReentry,
    exercises: chosen.map((ex) => {
      let reps = ex.default_reps;
      if (lastFeedback === 'hard' || isReentry) {
        reps = reps.replace(/(\d+)-(\d+)/, (_, a, b) => `${Math.max(4, parseInt(a, 10) - 2)}-${Math.max(6, parseInt(b, 10) - 2)}`);
      }
      return {
        ...ex,
        adjusted_reps: reps
      };
    })
  };
}
