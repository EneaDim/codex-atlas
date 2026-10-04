export type Language = 'en' | 'it';

export interface LocalizedText {
  en: string;
  it: string;
}

export interface WikiLinks {
  en: string;
  it: string;
}

export interface Concept {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  wikipedia: WikiLinks;
  prerequisites?: string[];
  learnOrder?: number;
}

export interface SystemGroup {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  wikipedia: WikiLinks;
  concepts: Concept[];
}

export interface Domain {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  wikipedia: WikiLinks;
  systems: SystemGroup[];
}

export interface CodexPack {
  id: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  centerImage: string;
  domains: Domain[];
}

export type NodeRole = 'domain' | 'system' | 'concept';

export interface FlatNode {
  id: string;
  role: NodeRole;
  title: LocalizedText;
  description: LocalizedText;
  wikipedia: WikiLinks;
  parentId?: string;
  domainId: string;
  prerequisites: string[];
  learnOrder?: number;
}
