import { describe, expect, it, vi } from 'vitest';

import { useSignalGraphViewport } from './useSignalGraphViewport';

describe('useSignalGraphViewport', () => {
  it('exposes the canonical viewport handle methods', async () => {
    const store = {
      findNode: vi.fn((nodeId: string) =>
        nodeId === 'node-a'
          ? {
              computedPosition: { x: 24, y: 40, z: 0 },
              dimensions: { width: 200, height: 100 },
            }
          : undefined
      ),
      fitView: vi.fn(() => Promise.resolve(true)),
      getViewport: vi.fn(() => ({ x: 0, y: 0, zoom: 1.25 })),
      setCenter: vi.fn(() => Promise.resolve(true)),
      setViewport: vi.fn(() => Promise.resolve(true)),
      zoomIn: vi.fn(() => Promise.resolve(true)),
      zoomOut: vi.fn(() => Promise.resolve(true)),
    };
    const focusNode = vi.fn();
    const clearFocus = vi.fn();
    const emitSignal = vi.fn();

    const viewport = useSignalGraphViewport({
      store,
      fitViewPadding: '20%',
      defaultZoom: 1.4,
      focusNode,
      clearFocus,
      emitSignal,
    });

    expect(await viewport.fitView()).toBe(true);
    expect(store.fitView).toHaveBeenCalledWith({ padding: 0.2 });

    expect(await viewport.centerNode('node-a')).toBe(true);
    expect(store.setCenter).toHaveBeenCalledWith(124, 90, { duration: 220, zoom: 1.25 });

    expect(await viewport.centerNode('missing-node')).toBe(false);

    viewport.focusNode('node-a');
    viewport.clearFocus();
    viewport.emitSignal({
      id: 'signal',
      edgeId: 'edge-a-b',
      variant: 'info',
      direction: 'forward',
      intensity: 'sm',
    });
    expect(focusNode).toHaveBeenCalledWith('node-a');
    expect(clearFocus).toHaveBeenCalled();
    expect(emitSignal).toHaveBeenCalled();

    await viewport.zoomIn();
    await viewport.zoomOut();
    await viewport.resetViewport();
    expect(store.zoomIn).toHaveBeenCalled();
    expect(store.zoomOut).toHaveBeenCalled();
    expect(store.setViewport).toHaveBeenCalledWith({ x: 0, y: 0, zoom: 1.4 }, { duration: 180 });
  });
});
