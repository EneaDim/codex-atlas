import { finance } from './finance.js';
import { home } from './home.js';
import { humanBody } from './human-body.js';
import { statistics } from './statistics.js';
import { climate } from './climate.js';
import { survival } from './survival.js';
import { nutrition } from './nutrition.js';

export const DEFAULT_PACK_ID = 'human-body';

export const PACKS = Object.freeze({
  'human-body': humanBody,
  finance,
  home,
  statistics,
  climate,
  survival,
  nutrition,
});

export const PACK_IDS = Object.freeze(Object.keys(PACKS));

export function isPackId(value) {
  return Object.hasOwn(PACKS, value);
}

export function getPack(id = DEFAULT_PACK_ID) {
  return PACKS[id] ?? PACKS[DEFAULT_PACK_ID];
}
