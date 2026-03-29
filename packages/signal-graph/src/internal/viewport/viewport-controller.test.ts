import { describe, expect, it, vi } from 'vitest';

import {
  centerSignalGraphNode,
  fitSignalGraphView,
  parseFitViewPadding,
  resetSignalGraphViewport,
} from './viewport-controller';

describe('signal graph viewport controller', () => {
  it('parses fit view padding from number, percentage, and default values', () => {
    expect(parseFitViewPadding(0.24)).toBe(0.24);
    expect(parseFitViewPadding('15%')).toBe(0.15);
    expect(parseFitViewPadding(undefined)).toBe(0.12);
  });

  it('delegates fit, center, and reset behavior to the vendor store predictably', async () => {
    const store = {
      findNode: vi.fn((nodeId: string) =>
        nodeId === 'node-a'
          ? {
              computedPosition: { x: 40, y: 60, z: 0 },
              dimensions: { width: 180, height: 120 },
            }
          : undefined
      ),
      fitView: vi.fn(() => Promise.resolve(true)),
      getViewport: vi.fn(() => ({ x: 0, y: 0, zoom: 1.1 })),
      setCenter: vi.fn(() => Promise.resolve(true)),
      setViewport: vi.fn(() => Promise.resolve(true)),
      zoomIn: vi.fn(),
      zoomOut: vi.fn(),
    };

    await fitSignalGraphView(store, undefined);
    expect(store.fitView).toHaveBeenCalledWith({ padding: 0.12 });

    expect(await centerSignalGraphNode(store, 'missing')).toBe(false);
    expect(await centerSignalGraphNode(store, 'node-a')).toBe(true);
    expect(store.setCenter).toHaveBeenCalledWith(130, 120, { duration: 220, zoom: 1.1 });

    await resetSignalGraphViewport(store, undefined);
    expect(store.setViewport).toHaveBeenCalledWith({ x: 0, y: 0, zoom: 1 }, { duration: 180 });
  });
});
