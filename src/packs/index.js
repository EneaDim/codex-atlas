import { humanBody } from './human-body.js';
import { finance } from './finance.js';
import { home } from './home.js';
import { DEFAULT_PACK_ID } from './manifest.js';

export const PACKS = Object.freeze({
  'human-body': humanBody,
  finance,
  home,
});

export function getPack(id = DEFAULT_PACK_ID) {
  return PACKS[id] ?? PACKS[DEFAULT_PACK_ID];
}
