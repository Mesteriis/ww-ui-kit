import { defineComponent, nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { computeFloatingPosition, useFloatingPosition } from './floating';

describe('floating positioning', () => {
  let resizeObserverInstances: Array<{
    callback: ResizeObserverCallback;
    disconnect: ReturnType<typeof vi.fn>;
    observe: ReturnType<typeof vi.fn>;
  }> = [];
  let originalResizeObserver: typeof ResizeObserver | undefined;

  beforeEach(() => {
    resizeObserverInstances = [];
    originalResizeObserver = globalThis.ResizeObserver;
    globalThis.ResizeObserver = class ResizeObserverMock {
      callback: ResizeObserverCallback;
      disconnect = vi.fn();
      observe = vi.fn();

      constructor(callback: ResizeObserverCallback) {
        this.callback = callback;
        resizeObserverInstances.push(this);
      }
    } as unknown as typeof ResizeObserver;

    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      callback(0);
      return 1;
    });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    if (originalResizeObserver) {
      globalThis.ResizeObserver = originalResizeObserver;
      return;
    }

    delete (globalThis as typeof globalThis & { ResizeObserver?: typeof ResizeObserver })
      .ResizeObserver;
  });

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

  it('covers zero-sized arrows, tiny viewports, and alignment tie-breaks', () => {
    const rightEdge = computeFloatingPosition({
      anchorRect: {
        top: 180,
        left: 160,
        width: 80,
        height: 40,
        right: 240,
        bottom: 220,
      },
      contentRect: {
        width: 420,
        height: 240,
      },
      placement: 'right-end',
      offset: -8,
      arrowSize: 0,
      viewportPadding: -12,
      viewportWidth: 240,
      viewportHeight: 180,
    });

    expect(rightEdge.x).toBeGreaterThanOrEqual(0);
    expect(rightEdge.y).toBeGreaterThanOrEqual(0);
    expect(rightEdge.arrow.x).toBeUndefined();
    expect(rightEdge.arrow.y).toBeUndefined();

    const topEnd = computeFloatingPosition({
      anchorRect: {
        top: 200,
        left: 260,
        width: 60,
        height: 24,
        right: 320,
        bottom: 224,
      },
      contentRect: {
        width: 120,
        height: 80,
      },
      placement: 'top-end',
      offset: 8,
      arrowSize: 12,
      viewportPadding: 12,
      viewportWidth: 640,
      viewportHeight: 480,
    });

    expect(topEnd.placement).toBe('top-end');
    expect(topEnd.arrow.edge).toBe('bottom');
    expect(topEnd.arrow.x).toBeGreaterThanOrEqual(12);
  });

  it('tracks anchor and content elements in the floating composable', async () => {
    const wrapper = mount(
      defineComponent({
        setup(_, { expose }) {
          const open = ref(false);
          const anchorRef = ref<HTMLElement | null>(null);
          const contentRef = ref<HTMLElement | null>(null);
          const floating = useFloatingPosition({
            open,
            anchorRef,
            contentRef,
            placement: 'bottom-start',
            offset: 8,
            arrowSize: 12,
          });

          expose({
            floating,
            open,
          });

          return {
            anchorRef,
            contentRef,
          };
        },
        template: `
          <div>
            <button id="anchor" ref="anchorRef" type="button">Anchor</button>
            <div id="content" ref="contentRef">Content</div>
          </div>
        `,
      }),
      {
        attachTo: document.body,
      }
    );

    const anchor = wrapper.get('#anchor').element as HTMLElement;
    const content = wrapper.get('#content').element as HTMLElement;
    anchor.getBoundingClientRect = () =>
      ({
        top: 100,
        left: 120,
        width: 80,
        height: 30,
        right: 200,
        bottom: 130,
      }) as DOMRect;
    content.getBoundingClientRect = () =>
      ({
        top: 0,
        left: 0,
        width: 160,
        height: 72,
        right: 160,
        bottom: 72,
      }) as DOMRect;

    const vm = wrapper.vm as unknown as {
      floating: ReturnType<typeof useFloatingPosition>;
      open: boolean;
    };

    vm.open = true;
    await nextTick();
    await nextTick();

    const observer = resizeObserverInstances[0];

    expect(observer?.observe).toHaveBeenCalledWith(anchor);
    expect(observer?.observe).toHaveBeenCalledWith(content);
    expect(vm.floating.anchorWidth.value).toBe(80);
    expect(vm.floating.anchorHeight.value).toBe(30);
    expect(vm.floating.arrowStyle.value.left).toBeDefined();
    expect(vm.floating.arrowStyle.value.top).toBeUndefined();
    expect(vm.floating.floatingStyle.value.position).toBe('fixed');

    observer?.callback([], {} as ResizeObserver);
    window.dispatchEvent(new Event('resize'));

    wrapper.unmount();
    expect(observer?.disconnect).toHaveBeenCalledTimes(1);
  });

  it('renders vertical arrow offsets when the placement resolves to a side axis', async () => {
    const wrapper = mount(
      defineComponent({
        setup(_, { expose }) {
          const open = ref(false);
          const anchorRef = ref<HTMLElement | null>(null);
          const contentRef = ref<HTMLElement | null>(null);
          const floating = useFloatingPosition({
            open,
            anchorRef,
            contentRef,
            placement: 'right-start',
            offset: 8,
            arrowSize: 12,
          });

          expose({
            floating,
            open,
          });

          return {
            anchorRef,
            contentRef,
          };
        },
        template: `
          <div>
            <button id="side-anchor" ref="anchorRef" type="button">Anchor</button>
            <div id="side-content" ref="contentRef">Content</div>
          </div>
        `,
      }),
      {
        attachTo: document.body,
      }
    );

    const anchor = wrapper.get('#side-anchor').element as HTMLElement;
    const content = wrapper.get('#side-content').element as HTMLElement;
    anchor.getBoundingClientRect = () =>
      ({
        top: 120,
        left: 40,
        width: 40,
        height: 120,
        right: 80,
        bottom: 240,
      }) as DOMRect;
    content.getBoundingClientRect = () =>
      ({
        top: 0,
        left: 0,
        width: 120,
        height: 120,
        right: 120,
        bottom: 120,
      }) as DOMRect;

    const vm = wrapper.vm as unknown as {
      floating: ReturnType<typeof useFloatingPosition>;
      open: boolean;
    };

    vm.open = true;
    await nextTick();
    await nextTick();

    expect(vm.floating.arrowStyle.value.left).toBeUndefined();
    expect(vm.floating.arrowStyle.value.top).toBeDefined();
  });
});
