(function () {
  var btn = document.querySelector('.menu-btn');
  var panel = document.getElementById('mobile-nav');
  if (btn && panel) {
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      panel.hidden = open;
    });
  }
  var form = document.querySelector('[data-contact-form]');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var s = form.querySelector('.status');
      if (s) { s.hidden = false; }
    });
  }
})();

/* Seitenwechsel: immer oben starten, außer ein Abschnitt (#wingwave usw.) ist gewählt */
(function () {
  try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; } catch (e) {}
  function place() {
    var id = decodeURIComponent(location.hash.slice(1));
    var el = id && document.getElementById(id);
    if (el) { el.scrollIntoView({ behavior: 'instant', block: 'start' }); }
    else { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }
  }
  place();
  window.addEventListener('load', place);
  window.addEventListener('pageshow', function (e) { if (e.persisted) place(); });
})();

/* ---------- Text- und Reveal-Animationen ---------- */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;
  var root = document.documentElement;
  root.classList.add('anim');

  // Headlines Wort für Wort
  function splitWords(el, counter) {
    Array.prototype.slice.call(el.childNodes).forEach(function (n) {
      if (n.nodeType === 3) {
        var parts = n.textContent.split(/(\s+)/);
        var frag = document.createDocumentFragment();
        parts.forEach(function (t) {
          if (!t) return;
          if (/^\s+$/.test(t)) { frag.appendChild(document.createTextNode(' ')); return; }
          var w = document.createElement('span'); w.className = 'w';
          var i = document.createElement('span'); i.textContent = t;
          i.style.setProperty('--wi', counter.n++);
          w.appendChild(i); frag.appendChild(w);
        });
        n.parentNode.replaceChild(frag, n);
      } else if (n.nodeType === 1 && n.tagName !== 'BR') {
        splitWords(n, counter);
      }
    });
  }
  document.querySelectorAll('main h1, main h2').forEach(function (h) {
    splitWords(h, { n: 0 });
    h.setAttribute('data-r', 'words');
  });

  // Blöcke, die weich einblenden
  var sel = [
    '.hero .kicker', '.hero .lines li', '.hero .actions',
    '.page-hero p', '.factors .lead', '.constellation', '.constellation .chip',
    '.split .media', '.split .body > p', '.split .body > .btn',
    '.offers-intro > p', '.card', '.detail .media', '.detail .body > :not(h2)',
    '.price', '.price-note', '.placeholder', '.way', '.form', '.map', '.location .info > :not(h2)',
    '.cta p', '.cta .btn', '.site-footer .top > *'
  ].join(',');
  document.querySelectorAll(sel).forEach(function (el) {
    if (!el.hasAttribute('data-r')) el.setAttribute('data-r', 'fx');
  });
  // Staffelung innerhalb einer Gruppe
  var groups = new Map();
  document.querySelectorAll('[data-r="fx"]').forEach(function (el) {
    var k = el.parentNode, n = groups.get(k) || 0;
    el.style.setProperty('--dl', Math.min(n, 9) * 0.09 + 's');
    groups.set(k, n + 1);
  });

  function show(el) {
    el.classList.add('is-in');
    // danach eigene Hover-Übergänge wieder freigeben
    setTimeout(function () { el.removeAttribute('data-r'); el.classList.remove('is-in'); }, 2200);
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { show(e.target); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      document.querySelectorAll('[data-r]').forEach(function (el) {
        if (el.closest('.hero, .page-hero')) show(el); else io.observe(el);
      });
    });
  });
})();
