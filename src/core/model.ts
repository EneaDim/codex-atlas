import type { CodexPack, FlatNode, Language } from '../content/types';

export function flattenPack(pack: CodexPack): FlatNode[] {
  const nodes: FlatNode[] = [];

  for (const domain of pack.domains) {
    nodes.push({
      id: domain.id,
      role: 'domain',
      title: domain.title,
      description: domain.description,
      wikipedia: domain.wikipedia,
      domainId: domain.id,
      prerequisites: [],
    });

    for (const system of domain.systems) {
      nodes.push({
        id: system.id,
        role: 'system',
        title: system.title,
        description: system.description,
        wikipedia: system.wikipedia,
        parentId: domain.id,
        domainId: domain.id,
        prerequisites: [],
      });

      for (const concept of system.concepts) {
        nodes.push({
          id: concept.id,
          role: 'concept',
          title: concept.title,
          description: concept.description,
          wikipedia: concept.wikipedia,
          parentId: system.id,
          domainId: domain.id,
          prerequisites: concept.prerequisites ?? [],
          learnOrder: concept.learnOrder,
        });
      }
    }
  }

  return nodes;
}

export function getNodePath(nodes: FlatNode[], nodeId: string): FlatNode[] {
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const path: FlatNode[] = [];
  let current = byId.get(nodeId);

  while (current) {
    path.unshift(current);
    current = current.parentId ? byId.get(current.parentId) : undefined;
  }

  return path;
}

export function searchableText(node: FlatNode): string {
  return [node.title.en, node.title.it, node.description.en, node.description.it]
    .join(' ')
    .toLocaleLowerCase();
}

export function roleLabel(role: FlatNode['role'], language: Language): string {
  const labels = {
    domain: { en: 'Macro area', it: 'Macro area' },
    system: { en: 'System', it: 'Sistema' },
    concept: { en: 'Concept', it: 'Concetto' },
  };
  return labels[role][language];
}
