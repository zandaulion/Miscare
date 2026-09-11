/**
 * Nivelul unui exercițiu, ca etichetă.
 *
 * Stă aici, nu în vederi, fiindcă îl arată și compendiul, și lista de azi. Tot
 * ce e scris de două ori ajunge, mai devreme sau mai târziu, scris diferit --
 * s-a întâmplat deja cu textele exercițiilor, unde același efort apărea
 * „30 secunde" într-un loc și „30-40 secunde" în altul.
 *
 * Cheile sunt românești, ca peste tot în aplicație; traducerea se face la
 * desenare.
 */
import { t } from './i18n.js';

export const LEVEL_LABEL = ['De la 0', 'Începător', 'Intermediar', 'Avansat'];

/** Eticheta colorată a nivelului. Întoarce șir gol pentru un nivel necunoscut. */
export function levelBadge(level) {
  const label = LEVEL_LABEL[level];
  if (!label) return '';
  return `<span class="badge-level level-${level}">${t(label)}</span>`;
}
