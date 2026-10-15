const wikiCache = new Map();
const langlinkCache = new Map();

async function fetchJson(url) {
  const response = await fetch(url, { headers: { accept: 'application/json' } });
  if (!response.ok) throw new Error(`Wikipedia request failed (${response.status})`);
  return response.json();
}

async function fetchWikipediaIntro(title, lang, sentences = 3) {
  if (!title) return null;
  const key = `${lang}:${sentences}:${title}`;
  if (wikiCache.has(key)) return wikiCache.get(key);
  const url = `https://${lang}.wikipedia.org/w/api.php?action=query&format=json&origin=*&redirects=1&prop=extracts&exintro=1&explaintext=1&exsentences=${sentences}&titles=${encodeURIComponent(title)}`;
  try {
    const data = await fetchJson(url);
    const page = Object.values(data.query?.pages ?? {})[0];
    const extract = page && !page.missing ? page.extract?.trim() : '';
    const value = extract ? { extract, title: page.title || title } : null;
    wikiCache.set(key, value);
    return value;
  } catch {
    wikiCache.set(key, null);
    return null;
  }
}

function chunk(values, size) {
  const result = [];
  for (let i = 0; i < values.length; i += size) result.push(values.slice(i, i + size));
  return result;
}

function followTitle(title, mappings) {
  let current = title;
  const seen = new Set();
  while (mappings.has(current) && !seen.has(current)) {
    seen.add(current);
    current = mappings.get(current);
  }
  return current;
}

/**
 * Resolve English Wikipedia page titles to a requested language using MediaWiki langlinks.
 * The function batches requests and caches successful and missing resolutions.
 */
export async function resolveWikipediaTitles(englishTitles, lang) {
  const titles = [...new Set((englishTitles || []).filter(Boolean))];
  const output = new Map();
  if (!titles.length) return output;
  if (lang === 'en') {
    titles.forEach((title) => output.set(title, title));
    return output;
  }

  const missing = [];
  for (const title of titles) {
    const key = `${lang}:${title}`;
    if (langlinkCache.has(key)) output.set(title, langlinkCache.get(key));
    else missing.push(title);
  }

  for (const group of chunk(missing, 35)) {
    const params = new URLSearchParams({
      action: 'query',
      format: 'json',
      origin: '*',
      redirects: '1',
      prop: 'langlinks',
      lllang: lang,
      lllimit: 'max',
      titles: group.join('|'),
    });
    try {
      const data = await fetch(`https://en.wikipedia.org/w/api.php?${params.toString()}`, {
        headers: { accept: 'application/json' },
      }).then((response) => {
        if (!response.ok) throw new Error('Wikipedia langlinks request failed');
        return response.json();
      });

      const remap = new Map();
      for (const item of data.query?.normalized ?? []) remap.set(item.from, item.to);
      for (const item of data.query?.redirects ?? []) remap.set(item.from, item.to);
      const pageTargets = new Map();
      for (const page of Object.values(data.query?.pages ?? {})) {
        const localized = page.langlinks?.[0]?.['*'] || page.langlinks?.[0]?.title || null;
        pageTargets.set(page.title, localized);
      }

      for (const original of group) {
        const canonical = followTitle(original, remap);
        const localized = pageTargets.get(canonical) ?? null;
        langlinkCache.set(`${lang}:${original}`, localized);
        output.set(original, localized);
      }
    } catch {
      for (const original of group) {
        langlinkCache.set(`${lang}:${original}`, null);
        output.set(original, null);
      }
    }
  }
  return output;
}

export async function resolveWikipediaTitle(englishTitle, lang) {
  if (!englishTitle) return null;
  const result = await resolveWikipediaTitles([englishTitle], lang);
  return result.get(englishTitle) ?? null;
}

/**
 * Populate exact localized Wikipedia titles for one active content pack.
 * This is mainly used for Spanish map labels. It needs only a few batched requests per pack.
 */
export async function hydrateWikipediaTitlesForPack(pack, lang) {
  if (!pack || lang === 'en') return pack;
  const concepts = [];
  for (const domain of pack.domains || []) {
    for (const system of domain.systems || []) {
      for (const concept of system.concepts || []) {
        if (concept.wiki?.en) concepts.push(concept);
      }
    }
  }
  const resolved = await resolveWikipediaTitles(concepts.map((concept) => concept.wiki.en), lang);
  for (const concept of concepts) {
    const localizedTitle = resolved.get(concept.wiki.en);
    if (!localizedTitle) continue;
    concept.wiki[lang] = localizedTitle;
    if (lang === 'es' && concept.title) concept.title.es = localizedTitle;
  }
  return pack;
}

export async function fetchWikipediaIntroForNode(node, lang, sentences = 3) {
  const requestedLang = lang || 'en';
  const primaryTitle = node.wiki?.[requestedLang];
  const primary = await fetchWikipediaIntro(primaryTitle, requestedLang, sentences);
  if (primary) {
    return {
      extract: primary.extract,
      lang: requestedLang,
      requestedLang,
      fallback: false,
      title: primary.title || primaryTitle,
      url: wikipediaUrlFrom(primary.title || primaryTitle, requestedLang),
    };
  }

  // A saved Italian/Spanish title can be stale or simply not match the local page title.
  // Resolve the canonical page through the English article's language links before falling back.
  if (requestedLang !== 'en' && node.wiki?.en) {
    const resolvedTitle = await resolveWikipediaTitle(node.wiki.en, requestedLang);
    if (resolvedTitle && resolvedTitle !== primaryTitle) {
      const resolved = await fetchWikipediaIntro(resolvedTitle, requestedLang, sentences);
      if (resolved) {
        node.wiki[requestedLang] = resolved.title || resolvedTitle;
        if (node.title && requestedLang === 'es') node.title.es = resolved.title || resolvedTitle;
        return {
          extract: resolved.extract,
          lang: requestedLang,
          requestedLang,
          fallback: false,
          title: resolved.title || resolvedTitle,
          url: wikipediaUrlFrom(resolved.title || resolvedTitle, requestedLang),
          resolvedFromLanglink: true,
        };
      }
    }
  }

  if (requestedLang !== 'en' && node.wiki?.en) {
    const fallback = await fetchWikipediaIntro(node.wiki.en, 'en', sentences);
    if (fallback) {
      return {
        extract: fallback.extract,
        lang: 'en',
        requestedLang,
        fallback: true,
        title: fallback.title || node.wiki.en,
        url: wikipediaUrlFrom(fallback.title || node.wiki.en, 'en'),
      };
    }
  }
  return null;
}

function wikipediaUrlFrom(title, lang) {
  if (!title) return '';
  return `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(title.replaceAll(' ', '_'))}`;
}

export function wikipediaUrl(node, lang) {
  const title = node.wiki?.[lang] || (lang !== 'en' ? node.wiki?.en : null);
  const actualLang = node.wiki?.[lang] ? lang : 'en';
  return wikipediaUrlFrom(title, actualLang);
}
