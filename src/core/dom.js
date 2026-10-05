import { SVG_NS } from './constants.js';

export function svgEl(tag, attrs = {}) {
  const element = document.createElementNS(SVG_NS, tag);
  for (const [key, value] of Object.entries(attrs)) element.setAttribute(key, String(value));
  return element;
}

export function must(id) {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Missing #${id}`);
  return element;
}

export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#039;',
    '"': '&quot;',
  }[char]));
}
