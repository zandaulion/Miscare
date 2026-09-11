export const EXERCISES = [
  // Structura exercițiilor. Textul -- nume, descriere, accent, sfat --
  // trăiește în web/i18n/<limbă>.json, sub cheia exercițiului: era scris de
  // două ori, aici și în catalogul clientului, iar cele două chiar au apucat
  // să difere. O singură sursă, tradusă o singură dată.
  {
    id: "wall_pushups",
    pattern: "push",
    category: "upper",
    level: 0,
    equipment: ["wall", "bodyweight"],
    safe_for: ["knees", "back", "wrists_moderate"],
    reps: { lo: 8, hi: 10, unit: "reps" },
    duration_s: 45
  },
  {
    id: "chair_sit_to_stand",
    pattern: "squat",
    category: "lower",
    level: 0,
    equipment: ["chair", "bodyweight"],
    safe_for: ["knees_mild", "back", "wrists"],
    reps: { lo: 6, hi: 8, unit: "reps" },
    duration_s: 50
  },
  {
    id: "standing_calf_raises",
    pattern: "calf",
    category: "lower",
    level: 0,
    equipment: ["wall", "chair", "bodyweight"],
    safe_for: ["knees", "back", "wrists"],
    reps: { lo: 10, hi: 12, unit: "reps" },
    duration_s: 40
  },
  {
    id: "shoulder_rolls_and_reach",
    pattern: "mobility",
    category: "mobility",
    level: 0,
    equipment: ["bodyweight"],
    safe_for: ["knees", "back", "wrists"],
    reps: { lo: 30, hi: 30, unit: "seconds" },
    duration_s: 30
  },
  {
    id: "glute_bridge_gentle",
    pattern: "hinge",
    category: "core_glutes",
    level: 0,
    equipment: ["bodyweight"],
    safe_for: ["knees", "wrists"],
    reps: { lo: 8, hi: 10, unit: "reps" },
    duration_s: 50
  },
  {
    id: "seated_knee_lifts",
    pattern: "core",
    category: "core",
    level: 0,
    equipment: ["chair", "bodyweight"],
    safe_for: ["knees", "back", "wrists"],
    reps: { lo: 10, hi: 10, unit: "reps", note: "alternating" },
    duration_s: 40
  },
  {
    id: "chest_opener_stretch",
    pattern: "mobility",
    category: "mobility",
    level: 0,
    equipment: ["wall", "bodyweight"],
    safe_for: ["knees", "back", "wrists"],
    reps: { lo: 30, hi: 30, unit: "seconds" },
    duration_s: 30
  },
  {
    id: "incline_pushups",
    pattern: "push",
    category: "upper",
    level: 0,
    equipment: ["chair", "bodyweight"],
    safe_for: ["knees", "back"],
    reps: { lo: 8, hi: 10, unit: "reps" },
    duration_s: 50
  },
  {
    id: "knee_pushups",
    pattern: "push",
    category: "upper",
    level: 1,
    equipment: ["bodyweight"],
    safe_for: ["back"],
    reps: { lo: 8, hi: 12, unit: "reps" },
    duration_s: 45
  },
  {
    id: "box_squat_touch",
    pattern: "squat",
    category: "lower",
    level: 1,
    equipment: ["chair", "bodyweight"],
    safe_for: ["back", "wrists"],
    reps: { lo: 8, hi: 10, unit: "reps" },
    duration_s: 50
  },
  {
    id: "wall_sit",
    pattern: "squat",
    category: "lower",
    level: 1,
    equipment: ["wall"],
    safe_for: ["back", "wrists"],
    reps: { lo: 20, hi: 30, unit: "seconds", note: "hold" },
    duration_s: 40
  },
  {
    id: "prone_cobra",
    pattern: "mobility",
    category: "mobility",
    level: 1,
    equipment: ["bodyweight"],
    safe_for: ["knees", "wrists"],
    reps: { lo: 8, hi: 10, unit: "reps", note: "hold2s" },
    duration_s: 45
  },
  {
    id: "bird_dog_gentle",
    pattern: "core",
    category: "core_glutes",
    level: 1,
    equipment: ["bodyweight"],
    safe_for: ["knees_cushioned"],
    reps: { lo: 6, hi: 8, unit: "reps", note: "eachSide" },
    duration_s: 55
  },
  {
    id: "deadbug_assisted",
    pattern: "core",
    category: "core",
    level: 1,
    equipment: ["bodyweight"],
    safe_for: ["knees", "wrists"],
    reps: { lo: 8, hi: 8, unit: "reps", note: "alternating" },
    duration_s: 45
  },
  {
    id: "crunches_standard",
    pattern: "core",
    category: "core",
    level: 1,
    equipment: ["bodyweight"],
    safe_for: ["knees", "wrists"],
    reps: { lo: 10, hi: 15, unit: "reps" },
    duration_s: 45
  },
  {
    id: "side_plank",
    pattern: "core",
    category: "core",
    level: 1,
    equipment: ["bodyweight"],
    safe_for: ["knees_cushioned"],
    reps: { lo: 15, hi: 20, unit: "seconds", note: "eachSide" },
    duration_s: 50
  },
  {
    id: "dumbbell_seated_bicep_curl",
    pattern: "pull",
    category: "upper",
    level: 1,
    equipment: ["dumbbells", "chair"],
    safe_for: ["knees", "back"],
    reps: { lo: 10, hi: 12, unit: "reps" },
    duration_s: 50
  },
  {
    id: "dumbbell_seated_shoulder_press",
    pattern: "push",
    category: "upper",
    level: 1,
    equipment: ["dumbbells", "chair"],
    safe_for: ["knees"],
    reps: { lo: 8, hi: 10, unit: "reps" },
    duration_s: 50
  },
  {
    id: "towel_pull_apart",
    pattern: "pull",
    category: "upper",
    level: 0,
    equipment: ["bodyweight"],
    safe_for: ["knees", "back", "wrists"],
    reps: { lo: 10, hi: 12, unit: "reps", note: "hold2s" },
    duration_s: 40
  },
  {
    id: "reverse_snow_angels",
    pattern: "pull",
    category: "upper",
    level: 0,
    equipment: ["bodyweight"],
    safe_for: ["knees", "wrists"],
    reps: { lo: 8, hi: 10, unit: "reps" },
    duration_s: 45
  },
  {
    id: "doorway_row",
    pattern: "pull",
    category: "upper",
    level: 1,
    equipment: ["bodyweight", "wall"],
    safe_for: ["knees", "back", "wrists"],
    reps: { lo: 8, hi: 10, unit: "reps" },
    duration_s: 45
  },
  {
    id: "band_pull_apart",
    pattern: "pull",
    category: "upper",
    level: 0,
    equipment: ["resistance_band"],
    safe_for: ["knees", "back", "wrists"],
    reps: { lo: 10, hi: 12, unit: "reps" },
    duration_s: 45
  },
  {
    id: "band_seated_row",
    pattern: "pull",
    category: "upper",
    level: 1,
    equipment: ["resistance_band"],
    safe_for: ["knees", "wrists"],
    reps: { lo: 10, hi: 12, unit: "reps" },
    duration_s: 50
  },
  {
    id: "active_hang",
    pattern: "mobility",
    category: "mobility",
    level: 1,
    equipment: ["pullup_bar"],
    safe_for: ["knees", "back"],
    reps: { lo: 20, hi: 30, unit: "seconds" },
    duration_s: 35
  },
  {
    id: "standard_pushups",
    pattern: "push",
    category: "upper",
    level: 2,
    equipment: ["bodyweight"],
    safe_for: ["knees", "back"],
    reps: { lo: 10, hi: 15, unit: "reps" },
    duration_s: 50
  },
  {
    id: "full_squats",
    pattern: "squat",
    category: "lower",
    level: 2,
    equipment: ["bodyweight"],
    safe_for: ["back", "wrists"],
    reps: { lo: 12, hi: 16, unit: "reps" },
    duration_s: 50
  },
  {
    id: "forearm_plank",
    pattern: "core",
    category: "core",
    level: 2,
    equipment: ["bodyweight"],
    safe_for: ["knees", "wrists"],
    reps: { lo: 35, hi: 50, unit: "seconds" },
    duration_s: 45
  },
  {
    id: "reverse_lunges",
    pattern: "squat",
    category: "lower",
    level: 2,
    equipment: ["bodyweight"],
    safe_for: ["back", "wrists"],
    reps: { lo: 10, hi: 12, unit: "reps", note: "perLeg" },
    duration_s: 55
  },
  {
    id: "chair_dips",
    pattern: "push",
    category: "upper",
    level: 2,
    equipment: ["chair", "bodyweight"],
    safe_for: ["knees"],
    reps: { lo: 10, hi: 12, unit: "reps" },
    duration_s: 50
  },
  {
    id: "mountain_climbers",
    pattern: "core",
    category: "core",
    level: 2,
    equipment: ["bodyweight"],
    safe_for: ["back"],
    reps: { lo: 30, hi: 40, unit: "seconds" },
    duration_s: 40
  },
  {
    id: "dumbbell_bent_over_row",
    pattern: "pull",
    category: "upper",
    level: 2,
    equipment: ["dumbbells"],
    safe_for: ["knees"],
    reps: { lo: 10, hi: 12, unit: "reps" },
    duration_s: 50
  },
  {
    id: "single_leg_glute_bridge",
    pattern: "hinge",
    category: "core_glutes",
    level: 2,
    equipment: ["bodyweight"],
    safe_for: ["knees", "wrists"],
    reps: { lo: 8, hi: 10, unit: "reps", note: "perLeg" },
    duration_s: 50
  },
  {
    id: "chin_ups",
    pattern: "pull",
    category: "upper",
    level: 2,
    equipment: ["pullup_bar"],
    safe_for: ["knees", "back"],
    reps: { lo: 4, hi: 8, unit: "reps" },
    duration_s: 50
  },
  {
    id: "negative_pullups",
    pattern: "pull",
    category: "upper",
    level: 2,
    equipment: ["pullup_bar"],
    safe_for: ["knees", "back"],
    reps: { lo: 5, hi: 6, unit: "reps", note: "lower34s" },
    duration_s: 50
  },
  {
    id: "hanging_knee_raises",
    pattern: "core",
    category: "core",
    level: 2,
    equipment: ["pullup_bar"],
    safe_for: ["knees", "back"],
    reps: { lo: 8, hi: 12, unit: "reps" },
    duration_s: 45
  },
  {
    id: "dumbbell_goblet_squat",
    pattern: "squat",
    category: "lower",
    level: 2,
    equipment: ["adjustable_dumbbells"],
    safe_for: ["knees", "back"],
    reps: { lo: 10, hi: 12, unit: "reps" },
    duration_s: 50
  },
  {
    id: "dumbbell_romanian_deadlift",
    pattern: "hinge",
    category: "lower",
    level: 2,
    equipment: ["adjustable_dumbbells"],
    safe_for: ["knees"],
    reps: { lo: 10, hi: 12, unit: "reps" },
    duration_s: 50
  },
  {
    id: "dumbbell_floor_press",
    pattern: "push",
    category: "upper",
    level: 2,
    equipment: ["adjustable_dumbbells"],
    safe_for: ["knees", "back"],
    reps: { lo: 10, hi: 12, unit: "reps" },
    duration_s: 50
  },
  {
    id: "dumbbell_single_arm_row",
    pattern: "pull",
    category: "upper",
    level: 2,
    equipment: ["adjustable_dumbbells", "chair"],
    safe_for: ["knees"],
    reps: { lo: 8, hi: 10, unit: "reps", note: "perArm" },
    duration_s: 50
  },
  {
    id: "dumbbell_farmers_carry",
    pattern: "carry",
    category: "core",
    level: 2,
    equipment: ["adjustable_dumbbells"],
    safe_for: ["knees", "back"],
    reps: { lo: 35, hi: 45, unit: "seconds" },
    duration_s: 45
  },
  {
    id: "diamond_pushups",
    pattern: "push",
    category: "upper",
    level: 3,
    equipment: ["bodyweight"],
    safe_for: ["knees", "back"],
    reps: { lo: 10, hi: 12, unit: "reps" },
    duration_s: 50
  },
  {
    id: "jump_squats",
    pattern: "squat",
    category: "lower",
    level: 3,
    equipment: ["bodyweight"],
    safe_for: ["wrists"],
    reps: { lo: 10, hi: 14, unit: "reps" },
    duration_s: 45
  },
  {
    id: "plank_shoulder_taps",
    pattern: "core",
    category: "core",
    level: 3,
    equipment: ["bodyweight"],
    safe_for: ["knees", "back"],
    reps: { lo: 16, hi: 20, unit: "taps" },
    duration_s: 45
  },
  {
    id: "burpees_clean",
    pattern: "core",
    category: "core",
    level: 3,
    equipment: ["bodyweight"],
    safe_for: ["back"],
    reps: { lo: 8, hi: 12, unit: "reps" },
    duration_s: 50
  },
  {
    id: "pullups_standard",
    pattern: "pull",
    category: "upper",
    level: 3,
    equipment: ["pullup_bar"],
    safe_for: ["knees", "back", "wrists"],
    reps: { lo: 6, hi: 10, unit: "reps" },
    duration_s: 50
  },
];

import { stepReps } from './load.js';

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

    // Verifică limitările.
    //
    // Genunchii se verifică pe toate categoriile, ca spatele și încheieturile.
    // Cât timp verificarea era limitată la category === 'lower', treceau de
    // filtru cinci mișcări nesigure pentru genunchi — printre care
    // knee_pushups, adică exact exercițiul numit după articulația protejată.
    if (limitations.includes('knees') && !ex.safe_for.includes('knees')) {
      return false;
    }
    if (limitations.includes('back') && !ex.safe_for.includes('back')) {
      return false;
    }
    if (limitations.includes('wrists') && !ex.safe_for.includes('wrists')) {
      return false;
    }

    // Nivelul e plafon, dar și prag.
    //
    // Plafonul e evident: nu servim ce omul încă nu poate face. Pragul e mai
    // subtil. Cu un nivel mai jos e în regulă -- mișcarea aceea joacă rolul de
    // încălzire, iar catalogul ar fi prea sărac fără ea. Cu două niveluri mai
    // jos nu mai e sesiunea nivelului declarat: cineva la Nivel 2 primea
    // flotări la perete drept mișcare principală de împins, având în bazin și
    // flotări clasice, și împins cu gantere.
    //
    // Mușcă doar de la Nivel 2 în sus. La 0 și 1 pragul cade sub catalog, deci
    // nu schimbă nimic.
    if (ex.level > targetLevel) return false;
    if (ex.level < targetLevel - 1) return false;

    return true;
  });
}

export function generateDailyRoutine(profile = {}, options = {}) {
  const {
    forceDurationMinutes = null,
    daysSinceLastSession = 0,
    lastFeedback = profile.last_feedback || null,
    repStep = profile.rep_step || 0,
    // Câte sesiuni s-au făcut. Rotația avansează când se muncește, nu odată cu
    // calendarul: cine se mișcă de două ori pe săptămână trece prin tot
    // catalogul la fel de sigur ca cine se mișcă zilnic, doar mai lent. Iar o
    // zi sărită nu consumă o poziție -- primești înapoi sesiunea pe care n-ai
    // făcut-o, nu următoarea.
    rotation = profile.total_sessions ?? profile.total_active_days ?? 0,
    // Ce s-a servit ieri, ca să nu se servească iar azi.
    //
    // Serverul îl dă din jurnal, fiindcă acolo scrie ce s-a servit cu
    // adevărat. Când lipsește -- offline, sau prima sesiune -- se reconstituie
    // mai jos.
    avoid = null
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

  // Când nu ies destule exerciții, lărgim — dar numai ce e preferință.
  //
  // Varianta veche relua filtrarea de la zero pe level + bodyweight și pierdea
  // pe drum `limitations`. Efectul era invers decât cel dorit: cu cât cineva
  // bifa mai multe zone sensibile, cu atât rămâneau mai puține exerciții, cu
  // atât mai sigur intra pe ramura asta — și primea exact mișcările pe care
  // tocmai le exclusese. Un profil cu genunchi + spate + încheieturi primea
  // flotări la perete (nesigure pentru încheieturi) și ridicări de pe scaun
  // (nesigure pentru genunchi).
  //
  // Echipamentul e o preferință: dacă nu ai ganteră, exercițiul cu greutatea
  // corpului rămâne o alternativă onestă. Limitările nu sunt o preferință.
  // Deci lărgim echipamentul și, dacă tot nu ajunge, servim mai puțin.
  const MIN_EXERCISES = 3;
  let candidateExercises = filterSafeExercises(EXERCISES, profile);
  if (candidateExercises.length < MIN_EXERCISES) {
    candidateExercises = filterSafeExercises(EXERCISES, {
      ...profile,
      equipment: ['bodyweight', 'chair', 'wall']
    });
  }
  const shortOnSafeMoves = candidateExercises.length < MIN_EXERCISES;

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

  const inCategory = (list, name) => list.filter((e) =>
    name === 'core' ? e.category.includes('core') : e.category === name);

  /**
   * O categorie cu o singură opțiune nu e o alegere, e o rutină înțepenită.
   *
   * La Nivel 0 există exact o mișcare de sus care cere doar un perete --
   * flotările la perete. Oricât ar roti, cine nu are bandă elastică le
   * primește la fiecare sesiune. Aici categoria subțire se completează cu
   * nivelul imediat următor, nu mai mult, și trecând prin același
   * filterSafeExercises: limitările și echipamentul rămân exact cum erau,
   * fiindcă lărgirea asta e despre varietate, nu despre relaxarea siguranței.
   */
  const LEVEL_ORDER = ['zero', 'beginner', 'intermediate', 'advanced'];
  const MIN_PER_CATEGORY = 2;
  const MIN_PATTERNS = 2;

  /**
   * Două exerciții de același tip sunt tot o rutină înțepenită.
   *
   * Prima versiune număra exercițiile. A ieșit prost imediat ce catalogul a
   * primit tracțiuni fără echipament: cine are doar greutatea corpului -- fără
   * perete, fără scaun -- avea la Nivel 0 exact două mișcări de sus, ambele de
   * tragere, ceea ce trecea de prag și oprea completarea. Rezultatul a fost
   * invers celui căutat: zero împingeri în douăsprezece sesiuni, în loc de
   * douăsprezece din douăsprezece.
   *
   * Se numără deci tiparele, nu rândurile.
   */
  const withNextLevel = (name) => {
    const base = inCategory(candidateExercises, name);
    const upKey = LEVEL_ORDER[targetLevel + 1];
    const patterns = new Set(base.map((e) => e.pattern));
    if (!upKey) return base;
    if (base.length >= MIN_PER_CATEGORY && patterns.size >= MIN_PATTERNS) return base;

    const wider = filterSafeExercises(EXERCISES, { ...profile, level: upKey });
    const extra = inCategory(wider, name).filter((e) => !base.includes(e));
    return base.concat(extra);
  };

  const mobility = withNextLevel('mobility');
  const upper = withNextLevel('upper');
  const lower = withNextLevel('lower');
  const core = withNextLevel('core');

  const chosen = [];

  /**
   * Sesiunea de ieri, reconstruită pas cu pas.
   *
   * Varianta dinainte cerea aceeași funcție cu o rotație mai puțin, dar cu
   * `avoid` gol -- pus acolo doar ca să oprească recursivitatea. Asta schimba
   * răspunsul: ieșea o sesiune generată fără regula de evitare, adică alta
   * decât cea servită în ziua aceea. Se ocolea o zi care nu existase și se
   * repeta cea care existase. Comentariul spunea „reproductibilă oricând", și
   * rotația chiar e determinsită -- doar că reproducerea folosea alt argument.
   *
   * Se merge acum înainte, fiecare pas primind rezultatul pasului dinainte,
   * deci fiecare apel intern are deja `avoid` și nu mai recurge. Fereastra
   * ține costul mărginit: după atâtea sesiuni, ce s-a făcut la început nu mai
   * schimbă ce se alege azi.
   */
  const CHAIN_WINDOW = 16;
  let yesterday = avoid;
  if (!yesterday) {
    yesterday = new Set();
    for (let r = Math.max(0, rotation - CHAIN_WINDOW); r < rotation; r++) {
      yesterday = new Set(
        generateDailyRoutine(profile, { ...options, rotation: r, avoid: yesterday })
          .exercises.map((e) => e.id));
    }
  }

  /**
   * Ia din listă începând de la poziția de rotație, nu de la zero.
   *
   * Structura zilei rămâne aceeași -- încălzire, sus, jos, centru -- fiindcă
   * forma e bună. Se schimbă doar cine ocupă fiecare loc. Rotația e o simplă
   * deplasare, nu o alegere la întâmplare: la întâmplare înseamnă că același
   * exercițiu poate ieși trei zile la rând iar altul niciodată, pe când o
   * rotație trece prin tot catalogul și se întoarce.
   */
  /**
   * Alege din listă, sărind peste ce s-a făcut ieri.
   *
   * Două treceri. Prima ocolește sesiunea precedentă, fiindcă „aceleași
   * exerciții ca ieri" e exact plângerea pe care rotația trebuia s-o rezolve.
   * A doua acceptă orice, fiindcă la un catalog subțire -- profilul care a
   * semnalat problema are doar două exerciții de centru și unul de cărat --
   * unele mișcări chiar n-au alternativă, iar un loc gol e mai rău decât o
   * repetare.
   */
  const pickFrom = (list, index = rotation) => {
    if (!list.length) return null;
    const start = ((index % list.length) + list.length) % list.length;
    for (const avoidYesterday of [true, false]) {
      for (let i = 0; i < list.length; i++) {
        const ex = list[(start + i) % list.length];
        if (chosen.includes(ex)) continue;
        if (avoidYesterday && yesterday.has(ex.id)) continue;
        return ex;
      }
    }
    return null;
  };


  const take = (ex) => {
    if (ex && chosen.length < exerciseCount && !chosen.includes(ex)) chosen.push(ex);
  };

  /**
   * Ce grupe conduc sesiunea de azi.
   *
   * O sesiune de zece minute are trei locuri, dintre care încălzirea ia unul.
   * Dacă celelalte două ar fi mereu „sus" și „jos", aceiași mușchi ar fi
   * încărcați în fiecare zi -- iar cine împinge trei zile la rând se trezește
   * cu pieptul înțepenit și sare o zi. Ziua sărită e exact ce încearcă
   * aplicația să prevină, deci grupele se rotesc și ele, nu doar exercițiile.
   *
   * Trei perechi, la rând: fiecare grupă apare în două sesiuni din trei în loc
   * de trei din trei.
   */
  const GROUP_CYCLE = [['upper', 'lower'], ['upper', 'core'], ['lower', 'core']];
  const groups = { upper, lower, core };
  const leadToday = GROUP_CYCLE[((rotation % 3) + 3) % 3];

  // 1. Warm-up / prima mișcare: dacă suntem la nivel avansat/intermediar, warm-up e opțional dacă vrea direct forță
  if (targetLevel < 2 && mobility.length) {
    chosen.push(pickFrom(mobility));
  }

  /**
   * De câte ori a fost folosită grupa asta până acum.
   *
   * Nu `rotation`, și nici `rotation` corectat cu ceva. O grupă e aleasă doar
   * la anumite poziții din ciclu, așa că indexarea listei după rotația brută
   * le blochează în fază: „sus" era ales doar când rotation % 3 era 0 sau 1,
   * ceea ce selecta exact pozițiile 0 și 1 din listă, iar al treilea exercițiu
   * nu ieșea niciodată. Prima încercare de corecție a mutat blocajul în loc
   * să-l elimine -- cu patru exerciții în listă rămânea inaccesibil al
   * patrulea.
   *
   * Numărând folosirile, lista avansează cu exact un pas de fiecare dată când
   * grupa chiar apare, deci le parcurge pe toate, oricâte ar fi.
   */
  const timesUsed = (name) => {
    const perCycle = GROUP_CYCLE.filter((pair) => pair.includes(name)).length;
    let n = Math.floor(rotation / GROUP_CYCLE.length) * perCycle;
    for (let i = 0; i < ((rotation % GROUP_CYCLE.length) + GROUP_CYCLE.length) % GROUP_CYCLE.length; i++) {
      if (GROUP_CYCLE[i].includes(name)) n++;
    }
    return n;
  };

  for (const name of leadToday) take(pickFrom(groups[name], timesUsed(name)));

  // Completare, preferând tipare care nu sunt deja în sesiune: două împingeri
  // în aceeași sesiune înseamnă aceiași mușchi de două ori, oricât de diferit
  // s-ar numi exercițiile.
  /**
   * Locurile rămase, după grupele care conduc ziua.
   *
   * Contează mai mult decât pare: la cincisprezece minute sunt patru locuri și
   * doar două grupe care conduc, deci completarea aduce jumătate de sesiune.
   *
   * Prima variantă parcurgea lista de candidați și lua primul exercițiu al
   * cărui tipar nu era deja folosit. Alegerea era făcută de tipar, nu de
   * rotație: același exercițiu câștiga „primul tipar nefolosit" în fiecare zi,
   * iar o deplasare cu o poziție într-o listă lungă nu schimba cine câștigă.
   * Rezultatul, măsurat pe profilul care a semnalat problema: 38% dintr-o
   * sesiune se repeta a doua zi.
   *
   * Acum se rotesc amândouă -- care tipar umple primul, și care exercițiu din
   * tiparul acela. Numărul de folosiri contorizate aici, nu rotația brută,
   * pentru același motiv ca la grupe: două lucruri care avansează cu același
   * pas se pot bloca în fază.
   */
  const fillSlots = () => {
    const patterns = [...new Set(candidateExercises.map((e) => e.pattern))];
    if (!patterns.length) return;

    // Trei treceri, în ordinea în care merită cedat.
    //
    //   1. tipar nefolosit azi, mișcare nefolosită ieri  -- ce se dorește
    //   2. tipar nefolosit azi, chiar dacă a fost și ieri -- catalog subțire
    //   3. tipar repetat                                  -- ultima soluție
    //
    // Ordinea contează. Cu doar două treceri, evitarea zilei de ieri împingea
    // completarea direct la un tipar repetat, adică două împingeri în aceeași
    // sesiune -- exact regula pusă pentru refacere. Varietatea de la o zi la
    // alta nu merită plătită cu aceiași mușchi de două ori în aceeași zi.
    const PASSES = [
      { repeatPattern: false, repeatYesterday: false },
      { repeatPattern: false, repeatYesterday: true },
      { repeatPattern: true, repeatYesterday: true }
    ];

    let taken = 0;
    for (const pass of PASSES) {
      for (let i = 0; i < patterns.length && chosen.length < exerciseCount; i++) {
        const pattern = patterns[(((rotation + i) % patterns.length) + patterns.length) % patterns.length];
        if (!pass.repeatPattern && chosen.some((c) => c.pattern === pattern)) continue;

        const list = candidateExercises.filter((e) => e.pattern === pattern);
        if (!pass.repeatYesterday && list.every((e) => yesterday.has(e.id))) continue;
        const before = chosen.length;
        take(pickFrom(list, rotation + taken));
        if (chosen.length > before) taken++;
      }
    }
  };
  fillSlots();

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

  // O sesiune scurtă și sigură bate una completă și nepotrivită. Spunem de ce
  // e scurtă, ca să nu pară că aplicația a rămas fără idei — și ca zonele
  // bifate să poată fi reconsiderate dacă au fost bifate din precauție.
  if (shortOnSafeMoves) {
    adjustmentNote = chosen.length
      ? `Sesiune mai scurtă: atât am găsit în siguranță pentru zonele pe care le-ai bifat.`
      : 'Nu am găsit nicio mișcare sigură pentru zonele bifate.';
    if (!chosen.length) {
      supportiveMessage =
        'Zonele pe care le-ai bifat exclud toate mișcările din catalog. '
        + 'Verifică-le în setări — sau întreabă un specialist ce e sigur pentru tine.';
    }
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
    // Efortul vine dintr-o singură sursă acum: treapta pe care se află omul.
    // Înainte se scădea 2 direct din text la fiecare sesiune „grea", ceea ce
    // nu se aduna -- a doua oară era tot minus 2 -- și rata complet formatele
    // fără interval, deci „30 secunde" nu se mișca niciodată.
    // Efortul pleacă structurat, nu ca text. Clientul îl scrie în limba lui,
    // fiindcă serverul nu are de unde ști ce limbă se uită la ecran.
    exercises: chosen.map((ex) => ({
      ...ex,
      reps: stepReps(ex.reps, repStep)
    }))
  };
}
