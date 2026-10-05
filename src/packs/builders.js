export function concept(id, en, it, wikiEn = en, wikiIt = it, extra = {}) {
  return {
    id,
    title: { en, it },
    wiki: { en: wikiEn, it: wikiIt },
    ...extra,
  };
}

export function system(id, en, it, descEn, descIt, concepts, extra = {}) {
  return {
    id,
    title: { en, it },
    description: { en: descEn, it: descIt },
    ...extra,
    concepts,
  };
}

export function domain(id, en, it, descEn, descIt, color, systems, extra = {}) {
  return {
    id,
    title: { en, it },
    description: { en: descEn, it: descIt },
    color,
    ...extra,
    systems,
  };
}
