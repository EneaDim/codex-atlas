export const DEFAULT_PACK_ID = 'human-body';

export const PACK_IDS = Object.freeze([
  'human-body',
  'finance',
  'home',
]);

export function isPackId(value) {
  return PACK_IDS.includes(value);
}
