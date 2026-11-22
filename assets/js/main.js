(function () {
  // Header shrinks after scrolling
  var header = document.getElementById('site-header');
  var onScroll = function () {
    if (header) header.classList.toggle('is-compact', window.scrollY > 80);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.textContent = open ? 'Close' : 'Menu';
    });
  }

  // Mark current section in nav
  var path = location.pathname;
  document.querySelectorAll('.site-nav a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href && href !== '/' && path.indexOf(href.replace(/index\.html$/, '')) !== -1) {
      a.setAttribute('aria-current', 'page');
    }
  });

  // Category filter (Stories page)
  var filters = document.querySelectorAll('.filter');
  if (filters.length) {
    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var f = btn.getAttribute('data-filter');
        filters.forEach(function (b) { b.classList.toggle('is-active', b === btn); });
        document.querySelectorAll('.filter-item').forEach(function (item) {
          item.hidden = !(f === 'all' || item.getAttribute('data-category') === f);
        });
      });
    });
  }

  // Gallery sliders
  document.querySelectorAll('.slider').forEach(function (sl) {
    var track = sl.querySelector('.slider-track');
    var step = function (dir) {
      var slide = track.querySelector('.slide');
      var w = slide ? slide.getBoundingClientRect().width + 16 : 300;
      track.scrollBy({ left: dir * w, behavior: 'smooth' });
    };
    sl.querySelector('.slider-prev').addEventListener('click', function () { step(-1); });
    sl.querySelector('.slider-next').addEventListener('click', function () { step(1); });
  });

  // Fade cards in as they scroll into view
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.card, .merch-gallery figure').forEach(function (el) {
      el.classList.add('reveal'); io.observe(el);
    });
  }

  // Lightbox for article and merch images
  var box = document.getElementById('lightbox');
  if (!box) return;
  var boxImg = box.querySelector('img');
  var count = box.querySelector('.lightbox-count');
  var list = [], idx = 0, lastFocus = null;
  function show(i) {
    idx = (i + list.length) % list.length;
    boxImg.src = list[idx].currentSrc || list[idx].src;
    boxImg.alt = list[idx].alt || '';
    count.textContent = (idx + 1) + ' / ' + list.length;
  }
  function open(imgs, i) {
    list = imgs; lastFocus = document.activeElement;
    box.hidden = false; document.body.style.overflow = 'hidden';
    show(i); box.querySelector('.lightbox-close').focus();
  }
  function close() {
    box.hidden = true; document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  document.querySelectorAll('.js-gallery').forEach(function (g) {
    var imgs = Array.prototype.slice.call(g.querySelectorAll('img'));
    imgs.forEach(function (img, i) {
      img.addEventListener('click', function () { open(imgs, i); });
    });
  });
  box.querySelector('.lightbox-close').addEventListener('click', close);
  box.querySelector('.lightbox-prev').addEventListener('click', function () { show(idx - 1); });
  box.querySelector('.lightbox-next').addEventListener('click', function () { show(idx + 1); });
  box.addEventListener('click', function (e) { if (e.target === box) close(); });
  box.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });
  // swipe on touch screens
  var sx = null;
  box.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', function (e) {
    if (sx === null) return;
    var dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 40) show(idx + (dx < 0 ? 1 : -1));
    sx = null;
  });
})();
