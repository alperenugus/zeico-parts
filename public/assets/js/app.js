(function () {
  'use strict';

  var WA = '905379590410';
  var MAIL = 'sinan@zeicoparts.com';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

  /* ---------- Language ---------- */
  // BASE: path the site is served from ('/' on Cloudflare, '/zeico-parts/' on GitHub Pages).
  // API: origin of the inventory API ('' when served by Cloudflare itself).
  var BASE = window.ZEICO_BASE || '/';
  var API = window.ZEICO_API || '';
  var params = new URLSearchParams(location.search);
  var LANG = location.pathname.indexOf(BASE + 'en/') === 0 || location.pathname === BASE + 'en' || params.get('lang') === 'en' ? 'en' : 'tr';
  var t = function (k, n) { var s = T[LANG][k] || k; return n != null ? s.replace('{n}', n) : s; };
  var L = function (o) { return o && typeof o === 'object' ? (o[LANG] || o.tr) : o; };

  function applyLang() {
    document.documentElement.lang = LANG;
    document.title = t('title');
    var md = $('meta[name="description"]'); if (md) md.content = t('desc');
    var can = $('link[rel="canonical"]'); if (can) can.href = 'https://www.zeicoparts.com/' + (LANG === 'en' ? 'en/' : '');
    $$('.lang__btn').forEach(function (b) { b.classList.toggle('is-active', b.dataset.lang === LANG); b.setAttribute('aria-pressed', b.dataset.lang === LANG); });
    if (LANG === 'tr') return;
    $$('[data-i18n]').forEach(function (el) { var v = EN[el.dataset.i18n]; if (v != null) el.textContent = v; });
    $$('[data-i18n-html]').forEach(function (el) { var v = EN[el.dataset.i18nHtml]; if (v != null) el.innerHTML = v; });
    $$('[data-i18n-ph]').forEach(function (el) { var v = EN[el.dataset.i18nPh]; if (v != null) el.placeholder = v; });
    $$('[data-i18n-aria]').forEach(function (el) { var v = EN[el.dataset.i18nAria]; if (v != null) el.setAttribute('aria-label', v); });
    $$('[data-i18n-alt]').forEach(function (el) { var v = EN[el.dataset.i18nAlt]; if (v != null) el.alt = v; });
  }

  $$('.lang__btn').forEach(function (b) {
    b.addEventListener('click', function () {
      if (b.dataset.lang === LANG) return;
      var onHttp = location.protocol.indexOf('http') === 0;
      if (onHttp && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
        location.href = BASE + (b.dataset.lang === 'en' ? 'en/' : '') + location.hash;
      } else {
        var p = new URLSearchParams(location.search);
        if (b.dataset.lang === 'en') p.set('lang', 'en'); else p.delete('lang');
        var q = p.toString();
        location.href = location.pathname.replace(new RegExp('^' + BASE + 'en/?'), BASE) + (q ? '?' + q : '') + location.hash;
      }
    });
  });

  /* ---------- Theme ---------- */
  $('#themeToggle').addEventListener('click', function () {
    var root = document.documentElement;
    var dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = dark ? 'light' : 'dark';
    try { localStorage.setItem('zeico-theme', root.dataset.theme); } catch (e) {}
  });

  /* ---------- Toast ---------- */
  var toastTimer;
  function toast(msg) {
    var el = $('#toast'); el.textContent = msg; el.classList.add('is-show');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { el.classList.remove('is-show'); }, 2600);
  }

  /* ---------- Header / nav ---------- */
  var header = $('#header');
  var toTop = $('#toTop');
  function onScroll() {
    var y = scrollY;
    header.classList.toggle('is-scrolled', y > 40);
    toTop.classList.toggle('is-show', y > 800);
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  toTop.addEventListener('click', function () { scrollTo({ top: 0, behavior: 'smooth' }); });

  var burger = $('#burger'), nav = $('#nav');
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', open);
    document.body.classList.toggle('no-scroll', open);
  });
  $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { nav.classList.remove('is-open'); burger.setAttribute('aria-expanded', false); document.body.classList.remove('no-scroll'); }); });

  var sections = $$('main section[id]');
  var navLinks = $$('a', nav);
  if ('IntersectionObserver' in window) {
    var secObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) navLinks.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { secObs.observe(s); });
  }

  var searchbar = $('#searchbar');
  $('#searchToggle').addEventListener('click', function () {
    searchbar.hidden = !searchbar.hidden;
    if (!searchbar.hidden) $('input', searchbar).focus();
  });
  function goSearch(q) {
    state.q = q.trim(); state.cat = 'all'; state.brand = 'all';
    $('#shopQ').value = state.q; $('#brandFilter').value = 'all';
    renderChips(); renderGrid();
    $('#shop').scrollIntoView({ behavior: 'smooth' });
    searchbar.hidden = true;
  }
  $('#headerSearch').addEventListener('submit', function (e) { e.preventDefault(); goSearch(this.q.value); });
  $('#heroSearch').addEventListener('submit', function (e) { e.preventDefault(); goSearch(this.q.value); });

  /* ---------- Hero slider ---------- */
  (function () {
    var slides = $$('.hero__slide'), dotsWrap = $('.hero__dots'), i = 0, timer;
    var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    slides.forEach(function (_, k) {
      var d = document.createElement('button');
      d.type = 'button'; d.className = 'hero__dot'; d.setAttribute('aria-label', t('slide') + ' ' + (k + 1));
      d.addEventListener('click', function () { go(k); restart(); });
      dotsWrap.appendChild(d);
    });
    var dots = $$('.hero__dot', dotsWrap);
    function go(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle('is-active', k === i); s.setAttribute('aria-hidden', k !== i); });
      dots.forEach(function (d, k) { d.classList.toggle('is-active', k === i); });
    }
    function restart() { clearInterval(timer); if (!reduce) timer = setInterval(function () { go(i + 1); }, 6500); }
    $$('.hero__arrow').forEach(function (b) { b.addEventListener('click', function () { go(i + +b.dataset.dir); restart(); }); });
    var hero = $('.hero');
    hero.addEventListener('mouseenter', function () { clearInterval(timer); });
    hero.addEventListener('mouseleave', restart);
    var sx = null;
    hero.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    hero.addEventListener('touchend', function (e) {
      if (sx == null) return; var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) { go(i + (dx < 0 ? 1 : -1)); restart(); } sx = null;
    });
    go(0); restart();
  })();

  /* ---------- Formatting ---------- */
  var fmt = new Intl.NumberFormat(LANG === 'tr' ? 'tr-TR' : 'en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
  var money = function (n) { return fmt.format(n); };
  var byId = {}; PRODUCTS.forEach(function (p) { byId[p.id] = p; });
  var catName = function (id) { var c = CATEGORIES.filter(function (c) { return c.id === id; })[0]; return c ? c[LANG] : id; };
  var stockLabel = { 'in': 'inStock', low: 'lowStock', order: 'onOrder' };

  /* ---------- Categories ---------- */
  function renderCategories() {
    $('#catGrid').innerHTML = CATEGORIES.map(function (c) {
      var n = PRODUCTS.filter(function (p) { return p.cat === c.id; }).length;
      return '<a class="cat reveal" href="#shop" data-cat="' + c.id + '">' +
        '<div class="cat__media"><img src="' + c.img + '" alt="' + esc(c[LANG]) + '" loading="lazy"></div>' +
        '<div class="cat__body"><h3>' + esc(c[LANG]) + '</h3><p>' + esc(LANG === 'tr' ? c.dtr : c.den) + '</p>' +
        '<span class="cat__count">' + t('count', n) + ' <svg class="i"><use href="#i-right"/></svg></span></div></a>';
    }).join('');
    $$('#catGrid .cat').forEach(function (a) {
      a.addEventListener('click', function () { state.cat = a.dataset.cat; renderChips(); renderGrid(); });
    });
    $('#footCats').innerHTML = CATEGORIES.map(function (c) {
      return '<li><a href="#shop" data-cat="' + c.id + '">' + esc(c[LANG]) + '</a></li>';
    }).join('');
    $$('#footCats a').forEach(function (a) { a.addEventListener('click', function () { state.cat = a.dataset.cat; renderChips(); renderGrid(); }); });
  }

  /* ---------- Product card ---------- */
  function card(p, extra) {
    var tag = p.tag ? '<span class="badge badge--' + p.tag + '">' + esc(L(TAGS[p.tag])) + '</span>' : '';
    var off = p.oldPrice && p.price ? '<span class="badge badge--sale">-' + Math.round((1 - p.price / p.oldPrice) * 100) + '%</span>' : '';
    var price = p.price != null
      ? '<span class="price">' + money(p.price) + (p.oldPrice ? ' <s>' + money(p.oldPrice) + '</s>' : '') + '</span>'
      : '<span class="price price--ask">' + t('ask') + '</span>';
    var btn = p.price != null
      ? '<button class="btn btn--primary btn--sm" type="button" data-add="' + p.id + '"><svg class="i"><use href="#i-plus"/></svg>' + t('add') + '</button>'
      : '<a class="btn btn--wa btn--sm" target="_blank" rel="noopener" href="' + waLink(t('hello') + t('waProduct') + p.brand + ' ' + p.pn + ' – ' + p[LANG].name) + '"><svg class="i"><use href="#i-wa"/></svg>' + t('waAsk') + '</a>';
    return '<article class="product ' + (extra || '') + '">' +
      '<button class="product__media" type="button" data-view="' + p.id + '" aria-label="' + esc(t('view') + ': ' + p[LANG].name) + '">' +
        '<img src="' + p.img[0] + '" alt="' + esc(p[LANG].name) + '" loading="lazy">' +
        '<span class="product__badges">' + tag + off + '</span>' +
        '<span class="product__quick"><svg class="i"><use href="#i-eye"/></svg>' + t('view') + '</span>' +
      '</button>' +
      '<div class="product__body">' +
        '<div class="product__meta"><span class="product__brand">' + esc(p.brand) + '</span><span class="stock stock--' + p.stock + '">' + t(stockLabel[p.stock]) + '</span></div>' +
        '<h3 class="product__name"><button type="button" data-view="' + p.id + '">' + esc(p[LANG].name) + '</button></h3>' +
        '<p class="product__pn">' + t('sku') + ': <code>' + esc(p.pn) + '</code></p>' +
        '<div class="product__foot">' + price + btn + '</div>' +
      '</div></article>';
  }

  /* ---------- Featured carousel ---------- */
  function renderFeatured() {
    var track = $('#featTrack');
    track.innerHTML = PRODUCTS.filter(function (p) { return p.featured; }).map(function (p) { return card(p, 'carousel__item'); }).join('');
  }
  $$('[data-carousel]').forEach(function (b) {
    b.addEventListener('click', function () {
      var tr = document.getElementById(b.dataset.carousel);
      var item = tr.firstElementChild; if (!item) return;
      tr.scrollBy({ left: (+b.dataset.dir) * (item.offsetWidth + 20) * 2, behavior: 'smooth' });
    });
  });

  /* ---------- Shop ---------- */
  var state = { cat: 'all', brand: 'all', q: '', sort: 'pop' };
  function renderChips() {
    var cats = [{ id: 'all' }].concat(CATEGORIES);
    $('#catChips').innerHTML = cats.map(function (c) {
      var n = c.id === 'all' ? PRODUCTS.length : PRODUCTS.filter(function (p) { return p.cat === c.id; }).length;
      var on = state.cat === c.id;
      return '<button type="button" role="tab" aria-selected="' + on + '" class="chip' + (on ? ' is-active' : '') + '" data-chip="' + c.id + '">' +
        esc(c.id === 'all' ? t('all') : c[LANG]) + '<span>' + n + '</span></button>';
    }).join('');
    $$('#catChips .chip').forEach(function (b) { b.addEventListener('click', function () { state.cat = b.dataset.chip; renderChips(); renderGrid(); }); });
  }
  function renderBrands() {
    var brands = PRODUCTS.map(function (p) { return p.brand; }).filter(function (b, i, a) { return a.indexOf(b) === i; }).sort();
    $('#brandFilter').innerHTML = '<option value="all">' + t('allBrands') + '</option>' + brands.map(function (b) { return '<option>' + esc(b) + '</option>'; }).join('');
  }
  var norm = function (s) { return String(s).toLocaleLowerCase(LANG).replace(/[\s\-.]/g, ''); };
  function filtered() {
    var q = norm(state.q);
    var list = PRODUCTS.filter(function (p) {
      if (state.cat !== 'all' && p.cat !== state.cat) return false;
      if (state.brand !== 'all' && p.brand !== state.brand) return false;
      if (q) {
        var hay = norm([p.pn, p.brand, p.tr.name, p.en.name, p.tr.desc, p.en.desc, catName(p.cat)].join(' '));
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });
    var pv = function (p) { return p.price == null ? Infinity : p.price; };
    if (state.sort === 'asc') list.sort(function (a, b) { return pv(a) - pv(b); });
    if (state.sort === 'desc') list.sort(function (a, b) { return (b.price || 0) - (a.price || 0); });
    if (state.sort === 'name') list.sort(function (a, b) { return a[LANG].name.localeCompare(b[LANG].name, LANG); });
    return list;
  }
  function renderGrid() {
    var list = filtered();
    $('#productGrid').innerHTML = list.map(function (p) { return card(p, 'reveal'); }).join('');
    $('#resultCount').textContent = t('results', list.length);
    $('#emptyState').hidden = list.length > 0;
    $('#clearFilters').hidden = state.cat === 'all' && state.brand === 'all' && !state.q;
    if (!list.length) $('#emptyWa').href = waLink(t('hello') + (state.q ? t('waProduct') + state.q : ''));
    observeReveal();
  }
  var qTimer;
  $('#shopQ').addEventListener('input', function () { var v = this.value; clearTimeout(qTimer); qTimer = setTimeout(function () { state.q = v; renderGrid(); }, 150); });
  $('#brandFilter').addEventListener('change', function () { state.brand = this.value; renderGrid(); });
  $('#sortSel').addEventListener('change', function () { state.sort = this.value; renderGrid(); });
  $('#clearFilters').addEventListener('click', function () {
    state = { cat: 'all', brand: 'all', q: '', sort: state.sort };
    $('#shopQ').value = ''; $('#brandFilter').value = 'all'; renderChips(); renderGrid();
  });

  /* ---------- Delegated product actions ---------- */
  document.addEventListener('click', function (e) {
    var add = e.target.closest('[data-add]');
    if (add) { addToCart(add.dataset.add, 1); return; }
    var view = e.target.closest('[data-view]');
    if (view) openProduct(view.dataset.view);
  });

  /* ---------- Modals ---------- */
  function openDialog(d) { if (typeof d.showModal === 'function') d.showModal(); else d.setAttribute('open', ''); document.body.classList.add('no-scroll'); }
  function closeDialog(d) { if (typeof d.close === 'function') d.close(); else d.removeAttribute('open'); }
  $$('dialog').forEach(function (d) {
    d.addEventListener('close', function () {
      if (!$$('dialog').some(function (x) { return x.open; }) && !drawerOpen) document.body.classList.remove('no-scroll');
      if (d.id === 'productModal' && /^#p=/.test(location.hash)) history.replaceState(null, '', location.pathname + location.search);
    });
    d.addEventListener('click', function (e) { if (e.target === d || e.target.closest('[data-close]')) closeDialog(d); });
  });

  function openProduct(id) {
    var p = byId[id]; if (!p) return;
    var specs = [['brand', p.brand], ['sku', p.pn], ['category', catName(p.cat)]].map(function (r) { return [t(r[0]), r[1]]; })
      .concat((p.specs || []).map(function (s) { return [SPEC_LABELS[LANG][s[0]] || s[0], L(s[1])]; }));
    var thumbs = p.img.length > 1 ? '<div class="pd__thumbs">' + p.img.map(function (src, k) {
      return '<button type="button" class="pd__thumb' + (k ? '' : ' is-active') + '" data-src="' + src + '"><img src="' + src + '" alt=""></button>';
    }).join('') + '</div>' : '';
    var priceHtml = p.price != null
      ? '<div class="pd__price"><strong>' + money(p.price) + '</strong>' + (p.oldPrice ? '<s>' + money(p.oldPrice) + '</s>' : '') + '<small>' + t('exVat') + '</small></div>'
      : '<div class="pd__price"><strong class="price--ask">' + t('ask') + '</strong></div>';
    var buy = p.price != null
      ? '<div class="pd__buy"><div class="qty"><button type="button" data-q="-1" aria-label="-"><svg class="i"><use href="#i-minus"/></svg></button><input type="number" min="1" value="1" id="pdQty" aria-label="' + t('qty') + '"><button type="button" data-q="1" aria-label="+"><svg class="i"><use href="#i-plus"/></svg></button></div>' +
        '<button class="btn btn--accent btn--lg" type="button" id="pdAdd"><svg class="i"><use href="#i-cart"/></svg>' + t('add') + '</button></div>'
      : '';
    $('#productBody').innerHTML =
      '<div class="pd">' +
        '<div class="pd__gallery"><div class="pd__main"><img id="pdMain" src="' + p.img[0] + '" alt="' + esc(p[LANG].name) + '"></div>' + thumbs + '</div>' +
        '<div class="pd__info">' +
          '<div class="product__meta"><span class="product__brand">' + esc(p.brand) + '</span><span class="stock stock--' + p.stock + '">' + t(stockLabel[p.stock]) + '</span></div>' +
          '<h2>' + esc(p[LANG].name) + '</h2>' +
          '<p class="product__pn">' + t('sku') + ': <code>' + esc(p.pn) + '</code></p>' +
          priceHtml +
          '<p class="pd__desc">' + esc(p[LANG].desc) + '</p>' +
          buy +
          '<div class="pd__links"><a class="btn btn--wa" target="_blank" rel="noopener" href="' + waLink(t('hello') + t('waProduct') + p.brand + ' ' + p.pn + ' – ' + p[LANG].name) + '"><svg class="i"><use href="#i-wa"/></svg>' + t('waAsk') + '</a>' +
          '<button class="btn btn--outline" type="button" id="pdShare">' + t('share') + '</button></div>' +
          '<h3 class="pd__h">' + t('specs') + '</h3>' +
          '<table class="specs">' + specs.map(function (r) { return '<tr><th>' + esc(r[0]) + '</th><td>' + esc(r[1]) + '</td></tr>'; }).join('') + '</table>' +
        '</div>' +
      '</div>';
    var body = $('#productBody');
    $$('.pd__thumb', body).forEach(function (b) {
      b.addEventListener('click', function () {
        $('#pdMain').src = b.dataset.src;
        $$('.pd__thumb', body).forEach(function (x) { x.classList.toggle('is-active', x === b); });
      });
    });
    $$('[data-q]', body).forEach(function (b) {
      b.addEventListener('click', function () { var q = $('#pdQty'); q.value = Math.max(1, (+q.value || 1) + +b.dataset.q); });
    });
    var addBtn = $('#pdAdd');
    if (addBtn) addBtn.addEventListener('click', function () { addToCart(p.id, Math.max(1, +$('#pdQty').value || 1)); closeDialog($('#productModal')); });
    $('#pdShare').addEventListener('click', function () {
      var url = location.origin + location.pathname + location.search + '#p=' + p.id;
      if (navigator.clipboard) navigator.clipboard.writeText(url).then(function () { toast(t('copied')); });
    });
    history.replaceState(null, '', '#p=' + p.id);
    openDialog($('#productModal'));
  }

  /* ---------- Cart ---------- */
  var cart = store.get('zeico-cart', {});
  var drawer = $('#cartDrawer'), overlay = $('#overlay'), drawerOpen = false;
  function saveCart() { store.set('zeico-cart', cart); renderCart(); }
  function addToCart(id, q) {
    cart[id] = (cart[id] || 0) + q; saveCart(); toast(t('added') + ' ✓');
    var c = $('#cartCount'); c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump');
  }
  function cartLines() { return Object.keys(cart).map(function (id) { return { p: byId[id], q: cart[id] }; }); }
  function subtotal() { return cartLines().reduce(function (s, l) { return s + l.p.price * l.q; }, 0); }
  function renderCart() {
    var lines = cartLines();
    var count = lines.reduce(function (s, l) { return s + l.q; }, 0);
    $('#cartCount').textContent = count;
    $('#cartCount').classList.toggle('is-zero', !count);
    $('#cartFoot').hidden = !lines.length;
    $('#cartSubtotal').textContent = money(subtotal());
    $('#cartItems').innerHTML = lines.length ? lines.map(function (l) {
      return '<div class="cline"><img src="' + l.p.img[0] + '" alt="">' +
        '<div class="cline__info"><strong>' + esc(l.p[LANG].name) + '</strong><span>' + esc(l.p.brand) + ' · ' + esc(l.p.pn) + '</span>' +
        '<div class="cline__row"><div class="qty qty--sm"><button type="button" data-cq="-1" data-id="' + l.p.id + '" aria-label="-"><svg class="i"><use href="#i-minus"/></svg></button><span>' + l.q + '</span><button type="button" data-cq="1" data-id="' + l.p.id + '" aria-label="+"><svg class="i"><use href="#i-plus"/></svg></button></div>' +
        '<strong>' + money(l.p.price * l.q) + '</strong></div></div>' +
        '<button class="icon-btn cline__rm" type="button" data-rm="' + l.p.id + '" aria-label="' + t('remove') + '"><svg class="i"><use href="#i-trash"/></svg></button></div>';
    }).join('') : '<div class="cart-empty"><svg class="i"><use href="#i-cart"/></svg><h4>' + t('cartEmpty') + '</h4><p>' + t('cartEmptyD') + '</p><a href="#shop" class="btn btn--primary" data-close>' + t('browse') + '</a></div>';
  }
  $('#cartItems').addEventListener('click', function (e) {
    var b = e.target.closest('[data-cq]');
    if (b) { var id = b.dataset.id; cart[id] = cart[id] + +b.dataset.cq; if (cart[id] < 1) delete cart[id]; saveCart(); return; }
    var r = e.target.closest('[data-rm]');
    if (r) { delete cart[r.dataset.rm]; saveCart(); return; }
    if (e.target.closest('[data-close]')) toggleDrawer(false);
  });
  function toggleDrawer(open) {
    drawerOpen = open;
    drawer.classList.toggle('is-open', open); drawer.setAttribute('aria-hidden', !open);
    overlay.hidden = !open; document.body.classList.toggle('no-scroll', open);
    if (open) $('[data-close]', drawer).focus();
  }
  $('#cartToggle').addEventListener('click', function () { toggleDrawer(true); });
  overlay.addEventListener('click', function () { toggleDrawer(false); });
  $('[data-close]', drawer).addEventListener('click', function () { toggleDrawer(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && drawerOpen) toggleDrawer(false); });
  $('#cartClear').addEventListener('click', function () { cart = {}; saveCart(); toast(t('cleared')); });
  $('#checkoutBtn').addEventListener('click', function () {
    var lines = cartLines(); if (!lines.length) return;
    $('#coSummary').innerHTML = '<ul>' + lines.map(function (l) { return '<li><span>' + l.q + ' × ' + esc(l.p.pn) + ' – ' + esc(l.p[LANG].name) + '</span><strong>' + money(l.p.price * l.q) + '</strong></li>'; }).join('') +
      '</ul><div class="cart-line"><span>' + t('total') + ' (' + t('exVat') + ')</span><strong>' + money(subtotal()) + '</strong></div>';
    toggleDrawer(false); openDialog($('#checkoutModal'));
  });

  /* ---------- Outbound messages ---------- */
  function waLink(text) { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(text); }
  function mailLink(subject, body) { return 'mailto:' + MAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body); }
  function validate(form) {
    var ok = true;
    $$('[required]', form).forEach(function (f) {
      var bad = !f.value.trim() || (f.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.value));
      f.classList.toggle('is-invalid', bad); if (bad && ok) { f.focus(); ok = false; }
    });
    if (!ok) toast(t('required'));
    return ok;
  }
  function send(via, subject, body) {
    if (via === 'wa') { toast(t('waOpened')); window.open(waLink(subject + '\n\n' + body), '_blank', 'noopener'); }
    else { toast(t('mailOpened')); location.href = mailLink(subject, body); }
  }
  function fields(form, map) {
    return map.filter(function (m) { return form[m[0]] && form[m[0]].value.trim(); })
      .map(function (m) { return t(m[1]) + ': ' + form[m[0]].value.trim(); }).join('\n');
  }

  $('#checkoutForm').addEventListener('submit', function (e) {
    e.preventDefault(); if (!validate(this)) return;
    var via = e.submitter ? e.submitter.value : 'mail';
    var items = cartLines().map(function (l) { return '• ' + l.q + ' × ' + l.p.brand + ' ' + l.p.pn + ' – ' + l.p[LANG].name + ' (' + money(l.p.price * l.q) + ')'; }).join('\n');
    var body = fields(this, [['name', 'lblName'], ['company', 'lblCompany'], ['email', 'lblEmail'], ['phone', 'lblPhone'], ['address', 'lblAddress'], ['note', 'lblNote']]) +
      '\n\n' + t('lblItems') + ':\n' + items + '\n\n' + t('total') + ' (' + t('exVat') + '): ' + money(subtotal());
    send(via, 'Zeico – ' + t('orderSubject'), body);
  });

  $('#quoteForm').addEventListener('submit', function (e) {
    e.preventDefault(); if (!validate(this)) return;
    var via = e.submitter ? e.submitter.value : 'mail';
    var body = fields(this, [['name', 'lblName'], ['company', 'lblCompany'], ['email', 'lblEmail'], ['phone', 'lblPhone'], ['country', 'lblCountry'], ['type', 'lblType']]) +
      '\n\n' + t('lblParts') + ':\n' + this.message.value.trim();
    send(via, 'Zeico – ' + t('quoteSubject'), body);
  });

  $('#feedbackForm').addEventListener('submit', function (e) {
    e.preventDefault(); if (!validate(this)) return;
    var r = +this.querySelector('[name=rating]:checked').value;
    var body = t('lblRating') + ': ' + '★★★★★'.slice(0, r) + '☆☆☆☆☆'.slice(0, 5 - r) + ' (' + r + '/5)\n' +
      fields(this, [['name', 'lblName'], ['company', 'lblCompany']]) + '\n\n' + t('lblMsg') + ':\n' + this.message.value.trim();
    toast(t('thanks'));
    location.href = mailLink('Zeico – ' + t('fbSubject'), body);
  });

  $('#newsForm').addEventListener('submit', function (e) {
    e.preventDefault(); if (!validate(this)) return;
    location.href = mailLink('Zeico – ' + t('newsSubject'), t('lblEmail') + ': ' + this.email.value.trim());
    toast(t('subscribed')); this.reset();
  });

  $$('.tabs__btn').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('.tabs__btn').forEach(function (x) { var on = x === b; x.classList.toggle('is-active', on); x.setAttribute('aria-selected', on); $('#' + x.dataset.tab).hidden = !on; });
    });
  });

  /* ---------- Reviews slider ---------- */
  (function () {
    var track = $('#reviewTrack'), dotsWrap = $('#revDots'), i = 0, timer;
    track.innerHTML = REVIEWS.map(function (r) {
      return '<figure class="review"><svg class="i review__q"><use href="#i-quote"/></svg>' +
        '<div class="review__stars" aria-label="' + r.rating + '/5">' + '★★★★★'.slice(0, r.rating) + '<span>' + '★★★★★'.slice(0, 5 - r.rating) + '</span></div>' +
        '<blockquote>' + esc(r[LANG]) + '</blockquote>' +
        '<figcaption><span class="review__avatar">' + esc(r.name.replace(/[^A-ZÇĞİÖŞÜ]/g, '').slice(0, 2)) + '</span><div><strong>' + esc(r.name) + '</strong><span>' + esc(L(r.role)) + '</span></div></figcaption></figure>';
    }).join('');
    var perView = function () { return innerWidth >= 1024 ? 3 : innerWidth >= 680 ? 2 : 1; };
    var pages = function () { return Math.max(1, REVIEWS.length - perView() + 1); };
    function dots() {
      dotsWrap.innerHTML = '';
      for (var k = 0; k < pages(); k++) {
        var d = document.createElement('button'); d.type = 'button'; d.setAttribute('aria-label', t('slide') + ' ' + (k + 1));
        d.addEventListener('click', go.bind(null, k)); dotsWrap.appendChild(d);
      }
    }
    function go(n) {
      i = (n + pages()) % pages();
      var item = track.firstElementChild;
      track.style.transform = 'translateX(' + (-i * (item.offsetWidth + 24)) + 'px)';
      $$('button', dotsWrap).forEach(function (d, k) { d.classList.toggle('is-active', k === i); });
    }
    $('#revPrev').addEventListener('click', function () { go(i - 1); });
    $('#revNext').addEventListener('click', function () { go(i + 1); });
    addEventListener('resize', function () { dots(); go(Math.min(i, pages() - 1)); });
    dots(); go(0);
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      timer = setInterval(function () { go(i + 1); }, 7000);
      track.parentNode.addEventListener('mouseenter', function () { clearInterval(timer); });
    }
  })();

  /* ---------- Gallery lightbox ---------- */
  (function () {
    var items = $$('.gallery__item'), lb = $('#lightbox'), img = $('#lightboxImg'), i = 0;
    function show(n) { i = (n + items.length) % items.length; img.src = items[i].dataset.src; img.alt = $('img', items[i]).alt; }
    items.forEach(function (it, k) { it.addEventListener('click', function () { show(k); openDialog(lb); }); });
    $$('.lightbox__nav', lb).forEach(function (b) { b.addEventListener('click', function (e) { e.stopPropagation(); show(i + +b.dataset.dir); }); });
    lb.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') show(i + 1); if (e.key === 'ArrowLeft') show(i - 1); });
    img.addEventListener('click', function (e) { e.stopPropagation(); });
  })();

  /* ---------- Reveal + counters ---------- */
  var revObs = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); revObs.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px' }) : null;
  function observeReveal() {
    $$('.reveal:not(.is-in)').forEach(function (el) { if (revObs) revObs.observe(el); else el.classList.add('is-in'); });
  }
  (function () {
    var nums = $$('[data-count]');
    var run = function (el) {
      var end = +el.dataset.count, suf = LANG === 'en' && el.dataset.suffix === 's' ? 'h' : el.dataset.suffix, t0 = null;
      var f = new Intl.NumberFormat(LANG === 'tr' ? 'tr-TR' : 'en-US');
      function step(ts) {
        if (!t0) t0 = ts; var k = Math.min(1, (ts - t0) / 1400);
        el.textContent = f.format(Math.round(end * (1 - Math.pow(1 - k, 3)))) + suf;
        if (k < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    };
    if (!('IntersectionObserver' in window)) return nums.forEach(run);
    var o = new IntersectionObserver(function (en) { en.forEach(function (e) { if (e.isIntersecting) { run(e.target); o.unobserve(e.target); } }); });
    nums.forEach(function (n) { o.observe(n); });
  })();

  /* ---------- Init ---------- */
  applyLang();
  $('#year').textContent = new Date().getFullYear();
  $$('.section__head, .usp__item, .plan, .step, .about__text, .about__media, .faq details, .scard').forEach(function (el) { el.classList.add('reveal'); });
  observeReveal();

  // Live prices, stock status and photos from the admin panel override products.js.
  // Falls back to the built-in data if the API is unavailable or slow.
  function applyInventory(inv) {
    Object.keys(inv || {}).forEach(function (id) {
      var p = byId[id], o = inv[id]; if (!p) return;
      if ('price' in o) { p.price = o.price; p.oldPrice = o.oldPrice; }
      if (o.stock) p.stock = o.stock;
      if (o.images && o.images.length) p.img = o.images.map(function (u) { return u.indexOf('/api/') === 0 ? API + u : u; });
    });
  }
  function start() {
    Object.keys(cart).forEach(function (id) { if (!byId[id] || byId[id].price == null) delete cart[id]; });
    renderCategories(); renderFeatured(); renderChips(); renderBrands(); renderGrid(); renderCart();
    var m = location.hash.match(/^#p=(.+)$/);
    if (m && byId[m[1]]) openProduct(m[1]);
  }
  var started = false;
  var once = function () { if (!started) { started = true; start(); } };
  setTimeout(once, 2500);
  if (window.fetch && location.protocol.indexOf('http') === 0) {
    fetch(API + '/api/inventory').then(function (r) { return r.ok ? r.json() : {}; })
      .then(function (inv) { if (!started) applyInventory(inv); }).catch(function () {}).then(once);
  } else once();
})();
