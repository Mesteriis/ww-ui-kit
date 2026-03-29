import { computed, effectScope, nextTick, ref } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useSignalGraphFocus } from './useSignalGraphFocus';

const nodes = [
  { id: 'a', type: 'service', position: { x: 0, y: 0 }, data: {} },
  { id: 'b', type: 'service', position: { x: 200, y: 0 }, data: {} },
  { id: 'c', type: 'service', position: { x: 400, y: 0 }, data: {} },
];

const edges = [
  { id: 'ab', source: 'a', target: 'b' },
  { id: 'bc', source: 'b', target: 'c' },
];

describe('useSignalGraphFocus', () => {
  afterEach(() => {
    vi.doUnmock('@ww/primitives');
    vi.resetModules();
  });

  it('supports uncontrolled focus, hover fallback, and focus state callbacks', async () => {
    const onFocusChange = vi.fn();
    const onFocusStateChange = vi.fn();
    const scope = effectScope();

    const focus = scope.run(() =>
      useSignalGraphFocus({
        nodes: ref(nodes),
        edges: ref(edges),
        depthMode: ref('full'),
        focusedNodeId: ref(undefined),
        relationDepth: ref(1),
        onFocusChange,
        onFocusStateChange,
      })
    );

    if (!focus) {
      throw new Error('Expected focus composable state.');
    }

    focus.focusNode('a');
    await nextTick();

    expect(focus.anchorNodeId.value).toBe('a');
    expect(focus.focusState.value.source).toBe('programmatic');
    expect(onFocusChange).toHaveBeenCalledWith('a');

    focus.selectNode('b');
    await nextTick();
    expect(focus.focusState.value.source).toBe('selection');

    focus.clearFocus();
    focus.setHoveredNodeId('c');
    await nextTick();
    expect(focus.anchorNodeId.value).toBe('c');
    expect(focus.focusState.value.source).toBe('hover');

    focus.clearFocus();
    await nextTick();
    expect(focus.anchorNodeId.value).toBeNull();
    expect(onFocusStateChange).toHaveBeenCalled();

    scope.stop();
  });

  it('supports controlled focus mode and depth-mode changes without onFocusChange handlers', async () => {
    const controlledFocusedNodeId = ref<string | null | undefined>('b');
    const scope = effectScope();

    const focus = scope.run(() =>
      useSignalGraphFocus({
        nodes: ref(nodes),
        edges: ref(edges),
        depthMode: ref('off'),
        focusedNodeId: controlledFocusedNodeId,
        relationDepth: computed(() => undefined),
      })
    );

    if (!focus) {
      throw new Error('Expected focus composable state.');
    }

    expect(focus.anchorNodeId.value).toBe('b');
    expect(focus.focusState.value.source).toBe('controlled');
    expect(focus.focusState.value.depthMode).toBe('off');

    controlledFocusedNodeId.value = null;
    focus.setHoveredNodeId('a');
    await nextTick();

    expect(focus.anchorNodeId.value).toBe('a');
    expect(focus.focusState.value.source).toBe('hover');

    scope.stop();
  });

  it('falls back to selection source when internal state is restored without an explicit focus source', async () => {
    vi.resetModules();
    vi.doMock('@ww/primitives', () => ({
      useControllable: () => ({
        currentValue: ref('a'),
        setValue: vi.fn(),
      }),
    }));

    const { useSignalGraphFocus: importUseSignalGraphFocus } =
      await import('./useSignalGraphFocus');
    const scope = effectScope();
    const focus = scope.run(() =>
      importUseSignalGraphFocus({
        nodes: ref(nodes),
        edges: ref(edges),
        depthMode: ref('full'),
        focusedNodeId: ref(undefined),
        relationDepth: ref(1),
      })
    );

    if (!focus) {
      throw new Error('Expected focus composable state.');
    }

    expect(focus.focusState.value.source).toBe('selection');
    scope.stop();
  });
});
