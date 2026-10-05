import { TAU } from './constants.js';

function mergeResources(...groups) {
  const seen = new Set();
  return groups.flatMap((group) => Array.isArray(group) ? group : []).filter((resource) => {
    if (!resource?.url || seen.has(resource.url)) return false;
    seen.add(resource.url);
    return true;
  });
}


export function assertUniqueIds(nodes) {
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

export function flattenPack(source) {
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
          risk: concept.risk ?? system.risk ?? domain.risk,
          difficulty: concept.difficulty ?? system.difficulty ?? domain.difficulty,
          resources: mergeResources(domain.resources, system.resources, concept.resources),
          description: concept.description || (source.id === 'home' ? {
            en: `${concept.title.en}: understand its role, common warning signs and the safe boundary between routine DIY and professional work within ${system.title.en.toLowerCase()}.`,
            it: `${concept.title.it}: capisci a cosa serve, quali segnali osservare e dove finisce il fai da te sicuro nell’ambito di ${system.title.it.toLowerCase()}.`,
          } : {
            en: `${concept.title.en} is a key concept within ${system.title.en.toLowerCase()}.`,
            it: `${concept.title.it} è un concetto chiave nell’ambito di ${system.title.it.toLowerCase()}.`,
          }),
        });
      });
    });
  });
  return result;
}

export function buildLayout(source) {
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
export function polar(radius, angle) {
  return [radius * Math.cos(angle), radius * Math.sin(angle)];
}
