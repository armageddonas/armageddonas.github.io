// Atwaira main page: the floating back-to-top button, shown once the visitor has scrolled down a little.
(function () {
  'use strict';
  document.documentElement.classList.add('js');
  var btn = document.querySelector('.back-top');
  if (!btn) return;
  var update = function () {
    // After 400px, or halfway down on shorter pages.
    var max = document.documentElement.scrollHeight - window.innerHeight;
    btn.classList.toggle('on', max > 0 && window.scrollY > Math.min(400, max / 2));
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0 });
    if (location.hash) history.replaceState(null, '', location.pathname + location.search);
    var brand = document.querySelector('.brand');
    if (brand) brand.focus({ preventScroll: true });
  });
})();
