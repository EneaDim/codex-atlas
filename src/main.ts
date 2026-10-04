import './styles/main.css';
import { humanBody } from './content/humanBody';
import type { FlatNode, Language } from './content/types';
import { flattenPack, getNodePath, roleLabel, searchableText } from './core/model';
import { branchPath, buildSegments, centerBranchPath, nodePoint, outerLabelLayout, OUTER_GUIDE_RADIUS } from './core/radial';
import { ViewportController } from './core/viewport';
import { fetchWikipediaIntro } from './core/wikipedia';

const pack = humanBody;
const nodes = flattenPack(pack);
const nodeById = new Map(nodes.map((node) => [node.id, node]));
const segments = buildSegments(pack);
const segmentById = new Map(segments.map((segment) => [segment.id, segment]));
const domainIndex = new Map(pack.domains.map((domain, index) => [domain.id, index]));
const learnSequence = nodes
  .filter((node) => node.role === 'concept' && node.learnOrder !== undefined)
  .sort((a, b) => (a.learnOrder ?? 999) - (b.learnOrder ?? 999));

const params = new URLSearchParams(location.search);
let language: Language = params.get('lang') === 'it' ? 'it' : 'en';
let selectedId = params.get('node') ?? '';
let learnMode = params.get('mode') === 'learn';
let learnIndex = Math.max(0, learnSequence.findIndex((node) => node.id === selectedId));
let drawerRenderVersion = 0;
let hoverRenderVersion = 0;
let hoverHideTimer: number | undefined;

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('App root not found');

app.innerHTML = `
  <main class="app-shell">
    <header class="topbar">
      <a class="brand" href="/" aria-label="Codex Atlas home">
        <span class="brand-mark">C</span>
        <span>
          <strong id="brand-title"></strong>
          <small>CODEX ATLAS / 001</small>
        </span>
      </a>

      <div class="topbar-actions">
        <div class="mode-switch" role="group" aria-label="View mode">
          <button type="button" class="mode-button" data-mode="explore">Explore</button>
          <button type="button" class="mode-button" data-mode="learn">Learn</button>
        </div>
        <button type="button" class="icon-button search-toggle" id="search-toggle" aria-label="Search" aria-expanded="false" aria-controls="search-wrap">⌕</button>
        <button type="button" class="language-button" id="language-button" aria-label="Switch language"></button>
        <button type="button" class="icon-button" id="about-button" aria-label="About">i</button>
      </div>
    </header>

    <section class="search-wrap" id="search-wrap" aria-label="Search knowledge map" aria-hidden="true">
      <label class="search-box">
        <span class="search-icon">⌕</span>
        <input id="search" autocomplete="off" spellcheck="false" />
        <kbd>/</kbd>
      </label>
      <div class="search-results" id="search-results" hidden></div>
    </section>

    <section class="canvas-wrap">
      <div class="map-meta left">
        <span id="mode-kicker"></span>
        <strong id="map-subtitle"></strong>
      </div>
      <div class="map-meta right">
        <span id="zoom-label">100%</span>
        <button type="button" id="reset-view">Reset view</button>
      </div>

      <svg id="codex-map" class="codex-map" viewBox="-930 -930 1860 1860" role="img" aria-labelledby="svg-title svg-desc">
        <title id="svg-title"></title>
        <desc id="svg-desc"></desc>
        <g id="viewport"></g>
      </svg>

      <div class="map-hint" id="map-hint"></div>
    </section>

    <div class="hover-card" id="hover-card" aria-live="polite" aria-hidden="true">
      <div id="hover-card-content"></div>
    </div>

    <aside class="detail-drawer" id="detail-drawer" aria-live="polite" aria-hidden="true">
      <button class="drawer-close" id="drawer-close" type="button" aria-label="Close">×</button>
      <div id="drawer-content"></div>
    </aside>

    <dialog class="about-dialog" id="about-dialog">
      <button class="drawer-close" id="about-close" type="button" aria-label="Close">×</button>
      <p class="eyebrow">CODEX ATLAS</p>
      <h2 id="about-title"></h2>
      <p id="about-copy"></p>
      <div class="about-rule"></div>
      <p class="fine-print" id="about-fine"></p>
    </dialog>
  </main>
`;

const svg = must<SVGSVGElement>('codex-map');
const viewport = must<SVGGElement>('viewport');
const drawer = must<HTMLElement>('detail-drawer');
const drawerContent = must<HTMLDivElement>('drawer-content');
const hoverCard = must<HTMLDivElement>('hover-card');
const hoverCardContent = must<HTMLDivElement>('hover-card-content');
const searchWrap = must<HTMLElement>('search-wrap');
const searchToggle = must<HTMLButtonElement>('search-toggle');
const search = must<HTMLInputElement>('search');
const searchResults = must<HTMLDivElement>('search-results');
const zoomLabel = must<HTMLElement>('zoom-label');
const languageButton = must<HTMLButtonElement>('language-button');
const aboutDialog = must<HTMLDialogElement>('about-dialog');

const viewportController = new ViewportController(svg, viewport, (scale) => {
  zoomLabel.textContent = `${Math.round(scale * 100)}%`;
});

renderMap();
renderChrome();
bindEvents();

if (selectedId && nodeById.has(selectedId)) {
  selectNode(selectedId, false);
} else if (learnMode) {
  startLearnMode();
}

function renderMap(): void {
  viewport.replaceChildren();

  const guide = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  guide.setAttribute('r', String(OUTER_GUIDE_RADIUS));
  guide.classList.add('guide-ring', 'outer-guide');
  viewport.append(guide);

  const labelPlacements = buildHorizontalLabelPlacements();

  // Draw detached domain labels first, then the bundled branches, then the centre.
  const roleOrder = { domain: 0, system: 1, concept: 2 } as const;
  const orderedSegments = [...segments].sort((a, b) => roleOrder[a.role] - roleOrder[b.role]);

  for (const segment of orderedSegments) {
    const node = nodeById.get(segment.id);
    if (!node) continue;

    const parentSegment = node.parentId ? segmentById.get(node.parentId) : undefined;
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.classList.add('segment', `segment-${segment.role}`, `domain-${domainIndex.get(segment.domainId) ?? 0}`);
    group.dataset.nodeId = node.id;
    group.setAttribute('tabindex', '0');
    group.setAttribute('role', 'button');
    group.setAttribute('aria-label', node.title[language]);

    const paths: string[] = [];
    if (segment.role === 'domain') {
      paths.push(centerBranchPath(segment));
    } else if (parentSegment) {
      paths.push(branchPath(parentSegment, segment));
    }

    paths.forEach((pathData) => {
      const branch = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      branch.setAttribute('d', pathData);
      branch.classList.add('branch-line');
      if (segment.role === 'domain') branch.classList.add('domain-trunk');
      if (segment.role === 'concept') branch.classList.add('concept-branch');
      if (segment.role === 'system') branch.classList.add('system-branch');

      const hit = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      hit.setAttribute('d', pathData);
      hit.classList.add('branch-hit');
      group.append(branch, hit);
    });

    const [endX, endY] = nodePoint(segment);
    const labelPlacement = labelPlacements.get(node.id);

    if (segment.role === 'concept') {
      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('cx', String(endX));
      dot.setAttribute('cy', String(endY));
      dot.setAttribute('r', '3.4');
      dot.classList.add('leaf-dot');
      group.append(dot);

      if (labelPlacement) {
        appendChipLabel(group, {
          x: labelPlacement.x,
          y: labelPlacement.y,
          textAnchor: labelPlacement.textAnchor,
          text: node.title[language],
          textClass: 'leaf-label',
          chipClass: 'leaf-chip',
        });
      }
    } else if (segment.role === 'system') {
      const hub = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      hub.setAttribute('cx', String(endX));
      hub.setAttribute('cy', String(endY));
      hub.setAttribute('r', '2.6');
      hub.classList.add('system-hub');
      group.append(hub);

      if (labelPlacement) {
        appendChipLabel(group, {
          x: labelPlacement.x,
          y: labelPlacement.y,
          textAnchor: labelPlacement.textAnchor,
          text: node.title[language],
          textClass: 'system-label',
          chipClass: 'system-chip',
        });
      }
    } else {
      const hub = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      hub.setAttribute('cx', String(endX));
      hub.setAttribute('cy', String(endY));
      hub.setAttribute('r', '2.8');
      hub.classList.add('domain-hub');
      group.append(hub);

      const domainAnchor = endX >= 0 ? 'start' : 'end';
      appendChipLabel(group, {
        x: endX + (endX >= 0 ? 22 : -22),
        y: endY,
        textAnchor: domainAnchor,
        text: node.title[language],
        textClass: 'domain-inner-label',
        chipClass: 'domain-inner-chip',
      });

      if (labelPlacement) {
        const outerDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        outerDot.setAttribute('cx', String(labelPlacement.dotX ?? 0));
        outerDot.setAttribute('cy', String(labelPlacement.dotY ?? 0));
        outerDot.setAttribute('r', '8');
        outerDot.classList.add('domain-dot');
        group.append(outerDot);

        appendChipLabel(group, {
          x: labelPlacement.x,
          y: labelPlacement.y,
          textAnchor: labelPlacement.textAnchor,
          text: node.title[language],
          textClass: 'domain-callout-title',
          chipClass: 'domain-chip',
        });
      }
    }

    group.addEventListener('pointerenter', (event) => {
      if (learnMode || event.pointerType === 'touch') return;
      showHoverCard(node, event.clientX, event.clientY);
    });
    group.addEventListener('pointermove', (event) => {
      if (learnMode || event.pointerType === 'touch' || hoverCard.getAttribute('aria-hidden') === 'true') return;
      positionHoverCard(event.clientX, event.clientY);
    });
    group.addEventListener('pointerleave', () => {
      if (!learnMode) scheduleHoverHide();
    });
    group.addEventListener('focus', () => {
      if (!learnMode) showHoverCardForElement(node, group);
    });
    group.addEventListener('blur', () => {
      if (!learnMode) scheduleHoverHide();
    });
    group.addEventListener('click', (event) => {
      event.stopPropagation();
      hideHoverCard();
      selectNode(node.id, true);
    });
    group.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        hideHoverCard();
        selectNode(node.id, true);
      }
    });
    viewport.append(group);
  }

  const center = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  center.classList.add('center-core');
  center.setAttribute('role', 'button');
  center.setAttribute('tabindex', '0');
  center.setAttribute('aria-label', language === 'it' ? 'Reimposta vista' : 'Reset view');

  const halo = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  halo.setAttribute('r', '194');
  halo.classList.add('center-halo');

  const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
  image.setAttribute('href', pack.centerImage);
  image.setAttribute('x', '-174');
  image.setAttribute('y', '-174');
  image.setAttribute('width', '348');
  image.setAttribute('height', '348');
  image.setAttribute('preserveAspectRatio', 'xMidYMid slice');
  image.classList.add('center-image');

  const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  label.setAttribute('x', '0');
  label.setAttribute('y', '174');
  label.setAttribute('text-anchor', 'middle');
  label.classList.add('center-label');
  label.textContent = language === 'it' ? 'CORPO UMANO' : 'HUMAN BODY';

  center.append(halo, image, label);
  center.addEventListener('click', () => {
    hideHoverCard();
    viewportController.reset();
    closeDrawer();
  });
  viewport.append(center);

  applySelectionClasses();
}

type LabelPlacement = {
  x: number;
  y: number;
  textAnchor: 'start' | 'end' | 'middle';
  dotX?: number;
  dotY?: number;
};

function buildHorizontalLabelPlacements(): Map<string, LabelPlacement> {
  const placements = new Map<string, LabelPlacement>();

  const conceptEntries = segments
    .filter((segment) => segment.role === 'concept')
    .map((segment) => {
      const [x, y] = nodePoint(segment);
      const right = x >= 0;
      return {
        id: segment.id,
        side: right ? 'right' : 'left',
        baseY: y,
        x: x + (right ? 12 : -12),
        textAnchor: right ? 'start' as const : 'end' as const,
      };
    });

  const systemEntries = segments
    .filter((segment) => segment.role === 'system')
    .map((segment) => {
      const [x, y] = nodePoint(segment);
      const right = x >= 0;
      return {
        id: segment.id,
        side: right ? 'right' : 'left',
        baseY: y,
        x: x + (right ? 14 : -14),
        textAnchor: right ? 'start' as const : 'end' as const,
      };
    });

  applySpread(conceptEntries, 13).forEach((entry) => {
    placements.set(entry.id, { x: entry.x, y: entry.y, textAnchor: entry.textAnchor });
  });
  applySpread(systemEntries, 18).forEach((entry) => {
    placements.set(entry.id, { x: entry.x, y: entry.y, textAnchor: entry.textAnchor });
  });

  segments
    .filter((segment) => segment.role === 'domain')
    .forEach((segment) => {
      const outer = outerLabelLayout(segment);
      placements.set(segment.id, {
        x: outer.x,
        y: outer.y,
        textAnchor: outer.textAnchor,
        dotX: outer.dotX,
        dotY: outer.dotY,
      });
    });

  return placements;
}

function applySpread<T extends { id: string; side: string; baseY: number; x: number; textAnchor: 'start' | 'end' }>(entries: T[], minGap: number) {
  const limitTop = -820;
  const limitBottom = 820;
  const result: Array<T & { y: number }> = [];

  for (const side of ['left', 'right'] as const) {
    const subset = entries
      .filter((entry) => entry.side === side)
      .sort((a, b) => a.baseY - b.baseY)
      .map((entry) => ({ ...entry, y: entry.baseY }));

    for (let index = 1; index < subset.length; index += 1) {
      subset[index].y = Math.max(subset[index].y, subset[index - 1].y + minGap);
    }

    for (let index = subset.length - 2; index >= 0; index -= 1) {
      subset[index].y = Math.min(subset[index].y, subset[index + 1].y - minGap);
    }

    const first = subset[0];
    const last = subset[subset.length - 1];
    if (first && first.y < limitTop) {
      const shift = limitTop - first.y;
      subset.forEach((entry) => { entry.y += shift; });
    }
    if (last && last.y > limitBottom) {
      const shift = last.y - limitBottom;
      subset.forEach((entry) => { entry.y -= shift; });
    }

    result.push(...subset);
  }

  return result;
}

function appendChipLabel(
  group: SVGGElement,
  options: {
    x: number;
    y: number;
    textAnchor: 'start' | 'middle' | 'end';
    text: string;
    textClass: string;
    chipClass: string;
  },
): SVGTextElement {
  const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  textEl.setAttribute('x', String(options.x));
  textEl.setAttribute('y', String(options.y));
  textEl.setAttribute('text-anchor', options.textAnchor);
  textEl.classList.add(options.textClass);
  textEl.textContent = options.text;
  group.append(textEl);

  const bbox = textEl.getBBox();
  const padX = 6;
  const padY = 3;
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  rect.setAttribute('x', String(bbox.x - padX));
  rect.setAttribute('y', String(bbox.y - padY));
  rect.setAttribute('width', String(bbox.width + padX * 2));
  rect.setAttribute('height', String(bbox.height + padY * 2));
  rect.setAttribute('rx', '8');
  rect.setAttribute('ry', '8');
  rect.classList.add('label-chip-bg', options.chipClass);
  group.insertBefore(rect, textEl);
  return textEl;
}

function renderChrome(): void {
  document.documentElement.lang = language;
  document.title = `${pack.title[language]} — Codex Atlas`;
  must<HTMLElement>('brand-title').textContent = pack.title[language];
  must<HTMLElement>('map-subtitle').textContent = pack.subtitle[language];
  must<HTMLElement>('mode-kicker').textContent = learnMode
    ? language === 'it' ? 'PERCORSO GUIDATO' : 'GUIDED PATH'
    : language === 'it' ? 'MAPPA INTERATTIVA' : 'INTERACTIVE MAP';
  must<HTMLElement>('map-hint').textContent = language === 'it'
    ? 'Passa sui nodi per l’anteprima · clicca per aprire · trascina per muoverti'
    : 'Hover nodes to preview · click to open · drag to move';
  search.placeholder = language === 'it' ? 'Cerca un concetto…' : 'Search a concept…';
  searchToggle.setAttribute('aria-label', language === 'it' ? 'Cerca' : 'Search');
  searchToggle.title = language === 'it' ? 'Cerca (/) ' : 'Search (/)';
  languageButton.textContent = language === 'it' ? 'EN' : 'IT';
  languageButton.title = language === 'it' ? 'Switch to English' : 'Passa all’italiano';

  must<SVGTitleElement>('svg-title').textContent = pack.title[language];
  must<SVGDescElement>('svg-desc').textContent = pack.subtitle[language];
  must<HTMLButtonElement>('reset-view').textContent = language === 'it' ? 'Reimposta' : 'Reset view';

  const exploreButton = document.querySelector<HTMLButtonElement>('[data-mode="explore"]');
  const learnButton = document.querySelector<HTMLButtonElement>('[data-mode="learn"]');
  exploreButton?.classList.toggle('active', !learnMode);
  learnButton?.classList.toggle('active', learnMode);
  if (exploreButton) exploreButton.textContent = language === 'it' ? 'Esplora' : 'Explore';
  if (learnButton) learnButton.textContent = language === 'it' ? 'Impara' : 'Learn';

  must<HTMLElement>('about-title').textContent = language === 'it' ? 'Come leggere la mappa' : 'How to read the map';
  must<HTMLElement>('about-copy').textContent = language === 'it'
    ? 'Dal centro partono fasci curvi raggruppati per macro-area; lungo tutto l’albero compaiono etichette orizzontali per domini, sistemi e concetti. La modalità Impara segue una sequenza di prerequisiti.'
    : 'Curved bundles emerge from the center by macro domain, with horizontal labels shown across domains, systems and concepts. Learn mode follows a prerequisite-aware sequence.';
  must<HTMLElement>('about-fine').textContent = language === 'it'
    ? 'Le descrizioni sono sintesi originali a scopo didattico. Wikipedia è fornita come fonte di approfondimento, non come sostituto di testi clinici o formazione professionale.'
    : 'Descriptions are original educational summaries. Wikipedia is provided for further reading, not as a substitute for clinical references or professional training.';

  if (selectedId && nodeById.has(selectedId)) renderDrawer(nodeById.get(selectedId)!);
  renderSearchResults(search.value);
}

function bindEvents(): void {
  must<HTMLButtonElement>('language-button').addEventListener('click', () => {
    hideHoverCard();
    language = language === 'en' ? 'it' : 'en';
    renderMap();
    renderChrome();
    syncUrl();
  });

  document.querySelectorAll<HTMLButtonElement>('.mode-button').forEach((button) => {
    button.addEventListener('click', () => {
      const mode = button.dataset.mode;
      if (mode === 'learn') startLearnMode();
      else stopLearnMode();
    });
  });

  must<HTMLButtonElement>('reset-view').addEventListener('click', () => viewportController.reset());
  must<HTMLButtonElement>('drawer-close').addEventListener('click', closeDrawer);
  must<HTMLButtonElement>('about-button').addEventListener('click', () => aboutDialog.showModal());
  must<HTMLButtonElement>('about-close').addEventListener('click', () => aboutDialog.close());

  hoverCard.addEventListener('pointerenter', cancelHoverHide);
  hoverCard.addEventListener('pointerleave', scheduleHoverHide);

  svg.addEventListener('click', (event) => {
    if (event.target === svg) {
      hideHoverCard();
      closeDrawer();
    }
  });

  searchToggle.addEventListener('click', (event) => {
    event.stopPropagation();
    if (searchWrap.classList.contains('open')) closeSearch();
    else openSearch();
  });

  search.addEventListener('input', () => renderSearchResults(search.value));
  search.addEventListener('focus', () => renderSearchResults(search.value));

  document.addEventListener('click', (event) => {
    const target = event.target as Node;
    if (!searchWrap.contains(target) && target !== searchToggle) closeSearch();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === '/' && document.activeElement !== search) {
      event.preventDefault();
      openSearch();
    }
    if (event.key === 'Escape') {
      if (searchWrap.classList.contains('open')) {
        closeSearch();
      } else if (aboutDialog.open) aboutDialog.close();
      else if (hoverCard.getAttribute('aria-hidden') === 'false') hideHoverCard();
      else closeDrawer();
    }
  });
}

function showHoverCardForElement(node: FlatNode, element: SVGGraphicsElement): void {
  const rect = element.getBoundingClientRect();
  showHoverCard(node, rect.left + rect.width / 2, rect.top + rect.height / 2);
}

function showHoverCard(node: FlatNode, clientX: number, clientY: number): void {
  cancelHoverHide();
  const renderVersion = ++hoverRenderVersion;
  const requestLanguage = language;

  hoverCardContent.innerHTML = `
    <div class="hover-card-head">
      <span class="hover-role">${escapeHtml(roleLabel(node.role, requestLanguage))}</span>
      <span class="hover-wiki">WIKIPEDIA</span>
    </div>
    <h3>${escapeHtml(node.title[requestLanguage])}</h3>
    <p id="hover-extract-${escapeHtml(node.id)}">${escapeHtml(node.description[requestLanguage])}</p>
    <div class="hover-card-foot">
      <span>${requestLanguage === 'it' ? 'Caricamento estratto…' : 'Loading extract…'}</span>
      <a href="${node.wikipedia[requestLanguage]}" target="_blank" rel="noreferrer">Wikipedia ↗</a>
    </div>
  `;

  hoverCard.classList.add('open');
  hoverCard.setAttribute('aria-hidden', 'false');
  positionHoverCard(clientX, clientY);
  void hydrateHoverCard(node, renderVersion, requestLanguage);
}

async function hydrateHoverCard(node: FlatNode, renderVersion: number, requestLanguage: Language): Promise<void> {
  // Small delay avoids firing network requests while the pointer merely crosses labels.
  await new Promise<void>((resolve) => window.setTimeout(resolve, 110));
  if (renderVersion !== hoverRenderVersion || learnMode || language !== requestLanguage) return;

  const extract = await fetchWikipediaIntro(node.wikipedia[requestLanguage], requestLanguage);
  if (renderVersion !== hoverRenderVersion || learnMode || language !== requestLanguage) return;

  const copy = hoverCard.querySelector<HTMLElement>(`#hover-extract-${CSS.escape(node.id)}`);
  const status = hoverCard.querySelector<HTMLElement>('.hover-card-foot span');
  if (copy) copy.textContent = extract ?? node.description[requestLanguage];
  if (status) status.textContent = extract
    ? (requestLanguage === 'it' ? 'Estratto Wikipedia · CC BY-SA' : 'Wikipedia excerpt · CC BY-SA')
    : (requestLanguage === 'it' ? 'Sintesi locale' : 'Local summary');
}

function positionHoverCard(clientX: number, clientY: number): void {
  const gap = 18;
  const margin = 14;
  const width = Math.min(340, window.innerWidth - margin * 2);
  const rect = hoverCard.getBoundingClientRect();
  const height = rect.height || 190;

  let x = clientX + gap;
  if (x + width > window.innerWidth - margin) x = clientX - width - gap;
  x = Math.max(margin, Math.min(x, window.innerWidth - width - margin));

  let y = clientY + gap;
  if (y + height > window.innerHeight - margin) y = clientY - height - gap;
  y = Math.max(margin, Math.min(y, window.innerHeight - height - margin));

  hoverCard.style.width = `${width}px`;
  hoverCard.style.left = `${x}px`;
  hoverCard.style.top = `${y}px`;
}

function cancelHoverHide(): void {
  if (hoverHideTimer !== undefined) {
    window.clearTimeout(hoverHideTimer);
    hoverHideTimer = undefined;
  }
}

function scheduleHoverHide(): void {
  cancelHoverHide();
  hoverHideTimer = window.setTimeout(hideHoverCard, 180);
}

function hideHoverCard(): void {
  cancelHoverHide();
  hoverRenderVersion += 1;
  hoverCard.classList.remove('open');
  hoverCard.setAttribute('aria-hidden', 'true');
}

function selectNode(id: string, focus: boolean): void {
  hideHoverCard();
  const node = nodeById.get(id);
  const segment = segmentById.get(id);
  if (!node || !segment) return;

  selectedId = id;
  if (learnMode && node.role === 'concept') {
    const index = learnSequence.findIndex((entry) => entry.id === id);
    if (index >= 0) learnIndex = index;
  }
  renderDrawer(node);
  applySelectionClasses();
  if (focus) viewportController.focus(segment);
  syncUrl();
}

function renderDrawer(node: FlatNode): void {
  const renderVersion = ++drawerRenderVersion;
  const path = getNodePath(nodes, node.id);
  const prerequisites = node.prerequisites
    .map((id) => nodeById.get(id))
    .filter((item): item is FlatNode => Boolean(item));

  const learnPosition = learnSequence.findIndex((entry) => entry.id === node.id);
  const isLearnConcept = learnMode && learnPosition >= 0;
  const showWikipediaIntro = !learnMode;

  drawerContent.innerHTML = `
    <p class="eyebrow">${escapeHtml(roleLabel(node.role, language))}</p>
    <nav class="breadcrumbs" aria-label="Breadcrumb">
      ${path.map((entry) => `<button type="button" data-select="${entry.id}">${escapeHtml(entry.title[language])}</button>`).join('<span>›</span>')}
    </nav>
    <h2>${escapeHtml(node.title[language])}</h2>

    ${showWikipediaIntro ? `
      <section class="wiki-extract" aria-live="polite">
        <div class="wiki-extract-heading">
          <span class="wiki-wordmark">W</span>
          <div>
            <small>WIKIPEDIA</small>
            <strong>${language === 'it' ? 'Introduzione' : 'Introduction'}</strong>
          </div>
        </div>
        <p class="drawer-description wiki-extract-copy" id="wiki-extract-${escapeHtml(node.id)}">
          <span class="wiki-loading">${language === 'it' ? 'Caricamento dell’introduzione…' : 'Loading introduction…'}</span>
        </p>
        <p class="wiki-attribution">${language === 'it' ? 'Estratto da Wikipedia · CC BY-SA' : 'Excerpt from Wikipedia · CC BY-SA'}</p>
      </section>
    ` : `
      <p class="drawer-description">${escapeHtml(node.description[language])}</p>
    `}

    ${prerequisites.length && learnMode ? `
      <section class="drawer-section">
        <h3>${language === 'it' ? 'Prerequisiti' : 'Prerequisites'}</h3>
        <div class="chip-row">
          ${prerequisites.map((entry) => `<button type="button" class="chip" data-select="${entry.id}">${escapeHtml(entry.title[language])}</button>`).join('')}
        </div>
      </section>
    ` : ''}

    ${isLearnConcept ? `
      <section class="learn-card">
        <div>
          <span>${language === 'it' ? 'Percorso' : 'Learning path'}</span>
          <strong>${learnPosition + 1} / ${learnSequence.length}</strong>
        </div>
        <div class="progress"><span style="width:${((learnPosition + 1) / learnSequence.length) * 100}%"></span></div>
        <div class="learn-actions">
          <button type="button" data-learn="prev" ${learnPosition === 0 ? 'disabled' : ''}>← ${language === 'it' ? 'Prima' : 'Previous'}</button>
          <button type="button" data-learn="next" ${learnPosition === learnSequence.length - 1 ? 'disabled' : ''}>${language === 'it' ? 'Avanti' : 'Next'} →</button>
        </div>
      </section>
    ` : ''}

    <a class="wiki-link" href="${node.wikipedia[language]}" target="_blank" rel="noreferrer">
      <span>W</span>
      <span><small>WIKIPEDIA</small>${language === 'it' ? 'Apri l’articolo completo' : 'Open full article'}</span>
      <b>↗</b>
    </a>
  `;

  drawer.querySelectorAll<HTMLButtonElement>('[data-select]').forEach((button) => {
    button.addEventListener('click', () => selectNode(button.dataset.select ?? '', true));
  });

  drawer.querySelector<HTMLButtonElement>('[data-learn="prev"]')?.addEventListener('click', () => stepLearn(-1));
  drawer.querySelector<HTMLButtonElement>('[data-learn="next"]')?.addEventListener('click', () => stepLearn(1));

  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');

  if (showWikipediaIntro) void hydrateWikipediaIntro(node, renderVersion);
}

async function hydrateWikipediaIntro(node: FlatNode, renderVersion: number): Promise<void> {
  const requestLanguage = language;
  const extract = await fetchWikipediaIntro(node.wikipedia[requestLanguage], requestLanguage);

  if (renderVersion !== drawerRenderVersion || selectedId !== node.id || learnMode || language !== requestLanguage) return;

  const target = document.getElementById(`wiki-extract-${node.id}`);
  if (!target) return;

  target.textContent = extract ?? node.description[requestLanguage];
  if (!extract) target.classList.add('wiki-extract-fallback');
}

function closeDrawer(): void {
  drawerRenderVersion += 1;
  selectedId = '';
  drawer.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
  applySelectionClasses();
  syncUrl();
}

function openSearch(): void {
  searchWrap.classList.add('open');
  searchWrap.setAttribute('aria-hidden', 'false');
  searchToggle.setAttribute('aria-expanded', 'true');
  requestAnimationFrame(() => search.focus());
}

function closeSearch(): void {
  searchWrap.classList.remove('open');
  searchWrap.setAttribute('aria-hidden', 'true');
  searchToggle.setAttribute('aria-expanded', 'false');
  searchResults.hidden = true;
}

function renderSearchResults(query: string): void {
  const term = query.trim().toLocaleLowerCase();
  if (!term) {
    searchResults.hidden = true;
    searchResults.replaceChildren();
    return;
  }

  const matches = nodes
    .filter((node) => searchableText(node).includes(term))
    .sort((a, b) => {
      const aStarts = a.title[language].toLocaleLowerCase().startsWith(term) ? 0 : 1;
      const bStarts = b.title[language].toLocaleLowerCase().startsWith(term) ? 0 : 1;
      return aStarts - bStarts || a.title[language].localeCompare(b.title[language]);
    })
    .slice(0, 8);

  searchResults.innerHTML = matches.length
    ? matches.map((node) => `
        <button type="button" data-search-id="${node.id}">
          <span><strong>${escapeHtml(node.title[language])}</strong><small>${escapeHtml(roleLabel(node.role, language))}</small></span>
          <b>↗</b>
        </button>
      `).join('')
    : `<p>${language === 'it' ? 'Nessun risultato.' : 'No results.'}</p>`;

  searchResults.querySelectorAll<HTMLButtonElement>('[data-search-id]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.dataset.searchId;
      if (!id) return;
      selectNode(id, true);
      search.value = '';
      closeSearch();
    });
  });

  searchResults.hidden = false;
}

function startLearnMode(): void {
  hideHoverCard();
  learnMode = true;
  const existingIndex = learnSequence.findIndex((node) => node.id === selectedId);
  learnIndex = existingIndex >= 0 ? existingIndex : 0;
  const node = learnSequence[learnIndex];
  renderChrome();
  if (node) selectNode(node.id, true);
  applySelectionClasses();
  syncUrl();
}

function stopLearnMode(): void {
  hideHoverCard();
  learnMode = false;
  renderChrome();
  applySelectionClasses();
  syncUrl();
}

function stepLearn(direction: -1 | 1): void {
  learnIndex = Math.min(learnSequence.length - 1, Math.max(0, learnIndex + direction));
  const node = learnSequence[learnIndex];
  if (node) selectNode(node.id, true);
}

function applySelectionClasses(): void {
  const selected = selectedId ? nodeById.get(selectedId) : undefined;
  const relevantIds = new Set<string>();

  if (selected) {
    getNodePath(nodes, selected.id).forEach((node) => relevantIds.add(node.id));
    selected.prerequisites.forEach((id) => relevantIds.add(id));
  }

  viewport.querySelectorAll<SVGGElement>('.segment').forEach((element) => {
    const id = element.dataset.nodeId ?? '';
    element.classList.toggle('selected', id === selectedId);
    element.classList.toggle('related', relevantIds.has(id) && id !== selectedId);
    element.classList.toggle('dimmed', Boolean(selected) && !relevantIds.has(id) && id !== selectedId);

    if (learnMode) {
      const node = nodeById.get(id);
      const sequenceIndex = node ? learnSequence.findIndex((entry) => entry.id === node.id) : -1;
      element.classList.toggle('completed', sequenceIndex >= 0 && sequenceIndex < learnIndex);
    } else {
      element.classList.remove('completed');
    }
  });
}

function syncUrl(): void {
  const next = new URLSearchParams();
  if (language !== 'en') next.set('lang', language);
  if (learnMode) next.set('mode', 'learn');
  if (selectedId) next.set('node', selectedId);
  const query = next.toString();
  history.replaceState(null, '', `${location.pathname}${query ? `?${query}` : ''}`);
}

function must<T extends Element>(id: string): T {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Missing element #${id}`);
  return element as unknown as T;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#039;',
    '"': '&quot;',
  })[character] ?? character);
}
