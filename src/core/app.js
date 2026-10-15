import { getPack } from '../packs/registry.js';
import { RADII } from './constants.js';
import { escapeHtml, delay, must, svgEl } from './dom.js';
import { assertUniqueIds, buildLayout, flattenPack, polar } from './layout.js';
import { createViewportController } from './viewport.js';
import { typesetMath } from './math.js';
import { fetchWikipediaIntroForNode, hydrateWikipediaTitlesForPack, wikipediaUrl } from './wikipedia.js';
import { localized, normalizeLanguage, t } from './i18n.js';
import { packSiteUrl, rebuildSearchIndex, semanticSearch } from './search.js';

const queryParams = new URLSearchParams(location.search);
let language = normalizeLanguage(queryParams.get('lang'), 'en');
const requestedPack = window.__CODEX_PACK__ || 'human-body';
const pack = getPack(requestedPack);
if (language === 'es') {
  await hydrateWikipediaTitlesForPack(pack, 'es');
  rebuildSearchIndex();
}
document.documentElement.dataset.codexPack = pack.id;
let theme = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
const flat = flattenPack(pack);
assertUniqueIds(flat);
const nodeById = new Map(flat.map((node) => [node.id, node]));
const childrenByParent = new Map();
for (const node of flat) {
  const key = node.parentId ?? '__root__';
  const children = childrenByParent.get(key) ?? [];
  children.push(node);
  childrenByParent.set(key, children);
}
const layout = buildLayout(pack);
const layoutById = new Map(layout.map((entry) => [entry.id, entry]));

let mode = queryParams.get('mode') === 'learn' ? 'learn' : 'explore';
let selectedId = queryParams.get('node') ?? '';
let hoverVersion = 0;
let hoverTimer;
let hoverNodeId = '';
let hoverCardHovered = false;

const app = document.querySelector('#app');
app.innerHTML = `
  <main class="app-shell">
    <header class="topbar">
      <a class="brand" id="atlas-home-link" href="https://codex-atlas.up.railway.app" aria-label="Codex Atlas home">
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
        <div class="language-switch" id="language-switch" role="group" aria-label="Language"><button data-lang="it">IT</button><button data-lang="en">EN</button><button data-lang="es">ES</button></div>
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
const languageSwitch = must('language-switch');
const aboutDialog = must('about-dialog');
const atlasHomeLink = must('atlas-home-link');
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

    const branchGroup = interactiveGroup(node, 'branch-group', false);
    appendBranch(branchGroup, domainTrunkPath(entry), 'domain-trunk');
    branchLayer.append(branchGroup);

    const [x, y] = polar(RADII.domain, entry.angle);
    const markerGroup = interactiveGroup(node, 'marker-group', false);
    markerGroup.append(svgEl('circle', { cx: x, cy: y, r: 4.2, class: 'domain-node-dot' }));
    markerLayer.append(markerGroup);

    const labelGroup = interactiveGroup(node, 'label-group', true);
    appendInnerLabel(labelGroup, localized(node.title, language), x, y, entry.angle, 'domain-label');
    labelLayer.append(labelGroup);
  }

  for (const entry of layout.filter((e) => e.role === 'system')) {
    const node = nodeById.get(entry.id);
    const parent = layoutById.get(entry.parentId);
    if (!node || !parent) continue;

    const branchGroup = interactiveGroup(node, 'branch-group', false);
    appendBranch(branchGroup, hierarchicalPath(parent, entry), 'system-branch');
    branchLayer.append(branchGroup);

    const [x, y] = polar(RADII.system, entry.angle);
    const markerGroup = interactiveGroup(node, 'marker-group', false);
    markerGroup.append(svgEl('circle', { cx: x, cy: y, r: 3, class: 'system-node-dot' }));
    markerLayer.append(markerGroup);

    const labelGroup = interactiveGroup(node, 'label-group', true);
    appendInnerLabel(labelGroup, localized(node.title, language), x, y, entry.angle, 'system-label');
    labelLayer.append(labelGroup);
  }

  for (const entry of layout.filter((e) => e.role === 'concept')) {
    const node = nodeById.get(entry.id);
    const parent = layoutById.get(entry.parentId);
    if (!node || !parent) continue;

    const branchGroup = interactiveGroup(node, 'branch-group', false);
    appendBranch(branchGroup, hierarchicalPath(parent, entry), 'concept-branch');
    branchLayer.append(branchGroup);

    const [x, y] = polar(RADII.concept, entry.angle);
    const markerGroup = interactiveGroup(node, 'marker-group', false);
    markerGroup.append(
      svgEl('circle', { cx: x, cy: y, r: 8.5, class: 'concept-node-hit' }),
      svgEl('circle', { cx: x, cy: y, r: 2.65, class: 'leaf-dot' }),
    );
    markerLayer.append(markerGroup);

    const labelGroup = interactiveGroup(node, 'label-group', true);
    appendLeafLabel(labelGroup, localized(node.title, language), entry.angle);
    labelLayer.append(labelGroup);
  }

  // Detached outer callouts: no connector line by design.
  for (const entry of layout.filter((e) => e.role === 'domain')) {
    const node = nodeById.get(entry.id);
    if (!node) continue;
    const group = interactiveGroup(node, 'domain-callout-group label-group', true);
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
  text.textContent = localized(pack.centerLabel, language, localized(pack.title, language).toUpperCase());
  center.append(text);
  center.addEventListener('click', () => {
    hideHover();
    viewportController.reset();
    if (mode === 'learn') renderLearnRoot();
    else closeDrawer();
  });
  viewport.append(center);
}

function appendBranch(group, d, className) {
  const visible = svgEl('path', { d, class: `branch ${className}` });
  const hit = svgEl('path', { d, class: `branch-hit ${className}-hit` });
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
  title.textContent = localized(node.title, language).toUpperCase();
  group.append(title);

  const lines = wrapWords(localized(node.description, language), 39).slice(0, 2);
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

function interactiveGroup(node, extraClass = '', focusable = true) {
  const group = svgEl('g', {
    class: `node-group role-${node.role} domain-${node.domainIndex} ${extraClass}`.trim(),
    tabindex: focusable ? 0 : -1,
    role: 'button',
    'aria-label': localized(node.title, language),
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
  document.title = `${localized(pack.title, language)} — Codex Atlas`;
  must('brand-title').textContent = localized(pack.title, language);
  must('brand-kicker').textContent = `CODEX ATLAS / ${pack.id.replaceAll('-', ' ').toUpperCase()}`;
  atlasHomeLink.href = atlasHomeUrl(language);
  atlasHomeLink.title = t('atlasHome', language);
  atlasHomeLink.setAttribute('aria-label', t('atlasHome', language));
  must('map-subtitle').textContent = localized(pack.subtitle, language);
  must('mode-kicker').textContent = t(mode === 'learn' ? 'learningLibrary' : 'interactiveMap', language);
  must('map-hint').textContent = t('mapHint', language);
  searchInput.placeholder = t('searchPlaceholder', language);
  languageSwitch.setAttribute('aria-label', t('languageGroup', language));
  languageSwitch.querySelectorAll('[data-lang]').forEach((button) => {
    const active = button.dataset.lang === language;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
  renderThemeControl();
  svg.setAttribute('aria-label', localized(pack.title, language));
  must('svg-desc').textContent = localized(pack.subtitle, language);
  must('reset-view').textContent = t('resetView', language);

  document.querySelectorAll('.mode-button').forEach((button) => {
    const active = button.dataset.mode === mode;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', active ? 'true' : 'false');
    button.textContent = t(button.dataset.mode === 'explore' ? 'explore' : 'learn', language);
  });

  must('about-title').textContent = t('aboutTitle', language);
  must('about-copy').textContent = t('aboutCopy', language);
  must('about-fine').textContent = localized(pack.resourceNote, language, t('aboutFine', language));

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

  languageSwitch.querySelectorAll('[data-lang]').forEach((button) => {
    button.addEventListener('click', async () => {
      const nextLanguage = normalizeLanguage(button.dataset.lang, language);
      if (nextLanguage === language) return;
      language = nextLanguage;
      hideHover();
      if (language === 'es') {
        await hydrateWikipediaTitlesForPack(pack, 'es');
        rebuildSearchIndex();
      }
      renderAll();
      syncUrl();
    });
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
  const label = t(isDark ? 'switchThemeLight' : 'switchThemeDark', language);
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
  const isStudy = Boolean(isConcept && node.study);
  const studyFormula = isStudy ? node.study.formulas?.[0]?.tex : '';
  const statusLabel = isStudy
    ? (localized(node.study.source, lang, t('courseNotes', lang)))
    : (resourceCount ? `${resourceCount} ${t('resourcesUpper', lang)}` : (isConcept ? 'WIKIPEDIA' : 'CODEX'));

  hoverContent.innerHTML = `
    <div class="hover-head"><span>${roleLabel(node.role, lang)}</span><span>${escapeHtml(statusLabel)}</span></div>
    <h3>${escapeHtml(localized(node.title, lang))}</h3>
    ${badges ? `<div class="practical-badges compact">${badges}</div>` : ''}
    <div class="hover-copy-wrap ${isConcept && !isStudy ? 'is-loading' : ''}" id="hover-copy-wrap">
      <p id="hover-copy">${isStudy
        ? escapeHtml(localized(node.study.summary, lang, localized(node.description, lang)))
        : (isConcept
          ? escapeHtml(t('wikiLoading', lang))
          : escapeHtml(localized(node.description, lang)))}</p>
      ${studyFormula ? `<div class="hover-math">\\[${escapeHtml(studyFormula)}\\]</div>` : ''}
    </div>
    <div class="hover-foot"><span id="hover-status">${isStudy ? escapeHtml(t('summaryFromNotebooks', lang)) : (isConcept ? 'Wikipedia' : roleLabel(node.role, lang))}</span>${wikiUrl ? `<a id="hover-wiki" href="${wikiUrl}" target="_blank" rel="noreferrer">Wikipedia ↗</a>` : ''}</div>
  `;
  hoverCard.classList.add('open');
  hoverCard.setAttribute('aria-hidden', 'false');
  positionHover();
  if (isStudy) {
    void typesetMath(hoverContent).then(positionHover);
  } else if (isConcept) {
    void hydrateHover(node, version, lang);
  }
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
  else if (copy) copy.textContent = t('wikiUnavailableHover', lang);
  if (status) status.textContent = result?.extract
    ? `Wikipedia ${result.lang.toUpperCase()} · ${result.fallback ? t('wikiFallback', lang) : 'CC BY-SA'}`
    : t('excerptUnavailable', lang);
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
  const badges = practicalBadges(node, language);
  const safety = practicalSafetyCard(node, language);
  const resources = renderResourceCards(node, language);
  const isConcept = node.role === 'concept';
  const isStudy = Boolean(isConcept && node.study);
  const introLabel = t('overviewWikipedia', language);
  const detailLabel = t('practicalDetails', language);
  const conceptBody = isStudy
    ? renderStudyLesson(node, language)
    : (isConcept ? `
      <section class="wiki-intro-card is-loading" id="wiki-intro-card">
        <div class="section-kicker"><span class="wiki-dot">W</span><span>${introLabel}</span></div>
        <p class="drawer-copy" id="drawer-copy">${escapeHtml(t('wikiLoading', language))}</p>
      </section>
    ` : `<p class="drawer-copy">${escapeHtml(localized(node.description, language))}</p>`);

  const hierarchy = !isConcept
    ? (mode === 'learn' ? renderLearnFolder(node) : renderExploreHierarchy(node))
    : '';
  const learnConceptNav = mode === 'learn' && isConcept ? renderLearnConceptNav(node) : '';

  drawerContent.innerHTML = `
    <p class="eyebrow">${mode === 'learn' ? t('learnFolders', language) : roleLabel(node.role, language)}</p>
    <nav class="breadcrumbs">${mode === 'learn' ? `<button data-learn-root>${escapeHtml(localized(pack.title, language))}</button><span>›</span>` : ''}${path.map((entry) => `<button data-node="${entry.id}">${escapeHtml(localized(entry.title, language))}</button>`).join('<span>›</span>')}</nav>
    <h2>${escapeHtml(localized(node.title, language))}</h2>
    ${badges ? `<div class="practical-badges">${badges}</div>` : ''}
    ${conceptBody}
    ${hierarchy}
    ${isConcept && !isStudy && (safety || resources) ? `<div class="section-divider"><span>${detailLabel}</span></div>` : ''}
    ${isStudy ? '' : safety}
    ${learnConceptNav}
    ${isStudy ? '' : resources}
    ${wikiUrl ? `<a class="wiki-link" id="drawer-wiki-link" href="${wikiUrl}" target="_blank" rel="noreferrer"><span>W</span><span><small>WIKIPEDIA</small>${escapeHtml(t('openFullArticle', language))}</span><b>↗</b></a>` : ''}
  `;
  openDrawerShell();
  bindDrawerNavigation();
  if (isStudy) void typesetMath(drawerContent);
  else if (isConcept) void hydrateDrawer(node, language);
}

function openDrawerShell() {
  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
}

function bindDrawerNavigation() {
  drawer.querySelectorAll('[data-node]').forEach((button) => button.addEventListener('click', () => openNode(button.dataset.node, false)));
  drawer.querySelectorAll('[data-learn-root]').forEach((button) => button.addEventListener('click', renderLearnRoot));
}

function renderExploreHierarchy(node) {
  const direct = childrenOf(node);
  const leaves = descendantConcepts(node);
  if (!direct.length) return '';
  const heading = t('contents', language);
  const summary = `${direct.length} ${t(node.role === 'domain' ? 'subtopics' : 'items', language)} · ${leaves.length} ${t('concepts', language)}`;

  if (node.role === 'system') {
    return `
      <section class="hierarchy-section">
        <div class="hierarchy-heading"><span>${heading}</span><small>${summary}</small></div>
        <div class="leaf-list">${direct.map((concept) => hierarchyLeafButton(concept)).join('')}</div>
      </section>`;
  }

  return `
    <section class="hierarchy-section">
      <div class="hierarchy-heading"><span>${heading}</span><small>${summary}</small></div>
      <div class="hierarchy-tree">${direct.map((system) => {
        const concepts = childrenOf(system);
        return `
          <article class="hierarchy-group">
            <button class="hierarchy-system" data-node="${system.id}">
              <span class="hierarchy-system-mark"></span>
              <span><strong>${escapeHtml(localized(system.title, language))}</strong><small>${concepts.length} ${t('concepts', language)}</small></span>
              <b>›</b>
            </button>
            <div class="hierarchy-concepts">${concepts.map((concept) => hierarchyLeafButton(concept)).join('')}</div>
          </article>`;
      }).join('')}</div>
    </section>`;
}

function hierarchyLeafButton(concept) {
  return `<button class="hierarchy-leaf" data-node="${concept.id}"><span></span><strong>${escapeHtml(localized(concept.title, language))}</strong><b>↗</b></button>`;
}

function renderLearnRoot() {
  selectedId = '';
  hideHover();
  drawerContent.innerHTML = `
    <p class="eyebrow">${t('learnLibrary', language)}</p>
    <h2>${escapeHtml(localized(pack.title, language))}</h2>
    <p class="drawer-copy">${escapeHtml(t('learnRootCopy', language))}</p>
    ${renderLearnFolderGrid(childrenByParent.get('__root__') ?? [])}
  `;
  openDrawerShell();
  bindDrawerNavigation();
  applySelection();
  syncUrl();
}

function renderLearnFolder(node) {
  const children = childrenOf(node);
  const leafCount = descendantConcepts(node).length;
  const label = t(node.role === 'domain' ? 'subfolders' : 'lessons', language);
  return `
    <section class="learn-library-section">
      <div class="hierarchy-heading"><span>${label}</span><small>${leafCount} ${t('concepts', language)}</small></div>
      ${renderLearnFolderGrid(children)}
    </section>`;
}

function renderLearnFolderGrid(nodes) {
  if (!nodes.length) return '';
  return `<div class="learn-folder-grid">${nodes.map((child) => {
    const isFolder = child.role !== 'concept';
    const count = isFolder ? descendantConcepts(child).length : 1;
    const meta = child.role === 'domain'
      ? `${childrenOf(child).length} ${t('folders', language)} · ${count} ${t('concepts', language)}`
      : child.role === 'system'
        ? `${count} ${t('lessons', language).toLocaleLowerCase(language)}`
        : t('openLesson', language);
    return `
      <button class="learn-folder ${isFolder ? 'is-folder' : 'is-lesson'}" data-node="${child.id}">
        <span class="folder-icon" aria-hidden="true"></span>
        <span class="folder-copy"><strong>${escapeHtml(localized(child.title, language))}</strong><small>${escapeHtml(meta)}</small></span>
        <b>›</b>
      </button>`;
  }).join('')}</div>`;
}

function renderLearnConceptNav(node) {
  const parent = node.parentId ? nodeById.get(node.parentId) : null;
  if (!parent) return '';
  const siblings = childrenOf(parent).filter((entry) => entry.role === 'concept');
  const index = siblings.findIndex((entry) => entry.id === node.id);
  const previous = index > 0 ? siblings[index - 1] : null;
  const next = index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : null;
  return `
    <section class="learn-concept-nav">
      <button class="learn-back-folder" data-node="${parent.id}"><span class="folder-icon" aria-hidden="true"></span><span><small>${t('backToFolder', language)}</small><strong>${escapeHtml(localized(parent.title, language))}</strong></span></button>
      <div class="learn-sibling-nav">
        ${previous ? `<button data-node="${previous.id}">← ${escapeHtml(localized(previous.title, language))}</button>` : '<span></span>'}
        ${next ? `<button data-node="${next.id}">${escapeHtml(localized(next.title, language))} →</button>` : '<span></span>'}
      </div>
    </section>`;
}

function childrenOf(node) {
  return childrenByParent.get(node.id) ?? [];
}

function descendantConcepts(node) {
  if (node.role === 'concept') return [node];
  return childrenOf(node).flatMap((child) => descendantConcepts(child));
}

function descendantNodes(node) {
  return childrenOf(node).flatMap((child) => [child, ...descendantNodes(child)]);
}

function renderStudyLesson(node, lang) {
  const study = node.study;
  const formulas = study.formulas || [];
  const terms = study.terms || [];
  const example = study.example;
  const summary = localized(study.summary, lang, localized(node.description, lang));
  const source = localized(study.source, lang, t('courseNotebook', lang));

  return `
    <section class="study-intro-card">
      <div class="section-kicker"><span class="study-dot">Σ</span><span>${escapeHtml(source)}</span></div>
      <p class="drawer-copy">${escapeHtml(summary)}</p>
    </section>
    ${formulas.length ? `
      <section class="study-section">
        <p class="study-heading">${t('formula', lang)}</p>
        <div class="formula-grid">${formulas.map((item) => `
          <article class="formula-card">
            <small>${escapeHtml(localized(item.title, lang, t('formula', lang)))}</small>
            <div class="math-display">\\[${escapeHtml(item.tex)}\\]</div>
          </article>
        `).join('')}</div>
      </section>` : ''}
    ${terms.length ? `
      <section class="study-section">
        <p class="study-heading">${t('meaningTerms', lang)}</p>
        <div class="term-list">${terms.map((item) => `
          <div class="term-row"><span class="term-symbol">\\(${escapeHtml(item.symbol)}\\)</span><span>${escapeHtml(localized(item.label, lang))}</span></div>
        `).join('')}</div>
      </section>` : ''}
    ${example ? `
      <section class="study-section example-section">
        <p class="study-heading">${escapeHtml(localized(example.title, lang, t('example', lang)))}</p>
        <p class="study-example-copy">${escapeHtml(localized(example.body, lang))}</p>
        ${example.tex ? `<div class="example-math">\\[${escapeHtml(example.tex)}\\]</div>` : ''}
      </section>` : ''}
    ${localized(study.note, lang) ? `
      <section class="study-note"><strong>${t('note', lang)}</strong><p>${escapeHtml(localized(study.note, lang))}</p></section>` : ''}
  `;
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
  else if (copy) copy.textContent = t('wikiUnavailableDrawer', lang);
  if (result?.url && link) {
    link.href = result.url;
    const small = link.querySelector('small');
    if (small && result.fallback) small.textContent = `WIKIPEDIA ${result.lang.toUpperCase()} · ${t('wikiFallback', lang).toUpperCase()}`;
  }
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
  renderChrome();
  renderLearnRoot();
}
function stopLearn() {
  mode = 'explore';
  hideHover();
  if (selectedId && nodeById.has(selectedId)) renderDrawer(nodeById.get(selectedId));
  else closeDrawer();
  renderChrome();
  applySelection();
  syncUrl();
}

function applySelection() {
  const selected = selectedId ? nodeById.get(selectedId) : null;
  const relevant = new Set();
  if (selected) {
    nodePath(selected).forEach((node) => relevant.add(node.id));
    if (selected.role !== 'concept') descendantNodes(selected).forEach((node) => relevant.add(node.id));
  }
  viewport.querySelectorAll('.node-group').forEach((group) => {
    const id = group.dataset.nodeId;
    group.classList.toggle('selected', id === selectedId);
    group.classList.toggle('related', relevant.has(id) && id !== selectedId);
    group.classList.toggle('dimmed', Boolean(selected) && !relevant.has(id));
  });
}

function renderSearchResults(query) {
  const term = query.trim();
  if (!term) {
    searchResults.hidden = true;
    searchResults.replaceChildren();
    return;
  }

  const matches = semanticSearch(term, {
    currentPackId: pack.id,
    language,
    limit: 12,
  });
  const semanticLabel = t('semantic', language);
  const allCodexLabel = t('semanticAll', language);

  searchResults.innerHTML = matches.length
    ? `<div class="search-mode-note"><span>✦</span>${escapeHtml(allCodexLabel)}</div>${matches.map((result) => {
        const role = roleLabel(result.node.role, language);
        const path = result.path ? `${result.path} · ` : '';
        const semantic = result.semantic ? `<em>${semanticLabel}</em>` : '';
        const otherPack = result.packId !== pack.id ? ' search-result-cross-pack' : '';
        return `<button class="search-result${otherPack}" data-search-pack="${escapeHtml(result.packId)}" data-search-node="${escapeHtml(result.node.id)}"><span><strong>${escapeHtml(result.title)}</strong><small><b>${escapeHtml(result.packTitle)}</b> · ${escapeHtml(path)}${escapeHtml(role)} ${semantic}</small></span><i>${result.packId === pack.id ? '↗' : '→'}</i></button>`;
      }).join('')}`
    : `<p>${t('noSemanticResults', language)}</p>`;

  searchResults.querySelectorAll('[data-search-node]').forEach((button) => button.addEventListener('click', () => {
    const targetPack = button.dataset.searchPack;
    const targetNode = button.dataset.searchNode;
    searchInput.value = '';
    closeSearch();
    if (targetPack === pack.id) {
      openNode(targetNode, true);
      return;
    }
    location.href = packSiteUrl(targetPack, { nodeId: targetNode, language });
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
      easy: t('simpleDIY', lang),
      moderate: t('intermediate', lang),
      pro: t('professional', lang),
    }[node.difficulty] || node.difficulty;
    items.push(`<span class="practical-badge difficulty-${escapeHtml(node.difficulty)}">${escapeHtml(label)}</span>`);
  }
  if (node.risk) {
    const label = {
      low: t('lowRisk', lang),
      medium: t('caution', lang),
      high: t('highRisk', lang),
    }[node.risk] || node.risk;
    items.push(`<span class="practical-badge risk-${escapeHtml(node.risk)}">${escapeHtml(label)}</span>`);
  }
  return items.join('');
}

function practicalSafetyCard(node, lang) {
  if (!node.risk || node.role !== 'concept') return '';
  const copy = {
    low: t('safetyLow', lang),
    medium: t('safetyMedium', lang),
    high: t('safetyHigh', lang),
  }[node.risk];
  if (!copy) return '';
  const title = node.risk === 'high' ? t('callProfessional', lang) : t('practicalNote', lang);
  return `<section class="safety-card risk-${escapeHtml(node.risk)}"><strong>${escapeHtml(title)}</strong><p>${escapeHtml(copy)}</p></section>`;
}

function renderResourceCards(node, lang) {
  const resources = node.resources || [];
  if (!resources.length) return '';
  const title = t('practicalResources', lang);
  return `<section class="resource-section"><p class="resource-heading">${title}</p><div class="resource-grid">${resources.map((resource) => {
    const label = localized(resource.title, lang, resource.source || resource.url);
    const type = {
      official: t('officialSource', lang),
      safety: t('safety', lang),
      tutorial: 'TUTORIAL',
      manual: t('manual', lang),
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
  return t({ domain: 'roleDomain', system: 'roleSystem', concept: 'roleConcept' }[role] || 'roleConcept', lang);
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

function atlasHomeUrl(lang = language) {
  const url = new URL('https://codex-atlas.up.railway.app');
  url.searchParams.set('lang', lang);
  return url.toString();
}

function syncUrl() {
  const params = new URLSearchParams();
  if (language !== 'en') params.set('lang', language);
  if (mode !== 'explore') params.set('mode', mode);
  if (selectedId) params.set('node', selectedId);
  history.replaceState(null, '', `${location.pathname}${params.toString() ? `?${params}` : ''}`);
}

