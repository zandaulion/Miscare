/**
 * Când se propune mai mult, când se propune mai puțin — și cine decide.
 *
 * Aplicația știa doar să coboare. "Cam greu" scădea volumul, "ușor" schimba
 * doar mesajul, așa că cineva care pornea de la flotări la perete rămânea la
 * flotări la perete oricât de ușoare deveneau. Promisiunea e "să te ia de la
 * zero"; fără o cale în sus, propoziția n-are a doua jumătate.
 *
 * Regula care ține laolaltă progresul și principiul „fără vinovăție”: nu se
 * impune niciodată mai mult. Rușinea vine din ținte pe care le poți rata --
 * serii, obiective, un plan în urma căruia rămâi. Nu vine din a fi întrebat
 * dacă vrei ceva mai mult, cu răspunsul „nu” la fel de ușor de dat ca „da”.
 *
 * De aceea:
 *   - în sus se propune și se așteaptă răspuns;
 *   - în jos, după o sesiune grea, se întâmplă tăcut -- cine tocmai s-a
 *     chinuit nu are de ce să mai confirme asta printr-un dialog;
 *   - după o pauză lungă se întreabă, fiindcă acolo nu e clar dacă e nevoie
 *     de menajament sau doar de reluat firul.
 *
 * Fiecare propunere spune că se poate reveni, iar starea anterioară se ține
 * minte ca revenirea să fie reală, nu o formulă de politețe.
 */

export const LEVELS = ['zero', 'beginner', 'intermediate', 'advanced'];

export const LEVEL_NAMES = {
  zero: 'Nivel 0',
  beginner: 'Nivel 1',
  intermediate: 'Nivel 2',
  advanced: 'Nivel 3'
};

/** Cât de sus pot urca repetările înainte ca răspunsul corect să fie alt nivel. */
export const MAX_STEP = 4;
/** Cât de jos pot coborî. Sub asta problema nu mai e volumul. */
export const MIN_STEP = -3;
/** Două sesiuni ușoare la rând. Una singură e o zi bună, nu o tendință. */
export const EASY_STREAK_FOR_MORE = 2;
/** Peste atâtea zile de pauză, reluarea se discută. */
export const REENTRY_DAYS = 4;

const clampStep = (n) => Math.max(MIN_STEP, Math.min(MAX_STEP, n));

/**
 * Ce se schimbă singur când se închide o sesiune.
 *
 * Doar coborârea e automată. Urcarea trece prin `proposeChange`, fiindcă
 * urcarea e singura direcție în care aplicația ar putea cere ceva ce nimeni
 * nu a acceptat.
 */
export function applyFeedback(state, feedback) {
  const repStep = clampStep(Number(state?.rep_step) || 0);
  const easyStreak = Math.max(0, Number(state?.easy_streak) || 0);

  if (feedback === 'hard') {
    return { rep_step: clampStep(repStep - 1), easy_streak: 0 };
  }
  if (feedback === 'easy') {
    return { rep_step: repStep, easy_streak: easyStreak + 1 };
  }
  // "tocmai bine" și "doar o parte": nimic de schimbat, dar seria de zile
  // ușoare se rupe -- altfel două sesiuni ușoare despărțite de o lună ar
  // conta ca o tendință.
  return { rep_step: repStep, easy_streak: 0 };
}

export function nextLevel(level) {
  const i = LEVELS.indexOf(level);
  return i >= 0 && i < LEVELS.length - 1 ? LEVELS[i + 1] : null;
}

export function previousLevel(level) {
  const i = LEVELS.indexOf(level);
  return i > 0 ? LEVELS[i - 1] : null;
}

/**
 * Întrebarea zilei, dacă există vreuna.
 *
 * Cel mult una. Două întrebări în același ecran transformă pornirea sesiunii
 * într-un formular, iar ecranul acesta există tocmai ca să nu fie unul.
 */
export function proposeChange({
  level = 'zero',
  repStep = 0,
  easyStreak = 0,
  daysSinceLastSession = 0
} = {}) {
  const step = clampStep(Number(repStep) || 0);

  // Pauza lungă se discută prima: e cea mai proaspătă informație despre om.
  if (daysSinceLastSession >= REENTRY_DAYS) {
    const zile = daysSinceLastSession;
    return {
      kind: 'ease_back',
      question: `Au trecut ${zile} zile de la ultima mișcare. Reluăm mai ușor decât data trecută, sau continuăm de unde ai rămas?`,
      accept_label: 'Reluăm mai ușor',
      decline_label: 'Continui de unde am rămas',
      note: 'Oricare ar fi răspunsul, nimic din ce ai adunat nu se pierde.',
      to: { rep_step: clampStep(step - 1) }
    };
  }

  if (easyStreak < EASY_STREAK_FOR_MORE) return null;

  // Repetările sunt deja sus pentru nivelul acesta: mai multe repetări din
  // aceleași mișcări nu mai e progres, e doar volum.
  const up = nextLevel(level);
  if (step >= MAX_STEP && up) {
    return {
      kind: 'level_up',
      question: `Ultimele sesiuni ți s-au părut ușoare, iar repetările sunt deja sus pentru ${LEVEL_NAMES[level]}. Treci la ${LEVEL_NAMES[up]}?`,
      accept_label: `Trec la ${LEVEL_NAMES[up]}`,
      decline_label: 'Rămân aici deocamdată',
      note: `${LEVEL_NAMES[up]} înseamnă mișcări noi, nu mai grele cu forța. Te poți întoarce la ${LEVEL_NAMES[level]} oricând, dintr-o atingere.`,
      to: { level: up, rep_step: 0 }
    };
  }

  if (step >= MAX_STEP) return null;   // Nivel 3 cu repetări la maxim: nimic de propus

  return {
    kind: 'more_reps',
    question: 'Ultimele două sesiuni ți s-au părut ușoare. Adăugăm puțin data viitoare?',
    accept_label: 'Hai puțin mai mult',
    decline_label: 'E bine așa',
    note: 'Câteva repetări în plus, nu o săritură. Poți reveni oricând la cum era.',
    to: { rep_step: clampStep(step + 1) }
  };
}
