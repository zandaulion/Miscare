/**
 * Catalogul de echipament servit prin API.
 *
 * Nu-și mai ține propria listă. Era a treia copie a acelorași unsprezece
 * lucruri, cu alte nume -- „Doar greutatea corpului" față de „Greutatea
 * corpului", „Gantere reglabile (5 - 20 kg)" față de „Gantere reglabile" --
 * și cu un `step_box` care nu exista nici în interfață, nici în vreun
 * exercițiu: API-ul oferea un echipament pe care aplicația nu-l putea folosi.
 *
 * `category` rămâne aici, fiindcă doar API-ul o folosește.
 */
import { EQUIPMENT_ORDER, equipmentInfo } from '../web/equipment.js';

const CATEGORY = {
  bodyweight: 'none',
  chair: 'household',
  wall: 'household',
  yoga_mat: 'floor',
  dumbbells: 'weights',
  adjustable_dumbbells: 'weights',
  resistance_band: 'bands',
  kettlebell: 'weights',
  pullup_bar: 'bar',
  foam_roller: 'recovery',
  cushion: 'floor'
};

const DEFAULTS = new Set(['bodyweight', 'chair', 'wall']);

export const EQUIPMENT_CATALOG = EQUIPMENT_ORDER.map((id) => {
  const info = equipmentInfo(id);
  const row = { id, name_ro: info.name, category: CATEGORY[id] || 'other' };
  if (DEFAULTS.has(id)) row.default = true;
  return row;
});
