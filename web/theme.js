/**
 * Tema: automată, luminoasă sau întunecată.
 *
 * Fișier clasic, nu modul, încărcat în <head> înaintea foii de stil: un modul
 * rulează după prima pictare, iar cine a ales tema întunecată ar vedea mai
 * întâi un ecran alb. Tot de aceea nu e un script în linie -- politica de
 * securitate din aplicația Android nu le permite.
 *
 * „Automat" nu pune nimic pe <html> și lasă media query-ul din app.css să
 * urmeze telefonul. Alegerea se ține în localStorage, ca limba: e o preferință
 * a ecranului acesta, nu o dată din jurnal, și nu intră în export.
 */
(function () {
  var KEY = 'miscare-theme';
  var root = document.documentElement;
  var dark = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function saved() {
    try {
      var value = localStorage.getItem(KEY);
      return value === 'light' || value === 'dark' ? value : 'auto';
    } catch (e) {
      return 'auto';
    }
  }

  function isDark(choice) {
    return choice === 'dark' || (choice === 'auto' && Boolean(dark && dark.matches));
  }

  /**
   * Bara de stare și bara de navigare ale telefonului.
   *
   * Pe Android nu le colorează pagina: le colorează aplicația. Fără asta, în
   * tema întunecată ceasul și pictogramele rămâneau închise la culoare peste
   * un antet închis la culoare -- adică invizibile.
   */
  function syncSystemBars(choice) {
    var surface = getComputedStyle(root).getPropertyValue('--surface').trim();
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta && surface) meta.setAttribute('content', surface);
    var native = window.MiscareNative;
    if (native && native.systemBars) {
      native.systemBars(isDark(choice), surface).catch(function () {});
    }
  }

  function apply(choice) {
    if (choice === 'light' || choice === 'dark') root.setAttribute('data-theme', choice);
    else root.removeAttribute('data-theme');
    syncSystemBars(choice);
  }

  window.MiscareTheme = {
    get: saved,
    set: function (choice) {
      try {
        if (choice === 'light' || choice === 'dark') localStorage.setItem(KEY, choice);
        else localStorage.removeItem(KEY);
      } catch (e) { /* fără stocare, alegerea ține până la închidere */ }
      apply(choice);
    },
    // Apelat de app.js după ce puntea nativă e gata.
    sync: function () { syncSystemBars(saved()); }
  };

  apply(saved());
  if (dark && dark.addEventListener) {
    dark.addEventListener('change', function () {
      if (saved() === 'auto') syncSystemBars('auto');
    });
  }
}());
