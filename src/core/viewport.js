import { RADII } from './constants.js';
import { polar } from './layout.js';

export function createViewportController(svgElement, viewportElement, onScale) {
  let scale = 1;
  let x = 0;
  let y = 0;
  const minScale = 0.58;
  const maxScale = 4.2;

  const pointers = new Map();
  let panGesture = null;
  let pinchGesture = null;
  let movedDuringGesture = false;
  let suppressClickUntil = 0;

  const clampScale = (value) => Math.max(minScale, Math.min(maxScale, value));

  const clientToSvg = (clientX, clientY) => {
    const point = svgElement.createSVGPoint();
    point.x = clientX;
    point.y = clientY;
    const matrix = svgElement.getScreenCTM();
    if (!matrix) return { x: 0, y: 0 };
    const transformed = point.matrixTransform(matrix.inverse());
    return { x: transformed.x, y: transformed.y };
  };

  const apply = () => {
    viewportElement.setAttribute('transform', `translate(${x} ${y}) scale(${scale})`);
    onScale(scale);
  };

  const beginPan = (pointer) => {
    const point = clientToSvg(pointer.clientX, pointer.clientY);
    panGesture = {
      pointerId: pointer.pointerId,
      startClientX: pointer.clientX,
      startClientY: pointer.clientY,
      startSvgX: point.x,
      startSvgY: point.y,
      startX: x,
      startY: y,
    };
    pinchGesture = null;
  };

  const beginPinch = () => {
    const active = [...pointers.values()].slice(0, 2);
    if (active.length < 2) return;
    const [a, b] = active;
    const midpointClientX = (a.clientX + b.clientX) / 2;
    const midpointClientY = (a.clientY + b.clientY) / 2;
    const midpointSvg = clientToSvg(midpointClientX, midpointClientY);
    const distance = Math.max(1, Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY));

    pinchGesture = {
      startDistance: distance,
      startScale: scale,
      anchorWorldX: (midpointSvg.x - x) / scale,
      anchorWorldY: (midpointSvg.y - y) / scale,
    };
    panGesture = null;
    movedDuringGesture = true;
  };

  svgElement.addEventListener('wheel', (event) => {
    event.preventDefault();
    const svgPoint = clientToSvg(event.clientX, event.clientY);
    const anchorWorldX = (svgPoint.x - x) / scale;
    const anchorWorldY = (svgPoint.y - y) / scale;
    const normalizedDelta = Math.max(-180, Math.min(180, event.deltaY));
    const factor = Math.exp(-normalizedDelta * 0.00135);
    const nextScale = clampScale(scale * factor);

    x = svgPoint.x - anchorWorldX * nextScale;
    y = svgPoint.y - anchorWorldY * nextScale;
    scale = nextScale;
    apply();
  }, { passive: false });

  svgElement.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    pointers.set(event.pointerId, {
      pointerId: event.pointerId,
      clientX: event.clientX,
      clientY: event.clientY,
      pointerType: event.pointerType,
    });

    if (pointers.size === 1) {
      movedDuringGesture = false;
      beginPan(event);
    } else if (pointers.size === 2) {
      for (const pointerId of pointers.keys()) {
        try { svgElement.setPointerCapture(pointerId); } catch { /* no-op */ }
      }
      beginPinch();
    }
  });

  svgElement.addEventListener('pointermove', (event) => {
    if (!pointers.has(event.pointerId)) return;

    pointers.set(event.pointerId, {
      pointerId: event.pointerId,
      clientX: event.clientX,
      clientY: event.clientY,
      pointerType: event.pointerType,
    });

    if (pointers.size >= 2 && pinchGesture) {
      event.preventDefault();
      const [a, b] = [...pointers.values()].slice(0, 2);
      const distance = Math.max(1, Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY));
      const midpointClientX = (a.clientX + b.clientX) / 2;
      const midpointClientY = (a.clientY + b.clientY) / 2;
      const midpointSvg = clientToSvg(midpointClientX, midpointClientY);
      const nextScale = clampScale(pinchGesture.startScale * (distance / pinchGesture.startDistance));

      scale = nextScale;
      x = midpointSvg.x - pinchGesture.anchorWorldX * scale;
      y = midpointSvg.y - pinchGesture.anchorWorldY * scale;
      movedDuringGesture = true;
      apply();
      return;
    }

    if (pointers.size === 1 && panGesture && panGesture.pointerId === event.pointerId) {
      const pixelDistance = Math.hypot(
        event.clientX - panGesture.startClientX,
        event.clientY - panGesture.startClientY,
      );
      if (!movedDuringGesture && pixelDistance <= 5) return;

      if (!movedDuringGesture) {
        movedDuringGesture = true;
        try { svgElement.setPointerCapture(event.pointerId); } catch { /* no-op */ }
      }

      event.preventDefault();
      const current = clientToSvg(event.clientX, event.clientY);
      x = panGesture.startX + (current.x - panGesture.startSvgX);
      y = panGesture.startY + (current.y - panGesture.startSvgY);
      apply();
    }
  }, { passive: false });

  const endPointer = (event) => {
    if (!pointers.has(event.pointerId)) return;

    pointers.delete(event.pointerId);
    try {
      if (svgElement.hasPointerCapture(event.pointerId)) svgElement.releasePointerCapture(event.pointerId);
    } catch { /* no-op */ }

    if (movedDuringGesture) suppressClickUntil = performance.now() + 420;

    if (pointers.size >= 2) {
      beginPinch();
      return;
    }

    pinchGesture = null;
    if (pointers.size === 1) {
      const remaining = [...pointers.values()][0];
      beginPan(remaining);
      movedDuringGesture = true;
    } else {
      panGesture = null;
      window.setTimeout(() => { movedDuringGesture = false; }, 0);
    }
  };

  svgElement.addEventListener('pointerup', endPointer);
  svgElement.addEventListener('pointercancel', endPointer);
  svgElement.addEventListener('lostpointercapture', (event) => {
    if (pointers.has(event.pointerId) && event.pointerType !== 'mouse') endPointer(event);
  });

  // A pinch or drag should never be interpreted as a node tap afterwards.
  svgElement.addEventListener('click', (event) => {
    if (performance.now() < suppressClickUntil) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);

  apply();
  return {
    reset() {
      scale = 1;
      x = 0;
      y = 0;
      pointers.clear();
      panGesture = null;
      pinchGesture = null;
      apply();
    },
    focus(radius, angle) {
      const [px, py] = polar(radius, angle);
      const targetScale = radius >= RADII.concept ? 1.45 : 1.25;
      // Automatic focus may zoom in, but it must never zoom the user out.
      scale = Math.max(scale, targetScale);
      x = -px * scale * 0.18;
      y = -py * scale * 0.18;
      apply();
    },
  };
}
