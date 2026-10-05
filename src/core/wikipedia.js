const wikiCache = new Map();

async function fetchWikipediaIntro(title, lang, sentences = 3) {
  if (!title) return null;
  const key = `${lang}:${sentences}:${title}`;
  if (wikiCache.has(key)) return wikiCache.get(key);
  const url = `https://${lang}.wikipedia.org/w/api.php?action=query&format=json&origin=*&redirects=1&prop=extracts&exintro=1&explaintext=1&exsentences=${sentences}&titles=${encodeURIComponent(title)}`;
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

export async function fetchWikipediaIntroForNode(node, lang, sentences = 3) {
  const primaryTitle = node.wiki?.[lang];
  const primary = await fetchWikipediaIntro(primaryTitle, lang, sentences);
  if (primary) return { extract: primary, lang, title: primaryTitle, url: wikipediaUrlFrom(primaryTitle, lang) };
  if (lang !== 'en' && node.wiki?.en) {
    const fallback = await fetchWikipediaIntro(node.wiki.en, 'en', sentences);
    if (fallback) return { extract: fallback, lang: 'en', title: node.wiki.en, url: wikipediaUrlFrom(node.wiki.en, 'en') };
  }
  return null;
}

function wikipediaUrlFrom(title, lang) {
  if (!title) return '';
  return `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(title.replaceAll(' ', '_'))}`;
}

export function wikipediaUrl(node, lang) {
  return wikipediaUrlFrom(node.wiki?.[lang], lang);
}

