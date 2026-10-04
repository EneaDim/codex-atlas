import type { CodexPack, NodeRole } from '../content/types';

export interface Segment {
  id: string;
  role: NodeRole;
  domainId: string;
  startAngle: number;
  endAngle: number;
  innerRadius: number;
  outerRadius: number;
}

export interface RadialLabelLayout {
  x: number;
  y: number;
  rotate: number;
  textAnchor: 'start' | 'end' | 'middle';
}

export interface OuterLabelLayout {
  x: number;
  y: number;
  textAnchor: 'start' | 'middle' | 'end';
  dotX: number;
  dotY: number;
  titleDy: number;
  copyDy: number;
}

const TAU = Math.PI * 2;
const START_ANGLE = -Math.PI / 2;

// Cognitive-Bias-like geometry:
// center image -> macro bundle trunks -> secondary branches -> concept leaves.
const CENTER_RADIUS = 194;
const DOMAIN_RADIUS = 316;
const SYSTEM_RADIUS = 498;
const CONCEPT_RADIUS = 678;
const RADII: Record<NodeRole, [number, number]> = {
  domain: [CENTER_RADIUS, DOMAIN_RADIUS],
  system: [DOMAIN_RADIUS, SYSTEM_RADIUS],
  concept: [SYSTEM_RADIUS, CONCEPT_RADIUS],
};

export const OUTER_GUIDE_RADIUS = 796;
const CALLOUT_OFFSET = 96;

export function buildSegments(pack: CodexPack): Segment[] {
  const totalLeaves = pack.domains.reduce(
    (total, domain) => total + domain.systems.reduce((sum, system) => sum + system.concepts.length, 0),
    0,
  );

  let cursor = START_ANGLE;
  const result: Segment[] = [];

  for (const domain of pack.domains) {
    const domainLeaves = domain.systems.reduce((sum, system) => sum + system.concepts.length, 0);
    const domainSpan = (domainLeaves / totalLeaves) * TAU;
    const domainStart = cursor;
    const domainEnd = cursor + domainSpan;

    result.push(makeSegment(domain.id, 'domain', domain.id, domainStart, domainEnd));

    let systemCursor = domainStart;
    for (const system of domain.systems) {
      const systemSpan = (system.concepts.length / domainLeaves) * domainSpan;
      const systemStart = systemCursor;
      const systemEnd = systemCursor + systemSpan;

      result.push(makeSegment(system.id, 'system', domain.id, systemStart, systemEnd));

      const conceptSpan = systemSpan / system.concepts.length;
      system.concepts.forEach((concept, index) => {
        const conceptStart = systemStart + conceptSpan * index;
        result.push(makeSegment(concept.id, 'concept', domain.id, conceptStart, conceptStart + conceptSpan));
      });

      systemCursor = systemEnd;
    }

    cursor = domainEnd;
  }

  return result;
}

function makeSegment(
  id: string,
  role: NodeRole,
  domainId: string,
  startAngle: number,
  endAngle: number,
): Segment {
  const [innerRadius, outerRadius] = RADII[role];
  return { id, role, domainId, startAngle, endAngle, innerRadius, outerRadius };
}

export function midAngle(segment: Segment): number {
  return (segment.startAngle + segment.endAngle) / 2;
}

export function point(radius: number, angle: number): [number, number] {
  return [radius * Math.cos(angle), radius * Math.sin(angle)];
}

/** Main bundled trunk from the center area to each domain cluster. */
export function centerBranchPath(segment: Segment): string {
  const angle = midAngle(segment);
  const startRadius = CENTER_RADIUS;
  const endRadius = DOMAIN_RADIUS;
  const [x0, y0] = point(startRadius, angle);
  const [x3, y3] = point(endRadius, angle);
  const [x1, y1] = point(startRadius + (endRadius - startRadius) * 0.52, angle - 0.015);
  const [x2, y2] = point(endRadius - (endRadius - startRadius) * 0.20, angle + 0.01);
  return `M ${x0} ${y0} C ${x1} ${y1} ${x2} ${y2} ${x3} ${y3}`;
}

/** Curved branch from a parent group toward a more specific child node. */
export function branchPath(parent: Segment, child: Segment): string {
  const startAngle = midAngle(parent);
  const endAngle = midAngle(child);
  const startRadius = parent.outerRadius;
  const endRadius = child.outerRadius;

  const [x0, y0] = point(startRadius, startAngle);
  const [x3, y3] = point(endRadius, endAngle);
  const radialSpan = endRadius - startRadius;
  const [x1, y1] = point(startRadius + radialSpan * 0.34, startAngle);
  const [x2, y2] = point(endRadius - radialSpan * 0.26, endAngle);

  return `M ${x0} ${y0} C ${x1} ${y1} ${x2} ${y2} ${x3} ${y3}`;
}

export function nodePoint(segment: Segment): [number, number] {
  return point(segment.outerRadius, midAngle(segment));
}

/** Concept labels sit just beyond the outer concept leaves. */
export function conceptLabelLayout(segment: Segment): RadialLabelLayout {
  const angle = midAngle(segment);
  const degrees = (angle * 180) / Math.PI;
  const onLeft = Math.cos(angle) < 0;
  const [x, y] = point(segment.outerRadius + 10, angle);

  return {
    x,
    y,
    rotate: onLeft ? degrees + 180 : degrees,
    textAnchor: onLeft ? 'end' : 'start',
  };
}

/** Optional system label layout retained for future use. */
export function systemLabelLayout(segment: Segment): RadialLabelLayout {
  const angle = midAngle(segment);
  const degrees = (angle * 180) / Math.PI;
  const onLeft = Math.cos(angle) < 0;
  const [x, y] = point(segment.outerRadius + 10, angle);

  return {
    x,
    y,
    rotate: onLeft ? degrees + 180 : degrees,
    textAnchor: onLeft ? 'end' : 'start',
  };
}

/** Detached horizontal macro copy around the outer guide circle. */
export function outerLabelLayout(segment: Segment): OuterLabelLayout {
  const angle = midAngle(segment);
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const [dotX, dotY] = point(OUTER_GUIDE_RADIUS, angle);

  if (Math.abs(cos) >= 0.42) {
    const side = cos > 0 ? 1 : -1;
    return {
      x: side * (OUTER_GUIDE_RADIUS + CALLOUT_OFFSET),
      y: dotY,
      textAnchor: side > 0 ? 'start' : 'end',
      dotX,
      dotY,
      titleDy: -8,
      copyDy: 12,
    };
  }

  const vertical = sin >= 0 ? 1 : -1;
  return {
    x: dotX,
    y: vertical * (OUTER_GUIDE_RADIUS + CALLOUT_OFFSET),
    textAnchor: 'middle',
    dotX,
    dotY,
    titleDy: vertical > 0 ? 0 : -14,
    copyDy: vertical > 0 ? 19 : 5,
  };
}

export function segmentCentroid(segment: Segment): [number, number] {
  return nodePoint(segment);
}
