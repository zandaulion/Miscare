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
    equipment: ['yoga_mat', 'bodyweight'],
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
    id: 'bird_dog_gentle',
    name: 'Bird-dog (stabilitate pe genunchi și palme)',
    category: 'core_glutes',
    level: 1,
    equipment: ['yoga_mat', 'cushion', 'bodyweight'],
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
    equipment: ['yoga_mat', 'bodyweight'],
    safe_for: ['knees', 'wrists'],
    default_reps: '8 repetări alternativ',
    duration_s: 45,
    description: 'Pe spate cu genunchii la 90 de grade. Coboară un călcâi spre sol păstrând spatele lipit de saltea, apoi revino.',
    focus: 'Abdomen profund și protecție lombară',
    tip: 'Dacă simți că spatele se arcuiește de pe podea, nu coborî călcâiul până jos.'
  },

  // --- Exerciții cu gantere (dacă utilizatorul are gantere)
  {
    id: 'dumbbell_seated_bicep_curl',
    name: 'Flexii pentru bicepși din așezat (cu gantere)',
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
    tip: 'Nu curba spatele; dacă e prea greu, folosește o greutate mai mică sau doar brațele libere.'
  },

  // --- Exerciții cu bandă elastică (dacă utilizatorul are bandă)
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
    tip: 'Excelent pentru corectarea umerilor aduși în față de la telefon sau laptop.'
  },
  {
    id: 'band_seated_row',
    name: 'Ramat din așezat cu bandă elastică',
    category: 'upper',
    level: 1,
    equipment: ['resistance_band', 'chair', 'yoga_mat'],
    safe_for: ['knees', 'wrists'],
    default_reps: '10-12 repetări',
    duration_s: 50,
    description: 'Cu picioarele întinse, trece banda pe sub tălpi. Trage de capetele benzii spre abdomen strângând omopații la spate.',
    focus: 'Mușchii spatelui și postură',
    tip: 'Păstrează pieptul deschis și umerii coborâți.'
  }
];

export function filterSafeExercises(allExercises, profile) {
  const limitations = Array.isArray(profile.limitations) ? profile.limitations : [];
  const equipment = Array.isArray(profile.equipment) ? profile.equipment : ['bodyweight', 'chair', 'wall'];

  return allExercises.filter((ex) => {
    // Verifică echipamentul: fiecare echipament necesar de exercițiu trebuie să fie disponibil
    const hasRequiredEquipment = ex.equipment.every((eq) => equipment.includes(eq));
    if (!hasRequiredEquipment) return false;

    // Verifică limitările/durerile
    if (limitations.includes('knees') && ex.category === 'lower' && !ex.safe_for.includes('knees')) {
      return false;
    }
    if (limitations.includes('back') && !ex.safe_for.includes('back')) {
      return false;
    }
    if (limitations.includes('wrists') && !ex.safe_for.includes('wrists')) {
      return false;
    }

    // Nivel compatibil
    const userLevelNum = profile.level === 'zero' ? 0 : profile.level === 'beginner' ? 1 : 2;
    if (ex.level > userLevelNum) return false;

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

  let candidateExercises = filterSafeExercises(EXERCISES, profile);
  if (candidateExercises.length < 3) {
    // Fallback garantat la mișcările de nivel 0 cu greutatea corpului
    candidateExercises = EXERCISES.filter((e) => e.level === 0 && e.equipment.includes('bodyweight'));
  }

  // Număr de exerciții țintă
  const exerciseCount = isShortSession ? 2 : targetMinutes <= 10 ? 3 : 4;

  // Împărțire pe categorii: vrem varietate (upper, lower, mobility/core)
  const mobility = candidateExercises.filter((e) => e.category === 'mobility');
  const upper = candidateExercises.filter((e) => e.category === 'upper');
  const lower = candidateExercises.filter((e) => e.category === 'lower');
  const core = candidateExercises.filter((e) => e.category.includes('core'));

  const chosen = [];

  // Întotdeauna începem cu o mobilizare blândă
  if (mobility.length) {
    chosen.push(mobility[0]);
  } else if (candidateExercises.length) {
    chosen.push(candidateExercises[0]);
  }

  // Adăugăm upper body
  const nextUpper = upper.find((e) => !chosen.includes(e));
  if (nextUpper && chosen.length < exerciseCount) chosen.push(nextUpper);

  // Adăugăm lower body
  const nextLower = lower.find((e) => !chosen.includes(e));
  if (nextLower && chosen.length < exerciseCount) chosen.push(nextLower);

  // Adăugăm core dacă mai e loc
  const nextCore = core.find((e) => !chosen.includes(e));
  if (nextCore && chosen.length < exerciseCount) chosen.push(nextCore);

  // Dacă încă nu avem destule, completăm din ce a rămas
  for (const ex of candidateExercises) {
    if (chosen.length >= exerciseCount) break;
    if (!chosen.includes(ex)) chosen.push(ex);
  }

  // Calculăm ajustările adaptive
  let adjustmentNote = null;
  let supportiveMessage = 'Pregătit pentru câteva minute de mișcare revigorantă?';

  if (isReentry) {
    supportiveMessage = 'Bine ai revenit! Fără grabă și fără vinovăție — corpul tău își reamintește ritmul treptat.';
    adjustmentNote = 'Sesiune calibrată pentru reacomodare ușoară.';
  } else if (lastFeedback === 'hard') {
    supportiveMessage = 'Am calibrat mișcările de azi să fie mai blânde și confortabile.';
    adjustmentNote = 'Volum adaptat automat după ultima sesiune.';
  } else if (lastFeedback === 'easy') {
    supportiveMessage = 'Data trecută a fost ușor și plăcut. Continuăm cu aceeași energie bună!';
  }

  // Estimează durata totală în secunde
  const estimatedSeconds = chosen.reduce((acc, curr) => acc + (curr.duration_s || 45) * 2 + 30, 0);

  return {
    id: 'routine_' + Date.now().toString(36),
    title: isShortSession
      ? 'Micro-sesiune de 5 minute'
      : isReentry
      ? 'Sesiune blândă de reacomodare'
      : 'Mișcarea ta de azi',
    target_minutes: Math.round(estimatedSeconds / 60) || targetMinutes,
    supportive_message: supportiveMessage,
    adjustment_note: adjustmentNote,
    is_reentry: isReentry,
    exercises: chosen.map((ex) => {
      let reps = ex.default_reps;
      if (lastFeedback === 'hard' || isReentry) {
        // Reducem ușor repetările dacă ultima dată a fost greu
        reps = reps.replace(/(\d+)-(\d+)/, (_, a, b) => `${Math.max(4, parseInt(a, 10) - 2)}-${Math.max(6, parseInt(b, 10) - 2)}`);
      }
      return {
        ...ex,
        adjusted_reps: reps
      };
    })
  };
}
