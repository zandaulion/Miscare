/**
 * Ce se deschide peste conținut trebuie să se închidă cu înapoi.
 *
 * Aplicația are trei asemenea straturi: foaia exercițiului din compendiu,
 * modalul de exersare și previzualizarea de pe „Azi". Fiecare avea nevoie de
 * aceleași patru lucruri -- o poziție în istoric, `popstate`, Escape, clic pe
 * fundal -- iar al treilea exemplar scris de mână ar fi fost primul care se
 * depărtează de celelalte.
 *
 * Regula care le ține laolaltă: închiderea din interfață nu ascunde nodul, ci
 * derulează poziția din istoric, iar `popstate` face ascunderea. Așa butonul
 * telefonului și ✕-ul ajung în același loc, și nu rămâne în istoric o intrare
 * moartă care face următorul înapoi să pară stricat.
 */

/**
 * @param {object} o
 * @param {string} o.name        Marca stratului în istoric; distinge straturile.
 * @param {Element} o.overlay    Fundalul; un clic pe el închide.
 * @param {Element} [o.panel]    Cutia care se trage în jos. Fără ea, fără gest.
 * @param {Element} [o.scroller] Zona derulabilă; gestul pornește doar cu ea sus.
 * @param {() => void} o.onDismiss  Scoate stratul de pe ecran. Nu atinge istoricul.
 * @param {boolean} [o.replace]  Ia locul poziției curente în loc să adauge una.
 * @returns {{ close: () => void, dismiss: () => void }}
 */
export function makeDismissable({
  name,
  overlay,
  panel = null,
  scroller = null,
  onDismiss,
  replace = false
}) {
  const entry = { overlay: name };
  if (replace) history.replaceState(entry, '');
  else history.pushState(entry, '');

  /*
   * O singură închidere, oricâte semnale ar veni.
   *
   * După `touchend`, browserul trimite un click sintetic în locul unde s-a
   * ridicat degetul. La trasul în jos, locul acela e fundalul -- deci se
   * închidea o dată din gest și a doua oară din clic, adică două
   * `history.back()` la rând: stratul se ducea, și odată cu el și ecranul de
   * dedesubt. Un singur swipe scotea omul din aplicație.
   */
  let settled = false;

  const dismiss = () => {
    if (settled) return;
    settled = true;
    window.removeEventListener('popstate', onPop);
    document.removeEventListener('keydown', onKey);
    // Stilurile puse de gest se șterg aici, nu doar pe ramura de revenire.
    // Foaia din compendiu e creată de fiecare dată, deci nu s-ar fi observat;
    // previzualizarea și modalul de exersare sunt însă noduri refolosite, iar
    // un `translateY` rămas le-ar fi redeschis deplasate în jos.
    if (panel) {
      panel.style.transform = '';
      panel.style.transition = '';
    }
    overlay.style.background = '';
    onDismiss();
  };

  const close = () => {
    if (settled) return;
    if (history.state && history.state.overlay === name) history.back();
    else dismiss();
  };

  function onPop() { dismiss(); }
  function onKey(e) { if (e.key === 'Escape') close(); }

  window.addEventListener('popstate', onPop);
  document.addEventListener('keydown', onKey);
  // Doar fundalul închide; un clic înăuntru nu trebuie să piardă stratul.
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

  if (panel) attachSwipe({ panel, scroller, overlay, close });

  return { close, dismiss };
}

/** Sub atât, degetul a șovăit; peste, a vrut să închidă. */
const DISMISS_AFTER = 110;

function attachSwipe({ panel, scroller, overlay, close }) {
  let startY = 0;
  let dy = 0;
  let dragging = false;

  const atTop = () => !scroller || scroller.scrollTop <= 0;

  panel.addEventListener('touchstart', (e) => {
    // Gestul pornește doar cu textul derulat până sus. Altfel ar fura
    // derularea: ai vrea să urci în descriere și cutia ar pleca de sub deget.
    if (e.touches.length !== 1 || !atTop()) return;
    startY = e.touches[0].clientY;
    dy = 0;
    dragging = true;
    panel.style.transition = 'none';
  }, { passive: true });

  panel.addEventListener('touchmove', (e) => {
    if (!dragging) return;
    dy = e.touches[0].clientY - startY;
    if (dy <= 0 || !atTop()) {
      dragging = false;
      panel.style.transform = '';
      return;
    }
    e.preventDefault();
    panel.style.transform = `translateY(${dy}px)`;
    // Fundalul se limpezește pe măsură ce cutia coboară, ca să se vadă că
    // gestul chiar duce undeva.
    overlay.style.background = `rgba(0, 0, 0, ${(0.7 * Math.max(0, 1 - dy / 420)).toFixed(3)})`;
  }, { passive: false });

  const end = (e) => {
    if (!dragging) return;
    dragging = false;
    panel.style.transition = '';
    overlay.style.background = '';
    if (dy > DISMISS_AFTER) {
      // Oprește clicul sintetic de după ridicarea degetului. `settled` ar
      // prinde oricum a doua închidere, dar clicul fantomă ar ajunge altfel
      // și la ce se află dedesubt, după ce stratul dispare.
      e.preventDefault();
      close();
    } else {
      panel.style.transform = '';
    }
  };
  panel.addEventListener('touchend', end, { passive: false });
  panel.addEventListener('touchcancel', end, { passive: false });
}
