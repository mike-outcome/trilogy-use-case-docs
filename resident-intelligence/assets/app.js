/* ============================================================================
   Trilogy Resident Intelligence — shared mockup behaviour
   Renders the app shell, and wires theme / spec-mode / tooltips / table views.
   No dependencies. Everything here is presentational scaffolding for the
   mockups — it is NOT intended as production code.
   ========================================================================= */

const SCREENS = [
  { id:'overview',  href:'01-portfolio-overview.html', label:'Portfolio Overview', icon:'M3 13h4v8H3zM10 3h4v18h-4zM17 9h4v12h-4z' },
  { id:'cohort',    href:'02-cohort-explorer.html',    label:'Cohort Explorer',    icon:'M3 5h18M6 12h12M10 19h4' },
  { id:'origin',    href:'03-origin-flow-map.html',    label:'Origin Flow Map',    icon:'M12 21s7-6.4 7-11a7 7 0 1 0-14 0c0 4.6 7 11 7 11z M12 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z' },
  { id:'person',    href:'04-person-profile.html',     label:'Person Profile',     icon:'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4 3.6-6 8-6s8 2 8 6' },
  { id:'compare',   href:'05-segment-comparison.html', label:'Segment Comparison', icon:'M12 3v18M7 8H4v8h3zM20 6h-3v12h3z' },
  { id:'quality',   href:'06-data-quality-console.html', label:'Data Quality',     icon:'M12 3l8 4v6c0 4.4-3.4 7.6-8 8-4.6-.4-8-3.6-8-8V7zM9 12l2 2 4-4' },
];

/* ---------------------------------------------------------------- shell -- */
function shell(activeId, crumb) {
  const nav = SCREENS.map((s, i) => `
    <a href="${s.href}" class="${s.id === activeId ? 'on' : ''}">
      <svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
           stroke-linecap="round" stroke-linejoin="round"><path d="${s.icon}"/></svg>
      <span>${i + 1}. ${s.label}</span>
    </a>`).join('');

  document.querySelector('.side').innerHTML = `
    <div class="brand">
      <div class="logo">T</div>
      <div class="brand-t">Resident Intelligence<span>Trilogy × Outcome</span></div>
    </div>
    <div class="nav-label">Screens</div>
    <nav class="nav">${nav}</nav>
    <div class="nav-label">Reference</div>
    <nav class="nav">
      <a href="index.html">
        <svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
             stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16v14H4zM4 9h16"/></svg>
        <span>Overview &amp; design system</span>
      </a>
    </nav>
    <div class="side-foot">
      Mockup v1 · Riverset Apartments<br>Data export cut-off 25 May 2026
    </div>`;

  document.querySelector('.top').insertAdjacentHTML('afterbegin',
    `<div class="crumb">Resident Intelligence &nbsp;/&nbsp; <b>${crumb}</b></div>`);

  document.querySelector('.top-right').insertAdjacentHTML('beforeend', `
    <button class="btn" id="specBtn" title="Show data-binding annotations for the engineer">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
           stroke-linecap="round" stroke-linejoin="round"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></svg>
      Spec mode
    </button>
    <button class="btn" id="themeBtn" title="Toggle light / dark" aria-label="Toggle theme">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
           stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v2M12 19v2M5 12H3M21 12h-2M6 6L4.6 4.6M19.4 19.4 18 18M6 18l-1.4 1.4M19.4 4.6 18 6"/><circle cx="12" cy="12" r="3.6"/></svg>
    </button>`);

  // spec mode
  const spec = localStorage.getItem('tri-spec') === '1';
  if (spec) { document.body.classList.add('spec'); document.getElementById('specBtn').classList.add('on'); }
  document.getElementById('specBtn').onclick = () => {
    const on = document.body.classList.toggle('spec');
    document.getElementById('specBtn').classList.toggle('on', on);
    localStorage.setItem('tri-spec', on ? '1' : '0');
  };

  // theme
  const saved = localStorage.getItem('tri-theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);
  document.getElementById('themeBtn').onclick = () => {
    const cur = document.documentElement.getAttribute('data-theme')
      || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('tri-theme', next);
  };

  wireTables();
  wireTips();
}

/* --------------------------------------------------- table-view toggles -- */
function wireTables() {
  document.querySelectorAll('[data-table-toggle]').forEach(btn => {
    btn.onclick = () => {
      const card = btn.closest('.card');
      const on = card.classList.toggle('showtable');
      btn.classList.toggle('on', on);
      btn.textContent = on ? 'Chart' : 'Table';
    };
  });
}

/* ------------------------------------------------------------- tooltips -- */
let tipEl;
function wireTips() {
  tipEl = document.createElement('div');
  tipEl.className = 'tip';
  document.body.appendChild(tipEl);

  document.addEventListener('mouseover', e => {
    const t = e.target.closest('[data-tip]');
    if (!t) return;
    tipEl.innerHTML = t.getAttribute('data-tip');
    tipEl.classList.add('on');
    move(e);
  });
  document.addEventListener('mousemove', e => { if (tipEl.classList.contains('on')) move(e); });
  document.addEventListener('mouseout', e => {
    if (e.target.closest('[data-tip]')) tipEl.classList.remove('on');
  });
  // keyboard parity — focus shows the same as hover
  document.addEventListener('focusin', e => {
    const t = e.target.closest('[data-tip]');
    if (!t) return;
    const r = t.getBoundingClientRect();
    tipEl.innerHTML = t.getAttribute('data-tip');
    tipEl.classList.add('on');
    place(r.left + r.width / 2, r.top);
  });
  document.addEventListener('focusout', () => tipEl.classList.remove('on'));

  function move(e) { place(e.clientX, e.clientY); }
  function place(x, y) {
    const r = tipEl.getBoundingClientRect();
    let left = x + 14, top = y - r.height - 10;
    if (left + r.width > innerWidth - 10) left = x - r.width - 14;
    if (top < 10) top = y + 18;
    tipEl.style.left = left + 'px';
    tipEl.style.top = top + 'px';
  }
}

/* -------------------------------------------------------------- helpers -- */
const fmt  = n => n.toLocaleString('en-US');
const pct  = (n, d) => (100 * n / d).toFixed(d > 400 ? 1 : 0) + '%';
const usd  = n => '$' + n.toLocaleString('en-US');

/** Horizontal bar row set. Marks: <=24px thick, 4px rounded data-end,
 *  square at the baseline, 2px surface gap between adjacent bars. */
function hbars(el, rows, opts = {}) {
  const w = opts.w || 560, rowH = opts.rowH || 30, barH = Math.min(opts.barH || 18, 24);
  const padL = opts.padL || 168, padR = opts.padR || 58;
  const max = opts.max || Math.max(...rows.map(r => r.v));
  const h = rows.length * rowH;
  const plot = w - padL - padR;
  const bars = rows.map((r, i) => {
    const y = i * rowH + (rowH - barH) / 2;
    const bw = Math.max(2, plot * r.v / max);
    const fill = r.color || 'var(--s1)';
    return `
      <g>
        <text class="axlbl" x="${padL - 10}" y="${y + barH / 2 + 4}" text-anchor="end">${r.k}</text>
        <path d="M${padL},${y} h${bw - 4} a4,4 0 0 1 4,4 v${barH - 8} a4,4 0 0 1 -4,4 h-${bw - 4} z" fill="${fill}"/>
        <text class="vlbl" x="${padL + bw + 8}" y="${y + barH / 2 + 4}">${r.lab ?? fmt(r.v)}</text>
        <rect class="hit" x="0" y="${i * rowH}" width="${w}" height="${rowH}" tabindex="0"
              data-tip="<div class='t-h'>${r.k}</div><div class='t-r'><span>${opts.metric || 'Count'}</span><b>${r.tipv ?? fmt(r.v)}</b></div>${r.tip || ''}"/>
      </g>`;
  }).join('');
  el.innerHTML = `<svg class="chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="${opts.aria || ''}">
      <line class="baseline" x1="${padL}" y1="0" x2="${padL}" y2="${h}"/>${bars}</svg>`;
}
