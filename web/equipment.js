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

export const EQUIPMENT = {
  bodyweight: { icon: '🧘', name: 'Greutatea corpului', short: 'Corp liber', desc: 'Întotdeauna disponibilă' },
  chair: { icon: '🪑', name: 'Scaun stabil', short: 'Scaun', desc: 'Pentru sprijin și așezare' },
  wall: { icon: '🧱', name: 'Perete liber', short: 'Perete', desc: 'Pentru flotări și postură' },
  yoga_mat: { icon: '🟩', name: 'Saltea / Covoraș', short: 'Saltea', desc: 'Pentru confort la sol' },
  dumbbells: { icon: '🏋️', name: 'Gantere ușoare', short: 'Gantere ușoare', desc: '1 - 5 kg (brațe & mobilitate)' },
  adjustable_dumbbells: { icon: '🏋️‍♂️', name: 'Gantere grele', short: 'Gantere grele', desc: '5 - 20 kg (forță & picioare)' },
  resistance_band: { icon: '🎗️', name: 'Bandă elastică', short: 'Bandă elastică', desc: 'Textilă sau cauciuc' },
  kettlebell: { icon: '🔔', name: 'Kettlebell', short: 'Kettlebell', desc: 'Greutate cu mâner' },
  pullup_bar: { icon: '🪜', name: 'Bară de tracțiuni', short: 'Bară tracțiuni', desc: 'Montată la ușă/perete' },
  foam_roller: { icon: '🪵', name: 'Rolă de spumă', short: 'Rolă spumă', desc: 'Masaj și relaxare' },
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
