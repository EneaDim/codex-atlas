const params = new URLSearchParams(location.search);
const LANGUAGES = ['it', 'en', 'es'];
const normalizeLanguage = (value, fallback = 'en') => LANGUAGES.includes(value) ? value : fallback;
let language = normalizeLanguage(params.get('lang'), normalizeLanguage(document.documentElement.lang, 'en'));
let theme = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
document.documentElement.dataset.codexPack = 'atlas';

const COPY = {
  kicker: { it: 'ATLANTE DELLA CONOSCENZA', en: 'KNOWLEDGE ATLAS', es: 'ATLAS DEL CONOCIMIENTO' },
  title: { it: 'Esplora ciò che vuoi capire.', en: 'Explore what you want to understand.', es: 'Explora lo que quieras comprender.' },
  intro: {
    it: 'Sette mappe interattive, un unico sistema. Scegli un dominio oppure cerca un concetto in tutto l’Atlas.',
    en: 'Seven interactive maps, one shared system. Choose a domain or search for a concept across the whole Atlas.',
    es: 'Siete mapas interactivos, un único sistema. Elige un dominio o busca un concepto en todo el Atlas.',
  },
  search: { it: 'Cerca in tutti i Codex…', en: 'Search across all Codex…', es: 'Buscar en todos los Codex…' },
  searchHint: { it: 'Ricerca semantica globale', en: 'Global semantic search', es: 'Búsqueda semántica global' },
  loading: { it: 'Caricamento ricerca…', en: 'Loading search…', es: 'Cargando búsqueda…' },
  searchUnavailable: { it: 'Ricerca temporaneamente non disponibile.', en: 'Search is temporarily unavailable.', es: 'La búsqueda no está disponible temporalmente.' },
  noResults: { it: 'Nessun risultato.', en: 'No results.', es: 'No hay resultados.' },
  open: { it: 'Apri Codex', en: 'Open Codex', es: 'Abrir Codex' },
  switchLight: { it: 'Tema chiaro', en: 'Light theme', es: 'Tema claro' },
  switchDark: { it: 'Tema scuro', en: 'Dark theme', es: 'Tema oscuro' },
  footer: { it: 'Un renderer · sette domini · ricerca condivisa', en: 'One renderer · seven domains · shared search', es: 'Un renderer · siete domini · búsqueda compartida' },
};

const PACKS = [
  {
    id: 'human-body', icon: '◎', color: '#58a9ff',
    title: { it: 'Corpo Umano', en: 'Human Body', es: 'Cuerpo Humano' },
    description: { it: 'Anatomia, organi, sistemi e processi del corpo umano.', en: 'Anatomy, organs, systems and processes of the human body.', es: 'Anatomía, órganos, sistemas y procesos del cuerpo humano.' },
  },
  {
    id: 'finance', icon: '↗', color: '#f0b64e',
    title: { it: 'Finanza', en: 'Finance', es: 'Finanzas' },
    description: { it: 'Mercati, economia, investimenti, rischio e finanza personale.', en: 'Markets, economics, investing, risk and personal finance.', es: 'Mercados, economía, inversión, riesgo y finanzas personales.' },
  },
  {
    id: 'home', icon: '⌂', color: '#55d1af',
    title: { it: 'Casa Pratica', en: 'Home', es: 'Casa Práctica' },
    description: { it: 'Impianti, manutenzione, strumenti e sicurezza della casa.', en: 'Practical home knowledge: systems, maintenance, tools and safety.', es: 'Instalaciones, mantenimiento, herramientas y seguridad del hogar.' },
  },
  {
    id: 'statistics', icon: 'Σ', color: '#8b7cf6',
    title: { it: 'Statistica', en: 'Statistics', es: 'Estadística' },
    description: { it: 'Probabilità e statistica: formule, termini ed esempi.', en: 'Probability and statistics with formulas, term explanations and examples.', es: 'Probabilidad y estadística con fórmulas, términos explicados y ejemplos.' },
  },
  {
    id: 'climate', icon: '◌', color: '#4fb7ff',
    title: { it: 'Clima', en: 'Climate', es: 'Clima' },
    description: { it: 'Sistema climatico, atmosfera, oceani, feedback, impatti e risposte.', en: 'Climate system, atmosphere, oceans, feedbacks, impacts and responses.', es: 'Sistema climático, atmósfera, océanos, retroalimentaciones, impactos y respuestas.' },
  },
  {
    id: 'survival', icon: '△', color: '#ff9f43',
    title: { it: 'Sopravvivenza', en: 'Survival', es: 'Supervivencia' },
    description: { it: 'Priorità, acqua, riparo, orientamento, primo soccorso e preparazione.', en: 'Priorities, water, shelter, navigation, first aid and preparedness.', es: 'Prioridades, agua, refugio, orientación, primeros auxilios y preparación.' },
  },
  {
    id: 'nutrition', icon: '◇', color: '#6fd19a',
    title: { it: 'Nutrizione', en: 'Nutrition', es: 'Nutrición' },
    description: { it: 'Nutrienti, digestione, metabolismo, alimentazione e sicurezza alimentare.', en: 'Nutrients, digestion, metabolism, dietary patterns and food safety.', es: 'Nutrientes, digestión, metabolismo, alimentación y seguridad alimentaria.' },
  },
];

const searchInput = document.querySelector('#hub-search');
const searchResults = document.querySelector('#hub-search-results');
const themeToggle = document.querySelector('#theme-toggle');
const languageSwitch = document.querySelector('#language-switch');
const domainContainer = document.querySelector('#hub-domains');
const lines = document.querySelector('#hub-lines');

let searchModulePromise = null;
let searchVersion = 0;

render();
bind();
requestAnimationFrame(layoutHub);

function render() {
  document.documentElement.lang = language;
  setText('#hub-kicker', text('kicker'));
  setText('#hub-title', text('title'));
  setText('#hub-intro', text('intro'));
  setText('#hub-search-hint', text('searchHint'));
  setText('#hub-footer', text('footer'));
  if (searchInput) searchInput.placeholder = text('search');

  languageSwitch?.querySelectorAll('[data-lang]').forEach((button) => {
    const active = button.dataset.lang === language;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', active ? 'true' : 'false');
  });

  renderThemeButton();
  renderDomains();
  if (searchInput?.value.trim()) renderSearch();
  document.title = `Codex Atlas · ${text('kicker')}`;
  syncUrl();
  requestAnimationFrame(layoutHub);
}

function renderDomains() {
  if (!domainContainer) return;
  domainContainer.innerHTML = PACKS.map((pack, index) => `
    <a class="hub-domain-card" data-pack="${pack.id}" data-index="${index}" href="${packSiteUrl(pack.id, { language })}" style="--domain-color:${pack.color}">
      <span class="hub-domain-icon">${pack.icon}</span>
      <span class="hub-domain-copy"><small>CODEX ${String(index + 1).padStart(2, '0')}</small><strong>${escapeHtml(localized(pack.title))}</strong><span>${escapeHtml(localized(pack.description))}</span></span>
      <b>${text('open')} ↗</b>
    </a>`).join('');
}

function layoutHub() {
  const stage = document.querySelector('.hub-stage');
  const center = document.querySelector('.hub-center');
  const cards = [...(domainContainer?.querySelectorAll('.hub-domain-card') || [])];
  if (!stage || !center || !lines || !cards.length) return;

  const stageRect = stage.getBoundingClientRect();
  const centerRect = center.getBoundingClientRect();
  const mobile = window.matchMedia('(max-width: 820px)').matches;
  lines.replaceChildren();
  lines.setAttribute('viewBox', `0 0 ${Math.max(1, stageRect.width)} ${Math.max(1, stageRect.height)}`);

  if (mobile) {
    cards.forEach((card) => { card.style.removeProperty('--hub-x'); card.style.removeProperty('--hub-y'); });
    return;
  }

  const cx = centerRect.left - stageRect.left + centerRect.width / 2;
  const cy = centerRect.top - stageRect.top + centerRect.height / 2;
  const radiusX = Math.min(stageRect.width * 0.37, 520);
  const radiusY = Math.min(stageRect.height * 0.34, 330);

  cards.forEach((card, index) => {
    const angle = (-Math.PI / 2) + (index * Math.PI * 2 / cards.length);
    const x = cx + Math.cos(angle) * radiusX;
    const y = cy + Math.sin(angle) * radiusY;
    card.style.setProperty('--hub-x', `${x}px`);
    card.style.setProperty('--hub-y', `${y}px`);

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const pull = 0.55;
    line.setAttribute('d', `M ${cx} ${cy} Q ${cx + (x - cx) * pull} ${cy + (y - cy) * pull} ${x} ${y}`);
    line.setAttribute('class', 'hub-line');
    line.style.setProperty('--line-color', card.style.getPropertyValue('--domain-color'));
    lines.append(line);
  });
}

function bind() {
  languageSwitch?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-lang]');
    if (!button) return;
    language = normalizeLanguage(button.dataset.lang, 'en');
    render();
  });

  themeToggle?.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('codex-theme', theme); } catch {}
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#fbfcfc' : '#0b0d11');
    renderThemeButton();
  });

  searchInput?.addEventListener('input', renderSearch);
  searchInput?.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      searchInput.value = '';
      hideSearch();
      searchInput.blur();
    }
  });

  searchResults?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-pack][data-node]');
    if (!button) return;
    location.href = packSiteUrl(button.dataset.pack, { nodeId: button.dataset.node, language });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === '/' && document.activeElement !== searchInput) {
      event.preventDefault();
      searchInput?.focus();
    }
  });

  window.addEventListener('resize', layoutHub, { passive: true });
}

async function renderSearch() {
  if (!searchInput || !searchResults) return;
  const query = searchInput.value.trim();
  const version = ++searchVersion;
  if (query.length < 2) {
    hideSearch();
    return;
  }

  searchResults.hidden = false;
  searchResults.innerHTML = `<p>${escapeHtml(text('loading'))}</p>`;

  try {
    const search = await loadSearch();
    if (version !== searchVersion || searchInput.value.trim() !== query) return;
    const results = search.semanticSearch(query, { language, limit: 9 });
    searchResults.innerHTML = results.length ? results.map((result) => `
      <button type="button" data-pack="${escapeHtml(result.packId)}" data-node="${escapeHtml(result.node.id)}">
        <span><strong>${escapeHtml(result.title)}</strong><small>${escapeHtml(result.packTitle)} · ${escapeHtml(result.path || '')}</small></span><b>↗</b>
      </button>`).join('') : `<p>${escapeHtml(text('noResults'))}</p>`;
  } catch (error) {
    console.error('Codex Atlas semantic search failed to load:', error);
    if (version === searchVersion) searchResults.innerHTML = `<p>${escapeHtml(text('searchUnavailable'))}</p>`;
  }
}

function loadSearch() {
  if (!searchModulePromise) searchModulePromise = import('./core/search.js');
  return searchModulePromise;
}

function hideSearch() {
  if (!searchResults) return;
  searchResults.hidden = true;
  searchResults.replaceChildren();
}

function renderThemeButton() {
  if (!themeToggle) return;
  const dark = theme === 'dark';
  themeToggle.textContent = dark ? '☼' : '☾';
  const label = dark ? text('switchLight') : text('switchDark');
  themeToggle.title = label;
  themeToggle.setAttribute('aria-label', label);
}

function packSiteUrl(packId, { nodeId = '', language: lang = 'it' } = {}) {
  const base = `https://codex-${packId}.up.railway.app/`;
  const query = new URLSearchParams();
  if (lang) query.set('lang', lang);
  if (nodeId) query.set('node', nodeId);
  const suffix = query.toString();
  return suffix ? `${base}?${suffix}` : base;
}

function syncUrl() {
  try {
    const next = new URL(location.href);
    next.searchParams.set('lang', language);
    history.replaceState(null, '', next);
  } catch {}
}

function localized(value) {
  return value?.[language] ?? value?.en ?? value?.it ?? value?.es ?? '';
}

function text(key) {
  return COPY[key]?.[language] || COPY[key]?.en || key;
}

function setText(selector, value) {
  const node = document.querySelector(selector);
  if (node) node.textContent = value;
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
}
