import { flattenPack } from './layout.js';
import { PACKS } from '../packs/registry.js';

const STOP_WORDS = new Set([
  'a','ad','al','alla','alle','allo','anche','che','chi','come','con','da','dal','dalla','dalle','dallo','dei','del','della','delle','di','e','ed','gli','i','il','in','la','le','lo','ma','nel','nella','nelle','o','per','piu','se','su','tra','un','una','uno',
  'a','an','and','are','as','at','by','for','from','how','in','into','is','of','on','or','the','to','what','when','where','which','with',
  'a','al','algo','como','con','de','del','desde','donde','el','ella','en','entre','es','esta','este','esto','la','las','lo','los','o','para','por','que','se','sin','sobre','su','sus','un','una','unos','unas','y',
]);

const SEMANTIC_CLUSTERS = [
  {
    terms: [
      'infiammazione','infiammatorio','infiammatoria','risposta infiammatoria','dieta antinfiammatoria','gonfiore','rossore','ferita gonfia','infezione ferita',
      'inflammation','inflammatory','inflammatory response','anti inflammatory diet','anti-inflammatory diet','swelling','redness','infected wound',
      'inflamacion','inflamación','inflamatorio','inflamatoria','respuesta inflamatoria','dieta antiinflamatoria','hinchazon','hinchazón','enrojecimiento','herida infectada',
    ],
    targets: {
      'human-body:inflammation': 34,
      'human-body:innate-immunity': 14,
      'human-body:immune': 9,
      'survival:wound-care': 19,
      'survival:first-aid': 8,
      'nutrition:mediterranean-diet': 9,
      'nutrition:omega-3': 8,
      'nutrition:dietary-fiber': 5,
    },
  },
  {
    terms: ['ferita','ferite','taglio','abrasione','lacerazione','medicazione','wound','wounds','cut','abrasion','laceration','dressing','herida','heridas','corte','abrasion','abrasión','laceracion','laceración','cura de heridas','vendaje'],
    targets: {
      'survival:wound-care': 30,
      'survival:first-aid': 12,
      'survival:bleeding': 11,
      'human-body:inflammation': 6,
    },
  },
  {
    terms: ['disidratazione','sete','mancanza acqua','bere in emergenza','dehydration','thirst','lack of water','emergency drinking water','deshidratacion','deshidratación','sed','falta de agua','beber en emergencia'],
    targets: {
      'survival:survival-water': 18,
      'survival:water-disinfection': 12,
      'human-body:kidney': 8,
      'nutrition:water': 10,
    },
  },
  {
    terms: ['acqua contaminata','potabilizzare','purificare acqua','microbi nell acqua','contaminated water','make water safe','water purification','waterborne'],
    targets: {
      'survival:water-disinfection': 30,
      'survival:boiling-water': 14,
      'survival:water-filter': 14,
      'nutrition:foodborne-illness': 8,
    },
  },
  {
    terms: ['probabilita inversa','aggiornare probabilita','dato un risultato qual e la causa','teorema inverso probabilita','inverse probability','update probability','cause given evidence','probabilidad inversa','actualizar probabilidad','causa dada la evidencia','teorema de bayes'],
    targets: {
      'statistics:stat-bayes-formula': 32,
      'statistics:stat-diagnostic-bayes': 18,
      'statistics:stat-bayes': 14,
    },
  },
  {
    terms: ['dispersione','variabilita','quanto sono sparsi','scarto dalla media','spread around mean','dispersion','variability','distance from mean','dispersion','dispersión','variabilidad','distancia respecto a la media'],
    targets: {
      'statistics:stat-variance-definition': 30,
      'statistics:stat-standard-deviation': 22,
      'statistics:stat-variance': 15,
    },
  },
  {
    terms: ['soldi perdono valore','perdita potere acquisto','prezzi salgono','carovita','money loses value','purchasing power falls','prices rise','cost of living rises','dinero pierde valor','perdida de poder adquisitivo','pérdida de poder adquisitivo','suben los precios','coste de vida'],
    targets: {
      'finance:inflation': 34,
      'finance:macro-cycle': 10,
    },
  },
  {
    terms: ['interesse composto','crescita esponenziale capitale','interessi sugli interessi','compound interest','interest on interest','exponential capital growth'],
    targets: {
      'finance:compound-interest': 30,
      'finance:time-value-money': 15,
    },
  },
  {
    terms: ['non mettere tutte le uova','ridurre rischio portafoglio','dividere investimenti','spread investment risk','diversify investments','not all eggs'],
    targets: {
      'finance:diversification': 30,
      'finance:portfolio-theory': 12,
    },
  },
  {
    terms: ['aria trattiene calore','gas trattengono calore','riscaldamento atmosfera','heat trapped by atmosphere','gases trap heat','atmosphere warming','aire retiene calor','gases retienen calor','calentamiento de la atmosfera','calentamiento de la atmósfera'],
    targets: {
      'climate:greenhouse-effect': 34,
      'climate:greenhouse-physics': 13,
      'climate:radiative-forcing': 11,
    },
  },
  {
    terms: ['meteo estremo','ondate di calore','alluvioni siccita','eventi estremi','extreme weather','heat waves','floods drought','climate extremes'],
    targets: {
      'climate:climate-extremes': 28,
      'climate:climate-impacts': 16,
      'survival:weather-briefing': 8,
    },
  },
  {
    terms: ['mi sono perso','perdersi bosco','ritrovare strada','orientarsi senza gps','lost in woods','find my way','navigate without gps','me he perdido','perderse en el bosque','encontrar el camino','orientarse sin gps'],
    targets: {
      'survival:survival-navigation': 24,
      'survival:map-compass': 18,
      'survival:route-planning': 9,
    },
  },
  {
    terms: ['freddo estremo','restare al caldo','ipotermia','riparo emergenza','extreme cold','stay warm','hypothermia','emergency shelter'],
    targets: {
      'survival:survival-shelter': 20,
      'survival:hypothermia': 24,
      'survival:shelter': 16,
    },
  },
  {
    terms: ['mal di pancia dopo mangiato','cibo contaminato','intossicazione alimentare','food poisoning','sick after eating','contaminated food','dolor de barriga despues de comer','alimento contaminado','intoxicacion alimentaria','intoxicación alimentaria'],
    targets: {
      'nutrition:foodborne-illness': 30,
      'nutrition:food-safety': 16,
      'survival:survival-food-hygiene': 10,
    },
  },
  {
    terms: ['salute intestinale','flora intestinale','batteri intestinali','gut health','gut flora','intestinal bacteria','salud intestinal','flora intestinal','bacterias intestinales','microbiota intestinal'],
    targets: {
      'nutrition:gut-microbiome': 24,
      'nutrition:dietary-fiber': 12,
    },
  },
  {
    terms: ['zucchero nel sangue','picco glicemico','glicemia','blood sugar','glucose spike','glycemia','azucar en sangre','azúcar en sangre','pico glucemico','pico glucémico','glucemia'],
    targets: {
      'nutrition:glycemic-index': 24,
      'nutrition:glycemic-load': 18,
      'human-body:insulin': 11,
      'human-body:glucagon': 9,
    },
  },
  {
    terms: ['corrente non arriva','presa non funziona','salta corrente','electric outlet not working','power outage circuit','breaker trips'],
    targets: {
      'home:circuits-wiring': 18,
      'home:circuit-breaker': 24,
      'home:electrical-diagnostics': 12,
    },
  },
  {
    terms: ['perdita acqua','tubo perde','rubinetto perde','water leak','leaking pipe','leaking faucet'],
    targets: {
      'home:leak-detection': 28,
      'home:plumbing-water': 14,
      'home:faucet': 9,
    },
  },
  {
    terms: ['fiato corto','manca il respiro','respirare','shortness of breath','cannot breathe','breathing difficulty'],
    targets: {
      'human-body:respiratory': 20,
      'human-body:lung': 14,
      'survival:airway-management': 11,
      'survival:breathing': 10,
    },
  },
  {
    terms: ['difese organismo','difese immunitarie','combattere infezioni','body defenses','immune defenses','fight infection'],
    targets: {
      'human-body:immune': 24,
      'human-body:innate-immunity': 15,
      'human-body:adaptive-immunity': 15,
    },
  },
];

let INDEX = buildIndex();

export function rebuildSearchIndex() {
  INDEX = buildIndex();
  return INDEX;
}

export function semanticSearch(query, { currentPackId = '', language = 'it', limit = 12 } = {}) {
  const normalizedQuery = normalize(query);
  if (normalizedQuery.length < 2) return [];

  const queryTokens = tokens(normalizedQuery);
  const semanticBoosts = semanticBoostMap(normalizedQuery, queryTokens);
  const scored = [];

  for (const doc of INDEX) {
    let score = lexicalScore(doc, normalizedQuery, queryTokens);
    const semanticBoost = semanticBoosts.get(doc.key) ?? 0;
    score += semanticBoost;

    const coverage = queryCoverage(doc, queryTokens);
    if (!semanticBoost && queryTokens.length > 1 && coverage < Math.min(2, queryTokens.length)) continue;
    if (doc.packId === currentPackId) score *= 1.06;
    if (score < 2.5) continue;

    scored.push({
      ...doc,
      score,
      semantic: semanticBoost > 0,
      title: doc.title[language] || doc.title.en,
      packTitle: doc.packTitle[language] || doc.packTitle.en,
      path: doc.path[language] || doc.path.en,
    });
  }

  return scored
    .sort((a, b) => b.score - a.score || rolePriority(a.node.role) - rolePriority(b.node.role) || a.title.localeCompare(b.title))
    .slice(0, limit);
}

export function packSiteUrl(packId, { nodeId = '', language = 'it' } = {}) {
  const base = `https://codex-${packId}.up.railway.app/`;
  const params = new URLSearchParams();
  if (language) params.set('lang', language);
  if (nodeId) params.set('node', nodeId);
  const suffix = params.toString();
  return suffix ? `${base}?${suffix}` : base;
}

function buildIndex() {
  const docs = [];
  for (const [packId, pack] of Object.entries(PACKS)) {
    const nodes = flattenPack(pack);
    const byId = new Map(nodes.map((node) => [node.id, node]));

    for (const node of nodes) {
      const parent = node.parentId ? byId.get(node.parentId) : null;
      const domain = node.domainId ? byId.get(node.domainId) : null;
      const aliases = localizedList(node.aliases);
      const searchTerms = localizedList(node.searchTerms);
      const tags = Array.isArray(node.tags) ? node.tags : [];

      const titleText = localizedText(node.title);
      const descriptionText = localizedText(node.description);
      const contextText = [
        localizedText(parent?.title),
        localizedText(parent?.description),
        localizedText(domain?.title),
        localizedText(domain?.description),
        localizedText(pack.title),
        localizedText(pack.subtitle),
      ].filter(Boolean).join(' ');
      const wikiText = localizedText(node.wiki);
      const extraText = [...aliases, ...searchTerms, ...tags].join(' ');
      const allText = [titleText, descriptionText, contextText, wikiText, extraText].filter(Boolean).join(' ');

      const path = {
        en: [domain?.title?.en, parent?.role === 'system' ? parent.title.en : null].filter(Boolean).join(' › '),
        it: [domain?.title?.it, parent?.role === 'system' ? parent.title.it : null].filter(Boolean).join(' › '),
        es: [domain?.title?.es, parent?.role === 'system' ? parent.title.es : null].filter(Boolean).join(' › '),
      };

      docs.push({
        key: `${packId}:${node.id}`,
        packId,
        packTitle: pack.title,
        node,
        title: node.title,
        path,
        normalizedTitle: normalize(titleText),
        normalizedDescription: normalize(descriptionText),
        normalizedContext: normalize(contextText),
        normalizedExtra: normalize(extraText),
        normalizedAll: normalize(allText),
        titleTokens: tokens(titleText),
        extraTokens: tokens(extraText),
        allTokens: tokens(allText),
      });
    }
  }
  return docs;
}

function lexicalScore(doc, phrase, queryTokens) {
  let score = 0;
  if (doc.normalizedTitle === phrase) score += 46;
  else if (doc.normalizedTitle.includes(phrase)) score += 30;
  if (doc.normalizedExtra.includes(phrase)) score += 22;
  if (doc.normalizedDescription.includes(phrase)) score += 12;
  if (doc.normalizedContext.includes(phrase)) score += 7;

  for (const queryToken of queryTokens) {
    score += bestTokenScore(queryToken, doc.titleTokens, 9);
    score += bestTokenScore(queryToken, doc.extraTokens, 7);
    score += bestTokenScore(queryToken, doc.allTokens, 2.4);
  }

  if (queryTokens.length > 1) {
    const matched = queryTokens.filter((token) => doc.allTokens.some((candidate) => tokenSimilarity(token, candidate) >= 0.72)).length;
    if (matched === queryTokens.length) score += 7;
    else score += matched * 0.7;
  }
  return score;
}


function queryCoverage(doc, queryTokens) {
  return queryTokens.filter((token) => doc.allTokens.some((candidate) => tokenSimilarity(token, candidate) >= 0.72)).length;
}

function bestTokenScore(queryToken, candidates, weight) {
  let best = 0;
  for (const candidate of candidates) {
    const similarity = tokenSimilarity(queryToken, candidate);
    if (similarity > best) best = similarity;
    if (best === 1) break;
  }
  if (best < 0.58) return 0;
  return best * weight;
}

function tokenSimilarity(a, b) {
  if (a === b) return 1;
  if (a.length >= 4 && b.length >= 4 && (a.startsWith(b) || b.startsWith(a))) return 0.9;
  return dice(a, b);
}

function semanticBoostMap(normalizedQuery, queryTokens) {
  const boosts = new Map();
  for (const cluster of SEMANTIC_CLUSTERS) {
    const triggered = cluster.terms.some((term) => {
      const normalizedTerm = normalize(term);
      if (normalizedQuery.includes(normalizedTerm)) return true;
      const termTokens = tokens(normalizedTerm);
      if (termTokens.length !== 1) return false;
      return queryTokens.some((queryToken) => tokenSimilarity(queryToken, termTokens[0]) >= 0.84);
    });
    if (!triggered) continue;

    for (const [key, boost] of Object.entries(cluster.targets)) {
      boosts.set(key, Math.max(boosts.get(key) ?? 0, boost));
    }
  }
  return boosts;
}

function localizedText(value) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return [value.en, value.it, value.es].filter(Boolean).join(' ');
}

function localizedList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') return [value];
  return [...(value.en || []), ...(value.it || []), ...(value.es || [])];
}

function tokens(value) {
  return normalize(value)
    .split(' ')
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}

function normalize(value) {
  return String(value || '')
    .toLocaleLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function dice(a, b) {
  if (a === b) return 1;
  if (a.length < 2 || b.length < 2) return 0;
  const pairs = new Map();
  for (let i = 0; i < a.length - 1; i += 1) {
    const pair = a.slice(i, i + 2);
    pairs.set(pair, (pairs.get(pair) || 0) + 1);
  }
  let overlap = 0;
  for (let i = 0; i < b.length - 1; i += 1) {
    const pair = b.slice(i, i + 2);
    const count = pairs.get(pair) || 0;
    if (!count) continue;
    overlap += 1;
    pairs.set(pair, count - 1);
  }
  return (2 * overlap) / ((a.length - 1) + (b.length - 1));
}

function rolePriority(role) {
  return role === 'concept' ? 0 : role === 'system' ? 1 : 2;
}
