import type { Language } from '../content/types';

interface QueryPage {
  pageid?: number;
  title?: string;
  extract?: string;
  missing?: boolean;
}

interface WikipediaQueryResponse {
  query?: {
    pages?: Record<string, QueryPage>;
  };
}

const extractCache = new Map<string, string | null>();

export async function fetchWikipediaIntro(wikipediaUrl: string, language: Language): Promise<string | null> {
  const title = titleFromWikipediaUrl(wikipediaUrl);
  if (!title) return null;

  const cacheKey = `${language}:${title}`;
  if (extractCache.has(cacheKey)) return extractCache.get(cacheKey) ?? null;

  const api = new URL(`https://${language}.wikipedia.org/w/api.php`);
  api.searchParams.set('action', 'query');
  api.searchParams.set('prop', 'extracts');
  api.searchParams.set('exintro', '1');
  api.searchParams.set('explaintext', '1');
  api.searchParams.set('exsentences', '3');
  api.searchParams.set('redirects', '1');
  api.searchParams.set('titles', title);
  api.searchParams.set('format', 'json');
  api.searchParams.set('formatversion', '2');
  api.searchParams.set('origin', '*');

  try {
    const response = await fetch(api, {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) throw new Error(`Wikipedia request failed with ${response.status}`);

    const data = await response.json() as WikipediaQueryResponse;
    const page = data.query?.pages ? Object.values(data.query.pages)[0] : undefined;
    const extract = page && !page.missing ? page.extract?.trim() : undefined;
    const result = extract || null;
    extractCache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.warn('Could not load Wikipedia intro', error);
    return null;
  }
}

function titleFromWikipediaUrl(wikipediaUrl: string): string | null {
  try {
    const url = new URL(wikipediaUrl);
    const marker = '/wiki/';
    const index = url.pathname.indexOf(marker);
    if (index < 0) return null;
    return decodeURIComponent(url.pathname.slice(index + marker.length)).replace(/_/g, ' ');
  } catch {
    return null;
  }
}
