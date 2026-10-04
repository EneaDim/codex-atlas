import { humanBody } from './data/human-body.js';

const SVG_NS = 'http://www.w3.org/2000/svg';
const TAU = Math.PI * 2;
const RADII = {
  center: 146,
  domain: 270,
  system: 465,
  concept: 705,
  guide: 800,
  callout: 846,
};

const pack = humanBody;
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
let hoverTransferUntil = 0;
const wikiCache = new Map();

const app = document.querySelector('#app');
app.innerHTML = `
  <main class="app-shell">
    <header class="topbar">
      <a class="brand" href="/" aria-label="Codex Atlas home">
        <span class="brand-mark">C</span>
        <span><strong id="brand-title"></strong><small>CODEX ATLAS / HUMAN BODY</small></span>
      </a>
      <div class="topbar-actions">
        <div class="mode-switch" role="group" aria-label="View mode">
          <button class="mode-button" data-mode="explore">Explore</button>
          <button class="mode-button" data-mode="learn">Learn</button>
        </div>
        <button class="round-button" id="search-toggle" aria-label="Search">⌕</button>
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
      <svg id="codex-map" viewBox="-1100 -900 2200 1800" role="img" aria-labelledby="svg-title svg-desc">
        <title id="svg-title"></title>
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
  text.textContent = language === 'it' ? 'CORPO UMANO' : 'HUMAN BODY';
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
    const cardOpen = hoverCard.getAttribute('aria-hidden') === 'false';
    if (cardOpen && hoverNodeId && hoverNodeId !== node.id && performance.now() < hoverTransferUntil) return;
    showHover(node);
  });

  viewport.addEventListener('pointerout', (event) => {
    const group = nodeGroupFromTarget(event.target);
    if (!group) return;
    const next = nodeGroupFromTarget(event.relatedTarget);
    if (next?.dataset.nodeId === group.dataset.nodeId) return;
    hoverTransferUntil = performance.now() + 460;
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
    openNode(id, true);
  });

  viewport.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const group = nodeGroupFromTarget(event.target);
    if (!group) return;
    const id = group.dataset.nodeId;
    if (!id) return;
    event.preventDefault();
    hideHover();
    openNode(id, true);
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
  must('map-subtitle').textContent = pack.subtitle[language];
  must('mode-kicker').textContent = mode === 'learn'
    ? (language === 'it' ? 'PERCORSO GUIDATO' : 'GUIDED PATH')
    : (language === 'it' ? 'MAPPA INTERATTIVA' : 'INTERACTIVE MAP');
  must('map-hint').textContent = language === 'it'
    ? 'Passa sui concetti per l’anteprima · clicca per fissare · trascina per muoverti'
    : 'Hover concepts to preview · click to pin · drag to move';
  searchInput.placeholder = language === 'it' ? 'Cerca un concetto…' : 'Search a concept…';
  languageToggle.textContent = language === 'it' ? 'EN' : 'IT';
  must('svg-title').textContent = pack.title[language];
  must('svg-desc').textContent = pack.subtitle[language];
  must('reset-view').textContent = language === 'it' ? 'Reimposta' : 'Reset view';

  document.querySelectorAll('.mode-button').forEach((button) => {
    const active = button.dataset.mode === mode;
    button.classList.toggle('active', active);
    if (button.dataset.mode === 'explore') button.textContent = language === 'it' ? 'Esplora' : 'Explore';
    else button.textContent = language === 'it' ? 'Impara' : 'Learn';
  });

  must('about-title').textContent = language === 'it' ? 'Come leggere il Codex' : 'How to read the Codex';
  must('about-copy').textContent = language === 'it'
    ? 'Come nel Cognitive Bias Codex, dal centro partono grandi famiglie colorate che si ramificano in sistemi e concetti sempre più specifici. Le macro-aree restano come callout esterni separati.'
    : 'Like the Cognitive Bias Codex, colored families radiate from the center and branch into systems and increasingly specific concepts. Macro areas remain as detached outer callouts.';
  must('about-fine').textContent = language === 'it'
    ? 'Le sintesi sono a scopo didattico. Gli estratti Wikipedia vengono caricati al passaggio del mouse quando disponibili.'
    : 'Summaries are educational. Wikipedia excerpts load on hover when available.';

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

function showHoverFromElement(node, element) {
  const rect = element.getBoundingClientRect();
  showHover(node);
}

function showHover(node) {
  cancelHoverHide();
  if (hoverNodeId === node.id && hoverCard.getAttribute('aria-hidden') === 'false') return;
  hoverNodeId = node.id;
  const version = ++hoverVersion;
  const lang = language;
  const wikiUrl = wikipediaUrl(node, lang);
  hoverContent.innerHTML = `
    <div class="hover-head"><span>${roleLabel(node.role, lang)}</span><span>${node.role === 'concept' ? 'WIKIPEDIA' : 'CODEX'}</span></div>
    <h3>${escapeHtml(node.title[lang])}</h3>
    <p id="hover-copy">${escapeHtml(node.description[lang])}</p>
    <div class="hover-foot"><span id="hover-status">${node.role === 'concept' ? (lang === 'it' ? 'Caricamento estratto…' : 'Loading excerpt…') : roleLabel(node.role, lang)}</span>${wikiUrl ? `<a href="${wikiUrl}" target="_blank" rel="noreferrer">Wikipedia ↗</a>` : ''}</div>
  `;
  hoverCard.classList.add('open');
  hoverCard.setAttribute('aria-hidden', 'false');
  positionHover();
  if (node.role === 'concept') void hydrateHover(node, version, lang);
}

async function hydrateHover(node, version, lang) {
  await delay(110);
  if (version !== hoverVersion || mode === 'learn' || lang !== language) return;
  const extract = await fetchWikipediaIntro(node.wiki[lang], lang);
  if (version !== hoverVersion || lang !== language) return;
  const copy = hoverCard.querySelector('#hover-copy');
  const status = hoverCard.querySelector('#hover-status');
  if (extract && copy) copy.textContent = extract;
  if (status) status.textContent = extract
    ? (lang === 'it' ? 'Estratto Wikipedia · CC BY-SA' : 'Wikipedia excerpt · CC BY-SA')
    : (lang === 'it' ? 'Sintesi locale' : 'Local summary');
}

function positionHover() {
  const margin = 16;
  const width = Math.min(350, window.innerWidth - margin * 2);
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
  hoverTransferUntil = 0;
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
  drawerContent.innerHTML = `
    <p class="eyebrow">${roleLabel(node.role, language)}</p>
    <nav class="breadcrumbs">${path.map((entry) => `<button data-node="${entry.id}">${escapeHtml(entry.title[language])}</button>`).join('<span>›</span>')}</nav>
    <h2>${escapeHtml(node.title[language])}</h2>
    <p class="drawer-copy" id="drawer-copy">${escapeHtml(node.description[language])}</p>
    ${mode === 'learn' && node.role === 'concept' ? `
      <section class="learn-card">
        <div><span>${language === 'it' ? 'Percorso' : 'Learning path'}</span><strong>${learnPos + 1} / ${conceptSequence.length}</strong></div>
        <div class="progress"><span style="width:${((learnPos + 1) / conceptSequence.length) * 100}%"></span></div>
        <div class="learn-actions"><button data-learn="prev" ${learnPos <= 0 ? 'disabled' : ''}>← ${language === 'it' ? 'Prima' : 'Previous'}</button><button data-learn="next" ${learnPos >= conceptSequence.length - 1 ? 'disabled' : ''}>${language === 'it' ? 'Avanti' : 'Next'} →</button></div>
      </section>` : ''}
    ${wikiUrl ? `<a class="wiki-link" href="${wikiUrl}" target="_blank" rel="noreferrer"><span>W</span><span><small>WIKIPEDIA</small>${language === 'it' ? 'Apri l’articolo completo' : 'Open full article'}</span><b>↗</b></a>` : ''}
  `;
  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
  drawer.querySelectorAll('[data-node]').forEach((button) => button.addEventListener('click', () => openNode(button.dataset.node, true)));
  drawer.querySelector('[data-learn="prev"]')?.addEventListener('click', () => stepLearn(-1));
  drawer.querySelector('[data-learn="next"]')?.addEventListener('click', () => stepLearn(1));
  if (mode === 'explore' && node.role === 'concept') void hydrateDrawer(node, language);
}

async function hydrateDrawer(node, lang) {
  const id = node.id;
  const extract = await fetchWikipediaIntro(node.wiki[lang], lang);
  if (!extract || selectedId !== id || language !== lang || mode !== 'explore') return;
  const copy = must('drawer-copy');
  copy.textContent = extract;
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

async function fetchWikipediaIntro(title, lang) {
  if (!title) return null;
  const key = `${lang}:${title}`;
  if (wikiCache.has(key)) return wikiCache.get(key);
  const url = `https://${lang}.wikipedia.org/w/api.php?action=query&format=json&origin=*&redirects=1&prop=extracts&exintro=1&explaintext=1&exsentences=3&titles=${encodeURIComponent(title)}`;
  try {
    const response = await fetch(url, { headers: { accept: 'application/json' } });
    if (!response.ok) throw new Error('Wikipedia request failed');
    const data = await response.json();
    const page = Object.values(data.query?.pages ?? {})[0];
    const extract = page && !page.missing ? page.extract?.trim() : '';
    const value = extract || null;
    wikiCache.set(key, value);
    return value;
  } catch {
    wikiCache.set(key, null);
    return null;
  }
}

function wikipediaUrl(node, lang) {
  const title = node.wiki?.[lang];
  if (!title) return '';
  return `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(title.replaceAll(' ', '_'))}`;
}

function assertUniqueIds(nodes) {
  const seen = new Set();
  const duplicates = new Set();
  nodes.forEach((node) => {
    if (seen.has(node.id)) duplicates.add(node.id);
    seen.add(node.id);
  });
  if (duplicates.size) {
    throw new Error(`Duplicate Codex ids: ${[...duplicates].join(', ')}`);
  }
}

function flattenPack(source) {
  const result = [];
  source.domains.forEach((domain, domainIndex) => {
    result.push({
      ...domain,
      role: 'domain',
      parentId: null,
      domainId: domain.id,
      domainIndex,
      color: domain.color,
      wiki: {},
    });
    domain.systems.forEach((system) => {
      result.push({
        ...system,
        role: 'system',
        parentId: domain.id,
        domainId: domain.id,
        domainIndex,
        color: domain.color,
        wiki: {},
      });
      system.concepts.forEach((concept) => {
        result.push({
          ...concept,
          role: 'concept',
          parentId: system.id,
          domainId: domain.id,
          domainIndex,
          color: domain.color,
          description: {
            en: `${concept.title.en} is a key structure, process or concept within ${system.title.en.toLowerCase()}.`,
            it: `${concept.title.it} è una struttura, un processo o un concetto chiave nell’ambito di ${system.title.it.toLowerCase()}.`,
          },
        });
      });
    });
  });
  return result;
}

function buildLayout(source) {
  const result = [];
  const domainGap = 0.055;
  const systemGap = 0.015;
  const counts = source.domains.map((domain) => countConcepts(domain));
  const total = counts.reduce((a, b) => a + b, 0);
  const available = TAU - domainGap * source.domains.length;
  let cursor = -Math.PI / 2;

  source.domains.forEach((domain, domainIndex) => {
    const domainSpan = available * (counts[domainIndex] / total);
    const domainStart = cursor + domainGap / 2;
    const domainEnd = domainStart + domainSpan;
    const domainAngle = normalizeAngle((domainStart + domainEnd) / 2);
    result.push({ id: domain.id, role: 'domain', parentId: null, domainId: domain.id, angle: domainAngle, startAngle: domainStart, endAngle: domainEnd });

    const sysTotal = domain.systems.reduce((sum, system) => sum + system.concepts.length, 0);
    const sysAvailable = Math.max(0.001, domainSpan - systemGap * Math.max(0, domain.systems.length - 1));
    let sysCursor = domainStart;
    domain.systems.forEach((system, sysIndex) => {
      const sysSpan = sysAvailable * (system.concepts.length / sysTotal);
      const sysStart = sysCursor;
      const sysEnd = sysStart + sysSpan;
      const conceptInset = Math.min(0.012, sysSpan * 0.08);
      const conceptSpan = Math.max(0.001, sysSpan - conceptInset * 2);
      const angles = system.concepts.map((_, index) => sysStart + conceptInset + conceptSpan * ((index + 0.5) / system.concepts.length));
      const sysAngle = averageAngle(angles);
      result.push({ id: system.id, role: 'system', parentId: domain.id, domainId: domain.id, angle: sysAngle, startAngle: sysStart, endAngle: sysEnd });
      system.concepts.forEach((concept, index) => {
        result.push({ id: concept.id, role: 'concept', parentId: system.id, domainId: domain.id, angle: normalizeAngle(angles[index]), startAngle: angles[index], endAngle: angles[index] });
      });
      sysCursor = sysEnd + (sysIndex < domain.systems.length - 1 ? systemGap : 0);
    });
    cursor = domainEnd + domainGap / 2;
  });
  return result;
}

function countConcepts(domain) {
  return domain.systems.reduce((sum, system) => sum + system.concepts.length, 0);
}
function averageAngle(angles) {
  const x = angles.reduce((sum, angle) => sum + Math.cos(angle), 0);
  const y = angles.reduce((sum, angle) => sum + Math.sin(angle), 0);
  return normalizeAngle(Math.atan2(y, x));
}
function normalizeAngle(angle) {
  let value = angle;
  while (value <= -Math.PI) value += TAU;
  while (value > Math.PI) value -= TAU;
  return value;
}
function polar(radius, angle) {
  return [radius * Math.cos(angle), radius * Math.sin(angle)];
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

function createViewportController(svgElement, viewportElement, onScale) {
  let scale = 1;
  let x = 0;
  let y = 0;
  const minScale = 0.58;
  const maxScale = 4.2;

  const pointers = new Map();
  let panGesture = null;
  let pinchGesture = null;
  let movedDuringGesture = false;
  let suppressClickUntil = 0;

  const clampScale = (value) => Math.max(minScale, Math.min(maxScale, value));

  const clientToSvg = (clientX, clientY) => {
    const point = svgElement.createSVGPoint();
    point.x = clientX;
    point.y = clientY;
    const matrix = svgElement.getScreenCTM();
    if (!matrix) return { x: 0, y: 0 };
    const transformed = point.matrixTransform(matrix.inverse());
    return { x: transformed.x, y: transformed.y };
  };

  const apply = () => {
    viewportElement.setAttribute('transform', `translate(${x} ${y}) scale(${scale})`);
    onScale(scale);
  };

  const beginPan = (pointer) => {
    const point = clientToSvg(pointer.clientX, pointer.clientY);
    panGesture = {
      pointerId: pointer.pointerId,
      startClientX: pointer.clientX,
      startClientY: pointer.clientY,
      startSvgX: point.x,
      startSvgY: point.y,
      startX: x,
      startY: y,
    };
    pinchGesture = null;
  };

  const beginPinch = () => {
    const active = [...pointers.values()].slice(0, 2);
    if (active.length < 2) return;
    const [a, b] = active;
    const midpointClientX = (a.clientX + b.clientX) / 2;
    const midpointClientY = (a.clientY + b.clientY) / 2;
    const midpointSvg = clientToSvg(midpointClientX, midpointClientY);
    const distance = Math.max(1, Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY));

    pinchGesture = {
      startDistance: distance,
      startScale: scale,
      anchorWorldX: (midpointSvg.x - x) / scale,
      anchorWorldY: (midpointSvg.y - y) / scale,
    };
    panGesture = null;
    movedDuringGesture = true;
  };

  svgElement.addEventListener('wheel', (event) => {
    event.preventDefault();
    const svgPoint = clientToSvg(event.clientX, event.clientY);
    const anchorWorldX = (svgPoint.x - x) / scale;
    const anchorWorldY = (svgPoint.y - y) / scale;
    const factor = event.deltaY < 0 ? 1.11 : 0.90;
    const nextScale = clampScale(scale * factor);

    x = svgPoint.x - anchorWorldX * nextScale;
    y = svgPoint.y - anchorWorldY * nextScale;
    scale = nextScale;
    apply();
  }, { passive: false });

  svgElement.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    pointers.set(event.pointerId, {
      pointerId: event.pointerId,
      clientX: event.clientX,
      clientY: event.clientY,
      pointerType: event.pointerType,
    });

    if (pointers.size === 1) {
      movedDuringGesture = false;
      beginPan(event);
    } else if (pointers.size === 2) {
      for (const pointerId of pointers.keys()) {
        try { svgElement.setPointerCapture(pointerId); } catch { /* no-op */ }
      }
      beginPinch();
    }
  });

  svgElement.addEventListener('pointermove', (event) => {
    if (!pointers.has(event.pointerId)) return;

    pointers.set(event.pointerId, {
      pointerId: event.pointerId,
      clientX: event.clientX,
      clientY: event.clientY,
      pointerType: event.pointerType,
    });

    if (pointers.size >= 2 && pinchGesture) {
      event.preventDefault();
      const [a, b] = [...pointers.values()].slice(0, 2);
      const distance = Math.max(1, Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY));
      const midpointClientX = (a.clientX + b.clientX) / 2;
      const midpointClientY = (a.clientY + b.clientY) / 2;
      const midpointSvg = clientToSvg(midpointClientX, midpointClientY);
      const nextScale = clampScale(pinchGesture.startScale * (distance / pinchGesture.startDistance));

      scale = nextScale;
      x = midpointSvg.x - pinchGesture.anchorWorldX * scale;
      y = midpointSvg.y - pinchGesture.anchorWorldY * scale;
      movedDuringGesture = true;
      apply();
      return;
    }

    if (pointers.size === 1 && panGesture && panGesture.pointerId === event.pointerId) {
      const pixelDistance = Math.hypot(
        event.clientX - panGesture.startClientX,
        event.clientY - panGesture.startClientY,
      );
      if (!movedDuringGesture && pixelDistance <= 5) return;

      if (!movedDuringGesture) {
        movedDuringGesture = true;
        try { svgElement.setPointerCapture(event.pointerId); } catch { /* no-op */ }
      }

      event.preventDefault();
      const current = clientToSvg(event.clientX, event.clientY);
      x = panGesture.startX + (current.x - panGesture.startSvgX);
      y = panGesture.startY + (current.y - panGesture.startSvgY);
      apply();
    }
  }, { passive: false });

  const endPointer = (event) => {
    if (!pointers.has(event.pointerId)) return;

    pointers.delete(event.pointerId);
    try {
      if (svgElement.hasPointerCapture(event.pointerId)) svgElement.releasePointerCapture(event.pointerId);
    } catch { /* no-op */ }

    if (movedDuringGesture) suppressClickUntil = performance.now() + 420;

    if (pointers.size >= 2) {
      beginPinch();
      return;
    }

    pinchGesture = null;
    if (pointers.size === 1) {
      const remaining = [...pointers.values()][0];
      beginPan(remaining);
      movedDuringGesture = true;
    } else {
      panGesture = null;
      window.setTimeout(() => { movedDuringGesture = false; }, 0);
    }
  };

  svgElement.addEventListener('pointerup', endPointer);
  svgElement.addEventListener('pointercancel', endPointer);
  svgElement.addEventListener('lostpointercapture', (event) => {
    if (pointers.has(event.pointerId) && event.pointerType !== 'mouse') endPointer(event);
  });

  // A pinch or drag should never be interpreted as a node tap afterwards.
  svgElement.addEventListener('click', (event) => {
    if (performance.now() < suppressClickUntil) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);

  apply();
  return {
    reset() {
      scale = 1;
      x = 0;
      y = 0;
      pointers.clear();
      panGesture = null;
      pinchGesture = null;
      apply();
    },
    focus(radius, angle) {
      const [px, py] = polar(radius, angle);
      scale = radius >= RADII.concept ? 1.45 : 1.25;
      x = -px * scale * 0.18;
      y = -py * scale * 0.18;
      apply();
    },
  };
}

function svgEl(tag, attrs = {}) {
  const element = document.createElementNS(SVG_NS, tag);
  for (const [key, value] of Object.entries(attrs)) element.setAttribute(key, String(value));
  return element;
}
function must(id) {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Missing #${id}`);
  return element;
}
function delay(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }
function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[char]));
}
