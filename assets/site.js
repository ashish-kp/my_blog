/* Load this in <head> without defer, so the saved theme is applied before the page paints. */
(function () {
  var root = document.documentElement;

  try {
    var saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);
  } catch (e) {}

  document.addEventListener('DOMContentLoaded', function () {
    /* ---------- Light / Dark switch ---------- */
    var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-theme-choice]'));
    var media = window.matchMedia('(prefers-color-scheme: dark)');

    function current() {
      return root.getAttribute('data-theme') || (media.matches ? 'dark' : 'light');
    }
    function sync() {
      var now = current();
      buttons.forEach(function (b) {
        b.setAttribute('aria-pressed', String(b.getAttribute('data-theme-choice') === now));
      });
    }
    buttons.forEach(function (b) {
      b.addEventListener('click', function () {
        var choice = b.getAttribute('data-theme-choice');
        root.setAttribute('data-theme', choice);
        try { localStorage.setItem('theme', choice); } catch (e) {}
        sync();
      });
    });
    if (media.addEventListener) media.addEventListener('change', sync);
    sync();

    /* ---------- Highlight the section in view (pages with a side menu) ---------- */
    var links = Array.prototype.slice.call(document.querySelectorAll('.side .nav a'));
    if (!links.length || !('IntersectionObserver' in window)) return;

    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) { a.removeAttribute('aria-current'); });
        var active = byId[entry.target.id];
        if (active) active.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-25% 0px -65% 0px' });

    document.querySelectorAll('main section[id]').forEach(function (s) { observer.observe(s); });
  });
})();
