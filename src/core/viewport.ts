import type { Segment } from './radial';
import { segmentCentroid } from './radial';

const DRAG_THRESHOLD = 6;

export class ViewportController {
  private tx = 0;
  private ty = 0;
  private scale = 1;
  private dragging = false;
  private pointerId: number | null = null;
  private previous = { x: 0, y: 0 };
  private pressStart = { x: 0, y: 0 };
  private pinchStartDistance = 0;
  private pinchStartScale = 1;
  private pointers = new Map<number, { x: number; y: number }>();
  private suppressNextClick = false;

  constructor(
    private svg: SVGSVGElement,
    private viewport: SVGGElement,
    private onZoomChange: (scale: number) => void,
  ) {
    this.bind();
    this.apply();
  }

  reset(): void {
    this.tx = 0;
    this.ty = 0;
    this.scale = 1;
    this.apply();
  }

  focus(segment: Segment): void {
    const [x, y] = segmentCentroid(segment);
    const targetScale = segment.role === 'concept' ? 1.72 : segment.role === 'system' ? 1.38 : 1.04;
    this.scale = targetScale;
    this.tx = -x * targetScale;
    this.ty = -y * targetScale;
    this.apply();
  }

  private bind(): void {
    this.svg.addEventListener('wheel', (event) => {
      event.preventDefault();
      const point = this.toSvg(event.clientX, event.clientY);
      const factor = Math.exp(-event.deltaY * 0.0012);
      this.zoomAt(point.x, point.y, factor);
    }, { passive: false });

    this.svg.addEventListener('pointerdown', (event) => {
      const p = this.toSvg(event.clientX, event.clientY);
      this.pointers.set(event.pointerId, p);

      if (this.pointers.size === 1) {
        this.pointerId = event.pointerId;
        this.previous = p;
        this.pressStart = p;
        this.dragging = false;
      } else if (this.pointers.size === 2) {
        // Pinch gestures are navigation gestures, not clicks.
        this.dragging = true;
        this.suppressNextClick = true;
        const pts = [...this.pointers.values()];
        this.pinchStartDistance = distance(pts[0], pts[1]);
        this.pinchStartScale = this.scale;
      }
    });

    this.svg.addEventListener('pointermove', (event) => {
      if (!this.pointers.has(event.pointerId)) return;
      const p = this.toSvg(event.clientX, event.clientY);
      this.pointers.set(event.pointerId, p);

      if (this.pointers.size === 2) {
        const pts = [...this.pointers.values()];
        const currentDistance = distance(pts[0], pts[1]);
        if (this.pinchStartDistance > 0) {
          const center = midpoint(pts[0], pts[1]);
          const targetScale = clamp(this.pinchStartScale * (currentDistance / this.pinchStartDistance), 0.72, 3.4);
          this.zoomTo(center.x, center.y, targetScale);
        }
        return;
      }

      if (event.pointerId !== this.pointerId) return;

      // Do not capture the pointer on pointerdown: doing so retargets a normal
      // click to the <svg> element and prevents segment click handlers firing.
      // Only switch to drag mode after the pointer has actually moved.
      if (!this.dragging && distance(this.pressStart, p) >= DRAG_THRESHOLD) {
        this.dragging = true;
        this.suppressNextClick = true;
        try {
          this.svg.setPointerCapture(event.pointerId);
        } catch {
          // Pointer capture is a progressive enhancement; panning still works
          // while the pointer remains over the SVG if the browser rejects it.
        }
      }

      if (this.dragging) {
        this.tx += p.x - this.previous.x;
        this.ty += p.y - this.previous.y;
        this.apply();
      }

      this.previous = p;
    });

    const endPointer = (event: PointerEvent) => {
      this.pointers.delete(event.pointerId);
      if (event.pointerId === this.pointerId) {
        this.dragging = false;
        this.pointerId = null;
      }
      if (this.pointers.size < 2) this.pinchStartDistance = 0;

      if (this.svg.hasPointerCapture?.(event.pointerId)) {
        try {
          this.svg.releasePointerCapture(event.pointerId);
        } catch {
          // Ignore browsers that already released capture automatically.
        }
      }
    };

    this.svg.addEventListener('pointerup', endPointer);
    this.svg.addEventListener('pointercancel', endPointer);

    // A drag can still synthesize a click in some browsers. Swallow only that
    // first post-drag click; ordinary taps/clicks continue to the segment.
    this.svg.addEventListener('click', (event) => {
      if (!this.suppressNextClick) return;
      this.suppressNextClick = false;
      event.preventDefault();
      event.stopPropagation();
    }, true);
  }

  private zoomAt(x: number, y: number, factor: number): void {
    this.zoomTo(x, y, clamp(this.scale * factor, 0.72, 3.4));
  }

  private zoomTo(x: number, y: number, newScale: number): void {
    const contentX = (x - this.tx) / this.scale;
    const contentY = (y - this.ty) / this.scale;
    this.tx = x - contentX * newScale;
    this.ty = y - contentY * newScale;
    this.scale = newScale;
    this.apply();
  }

  private apply(): void {
    this.viewport.setAttribute('transform', `translate(${this.tx} ${this.ty}) scale(${this.scale})`);
    this.svg.style.setProperty('--zoom', String(this.scale));
    this.svg.dataset.zoomLevel = this.scale >= 1.5 ? 'detail' : this.scale >= 1.08 ? 'middle' : 'overview';
    this.onZoomChange(this.scale);
  }

  private toSvg(clientX: number, clientY: number): DOMPoint {
    const point = this.svg.createSVGPoint();
    point.x = clientX;
    point.y = clientY;
    const matrix = this.svg.getScreenCTM();
    return matrix ? point.matrixTransform(matrix.inverse()) : new DOMPoint(clientX, clientY);
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function distance(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function midpoint(a: { x: number; y: number }, b: { x: number; y: number }): { x: number; y: number } {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}
