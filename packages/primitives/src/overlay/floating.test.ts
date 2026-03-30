import { describe, expect, it } from 'vitest';

import { computeFloatingPosition } from './floating';

describe('floating positioning', () => {
  it('keeps the requested placement when it fits inside the viewport', () => {
    const result = computeFloatingPosition({
      anchorRect: {
        top: 120,
        left: 140,
        width: 80,
        height: 32,
        right: 220,
        bottom: 152,
      },
      contentRect: {
        width: 160,
        height: 72,
      },
      placement: 'bottom-start',
      offset: 8,
      viewportPadding: 12,
      viewportWidth: 800,
      viewportHeight: 600,
    });

    expect(result.placement).toBe('bottom-start');
    expect(result.x).toBe(140);
    expect(result.y).toBe(160);
  });

  it('flips to the opposite side when the requested side overflows more', () => {
    const result = computeFloatingPosition({
      anchorRect: {
        top: 8,
        left: 160,
        width: 64,
        height: 28,
        right: 224,
        bottom: 36,
      },
      contentRect: {
        width: 180,
        height: 96,
      },
      placement: 'top',
      offset: 10,
      viewportPadding: 12,
      viewportWidth: 480,
      viewportHeight: 320,
    });

    expect(result.placement).toBe('bottom');
    expect(result.y).toBeGreaterThan(36);
  });

  it('clamps coordinates and arrow offsets inside the viewport bounds', () => {
    const result = computeFloatingPosition({
      anchorRect: {
        top: 260,
        left: 12,
        width: 40,
        height: 24,
        right: 52,
        bottom: 284,
      },
      contentRect: {
        width: 220,
        height: 120,
      },
      placement: 'left-end',
      offset: 12,
      arrowSize: 12,
      viewportPadding: 12,
      viewportWidth: 320,
      viewportHeight: 320,
    });

    expect(result.x).toBeGreaterThanOrEqual(12);
    expect(result.y).toBeGreaterThanOrEqual(12);
    expect(result.arrow.edge).toBe('left');
    expect(result.arrow.y).toBeGreaterThanOrEqual(12);
  });
});
