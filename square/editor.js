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
    'splash', 'bianco', 'negativo', 'scala', 'num_x', 'num_y', 'originale', 'crop', 'pagina_intera', 'senza_testata', 'nell_indice', 'bozza'];

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
  .ed-tools button { font: 13px Inter, sans-serif; color: var(--ui); background: #fff; border: 1px solid #c9c5c0; border-radius: 6px; padding: 5px 10px; cursor: pointer; min-width: 34px; }
  .ed-tools button:hover { border-color: #8f8a85; }
  .ed-tools .hint { width: 100%; text-align: center; font-size: 11.5px; color: #8a857f; letter-spacing: .02em; }
  .ed-tools .mic.on { background: #111; color: #fff; border-color: #111; animation: edpulse 1.4s ease-in-out infinite; }
  @keyframes edpulse { 50% { opacity: .55; } }
  .ed-interim { color: #9a958f; }
  .ed-tools .sep { width: 1px; background: #c9c5c0; margin: 2px 4px; }
  .ed-col { max-width: 700px; margin: 0 auto; }
  .ed-part { background: #fff; box-shadow: 0 2px 10px rgba(0,0,0,.08); margin: 0 0 4px; position: relative; }
  .ed-part.bozza { opacity: .55; }
  .ed-head { display: flex; align-items: center; gap: 6px; padding: 7px 10px; border-bottom: 1px solid #efedea; font-size: 12px; color: #77726d; letter-spacing: .03em; }
  .ed-head .grip { cursor: grab; touch-action: none; font-size: 15px; color: #9a958f; padding: 0 4px; user-select: none; }
  .ed-head button[aria-pressed="true"] { background: #1b1b1b; color: #fff; }
  .ed-part.dragging { opacity: .4; }
  .ed-part.drop-before { box-shadow: 0 -3px 0 #1f5fae, 0 2px 10px rgba(0,0,0,.08); }
  .ed-part.drop-after { box-shadow: 0 3px 0 #1f5fae, 0 2px 10px rgba(0,0,0,.08); }
  .ed-head .tt { flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ed-head button { font: 12px Inter, sans-serif; background: none; border: 1px solid transparent; border-radius: 5px; padding: 2px 7px; cursor: pointer; color: #55514c; }
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
  .ed-ap input { font: 200 40px Inter, sans-serif; border: 0; border-bottom: 1px dashed #ccc; width: 120px; padding: 2px 0; }
  .ed-ap input.t { font-size: 26px; font-weight: 400; width: 100%; }
  .ed-img { padding: 16px; display: flex; flex-direction: column; align-items: center; gap: 10px; }
  .ed-img img { max-width: 100%; max-height: 420px; display: block; box-shadow: 0 0 0 1px #eee; }
  .ed-img .due { display: flex; gap: 8px; width: 100%; } .ed-img .due > div { flex: 1; text-align: center; } .ed-img .due img { max-height: 260px; }
  .ed-img button, .ed-set button { font: 13px Inter, sans-serif; background: #fff; border: 1px solid #c9c5c0; border-radius: 6px; padding: 5px 12px; cursor: pointer; }
  .ed-set { padding: 12px 16px; background: #faf9f8; border-bottom: 1px solid #efedea; display: grid; grid-template-columns: 1fr 1fr; gap: 10px 16px; font-size: 13px; }
  .ed-set label { display: flex; flex-direction: column; gap: 3px; color: #55514c; }
  .ed-set label.chk { flex-direction: row; align-items: center; gap: 6px; }
  .ed-set input[type=text], .ed-set input[type=number], .ed-set select { font: 14px Inter, sans-serif; padding: 5px 7px; border: 1px solid #c9c5c0; border-radius: 5px; background: #fff; }
  .ed-add { display: flex; justify-content: center; padding: 6px 0 10px; position: relative; }
  .ed-add > button { font: 12px Inter, sans-serif; color: #77726d; background: none; border: 1px dashed #c9c5c0; border-radius: 999px; padding: 3px 12px; cursor: pointer; opacity: .55; }
  .ed-add > button:hover, .ed-add > button:focus { opacity: 1; background: #fff; }
  .ed-menu { position: absolute; top: 34px; z-index: 6; background: #fff; box-shadow: 0 6px 24px rgba(0,0,0,.18); border-radius: 8px; padding: 6px; display: flex; flex-direction: column; min-width: 220px; }
  .ed-menu button { text-align: left; font: 14px Inter, sans-serif; background: none; border: 0; padding: 7px 10px; border-radius: 5px; cursor: pointer; }
  .ed-menu button:hover { background: #f1efec; }
  .ed-modal { position: fixed; inset: 0; z-index: 20; background: rgba(20,20,20,.45); display: flex; align-items: center; justify-content: center; padding: 16px; }
  .ed-modal .box { background: #fff; max-width: 520px; width: 100%; border-radius: 10px; padding: 22px 24px; font-size: 14.5px; line-height: 1.5; }
  .ed-modal h3 { font-weight: 400; font-size: 20px; margin: 0 0 10px; }
  .ed-modal ol { padding-left: 1.2em; margin: 8px 0 14px; } .ed-modal li { margin: 0 0 6px; }
  .ed-modal input { width: 100%; font: 14px monospace; padding: 8px; border: 1px solid #c9c5c0; border-radius: 6px; margin: 4px 0 12px; }
  .ed-modal .row { display: flex; gap: 8px; justify-content: flex-end; }
  .ed-modal button { font: 14px Inter, sans-serif; border: 1px solid #c9c5c0; background: #fff; border-radius: 999px; padding: 6px 16px; cursor: pointer; }
  .ed-modal button.primary { background: #1b1b1b; color: #fff; border-color: #1b1b1b; }
  .ed-apimg { padding: 6px 0 0; align-items: flex-start; } .ed-apimg > img { max-height: 200px; }
  .ed-aprow { display: flex; flex-wrap: wrap; gap: 8px 16px; align-items: center; font-size: 14px; }
  .ed-lay label { display: flex; align-items: center; gap: 6px; cursor: pointer; }
  .ed-crop { position: relative; overflow: hidden; background: #000; cursor: grab; touch-action: none; margin: 0 auto 12px; user-select: none; }
  .ed-crop:active { cursor: grabbing; }
  .ed-crop img { position: absolute; left: 0; top: 0; max-width: none; transform-origin: 0 0; pointer-events: none; }
  .ed-crop .fold { position: absolute; left: 50%; top: 0; bottom: 0; width: 1px; background: rgba(255,255,255,.7); }
  .ed-crop .qq { position: absolute; pointer-events: none; }
  .ed-zoom { display: flex; align-items: center; gap: 10px; font-size: 13px; color: #555; margin: 0 0 14px; } .ed-zoom input { flex: 1; }
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
      if (n.nodeType !== 1 || n.classList.contains('ed-interim')) continue;
      const t = n.tagName, inner = () => mdInline(n);
      if (t === 'BR') { if (!trailingBr(n)) s += '\\\n'; }
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
  // a <br> with nothing after it in its paragraph is only the browser's placeholder for an empty line
  function trailingBr(n) {
    for (let x = n; x && !(x.nodeType === 1 && /^(P|DIV|H[1-6]|LI|BLOCKQUOTE|SECTION)$/.test(x.tagName)); x = x.parentNode) {
      for (let y = x.nextSibling; y; y = y.nextSibling) if ((y.nodeType === 3 && y.data.trim()) || (y.nodeType === 1 && (y.textContent.trim() || y.querySelector && (y.tagName === 'IMG' || y.querySelector('img'))))) return false;
    }
    return true;
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
    const negOn = (p.tipo === 'apertura' ? p.bianco === true : p.negativo === true);
    const negOk = !/^(foto|doppia|indice)$/.test(p.tipo || 'testo');
    sec.innerHTML = `<div class="ed-head"><span class="grip" title="Trascina per spostare la parte" aria-label="Trascina per spostare">⠿</span><span class="tt">${esc(label)}</span>
      ${negOk ? `<button data-a="neg" aria-pressed="${negOn}" title="${p.tipo === 'apertura' ? 'Pagina bianca invece che nera' : 'Negativo: pagina nera, testo bianco'}">◐ ${p.tipo === 'apertura' ? (negOn ? 'Bianca' : 'Nera') : (negOn ? 'Negativo' : 'Positivo')}</button>` : ''}
      <button data-a="su" title="Sposta su" aria-label="Sposta su">↑</button><button data-a="giu" title="Sposta giù" aria-label="Sposta giù">↓</button>
      <button data-a="imp" title="Impostazioni della parte">Impostazioni</button><button data-a="del" title="Elimina la parte">Elimina</button></div>
      <div class="ed-set" hidden></div>`;
    const tipo = p.tipo || 'testo';
    if (tipo === 'apertura') {
      const d = document.createElement('div'); d.className = 'ed-ap';
      d.innerHTML = `<input aria-label="Numero del capitolo (1 = 4⁰, 2 = 4¹, 3 = 4², 4 = 4³)" title="1 = 4⁰, 2 = 4¹, 3 = 4², 4 = 4³" class="n" value="${esc(p.numero || '')}"><input aria-label="Titolo del capitolo" class="t" value="${esc(p.titolo || '')}">
        <div class="ed-img ed-apimg"><img src="${esc(shown[p.immagine] || p.immagine || '')}" alt="" ${p.immagine ? '' : 'hidden'}>
          <div class="ed-aprow"><button data-img="immagine">${p.immagine ? 'Cambia immagine' : 'Aggiungi un’immagine'}</button>${p.immagine ? '<button data-crop="1">Ritaglia</button>' : ''}</div>
          ${p.immagine ? `<div class="ed-aprow ed-lay" role="radiogroup" aria-label="Impaginazione dell’apertura">
            <label><input type="radio" name="lay${p._id}" value="splash" ${p.splash === true ? 'checked' : ''}> Su due pagine</label>
            <label><input type="radio" name="lay${p._id}" value="pagina" ${p.splash === true ? '' : 'checked'}> Una pagina, l’altra nera</label>
            <label class="wq" ${p.splash === true ? '' : 'hidden'}><input type="checkbox" class="bianco" ${p.bianco === true ? 'checked' : ''}> Quadrato bianco</label></div>` : ''}</div>`;
      d.addEventListener('change', e => {
        if (e.target.type === 'radio') { const sp = e.target.value === 'splash'; if (sp !== (p.splash === true)) { p.splash = sp; if (!sp) p.bianco = false; cropImage(p); } }
        if (e.target.classList.contains('bianco')) { p.bianco = e.target.checked; dirty(p); }
      });
      d.addEventListener('input', e => { if (!e.target.matches('input.n, input.t')) return; p.numero = $('.n', d).value; p.titolo = $('.t', d).value; if (!p.capitolo || p.capitolo === p._capPrev) p.capitolo = p.titolo; p._capPrev = p.titolo; dirty(p); });
      p._capPrev = p.capitolo;
      sec.appendChild(d);
    } else if (IMMAGINE.has(tipo)) {
      const d = document.createElement('div'); d.className = 'ed-img';
      const pic = (src, key) => `<div><img src="${esc(shown[src] || src || '')}" alt="" ${src ? '' : 'hidden'}><br><button data-img="${key}">${src ? 'Cambia immagine' : 'Scegli immagine'}</button></div>`;
      d.innerHTML = tipo === 'doppia-figura' ? `<div class="due">${pic(p.immagine, 'immagine')}${pic(p.immagine_destra, 'immagine_destra')}</div>` : pic(p.immagine, 'immagine');
      if ((tipo === 'figura' || tipo === 'disegno') && p.immagine) {   // size: always centred, same place on the page
        const k = +p.scala || 100;
        d.insertAdjacentHTML('beforeend', `<label class="ed-zoom" style="width:100%;margin:0">Dimensione <input type="range" min="40" max="100" step="1" value="${k}" data-k="scala"><span class="v">${k}%</span></label>`);
        const r = d.querySelector('input[data-k=scala]');
        r.addEventListener('input', () => { p.scala = +r.value; r.nextElementSibling.textContent = r.value + '%'; dirty(p); });
      }
      if ((tipo === 'foto' || tipo === 'doppia') && p.immagine) {      // a photo: one page or a splash across two, and its crop
        d.insertAdjacentHTML('beforeend', `<div class="ed-aprow"><button data-crop="1">Ritaglia</button></div>
          <div class="ed-aprow ed-lay" role="radiogroup" aria-label="Impaginazione della foto">
          <label><input type="radio" name="fl${p._id}" value="doppia" ${tipo === 'doppia' ? 'checked' : ''}> Su due pagine</label>
          <label><input type="radio" name="fl${p._id}" value="foto" ${tipo === 'foto' ? 'checked' : ''}> Una pagina</label></div>`);
        d.addEventListener('change', e => { if (e.target.type === 'radio' && e.target.value !== p.tipo) { p.tipo = e.target.value; cropImage(p); } });
      }
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
    b.addEventListener('keydown', e => {
      if (e.key !== 'Enter' || e.isComposing) return;
      // like a typewriter: Enter = a capo (new line, no space); Enter on the empty new line = new paragraph
      const sel = getSelection();
      if (!e.shiftKey && sel.rangeCount) {
        let blk = sel.anchorNode; while (blk && blk.parentNode !== b) blk = blk.parentNode;
        const inList = sel.anchorNode && (sel.anchorNode.nodeType === 1 ? sel.anchorNode : sel.anchorNode.parentElement).closest('li');
        if (blk && blk.nodeType === 1 && /^(P|DIV|BLOCKQUOTE)$/.test(blk.tagName) && !inList) {
          e.preventDefault();
          const r = sel.getRangeAt(0).cloneRange(); r.setStart(blk, 0);
          const before = r.cloneContents();
          let last = before.lastChild; while (last && last.nodeType === 1 && last.tagName !== 'BR' && last.lastChild) last = last.lastChild;
          while (last && last.nodeType === 3 && !last.data.length) last = last.previousSibling;
          if (last && last.nodeName === 'BR' && blk.textContent.trim()) { document.execCommand('delete'); document.execCommand('insertParagraph'); }
          else if (!blk.textContent.trim()) document.execCommand('insertParagraph');
          else { document.execCommand('insertLineBreak'); dirty(p, b); return; }
        }
      }
      setTimeout(() => {                                        // a new paragraph starts plain, not in the style of the last word
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
    salva.classList.add('pending'); if (!dictating) say('Modifiche non salvate');
    preview(); backupSoon();
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
    if (tipo === 'apertura') h += f('numero', 'Numero del capitolo (1 = 4⁰ … 4 = 4³)') + c('splash', 'L’immagine occupa tutte e due le pagine') + c('bianco', 'Quadrato bianco invece che nero (solo con l’immagine su due pagine)');
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
      if ((p.tipo === 'apertura' || p.tipo === 'foto' || p.tipo === 'doppia') && key === 'immagine') { p.originale = await prepare(f, 5400); return cropImage(p); }
      const data = await prepare(f);
      if (insertInto) { insertInto.focus(); document.execCommand('insertHTML', false, `<img src="${data}" alt="">`); dirty(p, insertInto); return; }
      p[key] = data; p._dirty = true; redraw(p); dirty(p);
    };
    inp.click();
  }
  function prepare(file, max = 2800) {
    return new Promise((ok, ko) => {
      const r = new FileReader();
      r.onload = () => {
        const im = new Image();
        im.onload = () => {
          const k = Math.min(1, max / Math.max(im.width, im.height));
          if (k === 1 && file.size < 4e6 && /png|jpe?g|webp/.test(file.type)) return ok(r.result);
          const c = document.createElement('canvas'); c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
          c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); ok(c.toDataURL('image/jpeg', 0.9));
        };
        im.onerror = ko; im.src = r.result;
      };
      r.onerror = ko; r.readAsDataURL(file);
    });
  }

  // ------------------------------------------------------------------ cropping a chapter image
  // A square for one page, 2:1 for both pages. Drag the image, zoom with the slider; the frame is the page.
  function cropImage(p) {
    const src = shown[p.originale] || p.originale || shown[p.immagine] || p.immagine;
    if (!src) return;
    const ratio = (p.tipo === 'apertura' ? p.splash === true : p.tipo === 'doppia') ? 2 : 1;
    const m = modal(`<h3>Ritaglia l’immagine</h3><p style="margin:0 0 10px;color:#666">${ratio === 2 ? 'Due pagine affiancate: la linea al centro è la piega del libro.' : 'Una pagina quadrata.'} Trascina l’immagine, usa il cursore per ingrandire.</p>
      <div class="ed-crop"><img alt="" draggable="false"><i class="fold" ${ratio === 2 ? '' : 'hidden'}></i><i class="qq"></i></div>
      <label class="ed-zoom">Ingrandimento <input type="range" min="1" max="4" step="0.01" value="1"></label>
      <div class="row"><button data-x>Annulla</button><button class="primary" data-ok>Usa questo ritaglio</button></div>`);
    m.querySelector('.box').style.maxWidth = ratio === 2 ? '900px' : '620px';
    const box = $('.ed-crop', m), img = $('img', box), zoom = $('input[type=range]', m), qq = $('.qq', box);
    const W = Math.min(ratio === 2 ? 840 : 560, innerWidth - 80), H = W / ratio;
    box.style.width = W + 'px'; box.style.height = H + 'px';
    // where the black square will sit: the chapter's quarter of the right-hand page
    const n = parseInt(p.numero, 10), q = isNaN(n) ? 0 : (n - 1) % 4;
    if (ratio === 2 && p.tipo === 'apertura') Object.assign(qq.style, { left: (W / 2 + (q % 2) * W / 4) + 'px', top: (Math.floor(q / 2) * H / 2) + 'px', width: W / 4 + 'px', height: H / 2 + 'px', background: p.bianco === true ? 'rgba(255,255,255,.85)' : 'rgba(0,0,0,.8)' });
    else qq.hidden = true;
    let iw, ih, base, z = 1, x = 0, y = 0;
    const cp = String(p.crop || '').split(',').map(Number), c0 = cp.length === 4 && cp[0] === ratio ? { z: cp[1], x: cp[2], y: cp[3] } : null;
    const clamp = () => { const w = iw * base * z, h = ih * base * z; x = Math.min(0, Math.max(W - w, x)); y = Math.min(0, Math.max(H - h, y)); };
    const draw = () => { clamp(); img.style.width = iw * base * z + 'px'; img.style.transform = `translate(${x}px,${y}px)`; };
    img.onload = () => {
      iw = img.naturalWidth; ih = img.naturalHeight; base = Math.max(W / iw, H / ih);
      if (c0) { z = c0.z; zoom.value = z; x = c0.x * W; y = c0.y * H; } else { x = (W - iw * base) / 2; y = (H - ih * base) / 2; }
      draw();
    };
    img.src = src;
    zoom.oninput = () => { const cx = (W / 2 - x) / z, cy = (H / 2 - y) / z; z = +zoom.value; x = W / 2 - cx * z; y = H / 2 - cy * z; draw(); };
    box.addEventListener('wheel', e => { e.preventDefault(); zoom.value = Math.min(4, Math.max(1, z * (e.deltaY < 0 ? 1.06 : 1 / 1.06))); zoom.oninput(); }, { passive: false });
    let drag = null;
    box.addEventListener('pointerdown', e => { drag = { sx: e.clientX, sy: e.clientY, x, y }; box.setPointerCapture(e.pointerId); });
    box.addEventListener('pointermove', e => { if (!drag) return; x = drag.x + e.clientX - drag.sx; y = drag.y + e.clientY - drag.sy; draw(); });
    box.addEventListener('pointerup', () => { drag = null; });
    m.addEventListener('click', e => {
      if (e.target.dataset.x !== undefined) { m.remove(); redraw(p); dirty(p); return; }
      if (e.target.dataset.ok === undefined) return;
      // render the crop at print resolution (8.5 in at 300 dpi per page), never larger than the source allows
      const s = base * z, sx = -x / s, sy = -y / s, sw = W / s, sh = H / s;
      const outW = ratio * 2625, outH = 2625;
      const c = document.createElement('canvas'); c.width = outW; c.height = outH;
      const g = c.getContext('2d'); g.imageSmoothingQuality = 'high'; g.drawImage(img, sx, sy, sw, sh, 0, 0, outW, outH);
      if (!p.originale) p.originale = p.immagine;
      p.immagine = c.toDataURL('image/jpeg', 0.9);
      p.crop = [ratio, z, x / W, y / H].map(v => +(+v).toFixed(4)).join(',');
      m.remove(); redraw(p); dirty(p);
    });
  }

  // ------------------------------------------------------------------ the editing page
  function build() {
    const ed = $('#editor');
    ed.innerHTML = `<div class="ed-tools" role="toolbar" aria-label="Formattazione">
      <button data-c="p" title="Testo normale">Testo</button><button data-c="h2" title="Titolo">Titolo</button><button data-c="h3" title="Sottotitolo">Sottotitolo</button>
      <span class="sep"></span><button data-c="bold" title="Grassetto"><b>G</b></button><button data-c="italic" title="Corsivo"><i>C</i></button>
      <span class="sep"></span><button data-c="ul" title="Elenco">• Elenco</button><button data-c="blockquote" title="Citazione rientrata">Citazione</button>
      <button data-c="img" title="Inserisci un’immagine nel testo">Immagine</button><span class="sep"></span><button data-c="undo" title="Annulla">↶</button><button data-c="redo" title="Ripeti">↷</button><span class="sep"></span><button data-c="mic" class="mic" title="Detta: parla e il testo si scrive dove c’è il cursore">● Detta</button><button data-c="lang" class="lang" title="Lingua della dettatura">IT</button><span class="hint">Invio: a capo · Invio due volte: nuovo paragrafo · Detta: «virgola», «punto», «a capo», «nuovo paragrafo»</span>
      </div><div class="ed-col"></div>`;
    const col = $('.ed-col', ed);
    const add = i => { const d = document.createElement('div'); d.className = 'ed-add'; d.innerHTML = `<button type="button" data-at="${i}">+ Aggiungi qui</button>`; return d; };
    col.appendChild(add(0));
    parts.forEach((p, i) => { const s = partEl(p); if (p._dirty) s.classList.add('ed-dirty'); col.appendChild(s); col.appendChild(add(i + 1)); });
    let lastBody = null;
    // drag a part by its handle (mouse or finger); a blue line shows where it will land
    let drag = null;
    const clearMarks = () => col.querySelectorAll('.drop-before,.drop-after,.dragging').forEach(x => x.classList.remove('drop-before', 'drop-after', 'dragging'));
    col.addEventListener('pointerdown', ev => {
      const g = ev.target.closest && ev.target.closest('.grip'); if (!g) return;
      ev.preventDefault(); const sec = g.closest('.ed-part');
      drag = { id: +sec.dataset.id, target: null, after: false, pid: ev.pointerId }; sec.classList.add('dragging'); g.setPointerCapture(ev.pointerId);
    });
    col.addEventListener('pointermove', ev => {
      if (!drag) return;
      if (ev.clientY < 90) scrollBy(0, -14); else if (ev.clientY > innerHeight - 50) scrollBy(0, 14);
      const el = document.elementFromPoint(Math.min(ev.clientX, col.getBoundingClientRect().right - 10), ev.clientY);
      const sec = el && el.closest && el.closest('.ed-part'); if (!sec || !col.contains(sec)) return;
      const r = sec.getBoundingClientRect(), after = ev.clientY > r.top + r.height / 2;
      col.querySelectorAll('.drop-before,.drop-after').forEach(x => x.classList.remove('drop-before', 'drop-after'));
      if (+sec.dataset.id !== drag.id) { sec.classList.add(after ? 'drop-after' : 'drop-before'); drag.target = +sec.dataset.id; drag.after = after; } else drag.target = null;
    });
    const endDrag = () => {
      if (!drag) return; const d = drag; drag = null; clearMarks();
      if (d.target == null) return;
      syncBodies();
      const from = parts.findIndex(x => x._id === d.id), moving = parts.splice(from, 1)[0];
      let to = parts.findIndex(x => x._id === d.target); if (d.after) to++;
      parts.splice(to, 0, moving); parts._moved = true;
      build(); focusPart(moving); salva.classList.add('pending'); say('Modifiche non salvate');
    };
    col.addEventListener('pointerup', endDrag); col.addEventListener('pointercancel', () => { drag = null; clearMarks(); });
    col.addEventListener('focusin', e => {
      if (e.target.classList && e.target.classList.contains('ed-body')) lastBody = e.target;
      const sec = e.target.closest && e.target.closest('.ed-part'); if (sec) { focusId = +sec.dataset.id; follow(focusId); }
    });
    col.addEventListener('click', e => { const sec = e.target.closest('.ed-part'); if (sec && +sec.dataset.id !== focusId) { focusId = +sec.dataset.id; follow(focusId); } });
    $('.ed-tools .lang', ed).textContent = dictLang === 'it-IT' ? 'IT' : 'EN';
    if (dictating) $('.ed-tools .mic', ed).classList.add('on'), $('.ed-tools .mic', ed).textContent = '■ Ferma';
    $('.ed-tools', ed).addEventListener('mousedown', e => e.preventDefault());   // keep the selection in the text
    $('.ed-tools', ed).addEventListener('click', e => {
      const c = e.target.closest('button') && e.target.closest('button').dataset.c; if (!c) return;
      const b = document.activeElement && document.activeElement.classList.contains('ed-body') ? document.activeElement : lastBody;
      if (!b) { say('Clicca prima dentro un testo'); return; }
      b.focus();
      const p = parts.find(x => x._bodyEl === b);
      if (c === 'mic') return dictating ? stopDictation() : startDictation(b, p);
      if (c === 'lang') { dictLang = dictLang === 'it-IT' ? 'en-US' : 'it-IT'; e.target.closest('button').textContent = dictLang === 'it-IT' ? 'IT' : 'EN'; if (dictating) { stopDictation(); startDictation(b, p); } return; }
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
      if (btn.dataset.crop) return cropImage(p);
      if (btn.dataset.img) return pickImage(p, btn.dataset.img);
      const a = btn.dataset.a;
      if (a === 'imp') { const box = $('.ed-set', sec); if (!box.innerHTML) settings(p, box); box.hidden = !box.hidden; }
      if (a === 'neg') { if (p.tipo === 'apertura') p.bianco = !(p.bianco === true); else p.negativo = !(p.negativo === true); syncBodies(); redraw(p); dirty(p); return; }
      if (a === 'su' && i > 0) { syncBodies(); [parts[i - 1], parts[i]] = [parts[i], parts[i - 1]]; parts._moved = true; build(); focusPart(p); salva.classList.add('pending'); say('Modifiche non salvate'); }
      if (a === 'giu' && i < parts.length - 1) { syncBodies(); [parts[i + 1], parts[i]] = [parts[i], parts[i + 1]]; parts._moved = true; build(); focusPart(p); salva.classList.add('pending'); say('Modifiche non salvate'); }
      if (a === 'del') confirmBox('Eliminare questa parte?', `«${esc(p.titolo || TIPI[p.tipo] || '')}» sparirà dal libro quando salvi.`, 'Elimina', () => {
        syncBodies(); parts.splice(i, 1); if (!p._new) removed.push(p); build(); salva.classList.add('pending'); say('Modifiche non salvate'); preview(true);
      });
    });
  }
  function focusPart(p) { focusId = p._id; preview(true); const s = document.querySelector(`.ed-part[data-id="${p._id}"]`); if (s) s.scrollIntoView({ block: 'center' }); }
  function syncBodies() { parts.forEach(p => { if (p._bodyEl && p._bodyChanged) { p.body = mdBlocks(p._bodyEl); p._bodyChanged = false; } }); }


  // ------------------------------------------------------------------ dictation: speak, and the words are written where the cursor is
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  let dictating = false, fresh = false, rec = null, recBody = null, recPart = null, interim = null, wake = null, dictLang = 'it-IT';
  try { dictLang = localStorage.getItem('quadrante-lingua') || 'it-IT'; } catch (e) {}
  const CMD = {
    'it-IT': [[/\bnuovo paragrafo\b/gi, '\u0001P'], [/\ba capo\b/gi, '\u0001B'], [/\bpunto e virgola\b/gi, '\u0001;'], [/\bdue punti\b/gi, '\u0001:'],
              [/\bpunto interrogativo\b/gi, '\u0001?'], [/\bpunto esclamativo\b/gi, '\u0001!'], [/\bvirgola\b/gi, '\u0001,'],
              [/\bapri virgolette\b/gi, '\u0001«'], [/\bchiudi virgolette\b/gi, '\u0001»'], [/\bpunto(?=\s*(\u0001|$))/gi, '\u0001.']],
    'en-US': [[/\bnew paragraph\b/gi, '\u0001P'], [/\bnew line\b/gi, '\u0001B'], [/\bsemicolon\b/gi, '\u0001;'], [/\bcolon\b/gi, '\u0001:'],
              [/\bquestion mark\b/gi, '\u0001?'], [/\bexclamation (mark|point)\b/gi, '\u0001!'], [/\bcomma\b/gi, '\u0001,'],
              [/\bopen quotes?\b/gi, '\u0001«'], [/\bclose quotes?\b/gi, '\u0001»'], [/\b(period|full stop)(?=\s*(\u0001|$))/gi, '\u0001.']]};
  function caretRange() {
    const sel = getSelection();
    if (sel.rangeCount && recBody.contains(sel.anchorNode)) return sel.getRangeAt(0);
    const r = document.createRange(); r.selectNodeContents(recBody.lastElementChild || recBody); r.collapse(false); return r;
  }
  function placeCaret(node, after) {
    const r = document.createRange(); after ? r.setStartAfter(node) : r.setStartBefore(node); r.collapse(true);
    const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r);
  }
  function textBefore() {                         // the text just before the cursor, inside the same paragraph
    const sel = getSelection(); if (!sel.rangeCount) return '';
    let blk = sel.anchorNode; while (blk && blk.parentNode !== recBody) blk = blk.parentNode;
    if (!blk) return '';
    const r = sel.getRangeAt(0).cloneRange(); r.setStart(blk, 0);
    return r.toString();
  }
  function showInterim(t) {
    if (!t) { if (interim) { placeCaret(interim); interim.remove(); interim = null; } return; }
    if (!interim) {
      interim = document.createElement('span'); interim.className = 'ed-interim';
      const r = caretRange(); r.insertNode(interim); placeCaret(interim, true);
    }
    interim.textContent = (/\S$/.test(textBefore().replace(interim.textContent, '')) ? ' ' : '') + t;
  }
  function commit(t) {
    if (interim) { placeCaret(interim); interim.remove(); interim = null; }
    else { const r = caretRange(); const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r); }
    let x = ' ' + t.trim() + ' ';
    for (const [re, rep] of CMD[dictLang]) x = x.replace(re, rep);
    for (const piece of x.split(/(\u0001.)/)) {
      if (!piece) continue;
      if (piece[0] === '\u0001') {
        const k = piece[1];
        if (k === 'P') { document.execCommand('insertParagraph'); fresh = true; }
        else if (k === 'B') { document.execCommand('insertLineBreak'); fresh = true; }
        else if (k === '«') document.execCommand('insertText', false, (/\S$/.test(textBefore()) ? ' ' : '') + '«');
        else { const b = textBefore(); if (/ $/.test(b)) document.execCommand('delete'); document.execCommand('insertText', false, k); }
        continue;
      }
      let w = piece.replace(/\s+/g, ' ').trim(); if (!w) continue;
      const b = textBefore();
      if (fresh || !b.trim() || /[.!?]\s*$/.test(b)) w = w[0].toUpperCase() + w.slice(1);
      if (!fresh && b && !/[\s«]$/.test(b)) w = ' ' + w;
      fresh = false;
      document.execCommand('insertText', false, w);
    }
    if (recPart) dirty(recPart, recBody);
  }
  function startDictation(b, p) {
    if (!SR) { say('Questo browser non sa dettare: usa il microfono della tastiera del telefono (funziona uguale).'); return; }
    recBody = b; recPart = p; dictating = true; fresh = false;
    try { localStorage.setItem('quadrante-lingua', dictLang); } catch (e) {}
    const btn = $('.ed-tools .mic'); if (btn) { btn.classList.add('on'); btn.textContent = '■ Ferma'; }
    try { if (navigator.wakeLock) navigator.wakeLock.request('screen').then(w => { if (dictating) wake = w; else w.release(); }).catch(() => {}); } catch (e) {}   // keep the screen on while dictating
    const go = () => {
      rec = new SR(); rec.lang = dictLang; rec.continuous = true; rec.interimResults = true;
      rec.onresult = e => {
        let fin = '', mid = '';
        for (let i = e.resultIndex; i < e.results.length; i++) (e.results[i].isFinal ? (fin += e.results[i][0].transcript) : (mid += e.results[i][0].transcript));
        if (fin) commit(fin);
        showInterim(mid.trim());
      };
      rec.onerror = e => {
        if (e.error === 'not-allowed' || e.error === 'service-not-allowed') { say('Il microfono non è autorizzato: permettilo nelle impostazioni del browser.'); stopDictation(); }
        else if (e.error === 'network') say('Dettatura: serve la connessione.');
      };
      rec.onend = () => { if (dictating) setTimeout(() => { if (dictating) try { go(); } catch (x) {} }, 250); };   // the browser stops after a silence: start again
      try { rec.start(); say(dictLang === 'it-IT' ? 'Ti ascolto… (premi Ferma quando hai finito, poi Salva)' : 'Listening… (press Ferma when done, then Salva)'); } catch (x) {}
    };
    recBody.focus(); go();
  }
  function stopDictation() {
    dictating = false;
    try { rec && rec.stop(); } catch (e) {}
    rec = null; showInterim('');
    try { wake && wake.release(); } catch (e) {} wake = null;
    const btn = $('.ed-tools .mic'); if (btn) { btn.classList.remove('on'); btn.textContent = '● Detta'; }
    say(parts.some(p => p._dirty) ? 'Dettatura finita. Modifiche non salvate: premi Salva.' : 'Dettatura finita.');
  }
  document.addEventListener('visibilitychange', () => { if (dictating && document.visibilityState === 'visible' && navigator.wakeLock) navigator.wakeLock.request('screen').then(w => wake = w).catch(() => {}); });

  // ------------------------------------------------------------------ a copy of unsaved text on this device, in case the page closes
  const BACKUP = 'quadrante-bozza';
  let backupTimer = null;
  function backupSoon() {
    clearTimeout(backupTimer);
    backupTimer = setTimeout(() => {
      try {
        syncBodies();
        const keep = {}; parts.forEach(p => { if (p._dirty && p._file && typeof p.body === 'string') keep[p._file] = p.body; });
        if (Object.keys(keep).length) localStorage.setItem(BACKUP, JSON.stringify({ quando: Date.now(), testi: keep }));
      } catch (e) {}
    }, 1500);
  }
  function restoreBackup() {
    let b = null; try { b = JSON.parse(localStorage.getItem(BACKUP) || 'null'); } catch (e) {}
    if (!b || !b.testi) return 0;
    let n = 0;
    for (const p of parts) if (p._file && b.testi[p._file] !== undefined && b.testi[p._file] !== p.body) { p.body = b.testi[p._file]; p._dirty = true; n++; }
    return n;
  }

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
        for (const k of ['immagine', 'immagine_destra', 'originale']) if (p[k] && p[k].startsWith('data:')) p[k] = await upload(p[k], p.titolo || k);
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
      try { localStorage.removeItem(BACKUP); } catch (x) {}
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
      if (!parts.length) { fromBook(); const n = restoreBackup(); if (n) { salva.classList.add('pending'); setTimeout(() => say(`Recuperato il testo non salvato di ${n} ${n === 1 ? 'parte' : 'parti'} da questo dispositivo: premi Salva per tenerlo.`), 800); } }
      editing = true; document.body.classList.add('editing'); btn.textContent = 'Chiudi';
      document.documentElement.style.setProperty('--barh', $('.barra').offsetHeight + 'px');
      $('#editor').hidden = false; build(); window.scrollTo(0, 0); Q.fit();
      // the pages already shown carry no part ids: lay them out once with ids
      preview(true);
    } else {
      if (dictating) stopDictation();
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
