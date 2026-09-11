/**
 * Echipamentul, într-un singur loc.
 *
 * Era scris de două ori: o dată în vederea de echipament, cu nume lungi și
 * descrieri, o dată în compendiu, cu nume scurte pentru pastile. Se
 * depărtaseră deja -- `bodyweight` era „Greutatea corpului" într-un loc și
 * „Corp liber" în celălalt, iar ganterele reglabile „Gantere reglabile" față
 * de „Gantere 5-20kg". Nu e greșit să ai și formă lungă, și scurtă; e greșit
 * să le ții în două tabele care nu se știu unul pe altul.
 *
 * Cheile sunt românești, ca peste tot; traducerea se face la desenare.
 */

/*
 * Ce lipsește de aici, și de ce.
 *
 * Kettlebell-ul și rola de spumă erau în listă, dar niciun exercițiu nu le
 * cerea și nicio zi nu se schimba dacă le bifai. Un rând care nu face nimic nu
 * e neutru: slăbește încrederea în cele care chiar filtrează. Se pun înapoi
 * când catalogul are ce să ofere pentru ele -- kettlebell-ul merită, e o
 * unealtă serioasă de forță; rola ar cere o categorie de recuperare, care nu
 * există încă.
 *
 * Salteaua și perna au rămas, dar au trecut de la cerințe la sugestii: vezi
 * `comfort` în catalogul de exerciții.
 */
export const EQUIPMENT = {
  bodyweight: { icon: '🧘', name: 'Greutatea corpului', short: 'Corp liber', desc: 'Întotdeauna disponibilă' },
  chair: { icon: '🪑', name: 'Scaun stabil', short: 'Scaun', desc: 'Pentru sprijin și așezare' },
  wall: { icon: '🧱', name: 'Perete liber', short: 'Perete', desc: 'Pentru flotări și postură' },
  yoga_mat: { icon: '🟩', name: 'Saltea / Covoraș', short: 'Saltea', desc: 'Pentru confort la sol' },
  dumbbells: { icon: '🏋️', name: 'Gantere ușoare', short: 'Gantere ușoare', desc: '1 - 5 kg (brațe & mobilitate)' },
  adjustable_dumbbells: { icon: '🏋️‍♂️', name: 'Gantere grele', short: 'Gantere grele', desc: '5 - 20 kg (forță & picioare)' },
  resistance_band: { icon: '🎗️', name: 'Bandă elastică', short: 'Bandă elastică', desc: 'Textilă sau cauciuc' },
  pullup_bar: { icon: '🪜', name: 'Bară de tracțiuni', short: 'Bară tracțiuni', desc: 'Montată la ușă/perete' },
  cushion: { icon: '🛋️', name: 'Pernă moale', short: 'Pernă', desc: 'Protecție genunchi' }
};

/**
 * Ce implică echipamentul declarat.
 *
 * Ganterele grele se pot pune pe trei kilograme; cele ușoare nu se pot face
 * grele. Subsumarea merge deci într-o singură direcție, și numai într-aceea.
 *
 * Fără ea, cine are o singură pereche reglabilă era exclus de la curl, presa
 * de umeri și ramatul aplecat -- exerciții pe care le poate face -- și trebuia
 * să bifeze și „gantere ușoare" ca să le primească, adică să declare un
 * echipament pe care nu-l are. Contopirea celor două ar fi mutat greșeala în
 * partea cealaltă: cineva cu o pereche de două kilograme ar fi primit mersul
 * fermierului și îndreptări românești.
 *
 * Numele spun acum greutatea, nu mecanismul. Exercițiului nu-i pasă dacă
 * discurile se scot; îi pasă cât cântărește. Cine are o pereche fixă de zece
 * kilograme știe astfel ce să bifeze.
 */
export const IMPLIES = {
  adjustable_dumbbells: ['dumbbells']
};

/** Echipamentul declarat, plus ce decurge din el. */
export function expandEquipment(owned = []) {
  const out = new Set(owned);
  for (const id of owned) for (const extra of IMPLIES[id] || []) out.add(extra);
  return out;
}

/** Ordinea în care se strâng lucrurile: întâi ce e prin casă, apoi ce se caută. */
export const EQUIPMENT_ORDER = Object.keys(EQUIPMENT);

/** Un identificat necunoscut nu trebuie să spargă desenarea. */
export function equipmentInfo(id) {
  return EQUIPMENT[id] || { icon: '📦', name: id, short: id, desc: '' };
}

/**
 * Ce trebuie strâns pentru o listă de exerciții.
 *
 * Greutatea corpului nu se strânge de nicăieri, deci nu apare în listă -- dar
 * rămâne singurul răspuns onest când nu e nevoie de nimic altceva, iar
 * apelantul o poate deosebi după lista goală.
 */
export function equipmentForExercises(exercises = []) {
  const needed = new Set();
  for (const ex of exercises) {
    for (const id of ex?.equipment || []) {
      if (id !== 'bodyweight') needed.add(id);
    }
  }
  return EQUIPMENT_ORDER.filter((id) => needed.has(id));
}

/**
 * Ce ar face ziua mai comodă, fără să fie cerut.
 *
 * Se citește din câmpul `comfort` al exercițiilor, nu din textul lor. Am mai
 * avut o dată o regulă care citea proza -- pasul de progresie căuta cuvântul
 * „secunde" -- și s-a rupt la prima traducere. Aici e câmp.
 */
export function comfortForExercises(exercises = []) {
  const wanted = new Set();
  for (const ex of exercises) for (const id of ex?.comfort || []) wanted.add(id);
  return ['yoga_mat', 'cushion'].filter((id) => wanted.has(COMFORT_ID[id]));
}

/** `comfort` vorbește despre lucruri, echipamentul are identificatori. */
const COMFORT_ID = { yoga_mat: 'mat', cushion: 'cushion' };
