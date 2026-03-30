import type * as VueModule from 'vue';
import { computed, defineComponent, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const primitivesMocks = vi.hoisted(() => ({
  applyTransitionMotionVariables: vi.fn(),
  clearTransitionMotionVariables: vi.fn(),
  forceCompleteLeave: vi.fn(),
  handleAfterEnter: vi.fn(),
  handleAfterLeave: vi.fn(),
  handleBeforeEnter: vi.fn(),
  handleBeforeLeave: vi.fn(),
  isLeaving: { value: false },
  resolveTransitionMotionPreset: vi.fn(() => ({
    durationToken: '--ui-motion-duration-sm',
  })),
  restoreFocus: vi.fn(),
  updatePosition: vi.fn(async () => undefined),
}));

vi.mock('@ww/primitives', async () => {
  const vue = (await vi.importActual('vue')) as typeof VueModule;

  return {
    applyTransitionMotionVariables: primitivesMocks.applyTransitionMotionVariables,
    clearTransitionMotionVariables: primitivesMocks.clearTransitionMotionVariables,
    resolveTransitionMotionPreset: primitivesMocks.resolveTransitionMotionPreset,
    useFloatingPosition: () => ({
      anchorHeight: vue.computed(() => 24),
      anchorWidth: vue.computed(() => 96),
      arrowStyle: vue.computed(() => ({ left: '12px' })),
      floatingStyle: vue.computed(() => ({
        left: '4px',
        position: 'fixed',
        top: '8px',
      })),
      placement: vue.computed(() => 'bottom-start'),
      updatePosition: primitivesMocks.updatePosition,
    }),
    useMotionPresence: (open: unknown) => ({
      forceCompleteLeave: primitivesMocks.forceCompleteLeave,
      handleAfterEnter: primitivesMocks.handleAfterEnter,
      handleAfterLeave: primitivesMocks.handleAfterLeave,
      handleBeforeEnter: primitivesMocks.handleBeforeEnter,
      handleBeforeLeave: primitivesMocks.handleBeforeLeave,
      isActive: vue.computed(() => Boolean(vue.toValue(open))),
      isLeaving: primitivesMocks.isLeaving,
    }),
    useOverlaySurface: () => ({
      contentStyle: vue.computed(() => ({ zIndex: '4002' })),
      portalTarget: vue.computed(() => null),
      restoreFocus: primitivesMocks.restoreFocus,
    }),
  };
});

import { useFloatingSurface } from './useFloatingSurface';

describe('useFloatingSurface', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    document.documentElement.style.setProperty('--ui-motion-duration-sm', '16ms');
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    document.documentElement.style.removeProperty('--ui-motion-duration-sm');
  });

  it('merges floating styles, clears leave fallbacks, and restores focus through overlay fallback', async () => {
    const wrapper = mount(
      defineComponent({
        props: {
          open: {
            type: Boolean,
            required: true,
          },
        },
        setup(props, { expose }) {
          const triggerRef = ref<HTMLElement | null>(null);
          const surfaceRef = ref<HTMLElement | null>(null);
          const floating = useFloatingSurface(
            {
              open: computed(() => props.open),
              arrow: true,
            },
            {
              kind: 'floating',
              motionPreset: 'fade-up-xs',
              close: () => undefined,
              restoreFocus: true,
              surfaceRef,
              triggerRef,
            }
          );

          expose({ floating });

          return {
            floating,
            surfaceRef,
            triggerRef,
          };
        },
        template: `
          <div>
            <div id="trigger" ref="triggerRef"></div>
            <div id="surface" ref="surfaceRef"></div>
          </div>
        `,
      }),
      {
        props: {
          open: true,
        },
        attachTo: document.body,
      }
    );

    const vm = wrapper.vm as unknown as {
      floating: ReturnType<typeof useFloatingSurface>;
    };
    const element = document.createElement('div');

    vm.floating.handleSurfaceBeforeLeave(element);
    vm.floating.handleSurfaceBeforeEnter(element);
    vi.advanceTimersByTime(16);

    expect(primitivesMocks.forceCompleteLeave).not.toHaveBeenCalled();

    await wrapper.setProps({ open: false });
    vm.floating.handleSurfaceBeforeLeave(element);
    vi.advanceTimersByTime(16);

    expect(primitivesMocks.forceCompleteLeave).toHaveBeenCalledTimes(1);
    expect(primitivesMocks.restoreFocus).toHaveBeenCalledTimes(1);
    expect(vm.floating.surfaceStyle.value).toEqual({
      zIndex: '4002',
      left: '4px',
      position: 'fixed',
      top: '8px',
    });
    expect(vm.floating.arrowStyle.value).toEqual({ left: '12px' });
    expect(vm.floating.triggerWidth.value).toBe(96);
    expect(vm.floating.triggerHeight.value).toBe(24);
  });

  it('ignores non-html elements and skips focus restoration when disabled', async () => {
    const wrapper = mount(
      defineComponent({
        props: {
          open: {
            type: Boolean,
            required: true,
          },
        },
        setup(props, { expose }) {
          const triggerRef = ref<HTMLElement | null>(null);
          const surfaceRef = ref<HTMLElement | null>(null);
          const floating = useFloatingSurface(
            {
              open: computed(() => props.open),
            },
            {
              kind: 'tooltip',
              motionPreset: 'fade-in',
              close: () => undefined,
              restoreFocus: false,
              surfaceRef,
              triggerRef,
            }
          );

          expose({ floating });

          return {
            floating,
            surfaceRef,
            triggerRef,
          };
        },
        template: `
          <div>
            <button id="trigger" ref="triggerRef" type="button">Trigger</button>
            <div id="surface" ref="surfaceRef"></div>
          </div>
        `,
      }),
      {
        props: {
          open: true,
        },
      }
    );

    const vm = wrapper.vm as unknown as {
      floating: ReturnType<typeof useFloatingSurface>;
    };
    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    vm.floating.handleSurfaceBeforeEnter(svgElement);
    vm.floating.handleSurfaceAfterEnter(svgElement);
    vm.floating.handleSurfaceBeforeLeave(svgElement);
    vm.floating.handleSurfaceAfterLeave(svgElement);

    await wrapper.setProps({ open: false });
    vi.advanceTimersByTime(16);

    expect(primitivesMocks.applyTransitionMotionVariables).not.toHaveBeenCalled();
    expect(primitivesMocks.clearTransitionMotionVariables).not.toHaveBeenCalled();
    expect(primitivesMocks.restoreFocus).not.toHaveBeenCalled();
  });

  it('parses second-based and raw duration tokens for leave fallbacks', async () => {
    const wrapper = mount(
      defineComponent({
        props: {
          open: {
            type: Boolean,
            required: true,
          },
        },
        setup(props, { expose }) {
          const triggerRef = ref<HTMLElement | null>(null);
          const surfaceRef = ref<HTMLElement | null>(null);
          const floating = useFloatingSurface(
            {
              open: computed(() => props.open),
            },
            {
              kind: 'tooltip',
              motionPreset: 'fade-in',
              close: () => undefined,
              surfaceRef,
              triggerRef,
            }
          );

          expose({ floating });

          return {
            floating,
            surfaceRef,
            triggerRef,
          };
        },
        template: `
          <div>
            <button ref="triggerRef" type="button">Trigger</button>
            <div ref="surfaceRef"></div>
          </div>
        `,
      }),
      {
        props: {
          open: true,
        },
      }
    );

    const vm = wrapper.vm as unknown as {
      floating: ReturnType<typeof useFloatingSurface>;
    };
    const element = document.createElement('div');

    document.documentElement.style.setProperty('--ui-motion-duration-sm', '0.024s');
    vm.floating.handleSurfaceBeforeLeave(element);
    vi.advanceTimersByTime(24);
    expect(primitivesMocks.forceCompleteLeave).toHaveBeenCalledTimes(1);

    primitivesMocks.forceCompleteLeave.mockClear();
    document.documentElement.style.setProperty('--ui-motion-duration-sm', '24');
    vm.floating.handleSurfaceBeforeLeave(element);
    vi.advanceTimersByTime(24);
    expect(primitivesMocks.forceCompleteLeave).toHaveBeenCalledTimes(1);
  });
});
