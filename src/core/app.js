import { getPack } from '../packs/index.js';
import { RADII } from './constants.js';
import { escapeHtml, delay, must, svgEl } from './dom.js';
import { assertUniqueIds, buildLayout, flattenPack, polar } from './layout.js';
import { createViewportController } from './viewport.js';
import { fetchWikipediaIntroForNode, wikipediaUrl } from './wikipedia.js';

const requestedPack = window.__CODEX_PACK__ || 'human-body';
const pack = getPack(requestedPack);
document.documentElement.dataset.codexPack = pack.id;
let theme = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
const flat = flattenPack(pack);
assertUniqueIds(flat);
const nodeById = new Map(flat.map((node) => [node.id, node]));
const layout = buildLayout(pack);
const layoutById = new Map(layout.map((entry) => [entry.id, entry]));
const conceptSequence = flat.filter((node) => node.role === 'concept');

let language = new URLSearchParams(location.search).get('lang') === 'it' ? 'it' : 'en';
let mode = new URLSearchParams(location.search).get('mode') === 'learn' ? 'learn' : 'explore';
let selectedId = new URLSearchParams(location.search).get('node') ?? '';
let learnIndex = Math.max(0, conceptSequence.findIndex((node) => node.id === selectedId));
let hoverVersion = 0;
let hoverTimer;
let hoverNodeId = '';
let hoverCardHovered = false;

const app = document.querySelector('#app');
app.innerHTML = `
  <main class="app-shell">
    <header class="topbar">
      <a class="brand" href="/" aria-label="Codex Atlas home">
        <span class="brand-mark">C</span>
        <span><strong id="brand-title"></strong><small id="brand-kicker"></small></span>
      </a>
      <div class="topbar-actions">
        <div class="mode-switch" role="group" aria-label="View mode">
          <button class="mode-button" data-mode="explore">Explore</button>
          <button class="mode-button" data-mode="learn">Learn</button>
        </div>
        <button class="round-button" id="search-toggle" aria-label="Search">⌕</button>
        <button class="round-button theme-button" id="theme-toggle" aria-label="Switch theme">☼</button>
        <button class="round-button language-button" id="language-toggle">IT</button>
        <button class="round-button" id="about-toggle" aria-label="About">i</button>
      </div>
    </header>

    <section class="search-panel" id="search-panel" aria-hidden="true">
      <label class="search-box">
        <span>⌕</span>
        <input id="search-input" autocomplete="off" spellcheck="false" />
        <kbd>/</kbd>
      </label>
      <div class="search-results" id="search-results" hidden></div>
    </section>

    <section class="canvas-wrap">
      <svg id="codex-map" viewBox="-1100 -900 2200 1800" role="img" aria-describedby="svg-desc">
        <desc id="svg-desc"></desc>
        <g id="viewport"></g>
      </svg>
      <div class="map-meta left"><span id="mode-kicker"></span><strong id="map-subtitle"></strong></div>
      <div class="map-meta right"><span id="zoom-label">100%</span><button id="reset-view">Reset view</button></div>
      <div class="map-hint" id="map-hint"></div>
    </section>

    <div class="hover-card" id="hover-card" aria-hidden="true"><div id="hover-content"></div></div>

    <aside class="drawer" id="drawer" aria-hidden="true">
      <button class="drawer-close" id="drawer-close" aria-label="Close">×</button>
      <div id="drawer-content"></div>
    </aside>

    <dialog class="about-dialog" id="about-dialog">
      <button class="drawer-close" id="about-close" aria-label="Close">×</button>
      <p class="eyebrow">CODEX ATLAS</p>
      <h2 id="about-title"></h2>
      <p id="about-copy"></p>
      <div class="about-rule"></div>
      <p class="fine-print" id="about-fine"></p>
    </dialog>
  </main>
`;

const svg = must('codex-map');
const viewport = must('viewport');
const hoverCard = must('hover-card');
const hoverContent = must('hover-content');
const drawer = must('drawer');
const drawerContent = must('drawer-content');
const searchPanel = must('search-panel');
const searchInput = must('search-input');
const searchResults = must('search-results');
const searchToggle = must('search-toggle');
const themeToggle = must('theme-toggle');
const languageToggle = must('language-toggle');
const aboutDialog = must('about-dialog');
const zoomLabel = must('zoom-label');

const viewportController = createViewportController(svg, viewport, (scale) => {
  zoomLabel.textContent = `${Math.round(scale * 100)}%`;
});

renderAll();
bindUi();
if (selectedId && nodeById.has(selectedId)) openNode(selectedId, false);
else if (mode === 'learn') startLearn();

function renderAll() {
  renderMap();
  renderChrome();
}

function renderMap() {
  viewport.replaceChildren();

  const guide = svgEl('circle', { r: RADII.guide, class: 'outer-guide' });
  const branchLayer = svgEl('g', { class: 'map-layer branch-layer' });
  const markerLayer = svgEl('g', { class: 'map-layer marker-layer' });
  const labelLayer = svgEl('g', { class: 'map-layer label-layer' });
  const calloutLayer = svgEl('g', { class: 'map-layer callout-layer' });
  viewport.append(guide, branchLayer, markerLayer, labelLayer, calloutLayer);

  // Important: every branch is rendered in a dedicated layer below every label.
  // This makes it impossible for a later branch to paint over an earlier label.
  for (const entry of layout.filter((e) => e.role === 'domain')) {
    const node = nodeById.get(entry.id);
    if (!node) continue;

    const branchGroup = interactiveGroup(node, 'branch-group');
    appendBranch(branchGroup, domainTrunkPath(entry), 'domain-trunk');
    branchLayer.append(branchGroup);

    const [x, y] = polar(RADII.domain, entry.angle);
    const markerGroup = interactiveGroup(node, 'marker-group');
    markerGroup.append(svgEl('circle', { cx: x, cy: y, r: 4.2, class: 'domain-node-dot' }));
    markerLayer.append(markerGroup);

    const labelGroup = interactiveGroup(node, 'label-group');
    appendInnerLabel(labelGroup, node.title[language], x, y, entry.angle, 'domain-label');
    labelLayer.append(labelGroup);
  }

  for (const entry of layout.filter((e) => e.role === 'system')) {
    const node = nodeById.get(entry.id);
    const parent = layoutById.get(entry.parentId);
    if (!node || !parent) continue;

    const branchGroup = interactiveGroup(node, 'branch-group');
    appendBranch(branchGroup, hierarchicalPath(parent, entry), 'system-branch');
    branchLayer.append(branchGroup);

    const [x, y] = polar(RADII.system, entry.angle);
    const markerGroup = interactiveGroup(node, 'marker-group');
    markerGroup.append(svgEl('circle', { cx: x, cy: y, r: 3, class: 'system-node-dot' }));
    markerLayer.append(markerGroup);

    const labelGroup = interactiveGroup(node, 'label-group');
    appendInnerLabel(labelGroup, node.title[language], x, y, entry.angle, 'system-label');
    labelLayer.append(labelGroup);
  }

  for (const entry of layout.filter((e) => e.role === 'concept')) {
    const node = nodeById.get(entry.id);
    const parent = layoutById.get(entry.parentId);
    if (!node || !parent) continue;

    const branchGroup = interactiveGroup(node, 'branch-group');
    appendBranch(branchGroup, hierarchicalPath(parent, entry), 'concept-branch');
    branchLayer.append(branchGroup);

    const [x, y] = polar(RADII.concept, entry.angle);
    const markerGroup = interactiveGroup(node, 'marker-group');
    markerGroup.append(svgEl('circle', { cx: x, cy: y, r: 2.65, class: 'leaf-dot' }));
    markerLayer.append(markerGroup);

    const labelGroup = interactiveGroup(node, 'label-group');
    appendLeafLabel(labelGroup, node.title[language], entry.angle);
    labelLayer.append(labelGroup);
  }

  // Detached outer callouts: no connector line by design.
  for (const entry of layout.filter((e) => e.role === 'domain')) {
    const node = nodeById.get(entry.id);
    if (!node) continue;
    const group = interactiveGroup(node, 'domain-callout-group label-group');
    appendDomainCallout(group, node, entry);
    calloutLayer.append(group);
  }

  appendCenter();
  applySelection();
}

function appendCenter() {
  const center = svgEl('g', { class: 'center-core', tabindex: 0, role: 'button' });
  center.append(svgEl('circle', { r: 138, class: 'center-halo' }));
  center.append(svgEl('image', {
    href: pack.centerImage,
    x: -122,
    y: -122,
    width: 244,
    height: 244,
    preserveAspectRatio: 'xMidYMid meet',
    class: 'center-image',
  }));
  const text = svgEl('text', { x: 0, y: 122, 'text-anchor': 'middle', class: 'center-title' });
  text.textContent = pack.centerLabel?.[language] || pack.title[language].toUpperCase();
  center.append(text);
  center.addEventListener('click', () => {
    closeDrawer();
    hideHover();
    viewportController.reset();
  });
  viewport.append(center);
}

function appendBranch(group, d, className) {
  const visible = svgEl('path', { d, class: `branch ${className}` });
  const hit = svgEl('path', { d, class: 'branch-hit' });
  group.append(visible, hit);
}

function appendInnerLabel(group, text, x, y, angle, className) {
  const side = Math.cos(angle) >= 0 ? 1 : -1;
  const tx = x + side * 14;
  const ty = y - 8;
  const anchor = side > 0 ? 'start' : 'end';
  const label = svgEl('text', { x: tx, y: ty, 'text-anchor': anchor, class: `inner-label ${className}` });
  label.textContent = text;
  group.append(label);
  addGlassBackplate(group, label, className.includes('domain') ? 'domain-glass' : 'system-glass');
}

function appendLeafLabel(group, text, angle) {
  const degrees = angle * 180 / Math.PI;
  const left = Math.cos(angle) < 0;
  const rotation = left ? degrees + 180 : degrees;
  const [x, y] = polar(RADII.concept + 11, angle);
  const fontSize = 8.55;
  const width = Math.max(18, text.length * fontSize * 0.52);
  const height = fontSize * 1.2;
  const rectX = left ? x - width - 4.5 : x - 4.5;

  const wrap = svgEl('g', {
    class: 'leaf-label-wrap',
    transform: `rotate(${rotation} ${x} ${y})`,
  });
  wrap.append(svgEl('rect', {
    x: rectX,
    y: y - height / 2 - 2.7,
    width: width + 9,
    height: height + 5.4,
    rx: 5.5,
    class: 'glass-label leaf-glass',
  }));
  const label = svgEl('text', {
    x,
    y,
    'text-anchor': left ? 'end' : 'start',
    class: 'leaf-label',
  });
  label.textContent = text;
  wrap.append(label);
  group.append(wrap);
}

function appendDomainCallout(group, node, entry) {
  const [dotX, dotY] = polar(RADII.guide, entry.angle);
  group.append(svgEl('circle', { cx: dotX, cy: dotY, r: 8.5, class: 'callout-dot' }));

  const cos = Math.cos(entry.angle);
  const sin = Math.sin(entry.angle);
  let x;
  let y;
  let anchor;
  if (Math.abs(cos) > 0.48) {
    const side = cos > 0 ? 1 : -1;
    x = side * RADII.callout;
    y = dotY + 3;
    anchor = side > 0 ? 'start' : 'end';
  } else {
    x = dotX;
    y = (sin > 0 ? 1 : -1) * 834;
    anchor = 'middle';
  }

  const title = svgEl('text', { x, y, 'text-anchor': anchor, class: 'callout-title' });
  title.textContent = node.title[language].toUpperCase();
  group.append(title);

  const lines = wrapWords(node.description[language], 39).slice(0, 2);
  lines.forEach((line, index) => {
    const copy = svgEl('text', {
      x,
      y: y + 18 + index * 15,
      'text-anchor': anchor,
      class: 'callout-copy',
    });
    copy.textContent = line;
    group.append(copy);
  });
}

function interactiveGroup(node, extraClass = '') {
  const group = svgEl('g', {
    class: `node-group role-${node.role} domain-${node.domainIndex} ${extraClass}`.trim(),
    tabindex: 0,
    role: 'button',
    'aria-label': node.title[language],
  });
  group.dataset.nodeId = node.id;
  group.style.setProperty('--domain-color', node.color);
  return group;
}

function bindMapDelegation() {
  const nodeGroupFromTarget = (target) => target instanceof Element ? target.closest('.node-group') : null;

  viewport.addEventListener('pointerover', (event) => {
    const group = nodeGroupFromTarget(event.target);
    if (!group || mode === 'learn' || event.pointerType === 'touch' || hoverCardHovered) return;

    const previous = nodeGroupFromTarget(event.relatedTarget);
    if (previous?.dataset.nodeId === group.dataset.nodeId) return;

    const node = nodeById.get(group.dataset.nodeId ?? '');
    if (!node) return;
    showHover(node);
  });

  viewport.addEventListener('pointerout', (event) => {
    const group = nodeGroupFromTarget(event.target);
    if (!group) return;
    const next = nodeGroupFromTarget(event.relatedTarget);
    if (next?.dataset.nodeId === group.dataset.nodeId) return;
    if (next?.dataset.nodeId) {
      cancelHoverHide();
      return;
    }
    scheduleHoverHide(460);
  });

  viewport.addEventListener('focusin', (event) => {
    if (mode === 'learn') return;
    const group = nodeGroupFromTarget(event.target);
    if (!group) return;
    const node = nodeById.get(group.dataset.nodeId ?? '');
    if (node) showHover(node);
  });

  viewport.addEventListener('focusout', (event) => {
    const group = nodeGroupFromTarget(event.target);
    if (!group) return;
    const next = nodeGroupFromTarget(event.relatedTarget);
    if (next?.dataset.nodeId === group.dataset.nodeId) return;
    scheduleHoverHide(220);
  });

  viewport.addEventListener('click', (event) => {
    const group = nodeGroupFromTarget(event.target);
    if (!group) return;
    const id = group.dataset.nodeId;
    if (!id) return;
    event.stopPropagation();
    hideHover();
    openNode(id, false);
  });

  viewport.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const group = nodeGroupFromTarget(event.target);
    if (!group) return;
    const id = group.dataset.nodeId;
    if (!id) return;
    event.preventDefault();
    hideHover();
    openNode(id, false);
  });
}

function addGlassBackplate(group, textEl, extraClass) {
  const text = textEl.textContent ?? '';
  const x = Number(textEl.getAttribute('x') ?? 0);
  const y = Number(textEl.getAttribute('y') ?? 0);
  const anchor = textEl.getAttribute('text-anchor') ?? 'start';
  const fontSize = textEl.classList.contains('domain-label') ? 12 : 10.8;
  const textWidth = Math.max(24, text.length * fontSize * 0.56);
  const textHeight = fontSize * 1.15;
  const padX = 7;
  const padY = 4;
  let left = x;
  if (anchor === 'middle') left = x - textWidth / 2;
  if (anchor === 'end') left = x - textWidth;
  const rect = svgEl('rect', {
    x: left - padX,
    y: y - textHeight * 0.78 - padY,
    width: textWidth + padX * 2,
    height: textHeight + padY * 2,
    rx: 9,
    class: `glass-label ${extraClass}`,
  });
  group.insertBefore(rect, textEl);
}

function domainTrunkPath(entry) {
  const angle = entry.angle;
  const [x0, y0] = polar(RADII.center, angle);
  const [x3, y3] = polar(RADII.domain, angle);
  const [x1, y1] = polar(RADII.center + 52, angle - 0.025);
  const [x2, y2] = polar(RADII.domain - 36, angle + 0.012);
  return `M ${x0} ${y0} C ${x1} ${y1} ${x2} ${y2} ${x3} ${y3}`;
}

function hierarchicalPath(parent, child) {
  const parentRadius = radiusForRole(parent.role);
  const childRadius = radiusForRole(child.role);
  const [x0, y0] = polar(parentRadius, parent.angle);
  const [x3, y3] = polar(childRadius, child.angle);
  const span = childRadius - parentRadius;
  const [x1, y1] = polar(parentRadius + span * 0.38, parent.angle);
  const [x2, y2] = polar(childRadius - span * 0.28, child.angle);
  return `M ${x0} ${y0} C ${x1} ${y1} ${x2} ${y2} ${x3} ${y3}`;
}

function radiusForRole(role) {
  return role === 'domain' ? RADII.domain : role === 'system' ? RADII.system : RADII.concept;
}

function renderChrome() {
  document.documentElement.lang = language;
  document.title = `${pack.title[language]} — Codex Atlas`;
  must('brand-title').textContent = pack.title[language];
  must('brand-kicker').textContent = `CODEX ATLAS / ${pack.id.replaceAll('-', ' ').toUpperCase()}`;
  must('map-subtitle').textContent = pack.subtitle[language];
  must('mode-kicker').textContent = mode === 'learn'
    ? (language === 'it' ? 'PERCORSO GUIDATO' : 'GUIDED PATH')
    : (language === 'it' ? 'MAPPA INTERATTIVA' : 'INTERACTIVE MAP');
  must('map-hint').textContent = language === 'it'
    ? 'Passa sui concetti per l’anteprima · clicca per aprire · trascina e usa la rotella per esplorare'
    : 'Hover concepts to preview · click to open · drag and use the wheel to explore';
  searchInput.placeholder = language === 'it' ? 'Cerca un concetto…' : 'Search a concept…';
  languageToggle.textContent = language === 'it' ? 'EN' : 'IT';
  languageToggle.setAttribute('aria-label', language === 'it' ? 'Passa all’inglese' : 'Switch to Italian');
  languageToggle.setAttribute('title', language === 'it' ? 'English' : 'Italiano');
  renderThemeControl();
  svg.setAttribute('aria-label', pack.title[language]);
  must('svg-desc').textContent = pack.subtitle[language];
  must('reset-view').textContent = language === 'it' ? 'Reimposta' : 'Reset view';

  document.querySelectorAll('.mode-button').forEach((button) => {
    const active = button.dataset.mode === mode;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', active ? 'true' : 'false');
    if (button.dataset.mode === 'explore') button.textContent = language === 'it' ? 'Esplora' : 'Explore';
    else button.textContent = language === 'it' ? 'Impara' : 'Learn';
  });

  must('about-title').textContent = language === 'it' ? 'Come leggere il Codex' : 'How to read the Codex';
  must('about-copy').textContent = language === 'it'
    ? 'Dal centro partono grandi famiglie colorate che si ramificano in sistemi e concetti sempre più specifici. Le macro-aree restano come callout esterni separati, mentre Esplora e Impara usano la stessa mappa in modi diversi.'
    : 'Colored families radiate from the center and branch into systems and increasingly specific concepts. Macro areas remain as detached outer callouts, while Explore and Learn use the same map in different ways.';
  must('about-fine').textContent = pack.resourceNote?.[language] || (language === 'it'
    ? 'Le sintesi sono a scopo didattico. Gli estratti Wikipedia vengono caricati al passaggio del mouse quando disponibili.'
    : 'Summaries are educational. Wikipedia excerpts load on hover when available.');

  if (selectedId && nodeById.has(selectedId)) renderDrawer(nodeById.get(selectedId));
  renderSearchResults(searchInput.value);
}

function bindUi() {
  bindMapDelegation();
  document.querySelectorAll('.mode-button').forEach((button) => {
    button.addEventListener('click', () => {
      if (button.dataset.mode === 'learn') startLearn();
      else stopLearn();
    });
  });

  languageToggle.addEventListener('click', () => {
    language = language === 'en' ? 'it' : 'en';
    hideHover();
    renderAll();
    syncUrl();
  });

  themeToggle.addEventListener('click', () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  });

  searchToggle.addEventListener('click', (event) => {
    event.stopPropagation();
    searchPanel.classList.toggle('open');
    searchPanel.setAttribute('aria-hidden', searchPanel.classList.contains('open') ? 'false' : 'true');
    if (searchPanel.classList.contains('open')) requestAnimationFrame(() => searchInput.focus());
  });
  searchInput.addEventListener('input', () => renderSearchResults(searchInput.value));
  document.addEventListener('click', (event) => {
    if (!searchPanel.contains(event.target) && event.target !== searchToggle) closeSearch();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === '/' && document.activeElement !== searchInput) {
      event.preventDefault();
      searchPanel.classList.add('open');
      searchPanel.setAttribute('aria-hidden', 'false');
      searchInput.focus();
    }
    if (event.key === 'Escape') {
      if (searchPanel.classList.contains('open')) closeSearch();
      else if (aboutDialog.open) aboutDialog.close();
      else if (hoverCard.getAttribute('aria-hidden') === 'false') hideHover();
      else closeDrawer();
    }
  });

  must('drawer-close').addEventListener('click', closeDrawer);
  must('reset-view').addEventListener('click', () => viewportController.reset());
  must('about-toggle').addEventListener('click', () => aboutDialog.showModal());
  must('about-close').addEventListener('click', () => aboutDialog.close());
  window.addEventListener('resize', () => {
    if (hoverCard.getAttribute('aria-hidden') === 'false') positionHover();
  });
  hoverCard.addEventListener('pointerenter', () => {
    hoverCardHovered = true;
    cancelHoverHide();
  });
  hoverCard.addEventListener('pointerleave', () => {
    hoverCardHovered = false;
    scheduleHoverHide(180);
  });
}

function setTheme(nextTheme) {
  theme = nextTheme === 'light' ? 'light' : 'dark';
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem('codex-theme', theme); } catch {}
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'light' ? '#fbfcfc' : '#0b0d11');
  renderThemeControl();
}

function renderThemeControl() {
  if (!themeToggle) return;
  const isDark = theme === 'dark';
  themeToggle.textContent = isDark ? '☼' : '☾';
  const label = language === 'it'
    ? (isDark ? 'Passa alla modalità chiara' : 'Passa alla modalità scura')
    : (isDark ? 'Switch to light mode' : 'Switch to dark mode');
  themeToggle.setAttribute('aria-label', label);
  themeToggle.setAttribute('title', label);
  themeToggle.setAttribute('aria-pressed', isDark ? 'false' : 'true');
}

function showHover(node) {
  cancelHoverHide();
  if (hoverNodeId === node.id && hoverCard.getAttribute('aria-hidden') === 'false') return;
  hoverNodeId = node.id;
  const version = ++hoverVersion;
  const lang = language;
  const wikiUrl = wikipediaUrl(node, lang);
  const badges = practicalBadges(node, lang);
  const resourceCount = node.resources?.length || 0;
  const isConcept = node.role === 'concept';
  hoverContent.innerHTML = `
    <div class="hover-head"><span>${roleLabel(node.role, lang)}</span><span>${resourceCount ? `${resourceCount} ${lang === 'it' ? 'RISORSE' : 'RESOURCES'}` : (isConcept ? 'WIKIPEDIA' : 'CODEX')}</span></div>
    <h3>${escapeHtml(node.title[lang])}</h3>
    ${badges ? `<div class="practical-badges compact">${badges}</div>` : ''}
    <div class="hover-copy-wrap ${isConcept ? 'is-loading' : ''}" id="hover-copy-wrap">
      <p id="hover-copy">${isConcept
        ? escapeHtml(lang === 'it' ? 'Caricamento dell’introduzione da Wikipedia…' : 'Loading the Wikipedia introduction…')
        : escapeHtml(node.description[lang])}</p>
    </div>
    <div class="hover-foot"><span id="hover-status">${isConcept ? (lang === 'it' ? 'Wikipedia' : 'Wikipedia') : roleLabel(node.role, lang)}</span>${wikiUrl ? `<a id="hover-wiki" href="${wikiUrl}" target="_blank" rel="noreferrer">Wikipedia ↗</a>` : ''}</div>
  `;
  hoverCard.classList.add('open');
  hoverCard.setAttribute('aria-hidden', 'false');
  positionHover();
  if (isConcept) void hydrateHover(node, version, lang);
}

async function hydrateHover(node, version, lang) {
  await delay(70);
  if (version !== hoverVersion || mode === 'learn' || lang !== language) return;
  const result = await fetchWikipediaIntroForNode(node, lang, 3);
  if (version !== hoverVersion || lang !== language) return;
  const copy = hoverCard.querySelector('#hover-copy');
  const wrap = hoverCard.querySelector('#hover-copy-wrap');
  const status = hoverCard.querySelector('#hover-status');
  const link = hoverCard.querySelector('#hover-wiki');
  if (wrap) wrap.classList.remove('is-loading');
  if (result?.extract && copy) copy.textContent = result.extract;
  else if (copy) copy.textContent = lang === 'it'
    ? 'Wikipedia non ha restituito un’introduzione per questa voce. Apri l’articolo completo o usa le risorse collegate.'
    : 'Wikipedia did not return an introduction for this entry. Open the full article or use the linked resources.';
  if (status) status.textContent = result?.extract
    ? `Wikipedia ${result.lang.toUpperCase()} · CC BY-SA`
    : (lang === 'it' ? 'Estratto non disponibile' : 'Excerpt unavailable');
  if (result?.url && link) link.href = result.url;
  positionHover();
}

function positionHover() {
  const margin = 16;
  const width = Math.min(390, window.innerWidth - margin * 2);
  hoverCard.style.width = `${width}px`;
  const rect = hoverCard.getBoundingClientRect();
  const x = Math.max(margin, (window.innerWidth - width) / 2);
  const y = Math.max(84, (window.innerHeight - rect.height) / 2);
  hoverCard.style.left = `${x}px`;
  hoverCard.style.top = `${y}px`;
}

function scheduleHoverHide(delayMs = 180) {
  cancelHoverHide();
  hoverTimer = setTimeout(() => {
    if (!hoverCardHovered) hideHover();
  }, delayMs);
}
function cancelHoverHide() {
  if (hoverTimer) clearTimeout(hoverTimer);
  hoverTimer = undefined;
}
function hideHover() {
  cancelHoverHide();
  hoverVersion += 1;
  hoverNodeId = '';
  hoverCardHovered = false;
  hoverCard.classList.remove('open');
  hoverCard.setAttribute('aria-hidden', 'true');
}

function openNode(id, focus) {
  const node = nodeById.get(id);
  if (!node) return;
  selectedId = id;
  if (mode === 'learn' && node.role === 'concept') {
    const idx = conceptSequence.findIndex((entry) => entry.id === id);
    if (idx >= 0) learnIndex = idx;
  }
  renderDrawer(node);
  applySelection();
  if (focus) {
    const entry = layoutById.get(id);
    if (entry) viewportController.focus(radiusForRole(entry.role), entry.angle);
  }
  syncUrl();
}

function renderDrawer(node) {
  const path = nodePath(node);
  const wikiUrl = wikipediaUrl(node, language);
  const learnPos = node.role === 'concept' ? conceptSequence.findIndex((entry) => entry.id === node.id) : -1;
  const badges = practicalBadges(node, language);
  const safety = practicalSafetyCard(node, language);
  const resources = renderResourceCards(node, language);
  const isConcept = node.role === 'concept';
  const introLabel = language === 'it' ? 'In breve · Wikipedia' : 'Overview · Wikipedia';
  const detailLabel = language === 'it' ? 'Dettagli pratici' : 'Practical details';
  drawerContent.innerHTML = `
    <p class="eyebrow">${roleLabel(node.role, language)}</p>
    <nav class="breadcrumbs">${path.map((entry) => `<button data-node="${entry.id}">${escapeHtml(entry.title[language])}</button>`).join('<span>›</span>')}</nav>
    <h2>${escapeHtml(node.title[language])}</h2>
    ${badges ? `<div class="practical-badges">${badges}</div>` : ''}
    ${isConcept ? `
      <section class="wiki-intro-card is-loading" id="wiki-intro-card">
        <div class="section-kicker"><span class="wiki-dot">W</span><span>${introLabel}</span></div>
        <p class="drawer-copy" id="drawer-copy">${language === 'it' ? 'Caricamento dell’introduzione da Wikipedia…' : 'Loading the Wikipedia introduction…'}</p>
      </section>
    ` : `<p class="drawer-copy">${escapeHtml(node.description[language])}</p>`}
    ${isConcept && (safety || resources) ? `<div class="section-divider"><span>${detailLabel}</span></div>` : ''}
    ${safety}
    ${mode === 'learn' && node.role === 'concept' ? `
      <section class="learn-card">
        <div><span>${language === 'it' ? 'Percorso' : 'Learning path'}</span><strong>${learnPos + 1} / ${conceptSequence.length}</strong></div>
        <div class="progress"><span style="width:${((learnPos + 1) / conceptSequence.length) * 100}%"></span></div>
        <div class="learn-actions"><button data-learn="prev" ${learnPos <= 0 ? 'disabled' : ''}>← ${language === 'it' ? 'Prima' : 'Previous'}</button><button data-learn="next" ${learnPos >= conceptSequence.length - 1 ? 'disabled' : ''}>${language === 'it' ? 'Avanti' : 'Next'} →</button></div>
      </section>` : ''}
    ${resources}
    ${wikiUrl ? `<a class="wiki-link" id="drawer-wiki-link" href="${wikiUrl}" target="_blank" rel="noreferrer"><span>W</span><span><small>WIKIPEDIA</small>${language === 'it' ? 'Apri l’articolo completo' : 'Open full article'}</span><b>↗</b></a>` : ''}
  `;
  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
  drawer.querySelectorAll('[data-node]').forEach((button) => button.addEventListener('click', () => openNode(button.dataset.node, false)));
  drawer.querySelector('[data-learn="prev"]')?.addEventListener('click', () => stepLearn(-1));
  drawer.querySelector('[data-learn="next"]')?.addEventListener('click', () => stepLearn(1));
  if (isConcept) void hydrateDrawer(node, language);
}

async function hydrateDrawer(node, lang) {
  const id = node.id;
  const result = await fetchWikipediaIntroForNode(node, lang, 5);
  if (selectedId !== id || language !== lang) return;
  const copy = document.getElementById('drawer-copy');
  const card = document.getElementById('wiki-intro-card');
  const link = document.getElementById('drawer-wiki-link');
  if (card) card.classList.remove('is-loading');
  if (result?.extract && copy) copy.textContent = result.extract;
  else if (copy) copy.textContent = lang === 'it'
    ? 'Wikipedia non ha restituito un’introduzione per questa voce. Puoi aprire l’articolo completo oppure consultare le risorse pratiche qui sotto.'
    : 'Wikipedia did not return an introduction for this entry. You can open the full article or use the practical resources below.';
  if (result?.url && link) link.href = result.url;
}

function closeDrawer() {
  selectedId = '';
  drawer.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
  applySelection();
  syncUrl();
}

function startLearn() {
  mode = 'learn';
  hideHover();
  const idx = conceptSequence.findIndex((node) => node.id === selectedId);
  learnIndex = idx >= 0 ? idx : 0;
  renderChrome();
  openNode(conceptSequence[learnIndex].id, true);
}
function stopLearn() {
  mode = 'explore';
  hideHover();
  renderChrome();
  applySelection();
  syncUrl();
}
function stepLearn(direction) {
  learnIndex = Math.max(0, Math.min(conceptSequence.length - 1, learnIndex + direction));
  openNode(conceptSequence[learnIndex].id, true);
}

function applySelection() {
  const selected = selectedId ? nodeById.get(selectedId) : null;
  const relevant = new Set();
  if (selected) nodePath(selected).forEach((node) => relevant.add(node.id));
  viewport.querySelectorAll('.node-group').forEach((group) => {
    const id = group.dataset.nodeId;
    group.classList.toggle('selected', id === selectedId);
    group.classList.toggle('related', relevant.has(id) && id !== selectedId);
    group.classList.toggle('dimmed', Boolean(selected) && !relevant.has(id));
  });
}

function renderSearchResults(query) {
  const term = query.trim().toLocaleLowerCase();
  if (!term) {
    searchResults.hidden = true;
    searchResults.replaceChildren();
    return;
  }
  const matches = flat
    .filter((node) => `${node.title.en} ${node.title.it}`.toLocaleLowerCase().includes(term))
    .slice(0, 10);
  searchResults.innerHTML = matches.length
    ? matches.map((node) => `<button data-search="${node.id}"><span><strong>${escapeHtml(node.title[language])}</strong><small>${roleLabel(node.role, language)}</small></span><b>↗</b></button>`).join('')
    : `<p>${language === 'it' ? 'Nessun risultato.' : 'No results.'}</p>`;
  searchResults.querySelectorAll('[data-search]').forEach((button) => button.addEventListener('click', () => {
    openNode(button.dataset.search, true);
    searchInput.value = '';
    closeSearch();
  }));
  searchResults.hidden = false;
}

function closeSearch() {
  searchPanel.classList.remove('open');
  searchPanel.setAttribute('aria-hidden', 'true');
  searchResults.hidden = true;
}


function practicalBadges(node, lang) {
  const items = [];
  if (node.difficulty) {
    const label = {
      easy: lang === 'it' ? 'DIY semplice' : 'Simple DIY',
      moderate: lang === 'it' ? 'Intermedio' : 'Intermediate',
      pro: lang === 'it' ? 'Tecnico' : 'Professional',
    }[node.difficulty] || node.difficulty;
    items.push(`<span class="practical-badge difficulty-${escapeHtml(node.difficulty)}">${escapeHtml(label)}</span>`);
  }
  if (node.risk) {
    const label = {
      low: lang === 'it' ? 'Rischio basso' : 'Low risk',
      medium: lang === 'it' ? 'Attenzione' : 'Caution',
      high: lang === 'it' ? 'Rischio alto' : 'High risk',
    }[node.risk] || node.risk;
    items.push(`<span class="practical-badge risk-${escapeHtml(node.risk)}">${escapeHtml(label)}</span>`);
  }
  return items.join('');
}

function practicalSafetyCard(node, lang) {
  if (!node.risk || node.role !== 'concept') return '';
  const copy = {
    low: lang === 'it'
      ? 'In genere adatto a controlli o manutenzione leggera. Segui il manuale del componente e isola acqua o alimentazione quando pertinente.'
      : 'Generally suitable for inspection or light maintenance. Follow the component manual and isolate water or power when relevant.',
    medium: lang === 'it'
      ? 'Richiede attenzione: se devi aprire impianti, lavorare in quota o non riesci a isolare in sicurezza la fonte, fermati e chiama un professionista.'
      : 'Use caution: if the job requires opening building systems, working at height, or you cannot safely isolate the source, stop and call a professional.',
    high: lang === 'it'
      ? 'Non trattarlo come una procedura fai da te. Usa questa scheda per capire il sistema e riconoscere i segnali; l’intervento va affidato a un tecnico qualificato.'
      : 'Do not treat this as a DIY procedure. Use this card to understand the system and recognize warning signs; hands-on work belongs with a qualified professional.',
  }[node.risk];
  if (!copy) return '';
  const title = node.risk === 'high'
    ? (lang === 'it' ? 'Quando chiamare un professionista' : 'When to call a professional')
    : (lang === 'it' ? 'Nota pratica' : 'Practical note');
  return `<section class="safety-card risk-${escapeHtml(node.risk)}"><strong>${escapeHtml(title)}</strong><p>${escapeHtml(copy)}</p></section>`;
}

function renderResourceCards(node, lang) {
  const resources = node.resources || [];
  if (!resources.length) return '';
  const title = lang === 'it' ? 'Risorse pratiche' : 'Practical resources';
  return `<section class="resource-section"><p class="resource-heading">${title}</p><div class="resource-grid">${resources.map((resource) => {
    const label = resource.title?.[lang] || resource.title?.en || resource.source || resource.url;
    const type = {
      official: lang === 'it' ? 'FONTE UFFICIALE' : 'OFFICIAL',
      safety: lang === 'it' ? 'SICUREZZA' : 'SAFETY',
      tutorial: 'TUTORIAL',
      manual: lang === 'it' ? 'MANUALE' : 'MANUAL',
    }[resource.type] || 'LINK';
    const icon = { official: '◎', safety: '!', tutorial: '↗', manual: '▤' }[resource.type] || '↗';
    return `<a class="resource-link resource-${escapeHtml(resource.type || 'link')}" href="${escapeHtml(resource.url)}" target="_blank" rel="noreferrer"><span>${icon}</span><span><small>${type}${resource.source ? ` · ${escapeHtml(resource.source)}` : ''}</small>${escapeHtml(label)}</span><b>↗</b></a>`;
  }).join('')}</div></section>`;
}


function nodePath(node) {
  const path = [node];
  let current = node;
  while (current.parentId) {
    current = nodeById.get(current.parentId);
    if (!current) break;
    path.unshift(current);
  }
  return path;
}

function roleLabel(role, lang) {
  const labels = {
    domain: { en: 'Macro area', it: 'Macro-area' },
    system: { en: 'System', it: 'Sistema' },
    concept: { en: 'Concept', it: 'Concetto' },
  };
  return labels[role][lang];
}

function wrapWords(value, max) {
  const words = value.split(/\s+/);
  const lines = [];
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > max && line) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

function syncUrl() {
  const params = new URLSearchParams();
  if (language !== 'en') params.set('lang', language);
  if (mode !== 'explore') params.set('mode', mode);
  if (selectedId) params.set('node', selectedId);
  history.replaceState(null, '', `${location.pathname}${params.toString() ? `?${params}` : ''}`);
}

