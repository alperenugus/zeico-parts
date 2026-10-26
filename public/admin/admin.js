(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var LOW_STOCK = 5;

  /* ---------- i18n ---------- */
  var STR = {
    tr: {
      loginTitle: 'Yönetim Paneli', loginSub: 'Stok ve fiyat yönetimi için giriş yapın.', password: 'Şifre', login: 'Giriş yap',
      backToSite: '← Siteye dön', panel: 'Stok & Fiyat', tabStock: 'Ürünler', tabLog: 'Değişiklik geçmişi', viewSite: 'Siteyi aç', logout: 'Çıkış',
      searchPh: 'Ürün adı, marka veya parça no…', stAll: 'Tüm durumlar', stIn: 'Stokta', stLow: 'Düşük stok', stOut: 'Tükendi / Siparişle', stUntracked: 'Takip edilmiyor',
      export: 'CSV indir', allCats: 'Tüm kategoriler',
      hint: 'Fiyatlar € ve KDV hariçtir. Fiyatı boş bırakırsanız sitede “Fiyat sorun” görünür. İndirimli göstermek için “Eski fiyat” alanına satış fiyatından yüksek bir değer girin. Stok 0 → Siparişle, 1–5 → Sınırlı stok.',
      colPhoto: 'Foto', colProduct: 'Ürün', colPrice: 'Fiyat (€)', colOld: 'Eski fiyat (€)', colQty: 'Stok adedi', colStatus: 'Durum', colUpdated: 'Güncelleme',
      logTime: 'Zaman', logField: 'Alan', logChange: 'Değişiklik', discard: 'Geri al', save: 'Değişiklikleri kaydet',
      photos: 'Fotoğraflar', dropTitle: 'Fotoğraf yükle', dropSub: 'Sürükleyip bırakın veya tıklayın • JPG, PNG, WebP • Otomatik olarak küçültülür',
      resetPhotos: 'Varsayılan fotoğraflara dön', photoNote: 'İlk fotoğraf ana görseldir. Değişiklikler anında yayınlanır.',
      kProducts: 'Ürün', kUnits: 'Toplam stok adedi', kLow: 'Düşük stok', kOut: 'Tükendi', kValue: 'Stok değeri',
      untracked: 'Takip yok', inStock: 'Stokta', low: 'Sınırlı', out: 'Tükendi', never: '—', ask: 'Fiyat sorun',
      changes: '{n} kaydedilmemiş değişiklik', saved: 'Kaydedildi ✓', saveFail: 'Kaydedilemedi: ', wrong: 'Şifre hatalı.',
      locked: 'Çok fazla hatalı deneme. 15 dakika sonra tekrar deneyin.', notConfigured: 'Panel yapılandırılmamış (ADMIN_PASSWORD / SESSION_SECRET / KV).',
      network: 'Bağlantı hatası.', expired: 'Oturum süresi doldu, tekrar giriş yapın.', leave: 'Kaydedilmemiş değişiklikler var.',
      main: 'Ana görsel', makeMain: 'Ana yap', remove: 'Sil', uploading: 'Yükleniyor…', uploaded: 'Fotoğraf yüklendi ✓', removed: 'Fotoğraf silindi',
      reset: 'Varsayılan fotoğraflar geri yüklendi', confirmRemove: 'Bu fotoğraf silinsin mi?', confirmReset: 'Yüklenen tüm fotoğraflar silinip varsayılanlara dönülsün mü?',
      lastPhoto: 'En az bir fotoğraf kalmalı.', badFile: 'Desteklenmeyen dosya: ', noLog: 'Henüz değişiklik yok.', photoCount: '{n} foto',
      f_price: 'Fiyat', f_oldPrice: 'Eski fiyat', f_qty: 'Stok', f_images: 'Fotoğraflar', def: 'varsayılan', moveLeft: 'Sola taşı'
    },
    en: {
      loginTitle: 'Admin Panel', loginSub: 'Sign in to manage stock and prices.', password: 'Password', login: 'Sign in',
      backToSite: '← Back to site', panel: 'Stock & Prices', tabStock: 'Products', tabLog: 'Change history', viewSite: 'Open site', logout: 'Sign out',
      searchPh: 'Product name, brand or part no…', stAll: 'All statuses', stIn: 'In stock', stLow: 'Low stock', stOut: 'Out of stock / On order', stUntracked: 'Not tracked',
      export: 'Download CSV', allCats: 'All categories',
      hint: 'Prices are in € excl. VAT. Leave the price empty to show “Ask for price” on the site. To show a discount, enter a value higher than the price in “Old price”. Stock 0 → On order, 1–5 → Limited stock.',
      colPhoto: 'Photo', colProduct: 'Product', colPrice: 'Price (€)', colOld: 'Old price (€)', colQty: 'Stock qty', colStatus: 'Status', colUpdated: 'Updated',
      logTime: 'Time', logField: 'Field', logChange: 'Change', discard: 'Discard', save: 'Save changes',
      photos: 'Photos', dropTitle: 'Upload photos', dropSub: 'Drag & drop or click • JPG, PNG, WebP • Resized automatically',
      resetPhotos: 'Restore default photos', photoNote: 'The first photo is the main image. Changes go live immediately.',
      kProducts: 'Products', kUnits: 'Total units in stock', kLow: 'Low stock', kOut: 'Out of stock', kValue: 'Stock value',
      untracked: 'Not tracked', inStock: 'In stock', low: 'Limited', out: 'Out', never: '—', ask: 'Ask for price',
      changes: '{n} unsaved changes', saved: 'Saved ✓', saveFail: 'Could not save: ', wrong: 'Wrong password.',
      locked: 'Too many failed attempts. Try again in 15 minutes.', notConfigured: 'Panel not configured (ADMIN_PASSWORD / SESSION_SECRET / KV).',
      network: 'Network error.', expired: 'Session expired, please sign in again.', leave: 'You have unsaved changes.',
      main: 'Main image', makeMain: 'Make main', remove: 'Delete', uploading: 'Uploading…', uploaded: 'Photo uploaded ✓', removed: 'Photo deleted',
      reset: 'Default photos restored', confirmRemove: 'Delete this photo?', confirmReset: 'Delete all uploaded photos and restore the defaults?',
      lastPhoto: 'At least one photo must remain.', badFile: 'Unsupported file: ', noLog: 'No changes yet.', photoCount: '{n} photos',
      f_price: 'Price', f_oldPrice: 'Old price', f_qty: 'Stock', f_images: 'Photos', def: 'default', moveLeft: 'Move left'
    }
  };
  var LANG = 'tr';
  try { LANG = localStorage.getItem('zeico-admin-lang') || 'tr'; } catch (e) {}
  var t = function (k, n) { var s = STR[LANG][k] || k; return n != null ? s.replace('{n}', n) : s; };
  function applyLang() {
    document.documentElement.lang = LANG;
    $$('[data-t]').forEach(function (el) { el.textContent = t(el.dataset.t); });
    $$('[data-t-ph]').forEach(function (el) { el.placeholder = t(el.dataset.tPh); });
    $$('[data-lang-toggle]').forEach(function (b) { b.textContent = LANG === 'tr' ? 'EN' : 'TR'; });
  }
  $$('[data-lang-toggle]').forEach(function (b) {
    b.addEventListener('click', function () {
      LANG = LANG === 'tr' ? 'en' : 'tr';
      try { localStorage.setItem('zeico-admin-lang', LANG); } catch (e) {}
      applyLang();
      if (!$('#appView').hidden) { renderFilters(); render(); renderLog(); }
    });
  });

  var toastTimer;
  function toast(msg) {
    var el = $('#toast'); el.textContent = msg; el.classList.add('is-show');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { el.classList.remove('is-show'); }, 2800);
  }

  /* ---------- API ---------- */
  function api(path, opts) {
    opts = opts || {};
    opts.credentials = 'same-origin';
    return fetch(path, opts).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (data) {
        if (r.status === 401 && path !== '/api/admin/login') { showLogin(t('expired')); throw new Error('unauthorized'); }
        if (!r.ok) { var e = new Error(data.error || r.status); e.status = r.status; throw e; }
        return data;
      });
    });
  }
  var putJSON = function (path, body) { return api(path, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); };

  /* ---------- State ---------- */
  var inv = {}, log = [], edits = {};
  var cats = {}; CATEGORIES.forEach(function (c) { cats[c.id] = c; });
  var byId = {}; PRODUCTS.forEach(function (p) { byId[p.id] = p; });

  // Effective values: saved inventory overrides the defaults in products.js.
  function current(p) {
    var r = inv[p.id] || {};
    return {
      price: 'price' in r ? r.price : p.price,
      oldPrice: 'price' in r ? (r.oldPrice == null ? null : r.oldPrice) : (p.oldPrice || null),
      qty: r.qty == null ? null : r.qty,
      images: r.images || p.img,
      custom: !!r.images,
      updatedAt: r.updatedAt || null
    };
  }
  function value(p, field) { return edits[p.id] && field in edits[p.id] ? edits[p.id][field] : current(p)[field]; }
  function statusOf(qty) { return qty == null ? 'untracked' : qty <= 0 ? 'order' : qty <= LOW_STOCK ? 'low' : 'in'; }
  var statusLabel = { untracked: 'untracked', in: 'inStock', low: 'low', order: 'out' };
  var fmtMoney = function (n) { return new Intl.NumberFormat(LANG === 'tr' ? 'tr-TR' : 'en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n); };
  var fmtDate = function (s) { return s ? new Date(s).toLocaleString(LANG === 'tr' ? 'tr-TR' : 'en-GB', { dateStyle: 'short', timeStyle: 'short' }) : t('never'); };

  /* ---------- Views ---------- */
  function showLogin(msg) {
    $('#appView').hidden = true; $('#loginView').hidden = false;
    var err = $('#loginError'); err.hidden = !msg; err.textContent = msg || '';
    $('#loginForm').password.focus();
  }
  function showApp() {
    $('#loginView').hidden = true; $('#appView').hidden = false;
    return api('/api/admin/inventory').then(function (d) { inv = d.inventory || {}; log = d.log || []; renderFilters(); render(); renderLog(); });
  }

  $('#loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var btn = $('button[type=submit]', this); btn.disabled = true;
    api('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: this.password.value }) })
      .then(function () { $('#loginForm').reset(); return showApp(); })
      .catch(function (err) {
        var m = err.status === 429 ? t('locked') : err.status === 503 ? t('notConfigured') : err.status === 401 ? t('wrong') : t('network');
        showLogin(m);
      })
      .then(function () { btn.disabled = false; });
  });
  $('#logoutBtn').addEventListener('click', function () {
    if (Object.keys(edits).length && !confirm(t('leave'))) return;
    edits = {};
    api('/api/admin/logout', { method: 'POST' }).catch(function () {}).then(function () { showLogin(); });
  });

  $$('.tabs__btn').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('.tabs__btn').forEach(function (x) { x.classList.toggle('is-active', x === b); });
      $('#stockView').hidden = b.dataset.view !== 'stock';
      $('#logView').hidden = b.dataset.view !== 'log';
    });
  });

  function renderFilters() {
    var sel = $('#catFilter'), v = sel.value || 'all';
    sel.innerHTML = '<option value="all">' + t('allCats') + '</option>' + CATEGORIES.map(function (c) { return '<option value="' + c.id + '">' + esc(c[LANG]) + '</option>'; }).join('');
    sel.value = v;
  }

  function renderKpis() {
    var units = 0, low = 0, out = 0, worth = 0;
    PRODUCTS.forEach(function (p) {
      var q = value(p, 'qty'), pr = value(p, 'price');
      if (q == null) return;
      units += q;
      if (q <= 0) out++; else if (q <= LOW_STOCK) low++;
      if (pr) worth += pr * q;
    });
    var k = [['kProducts', PRODUCTS.length, ''], ['kUnits', units.toLocaleString(LANG), ''], ['kLow', low, low ? 'warn' : ''], ['kOut', out, out ? 'bad' : ''], ['kValue', fmtMoney(worth), '']];
    $('#kpis').innerHTML = k.map(function (x) { return '<div class="kpi kpi--' + x[2] + '"><span>' + t(x[0]) + '</span><strong>' + x[1] + '</strong></div>'; }).join('');
  }

  function filteredProducts() {
    var q = $('#q').value.trim().toLocaleLowerCase(LANG), cat = $('#catFilter').value, st = $('#statusFilter').value;
    return PRODUCTS.filter(function (p) {
      if (cat !== 'all' && p.cat !== cat) return false;
      if (st !== 'all' && statusOf(value(p, 'qty')) !== st) return false;
      if (q && [p.pn, p.brand, p.tr.name, p.en.name].join(' ').toLocaleLowerCase(LANG).indexOf(q) === -1) return false;
      return true;
    });
  }

  var numIn = function (id, field, v, step, ph) {
    return '<input class="input input--num" type="number" min="0" step="' + step + '" inputmode="decimal" data-id="' + id + '" data-field="' + field + '" value="' + (v == null ? '' : v) + '" placeholder="' + (ph || '') + '">';
  };

  function render() {
    renderKpis();
    $('#rows').innerHTML = filteredProducts().map(function (p) {
      var c = current(p), q = value(p, 'qty'), st = statusOf(q), dirty = !!edits[p.id];
      return '<tr class="' + (dirty ? 'is-dirty' : '') + '" data-row="' + p.id + '">' +
        '<td data-label="' + t('colPhoto') + '"><button type="button" class="thumb" data-photos="' + p.id + '" title="' + t('photos') + '"><img src="' + esc(c.images[0]) + '" alt=""><span>' + t('photoCount', c.images.length) + '</span></button></td>' +
        '<td data-label="' + t('colProduct') + '"><strong>' + esc(p[LANG].name) + '</strong><small>' + esc(p.brand) + ' · <code>' + esc(p.pn) + '</code> · ' + esc(cats[p.cat] ? cats[p.cat][LANG] : p.cat) + '</small></td>' +
        '<td data-label="' + t('colPrice') + '">' + numIn(p.id, 'price', value(p, 'price'), '0.01', t('ask')) + '</td>' +
        '<td data-label="' + t('colOld') + '">' + numIn(p.id, 'oldPrice', value(p, 'oldPrice'), '0.01', '—') + '</td>' +
        '<td data-label="' + t('colQty') + '"><div class="stepper"><button type="button" data-step="-1" data-id="' + p.id + '" aria-label="-1">−</button>' + numIn(p.id, 'qty', q, '1', '—') + '<button type="button" data-step="1" data-id="' + p.id + '" aria-label="+1">+</button></div></td>' +
        '<td data-label="' + t('colStatus') + '"><span class="status status--' + st + '">' + t(statusLabel[st]) + '</span></td>' +
        '<td data-label="' + t('colUpdated') + '" class="muted">' + fmtDate(c.updatedAt) + '</td></tr>';
    }).join('');
    updateSavebar();
  }

  function renderLog() {
    $('#logRows').innerHTML = log.length ? log.map(function (e) {
      var p = byId[e.id], show = function (v) { return v == null ? '—' : v === 'default' ? t('def') : v; };
      return '<tr><td class="muted">' + fmtDate(e.t) + '</td><td>' + esc(p ? p[LANG].name + ' (' + p.pn + ')' : e.id) + '</td><td>' + esc(t('f_' + e.field)) + '</td><td>' + esc(show(e.from)) + ' → <strong>' + esc(show(e.to)) + '</strong></td></tr>';
    }).join('') : '<tr><td colspan="4" class="muted center">' + t('noLog') + '</td></tr>';
  }

  /* ---------- Editing ---------- */
  function setEdit(id, field, v) {
    var p = byId[id], base = current(p)[field];
    edits[id] = edits[id] || {};
    if (v === base) delete edits[id][field]; else edits[id][field] = v;
    if (!Object.keys(edits[id]).length) delete edits[id];
  }
  function parse(field, raw) {
    if (raw === '') return null;
    var n = field === 'qty' ? parseInt(raw, 10) : Math.round(parseFloat(raw) * 100) / 100;
    return isFinite(n) && n >= 0 ? n : undefined;
  }
  function refreshRow(id) {
    var row = $('[data-row="' + id + '"]'); if (!row) return;
    var p = byId[id], st = statusOf(value(p, 'qty'));
    row.classList.toggle('is-dirty', !!edits[id]);
    var s = $('.status', row); s.className = 'status status--' + st; s.textContent = t(statusLabel[st]);
    renderKpis(); updateSavebar();
  }
  $('#rows').addEventListener('input', function (e) {
    var el = e.target; if (!el.dataset.field) return;
    var v = parse(el.dataset.field, el.value.trim());
    el.classList.toggle('is-invalid', v === undefined);
    if (v === undefined) return;
    setEdit(el.dataset.id, el.dataset.field, v); refreshRow(el.dataset.id);
  });
  $('#rows').addEventListener('click', function (e) {
    var b = e.target.closest('[data-step]');
    if (b) {
      var input = $('input[data-field="qty"][data-id="' + b.dataset.id + '"]');
      var v = Math.max(0, (parseInt(input.value, 10) || 0) + +b.dataset.step);
      input.value = v; setEdit(b.dataset.id, 'qty', v); refreshRow(b.dataset.id); return;
    }
    var ph = e.target.closest('[data-photos]');
    if (ph) openPhotos(ph.dataset.photos);
  });
  ['#q', '#catFilter', '#statusFilter'].forEach(function (s) { $(s).addEventListener('input', render); });

  function updateSavebar() {
    var n = Object.keys(edits).reduce(function (s, id) { return s + Object.keys(edits[id]).length; }, 0);
    $('#savebar').hidden = !n;
    $('#saveCount').textContent = t('changes', n);
  }
  $('#discardBtn').addEventListener('click', function () { edits = {}; render(); });
  $('#saveBtn').addEventListener('click', function () {
    var btn = this; btn.disabled = true;
    // Send full price/oldPrice/qty for each edited item so defaults from products.js become saved values.
    var changes = {};
    Object.keys(edits).forEach(function (id) {
      var p = byId[id];
      changes[id] = { price: value(p, 'price'), oldPrice: value(p, 'oldPrice'), qty: value(p, 'qty') };
    });
    putJSON('/api/admin/inventory', { changes: changes })
      .then(function (d) { inv = d.inventory; edits = {}; render(); toast(t('saved')); return api('/api/admin/inventory'); })
      .then(function (d) { log = d.log || []; renderLog(); })
      .catch(function (err) { if (err.message !== 'unauthorized') toast(t('saveFail') + err.message); })
      .then(function () { btn.disabled = false; });
  });
  addEventListener('beforeunload', function (e) { if (Object.keys(edits).length) { e.preventDefault(); e.returnValue = t('leave'); } });

  $('#exportBtn').addEventListener('click', function () {
    var rows = [['id', 'part_no', 'brand', 'name', 'category', 'price_eur', 'old_price_eur', 'stock_qty', 'status', 'updated']];
    PRODUCTS.forEach(function (p) {
      var c = current(p);
      rows.push([p.id, p.pn, p.brand, p[LANG].name, cats[p.cat] ? cats[p.cat][LANG] : p.cat, c.price, c.oldPrice, c.qty, statusOf(c.qty), c.updatedAt]);
    });
    var csv = '﻿' + rows.map(function (r) { return r.map(function (v) { v = v == null ? '' : String(v); return /[",;\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }).join(','); }).join('\n');
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    a.download = 'zeico-stok-' + new Date().toISOString().slice(0, 10) + '.csv';
    a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  });

  /* ---------- Photos ---------- */
  var dlg = $('#photoDialog'), photoId = null;
  function openPhotos(id) { photoId = id; renderPhotos(); dlg.showModal(); }
  dlg.addEventListener('click', function (e) { if (e.target === dlg || e.target.closest('[data-close]')) dlg.close(); });
  dlg.addEventListener('close', function () { render(); });

  function renderPhotos() {
    var p = byId[photoId], c = current(p);
    $('#photoFor').textContent = p[LANG].name + ' · ' + p.pn;
    $('#resetPhotos').hidden = !c.custom;
    $('#photoList').innerHTML = c.images.map(function (src, i) {
      return '<figure class="photo' + (i ? '' : ' photo--main') + '"><img src="' + esc(src) + '" alt="">' +
        (i ? '' : '<span class="photo__tag">' + t('main') + '</span>') +
        '<figcaption>' +
          (i ? '<button type="button" class="btn btn--outline btn--xs" data-main="' + i + '">' + t('makeMain') + '</button>' : '') +
          '<button type="button" class="btn btn--danger btn--xs" data-del="' + i + '">' + t('remove') + '</button>' +
        '</figcaption></figure>';
    }).join('');
  }
  function setImages(list, msg) {
    return putJSON('/api/admin/images/' + photoId, { images: list })
      .then(function (d) { inv[photoId] = inv[photoId] || {}; inv[photoId].images = d.images; inv[photoId].updatedAt = new Date().toISOString(); renderPhotos(); toast(msg); })
      .catch(function (err) { if (err.message !== 'unauthorized') toast(t('saveFail') + err.message); });
  }
  $('#photoList').addEventListener('click', function (e) {
    var list = current(byId[photoId]).images.slice();
    var m = e.target.closest('[data-main]');
    if (m) { var moved = list.splice(+m.dataset.main, 1)[0]; list.unshift(moved); setImages(list, t('saved')); return; }
    var d = e.target.closest('[data-del]');
    if (d) {
      if (list.length < 2) return toast(t('lastPhoto'));
      if (!confirm(t('confirmRemove'))) return;
      list.splice(+d.dataset.del, 1); setImages(list, t('removed'));
    }
  });
  $('#resetPhotos').addEventListener('click', function () { if (confirm(t('confirmReset'))) setImages(null, t('reset')); });

  // Resize to max 1600px and re-encode (WebP where supported, else JPEG) before upload.
  function compress(file) {
    return createImageBitmap(file).then(function (bmp) {
      var max = 1600, s = Math.min(1, max / Math.max(bmp.width, bmp.height));
      var cv = document.createElement('canvas');
      cv.width = Math.round(bmp.width * s); cv.height = Math.round(bmp.height * s);
      var ctx = cv.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.drawImage(bmp, 0, 0, cv.width, cv.height);
      return new Promise(function (res) { cv.toBlob(function (b) { res(b); }, 'image/webp', 0.85); }).then(function (b) {
        return b && b.type === 'image/webp' ? b : new Promise(function (res) { cv.toBlob(res, 'image/jpeg', 0.88); });
      });
    });
  }
  function upload(files) {
    var list = Array.prototype.slice.call(files);
    var chain = Promise.resolve();
    $('#drop').classList.add('is-busy'); $('#drop strong').textContent = t('uploading');
    list.forEach(function (f) {
      chain = chain.then(function () {
        if (!/^image\/(jpeg|png|webp)$/.test(f.type)) { toast(t('badFile') + f.name); return; }
        return compress(f).then(function (blob) {
          var c = current(byId[photoId]);
          var q = c.custom ? '' : '?base=' + encodeURIComponent(c.images.join(','));
          return api('/api/admin/images/' + photoId + q, { method: 'POST', headers: { 'Content-Type': blob.type }, body: blob });
        }).then(function (d) {
          inv[photoId] = inv[photoId] || {}; inv[photoId].images = d.images; inv[photoId].updatedAt = new Date().toISOString();
          renderPhotos(); toast(t('uploaded'));
        });
      });
    });
    chain.catch(function (err) { if (err.message !== 'unauthorized') toast(t('saveFail') + err.message); })
      .then(function () { $('#drop').classList.remove('is-busy'); $('#drop strong').textContent = t('dropTitle'); $('#fileInput').value = ''; });
  }
  $('#fileInput').addEventListener('change', function () { if (this.files.length) upload(this.files); });
  var drop = $('#drop');
  ['dragenter', 'dragover'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add('is-over'); }); });
  ['dragleave', 'drop'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove('is-over'); }); });
  drop.addEventListener('drop', function (e) { if (e.dataTransfer.files.length) upload(e.dataTransfer.files); });

  /* ---------- Init ---------- */
  applyLang();
  api('/api/admin/session').then(showApp).catch(function (err) {
    if (err.message === 'unauthorized') return;
    showLogin(err.status === 503 ? t('notConfigured') : '');
  });
})();
