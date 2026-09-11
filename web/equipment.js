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
  dumbbells: { icon: '🏋️', name: 'Gantere mici', short: 'Gantere mici', desc: '1 - 5 kg (brațe & mobilitate)' },
  adjustable_dumbbells: { icon: '🏋️‍♂️', name: 'Gantere reglabile', short: 'Gantere 5-20kg', desc: '5 - 20 kg (forță & picioare)' },
  resistance_band: { icon: '🎗️', name: 'Bandă elastică', short: 'Bandă elastică', desc: 'Textilă sau cauciuc' },
  kettlebell: { icon: '🔔', name: 'Kettlebell', short: 'Kettlebell', desc: 'Greutate cu mâner' },
  pullup_bar: { icon: '🪜', name: 'Bară de tracțiuni', short: 'Bară tracțiuni', desc: 'Montată la ușă/perete' },
  foam_roller: { icon: '🪵', name: 'Rolă de spumă', short: 'Rolă spumă', desc: 'Masaj și relaxare' },
  cushion: { icon: '🛋️', name: 'Pernă moale', short: 'Pernă', desc: 'Protecție genunchi' }
};

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
