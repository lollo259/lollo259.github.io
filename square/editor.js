// Il Quadrante delle Emozioni — the book editor.
// "Modifica" turns the book into one long editable page: write in place, add or move parts, change images.
// "Salva" sends everything to GitHub in a single commit; the public site updates about a minute later.
'use strict';
(() => {
  const REPO = 'lollo259/lollo259.github.io', BRANCH = 'main', DIR = 'square/capitoli/';
  const API = 'https://api.github.com/repos/' + REPO;
  const TOKEN_KEY = 'quadrante-github-token';
  const $ = (s, el = document) => el.querySelector(s);
  const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const TIPI = {
    testo: 'Testo', apertura: 'Apertura di capitolo', foto: 'Foto a pagina intera', doppia: 'Foto su due pagine',
    figura: 'Figura', disegno: 'Disegno', 'doppia-figura': 'Due immagini affiancate', frontespizio: 'Frontespizio',
    dedica: 'Dedica', colophon: 'Colophon', indice: 'Indice'
  };
  const IMMAGINE = new Set(['foto', 'doppia', 'figura', 'disegno', 'doppia-figura']);
  const FM_ORDER = ['ordine', 'titolo', 'tipo', 'capitolo', 'numero', 'immagine', 'immagine_destra', 'lato', 'nuova_pagina',
    'pagina_intera', 'senza_testata', 'nell_indice', 'bozza'];

  let parts = [], removed = [], editing = false, nextId = 1, saving = false;

  // ------------------------------------------------------------------ styles
  const css = document.createElement('style');
  css.textContent = `
  #editor { padding: 0 16px 120px; }
  @media (min-width: 1000px) {
    body.editing #editor { width: 50vw; }
    body.editing #libro { position: fixed; top: var(--barh, 49px); right: 0; bottom: 0; width: 50vw; overflow: auto; padding: 18px 16px 60vh;
      border-left: 1px solid #d6d3cf; gap: 18px; justify-content: flex-start; }
    body.editing #libro .spread.qui .page { outline: 2px solid #9db8dc; outline-offset: 0; }
  }
  @media (max-width: 999.98px) { body.editing #libro { display: none; } }
  .ed-tools { position: sticky; top: var(--barh, 49px); z-index: 4; display: flex; flex-wrap: wrap; gap: 6px; justify-content: center;
    padding: 8px 0; background: var(--desk); border-bottom: 1px solid #d6d3cf; margin: 0 -16px 24px; }
  .ed-tools button { font: 13px Jost, sans-serif; color: var(--ui); background: #fff; border: 1px solid #c9c5c0; border-radius: 6px; padding: 5px 10px; cursor: pointer; min-width: 34px; }
  .ed-tools button:hover { border-color: #8f8a85; }
  .ed-tools .sep { width: 1px; background: #c9c5c0; margin: 2px 4px; }
  .ed-col { max-width: 700px; margin: 0 auto; }
  .ed-part { background: #fff; box-shadow: 0 2px 10px rgba(0,0,0,.08); margin: 0 0 4px; position: relative; }
  .ed-part.bozza { opacity: .55; }
  .ed-head { display: flex; align-items: center; gap: 6px; padding: 7px 10px; border-bottom: 1px solid #efedea; font-size: 12px; color: #77726d; letter-spacing: .03em; }
  .ed-head .tt { flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ed-head button { font: 12px Jost, sans-serif; background: none; border: 1px solid transparent; border-radius: 5px; padding: 2px 7px; cursor: pointer; color: #55514c; }
  .ed-head button:hover { border-color: #c9c5c0; background: #faf9f8; }
  .ed-dirty .ed-head .tt::after { content: " · modificato"; color: #1f5fae; }
  .ed-body { padding: 26px 46px 30px; font-size: 15.5px; line-height: 1.55; outline: none; min-height: 60px; }
  .ed-body:focus { box-shadow: inset 0 0 0 2px #e3eaf4; }
  .ed-body p { margin: 0 0 .7em; } .ed-body h1 { font-weight: 400; font-size: 26px; margin: .4em 0 .6em; }
  .ed-body h2 { font-weight: 400; font-size: 21px; margin: 1em 0 .5em; } .ed-body h3 { font-weight: 400; font-size: 17px; margin: 1.1em 0 .4em; }
  .ed-body blockquote { margin: 0 0 .8em 1.4em; font-size: .95em; } .ed-body ul, .ed-body ol { padding-left: 1.4em; margin: 0 0 .7em; }
  .ed-body img { max-width: 100%; display: block; margin: .6em 0; }
  .ed-body .epi, .ed-body p:has(> em:only-child) { color: #555; }
  .ed-ap { padding: 30px 46px 36px; display: flex; flex-direction: column; gap: 10px; }
  .ed-ap input { font: 300 40px Jost, sans-serif; border: 0; border-bottom: 1px dashed #ccc; width: 120px; padding: 2px 0; }
  .ed-ap input.t { font-size: 26px; font-weight: 400; width: 100%; }
  .ed-img { padding: 16px; display: flex; flex-direction: column; align-items: center; gap: 10px; }
  .ed-img img { max-width: 100%; max-height: 420px; display: block; box-shadow: 0 0 0 1px #eee; }
  .ed-img .due { display: flex; gap: 8px; width: 100%; } .ed-img .due > div { flex: 1; text-align: center; } .ed-img .due img { max-height: 260px; }
  .ed-img button, .ed-set button { font: 13px Jost, sans-serif; background: #fff; border: 1px solid #c9c5c0; border-radius: 6px; padding: 5px 12px; cursor: pointer; }
  .ed-set { padding: 12px 16px; background: #faf9f8; border-bottom: 1px solid #efedea; display: grid; grid-template-columns: 1fr 1fr; gap: 10px 16px; font-size: 13px; }
  .ed-set label { display: flex; flex-direction: column; gap: 3px; color: #55514c; }
  .ed-set label.chk { flex-direction: row; align-items: center; gap: 6px; }
  .ed-set input[type=text], .ed-set input[type=number], .ed-set select { font: 14px Jost, sans-serif; padding: 5px 7px; border: 1px solid #c9c5c0; border-radius: 5px; background: #fff; }
  .ed-add { display: flex; justify-content: center; padding: 6px 0 10px; position: relative; }
  .ed-add > button { font: 12px Jost, sans-serif; color: #77726d; background: none; border: 1px dashed #c9c5c0; border-radius: 999px; padding: 3px 12px; cursor: pointer; opacity: .55; }
  .ed-add > button:hover, .ed-add > button:focus { opacity: 1; background: #fff; }
  .ed-menu { position: absolute; top: 34px; z-index: 6; background: #fff; box-shadow: 0 6px 24px rgba(0,0,0,.18); border-radius: 8px; padding: 6px; display: flex; flex-direction: column; min-width: 220px; }
  .ed-menu button { text-align: left; font: 14px Jost, sans-serif; background: none; border: 0; padding: 7px 10px; border-radius: 5px; cursor: pointer; }
  .ed-menu button:hover { background: #f1efec; }
  .ed-modal { position: fixed; inset: 0; z-index: 20; background: rgba(20,20,20,.45); display: flex; align-items: center; justify-content: center; padding: 16px; }
  .ed-modal .box { background: #fff; max-width: 520px; width: 100%; border-radius: 10px; padding: 22px 24px; font-size: 14.5px; line-height: 1.5; }
  .ed-modal h3 { font-weight: 400; font-size: 20px; margin: 0 0 10px; }
  .ed-modal ol { padding-left: 1.2em; margin: 8px 0 14px; } .ed-modal li { margin: 0 0 6px; }
  .ed-modal input { width: 100%; font: 14px monospace; padding: 8px; border: 1px solid #c9c5c0; border-radius: 6px; margin: 4px 0 12px; }
  .ed-modal .row { display: flex; gap: 8px; justify-content: flex-end; }
  .ed-modal button { font: 14px Jost, sans-serif; border: 1px solid #c9c5c0; background: #fff; border-radius: 999px; padding: 6px 16px; cursor: pointer; }
  .ed-modal button.primary { background: #1b1b1b; color: #fff; border-color: #1b1b1b; }
  .ed-modal .err { color: #a3261b; min-height: 1.2em; font-size: 13px; }
  #salva { display: none; } body.editing #salva { display: inline-block; } body.editing #vista, body.editing #pdf { display: none; }
  #salva.pending { background: #1b1b1b; color: #fff; border-color: #1b1b1b; }
  #edstato { color: #1f5fae; font-size: 13px; }
  @media (max-width: 640px) { .ed-body { padding: 18px 18px 22px; } .ed-set { grid-template-columns: 1fr; } .ed-ap { padding: 22px 18px; } }
  @media print { #editor { display: none !important; } }`;
  document.head.appendChild(css);

  // the save button and a status line in the bar
  const bar = $('.barra');
  const salva = document.createElement('button'); salva.id = 'salva'; salva.type = 'button'; salva.textContent = 'Salva';
  const stato = document.createElement('span'); stato.id = 'edstato'; stato.setAttribute('aria-live', 'polite');
  bar.insertBefore(salva, $('#modifica')); bar.insertBefore(stato, salva);
  const say = t => { stato.textContent = t || ''; };

  // ------------------------------------------------------------------ Markdown back from the edited HTML
  function mdInline(node) {
    let s = '';
    for (const n of node.childNodes) {
      if (n.nodeType === 3) { s += n.data.replace(/ /g, ' ').replace(/([*_\\`])/g, '\\$1').replace(/\s+/g, ' '); continue; }
      if (n.nodeType !== 1) continue;
      const t = n.tagName, inner = () => mdInline(n);
      if (t === 'BR') s += '\\\n';
      else if (t === 'STRONG' || t === 'B') { const x = inner(); s += x.trim() ? wrap(x, '**') : x; }
      else if (t === 'EM' || t === 'I') { const x = inner(); s += x.trim() ? wrap(x, '*') : x; }
      else if (t === 'A') s += `[${inner()}](${n.getAttribute('href') || ''})`;
      else if (t === 'IMG') s += `![${(n.getAttribute('alt') || '').replace(/[\]\[]/g, '')}](${n.getAttribute('src')})`;
      else if (t === 'SPAN' && /font-weight:\s*(bold|[6-9]00)/.test(n.getAttribute('style') || '')) s += wrap(inner(), '**');
      else if (t === 'SPAN' && /font-style:\s*italic/.test(n.getAttribute('style') || '')) s += wrap(inner(), '*');
      else s += inner();
    }
    return s;
  }
  function wrap(x, m) {                         // keep spaces outside the markers: "*a b* c", not "*a b *c"
    const a = x.match(/^\s*/)[0], b = x.match(/\s*$/)[0];
    return a + m + x.trim() + m + b;
  }
  function mdBlocks(el, depth = 0) {
    const out = [];
    let inl = null;                             // loose inline content directly in the container
    const flushInl = () => { if (inl !== null) { const t = inl.trim(); if (t) out.push(t); inl = null; } };
    for (const n of el.childNodes) {
      const isBlock = n.nodeType === 1 && /^(P|DIV|H[1-6]|UL|OL|BLOCKQUOTE|FIGURE|HR|TABLE|SECTION)$/.test(n.tagName);
      if (!isBlock) {
        if (n.nodeType === 1 && n.tagName === 'BR') { flushInl(); continue; }
        const tmp = document.createElement('span'); tmp.appendChild(n.cloneNode(true)); inl = (inl || '') + mdInline(tmp); continue;
      }
      flushInl();
      const t = n.tagName;
      if (/^H[1-6]$/.test(t)) { const x = mdInline(n).replace(/\\\n/g, ' ').trim().replace(/^(\*{1,3})([^*]+)\1$/, '$2'); if (x) out.push('#'.repeat(+t[1]) + ' ' + x); }
      else if (t === 'P' || t === 'DIV' || t === 'SECTION' || t === 'FIGURE') {
        if (n.querySelector('p,div,h1,h2,h3,h4,ul,ol,blockquote')) out.push(...mdBlocks(n, depth).split('\n\n'));
        else { const x = mdInline(n).replace(/\\\n$/, '').trim(); if (x) out.push(x); }
      }
      else if (t === 'HR') out.push('---');
      else if (t === 'BLOCKQUOTE') { const x = mdBlocks(n); if (x.trim()) out.push(x.split('\n').map(l => l ? '> ' + l : '>').join('\n')); }
      else if (t === 'UL' || t === 'OL') {
        const lines = []; let k = 1;
        for (const li of n.children) {
          if (li.tagName !== 'LI') continue;
          const sub = [...li.children].filter(c => c.tagName === 'UL' || c.tagName === 'OL');
          const clone = li.cloneNode(true); clone.querySelectorAll('ul,ol').forEach(c => c.remove());
          const txt = clone.querySelector('p,div') ? mdBlocks(clone).replace(/\n\n/g, ' ') : mdInline(clone).replace(/\\\n$/, '').trim();
          lines.push('  '.repeat(depth) + (t === 'OL' ? (k++) + '. ' : '- ') + txt);
          sub.forEach(s => { const w = document.createElement('div'); w.appendChild(s.cloneNode(true)); lines.push(mdBlocks(w, depth + 1)); });
        }
        out.push(lines.join('\n'));
      }
      else out.push(mdInline(n).trim());
    }
    flushInl();
    return out.filter(Boolean).join('\n\n');
  }

  // ------------------------------------------------------------------ the parts
  function fromBook() {
    parts = Q.libro.parti.map(x => {
      const p = { ...x }; p._id = nextId++; p._orig = JSON.stringify(clean(x)); p._file = x.file; return p;
    });
    removed = [];
  }
  function clean(p) { const o = {}; for (const [k, v] of Object.entries(p)) if (!k.startsWith('_') && k !== 'file') o[k] = v; return o; }
  function fm(p) {
    const keys = [...FM_ORDER.filter(k => k in p), ...Object.keys(p).filter(k => !FM_ORDER.includes(k) && k !== 'body' && k !== 'file' && !k.startsWith('_'))];
    let s = '---\n';
    for (const k of keys) {
      const v = p[k];
      if (v === undefined || v === null || v === '' || k === 'body') continue;
      s += `${k}: ${typeof v === 'boolean' || typeof v === 'number' ? v : JSON.stringify(String(v))}\n`;
    }
    return s + '---\n' + (p.body ? '\n' + p.body.replace(/\s+$/, '') + '\n' : '');
  }
  const slug = s => (String(s || 'parte').normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'parte');

  function partEl(p) {
    const sec = document.createElement('section'); sec.className = 'ed-part' + (p.bozza ? ' bozza' : ''); sec.dataset.id = p._id;
    const label = `${TIPI[p.tipo || 'testo'] || p.tipo}${p.titolo ? ' · ' + p.titolo : ''}`;
    sec.innerHTML = `<div class="ed-head"><span class="tt">${esc(label)}</span>
      <button data-a="su" title="Sposta su" aria-label="Sposta su">↑</button><button data-a="giu" title="Sposta giù" aria-label="Sposta giù">↓</button>
      <button data-a="imp" title="Impostazioni della parte">Impostazioni</button><button data-a="del" title="Elimina la parte">Elimina</button></div>
      <div class="ed-set" hidden></div>`;
    const tipo = p.tipo || 'testo';
    if (tipo === 'apertura') {
      const d = document.createElement('div'); d.className = 'ed-ap';
      d.innerHTML = `<input aria-label="Numero del capitolo" class="n" value="${esc(p.numero || '')}"><input aria-label="Titolo del capitolo" class="t" value="${esc(p.titolo || '')}">`;
      d.addEventListener('input', () => { p.numero = $('.n', d).value; p.titolo = $('.t', d).value; if (!p.capitolo || p.capitolo === p._capPrev) p.capitolo = p.titolo; p._capPrev = p.titolo; dirty(p); });
      p._capPrev = p.capitolo;
      sec.appendChild(d);
    } else if (IMMAGINE.has(tipo)) {
      const d = document.createElement('div'); d.className = 'ed-img';
      const pic = (src, key) => `<div><img src="${esc(shown[src] || src || '')}" alt="" ${src ? '' : 'hidden'}><br><button data-img="${key}">${src ? 'Cambia immagine' : 'Scegli immagine'}</button></div>`;
      d.innerHTML = tipo === 'doppia-figura' ? `<div class="due">${pic(p.immagine, 'immagine')}${pic(p.immagine_destra, 'immagine_destra')}</div>` : pic(p.immagine, 'immagine');
      sec.appendChild(d);
      if (tipo === 'disegno' || (tipo === 'figura' && p.body)) sec.appendChild(bodyEl(p));
    } else {
      sec.appendChild(bodyEl(p));
    }
    return sec;
  }
  function bodyEl(p) {
    const b = document.createElement('div'); b.className = 'ed-body'; b.contentEditable = 'true'; b.spellcheck = true;
    b.innerHTML = Q.markdown(p.body || '') || '<p><br></p>';
    b.querySelectorAll('p').forEach((x, i, all) => { const n = x.nextElementSibling; if (/^<em>[^<]+<\/em>$/.test(x.innerHTML.trim()) && n && n.tagName === 'H2') x.classList.add('epi'); });
    b.addEventListener('input', () => dirty(p, b));
    b.addEventListener('keydown', e => {                       // a new paragraph starts plain, not in the style of the last word
      if (e.key !== 'Enter' || e.shiftKey) return;
      setTimeout(() => {
        const sel = getSelection(); if (!sel.rangeCount) return;
        let blk = sel.anchorNode; while (blk && blk.parentNode !== b) blk = blk.parentNode;
        if (blk && blk.nodeType === 1 && /^(P|DIV|H[1-6])$/.test(blk.tagName) && !blk.textContent.trim() && blk.querySelector('em,i,strong,b,span')) {
          blk.innerHTML = '<br>'; const r = document.createRange(); r.setStart(blk, 0); r.collapse(true); sel.removeAllRanges(); sel.addRange(r);
        }
        if (blk && !blk.textContent.trim() && !/^H[1-6]$/.test(blk.tagName)) {
          if (document.queryCommandState('italic')) document.execCommand('italic');
          if (document.queryCommandState('bold')) document.execCommand('bold');
        }
      }, 0);
    });
    b.addEventListener('paste', e => {                          // paste as clean text: paragraphs stay paragraphs
      const t = (e.clipboardData || window.clipboardData).getData('text/plain'); if (!t) return;
      e.preventDefault();
      const paras = t.replace(/\r/g, '').split(/\n\s*\n/);
      if (paras.length < 2) document.execCommand('insertText', false, t.replace(/\n/g, ' '));
      else document.execCommand('insertHTML', false, paras.map(x => `<p>${esc(x.replace(/\n/g, ' '))}</p>`).join(''));
    });
    p._bodyEl = b;
    return b;
  }
  function dirty(p, b) {
    p._dirty = true; if (b) p._bodyChanged = true;
    const sec = document.querySelector(`.ed-part[data-id="${p._id}"]`); if (sec) sec.classList.add('ed-dirty');
    salva.classList.add('pending'); say('Modifiche non salvate');
    preview();
  }
  // the book beside the text: re-laid out half a second after you stop typing
  let timer = null, busy = false, again = false, focusId = null;
  function preview(now) {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      if (!editing) return;
      if (busy) { again = true; return; }
      busy = true;
      try {
        syncBodies();
        const libro = $('#libro'), y = libro.scrollTop;
        await Q.impagina(parts.filter(p => p.bozza !== true).map(local), Q.libro.generato);
        libro.scrollTop = y;
        follow(focusId, true);
      } finally { busy = false; if (again) { again = false; preview(true); } }
    }, now ? 0 : 500);
  }
  // keep the page of the part being edited in view, and mark its spread
  function follow(id, keep) {
    if (id == null || !Q.pageOf) return;
    const i = Q.pageOf[id]; const pg = Q.pages()[i]; if (!pg) return;
    const sp = pg.el.closest('.spread'), libro = $('#libro'); if (!sp) return;
    libro.querySelectorAll('.spread.qui').forEach(x => x !== sp && x.classList.remove('qui')); sp.classList.add('qui');
    const top = sp.offsetTop - libro.offsetTop, z = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--z')) || 1;
    const t = sp.getBoundingClientRect(), l = libro.getBoundingClientRect();
    if (keep && t.top >= l.top && t.bottom <= l.bottom) return;
    libro.scrollTop += t.top - l.top - 12;
  }
  function settings(p, box) {
    const tipo = p.tipo || 'testo';
    const f = (k, lab, type = 'text', extra = '') => `<label>${lab}<input type="${type}" data-k="${k}" value="${esc(p[k] ?? '')}" ${extra}></label>`;
    const c = (k, lab) => `<label class="chk"><input type="checkbox" data-k="${k}" ${p[k] === true ? 'checked' : ''}> ${lab}</label>`;
    let h = f('titolo', 'Titolo (per riconoscere la parte)') +
      `<label>Tipo<select data-k="tipo">${Object.entries(TIPI).map(([k, v]) => `<option value="${k}" ${k === tipo ? 'selected' : ''}>${v}</option>`).join('')}</select></label>` +
      f('capitolo', 'Titolo corrente in alto sulle pagine') +
      `<label>Lato<select data-k="lato"><option value="">Qualsiasi</option><option value="destra" ${p.lato === 'destra' ? 'selected' : ''}>Pagina destra</option><option value="sinistra" ${p.lato === 'sinistra' ? 'selected' : ''}>Pagina sinistra</option></select></label>`;
    if (tipo === 'apertura') h += f('numero', 'Numero del capitolo');
    if (tipo === 'testo') h += c('nuova_pagina', 'Comincia su una pagina nuova');
    if (tipo === 'figura') h += c('pagina_intera', 'L’immagine è già una pagina intera') + c('senza_testata', 'Senza titolo corrente e numero di pagina');
    h += c('bozza', 'Nascondi dal libro (bozza)');
    box.innerHTML = h;
    box.addEventListener('input', e => {
      const k = e.target.dataset.k; if (!k) return;
      let v = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      if (k === 'lato' && !v) v = undefined;
      p[k] = v;
      if (k === 'tipo' || k === 'bozza') redraw(p);
      else if (k === 'titolo') { const tt = box.parentElement.querySelector('.tt'); tt.textContent = `${TIPI[p.tipo || 'testo'] || p.tipo} · ${p.titolo}`; }
      dirty(p);
    });
  }
  function redraw(p) {
    const old = document.querySelector(`.ed-part[data-id="${p._id}"]`);
    if (p._bodyEl && p._bodyChanged) p.body = mdBlocks(p._bodyEl);
    const n = partEl(p); old.replaceWith(n); if (p._dirty) n.classList.add('ed-dirty');
    const box = $('.ed-set', n); settings(p, box); box.hidden = false;
  }

  function addMenu(at, btn) {
    document.querySelectorAll('.ed-menu').forEach(m => m.remove());
    const m = document.createElement('div'); m.className = 'ed-menu';
    const items = [['testo', 'Testo'], ['apertura', 'Apertura di capitolo'], ['foto', 'Foto a pagina intera'], ['doppia', 'Foto su due pagine'], ['figura', 'Figura'], ['disegno', 'Disegno con i margini']];
    m.innerHTML = items.map(([k, v]) => `<button data-t="${k}">${v}</button>`).join('');
    btn.parentElement.appendChild(m);
    m.addEventListener('click', e => {
      const t = e.target.dataset.t; if (!t) return;
      const prev = parts[at - 1];
      const p = { tipo: t, titolo: t === 'testo' ? 'Nuovo testo' : t === 'apertura' ? 'Nuovo capitolo' : 'Nuova immagine', capitolo: prev ? prev.capitolo || '' : '', body: t === 'testo' ? '' : '', _id: nextId++, _new: true, _dirty: true };
      if (t === 'apertura') p.numero = '';
      if (t === 'figura') p.pagina_intera = false;
      parts.splice(at, 0, p); m.remove(); build();
      const sec = document.querySelector(`.ed-part[data-id="${p._id}"]`); sec.scrollIntoView({ block: 'center' });
      const b = $('.ed-body', sec); if (b) b.focus(); else if (IMMAGINE.has(t)) pickImage(p, 'immagine');
      salva.classList.add('pending'); say('Modifiche non salvate'); focusId = p._id; preview(true);
    });
    setTimeout(() => document.addEventListener('click', function off(e) { if (!m.contains(e.target) && e.target !== btn) { m.remove(); document.removeEventListener('click', off); } }), 0);
  }

  // images: read, shrink if very large, keep as data until saved
  function pickImage(p, key, insertInto) {
    const inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'image/*';
    inp.onchange = async () => {
      const f = inp.files[0]; if (!f) return;
      const data = await prepare(f);
      if (insertInto) { insertInto.focus(); document.execCommand('insertHTML', false, `<img src="${data}" alt="">`); dirty(p, insertInto); return; }
      p[key] = data; p._dirty = true; redraw(p); dirty(p);
    };
    inp.click();
  }
  function prepare(file) {
    return new Promise((ok, ko) => {
      const r = new FileReader();
      r.onload = () => {
        const im = new Image();
        im.onload = () => {
          const max = 2800, k = Math.min(1, max / Math.max(im.width, im.height));
          if (k === 1 && file.size < 4e6 && /png|jpe?g|webp/.test(file.type)) return ok(r.result);
          const c = document.createElement('canvas'); c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
          c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); ok(c.toDataURL('image/jpeg', 0.9));
        };
        im.onerror = ko; im.src = r.result;
      };
      r.onerror = ko; r.readAsDataURL(file);
    });
  }

  // ------------------------------------------------------------------ the editing page
  function build() {
    const ed = $('#editor');
    ed.innerHTML = `<div class="ed-tools" role="toolbar" aria-label="Formattazione">
      <button data-c="p" title="Testo normale">Testo</button><button data-c="h2" title="Titolo">Titolo</button><button data-c="h3" title="Sottotitolo">Sottotitolo</button>
      <span class="sep"></span><button data-c="bold" title="Grassetto"><b>G</b></button><button data-c="italic" title="Corsivo"><i>C</i></button>
      <span class="sep"></span><button data-c="ul" title="Elenco">• Elenco</button><button data-c="blockquote" title="Citazione rientrata">Citazione</button>
      <button data-c="img" title="Inserisci un’immagine nel testo">Immagine</button><span class="sep"></span><button data-c="undo" title="Annulla">↶</button><button data-c="redo" title="Ripeti">↷</button>
      </div><div class="ed-col"></div>`;
    const col = $('.ed-col', ed);
    const add = i => { const d = document.createElement('div'); d.className = 'ed-add'; d.innerHTML = `<button type="button" data-at="${i}">+ Aggiungi qui</button>`; return d; };
    col.appendChild(add(0));
    parts.forEach((p, i) => { const s = partEl(p); if (p._dirty) s.classList.add('ed-dirty'); col.appendChild(s); col.appendChild(add(i + 1)); });
    let lastBody = null;
    col.addEventListener('focusin', e => {
      if (e.target.classList && e.target.classList.contains('ed-body')) lastBody = e.target;
      const sec = e.target.closest && e.target.closest('.ed-part'); if (sec) { focusId = +sec.dataset.id; follow(focusId); }
    });
    col.addEventListener('click', e => { const sec = e.target.closest('.ed-part'); if (sec && +sec.dataset.id !== focusId) { focusId = +sec.dataset.id; follow(focusId); } });
    $('.ed-tools', ed).addEventListener('mousedown', e => e.preventDefault());   // keep the selection in the text
    $('.ed-tools', ed).addEventListener('click', e => {
      const c = e.target.closest('button') && e.target.closest('button').dataset.c; if (!c) return;
      const b = document.activeElement && document.activeElement.classList.contains('ed-body') ? document.activeElement : lastBody;
      if (!b) { say('Clicca prima dentro un testo'); return; }
      b.focus();
      const p = parts.find(x => x._bodyEl === b);
      if (c === 'img') return pickImage(p, null, b);
      if (c === 'bold' || c === 'italic' || c === 'undo' || c === 'redo') document.execCommand(c);
      else if (c === 'ul') document.execCommand('insertUnorderedList');
      else document.execCommand('formatBlock', false, c === 'p' ? 'P' : c.toUpperCase());
      if (p) dirty(p, b);
    });
    col.addEventListener('click', e => {
      const btn = e.target.closest('button'); if (!btn) return;
      if (btn.dataset.at !== undefined) return addMenu(+btn.dataset.at, btn);
      const sec = btn.closest('.ed-part'); if (!sec) return;
      const p = parts.find(x => x._id === +sec.dataset.id), i = parts.indexOf(p);
      if (btn.dataset.img) return pickImage(p, btn.dataset.img);
      const a = btn.dataset.a;
      if (a === 'imp') { const box = $('.ed-set', sec); if (!box.innerHTML) settings(p, box); box.hidden = !box.hidden; }
      if (a === 'su' && i > 0) { syncBodies(); [parts[i - 1], parts[i]] = [parts[i], parts[i - 1]]; parts._moved = true; build(); focusPart(p); salva.classList.add('pending'); say('Modifiche non salvate'); }
      if (a === 'giu' && i < parts.length - 1) { syncBodies(); [parts[i + 1], parts[i]] = [parts[i], parts[i + 1]]; parts._moved = true; build(); focusPart(p); salva.classList.add('pending'); say('Modifiche non salvate'); }
      if (a === 'del') confirmBox('Eliminare questa parte?', `«${esc(p.titolo || TIPI[p.tipo] || '')}» sparirà dal libro quando salvi.`, 'Elimina', () => {
        syncBodies(); parts.splice(i, 1); if (!p._new) removed.push(p); build(); salva.classList.add('pending'); say('Modifiche non salvate'); preview(true);
      });
    });
  }
  function focusPart(p) { focusId = p._id; preview(true); const s = document.querySelector(`.ed-part[data-id="${p._id}"]`); if (s) s.scrollIntoView({ block: 'center' }); }
  function syncBodies() { parts.forEach(p => { if (p._bodyEl && p._bodyChanged) { p.body = mdBlocks(p._bodyEl); p._bodyChanged = false; } }); }

  // ------------------------------------------------------------------ modal boxes
  function modal(html) {
    const m = document.createElement('div'); m.className = 'ed-modal'; m.innerHTML = `<div class="box" role="dialog" aria-modal="true">${html}</div>`;
    document.body.appendChild(m); return m;
  }
  function confirmBox(title, text, ok, fn) {
    const m = modal(`<h3>${title}</h3><p>${text}</p><div class="row"><button data-x>Annulla</button><button class="primary" data-ok>${ok}</button></div>`);
    m.addEventListener('click', e => { if (e.target.dataset.ok !== undefined) { m.remove(); fn(); } else if (e.target.dataset.x !== undefined || e.target === m) m.remove(); });
  }
  function getToken() {
    let t = null; try { t = localStorage.getItem(TOKEN_KEY); } catch (e) {}
    if (t) return Promise.resolve(t);
    return new Promise(resolve => {
      const m = modal(`<h3>Collega GitHub, una volta sola</h3>
        <p>Per salvare, il sito ha bisogno di una chiave che gli permetta di scrivere nel tuo sito. Si crea una volta e resta su questo dispositivo.</p>
        <ol><li>Apri <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener">github.com → Nuova chiave</a> (sei già dentro GitHub).</li>
        <li>Nome: <b>Quadrante</b>. Scadenza: <b>No expiration</b> (o quella che preferisci).</li>
        <li>Repository access: <b>Only select repositories</b> → <b>lollo259.github.io</b>.</li>
        <li>Permissions → Repository permissions → <b>Contents: Read and write</b>.</li>
        <li><b>Generate token</b>, copia la chiave e incollala qui sotto.</li></ol>
        <input id="tk" placeholder="github_pat_…" autocomplete="off" spellcheck="false" aria-label="Chiave GitHub"><div class="err" id="tkerr"></div>
        <div class="row"><button data-x>Annulla</button><button class="primary" data-ok>Collega</button></div>`);
      m.addEventListener('click', async e => {
        if (e.target.dataset.x !== undefined) { m.remove(); resolve(null); return; }
        if (e.target.dataset.ok === undefined) return;
        const t = $('#tk', m).value.trim(); if (!t) return;
        $('#tkerr', m).textContent = 'Controllo…';
        try {
          const r = await fetch(API, { headers: { Authorization: 'Bearer ' + t, Accept: 'application/vnd.github+json' } });
          const j = await r.json();
          if (!r.ok || !j.permissions || !j.permissions.push) throw new Error(r.ok ? 'la chiave non può scrivere nel sito: controlla «Contents: Read and write»' : 'chiave non valida o senza accesso a lollo259.github.io');
          try { localStorage.setItem(TOKEN_KEY, t); } catch (e) {}
          m.remove(); resolve(t);
        } catch (err) { $('#tkerr', m).textContent = 'Non funziona: ' + err.message; }
      });
    });
  }

  // ------------------------------------------------------------------ saving: one commit with every change
  async function gh(token, path, opts = {}) {
    const r = await fetch(API + path, { ...opts, headers: { Authorization: 'Bearer ' + token, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json', ...(opts.headers || {}) } });
    if (!r.ok) { const t = await r.text(); const e = new Error(`GitHub ${r.status}: ${t.slice(0, 200)}`); e.status = r.status; throw e; }
    return r.json();
  }
  // keep every existing number that is still in order; give the others a number between their neighbours
  function renumber() {
    let prev = -Infinity;
    parts.forEach((p, i) => {
      const o = Number(p.ordine);
      if (Number.isFinite(o) && o > prev) { prev = o; return; }
      const nx = parts.slice(i + 1).map(q => Number(q.ordine)).find(v => Number.isFinite(v) && v > prev);
      const lo = Number.isFinite(prev) ? prev : 0;
      let v = nx === undefined ? Math.floor(lo / 10) * 10 + 10 : nx - lo >= 2 ? Math.floor((lo + nx) / 2) : +((lo + nx) / 2).toFixed(6);
      p.ordine = v; p._dirty = true; prev = v;
    });
  }
  const shown = {};                              // new images: show the local copy until the site has published them
  const local = x => { const o = { ...clean(x), _pid: x._id }; for (const k of ['immagine', 'immagine_destra']) if (shown[o[k]]) o[k] = shown[o[k]];
    if (o.body) for (const [u, d] of Object.entries(shown)) o.body = o.body.split('](' + u + ')').join('](' + d + ')'); return o; };
  async function save() {
    if (saving) return;
    syncBodies();
    const changed = parts.filter(p => p._dirty || p._new);
    if (!changed.length && !removed.length && !parts._moved) { say('Niente da salvare'); return; }
    const token = await getToken(); if (!token) return;
    saving = true; salva.disabled = true; say('Salvo…');
    try {
      // order: when parts moved or were added, renumber everything 10, 20, 30…
      renumber();
      const ref = await gh(token, `/git/ref/heads/${BRANCH}`);
      const head = await gh(token, `/git/commits/${ref.object.sha}`);
      const tree = [];
      // images still held as data: upload them as files in square/media
      const upload = async (data, name) => {
        const m = data.match(/^data:image\/(\w+);base64,(.*)$/); if (!m) return data;
        const keep = data;
        const ext = m[1] === 'jpeg' ? 'jpg' : m[1];
        const blob = await gh(token, '/git/blobs', { method: 'POST', body: JSON.stringify({ content: m[2], encoding: 'base64' }) });
        const path = `square/media/${slug(name)}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}.${ext}`;
        tree.push({ path, mode: '100644', type: 'blob', sha: blob.sha });
        shown['/' + path] = keep;
        return '/' + path;
      };
      for (const p of parts.filter(p => p._dirty || p._new)) {
        for (const k of ['immagine', 'immagine_destra']) if (p[k] && p[k].startsWith('data:')) p[k] = await upload(p[k], p.titolo || k);
        if (p.body && p.body.includes('data:image')) {
          const found = [...p.body.matchAll(/\]\((data:image\/[^)]+)\)/g)];
          for (const f of found) p.body = p.body.replace(f[1], await upload(f[1], (p.titolo || 'immagine') + '-testo'));
        }
        if (!p._file) {
          let base = `${String(p.ordine).padStart(4, '0')}-${slug(p.titolo)}`, name = base + '.md', k = 2;
          const taken = new Set(parts.map(x => x._file).filter(Boolean));
          while (taken.has(name)) name = `${base}-${k++}.md`;
          p._file = name;
        }
        tree.push({ path: DIR + p._file, mode: '100644', type: 'blob', content: fm(clean(p)) });
      }
      for (const p of removed) if (p._file) tree.push({ path: DIR + p._file, mode: '100644', type: 'blob', sha: null });
      // the book's data file, so the site does not have to wait for the rebuild
      const libro = { generato: new Date().toISOString(), parti: parts.filter(p => p.bozza !== true).map(p => ({ file: p._file, ...clean(p) })) };
      tree.push({ path: 'square/libro.json', mode: '100644', type: 'blob', content: JSON.stringify(libro, null, 1) });
      const nt = await gh(token, '/git/trees', { method: 'POST', body: JSON.stringify({ base_tree: head.tree.sha, tree }) });
      const n = changed.length + removed.length;
      const c = await gh(token, '/git/commits', { method: 'POST', body: JSON.stringify({ message: `Quadrante: ${n} ${n === 1 ? 'parte modificata' : 'parti modificate'} dall’editor`, tree: nt.sha, parents: [ref.object.sha] }) });
      await gh(token, `/git/refs/heads/${BRANCH}`, { method: 'PATCH', body: JSON.stringify({ sha: c.sha }) });
      // saved: this is now the book
      parts.forEach(p => { p._dirty = false; p._new = false; p._bodyChanged = false; p._orig = JSON.stringify(clean(p)); });
      parts._moved = false; removed = [];
      Q.libro = libro;
      document.querySelectorAll('.ed-dirty').forEach(s => s.classList.remove('ed-dirty'));
      salva.classList.remove('pending');
      say('Salvato. Il sito pubblico si aggiorna in circa un minuto.'); preview(true);
    } catch (e) {
      console.error(e);
      if (e.status === 401 || e.status === 403) { try { localStorage.removeItem(TOKEN_KEY); } catch (x) {} say('La chiave GitHub non funziona più: premi di nuovo Salva per collegarla.'); }
      else if (e.status === 422 || e.status === 409) say('Il sito è cambiato nel frattempo: premi di nuovo Salva.');
      else say('Non sono riuscito a salvare: ' + e.message);
    } finally { saving = false; salva.disabled = false; }
  }

  // ------------------------------------------------------------------ switching between reading and editing
  async function toggle() {
    const btn = $('#modifica');
    if (!editing) {
      if (!Q.libro) return;
      if (!parts.length) fromBook();
      editing = true; document.body.classList.add('editing'); btn.textContent = 'Chiudi';
      document.documentElement.style.setProperty('--barh', $('.barra').offsetHeight + 'px');
      $('#editor').hidden = false; build(); window.scrollTo(0, 0); Q.fit();
      // the pages already shown carry no part ids: lay them out once with ids
      preview(true);
    } else {
      syncBodies();
      clearTimeout(timer);
      editing = false; document.body.classList.remove('editing'); btn.textContent = 'Modifica';
      $('#editor').hidden = true; Q.fit();
      document.querySelectorAll('.spread.qui').forEach(x => x.classList.remove('qui'));
      say(parts.some(p => p._dirty) || removed.length || parts._moved ? 'Anteprima delle modifiche (non ancora salvate)' : stato.textContent);
      await Q.impagina(parts.filter(p => p.bozza !== true).map(local), Q.libro.generato);
      window.scrollTo(0, 0);
    }
  }
  $('#modifica').addEventListener('click', toggle);
  salva.addEventListener('click', save);
  addEventListener('keydown', e => { if (editing && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); save(); } });
  addEventListener('beforeunload', e => { if (parts.some(p => p._dirty) || removed.length || parts._moved) { e.preventDefault(); e.returnValue = ''; } });
  window.QE = { mdBlocks, fm, parts: () => parts, save, toggle };   // for tests
})();
