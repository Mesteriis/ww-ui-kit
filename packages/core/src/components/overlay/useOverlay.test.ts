import { computed, defineComponent, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const primitivesMocks = vi.hoisted(() => ({
  leaveCount: 0,
  applyTransitionMotionVariables: vi.fn(),
  clearTransitionMotionVariables: vi.fn(),
  resolveTransitionMotionPreset: vi.fn((preset: string) => ({
    durationToken: '--ui-motion-duration-sm',
    preset,
  })),
  restoreFocus: vi.fn(),
  focusOverlay: vi.fn(async () => true),
  forceCompleteLeave: vi.fn(() => {
    primitivesMocks.leaveCount = 0;
    primitivesMocks.isLeaving.value = false;
  }),
  handleAfterEnter: vi.fn(() => {
    primitivesMocks.leaveCount = 0;
    primitivesMocks.isLeaving.value = false;
  }),
  handleBeforeEnter: vi.fn(() => {
    primitivesMocks.leaveCount = 0;
    primitivesMocks.isLeaving.value = false;
  }),
  handleAfterLeave: vi.fn(() => {
    primitivesMocks.leaveCount = Math.max(0, primitivesMocks.leaveCount - 1);
    primitivesMocks.isLeaving.value = primitivesMocks.leaveCount > 0;
  }),
  handleBeforeLeave: vi.fn(() => {
    primitivesMocks.leaveCount += 1;
    primitivesMocks.isLeaving.value = true;
  }),
  isLeaving: { value: false },
}));

vi.mock('@ww/primitives', () => ({
  applyTransitionMotionVariables: primitivesMocks.applyTransitionMotionVariables,
  clearTransitionMotionVariables: primitivesMocks.clearTransitionMotionVariables,
  resolveTransitionMotionPreset: primitivesMocks.resolveTransitionMotionPreset,
  useId: (prefix: string) => computed(() => `${prefix}-id`),
  useMotionPresence: () => ({
    isActive: computed(() => true),
    isLeaving: primitivesMocks.isLeaving,
    forceCompleteLeave: primitivesMocks.forceCompleteLeave,
    handleBeforeEnter: primitivesMocks.handleBeforeEnter,
    handleAfterEnter: primitivesMocks.handleAfterEnter,
    handleBeforeLeave: primitivesMocks.handleBeforeLeave,
    handleAfterLeave: primitivesMocks.handleAfterLeave,
  }),
  useOverlaySurface: () => ({
    backdropStyle: computed(() => ({ zIndex: '4000' })),
    contentStyle: computed(() => ({ zIndex: '4002' })),
    focusOverlay: primitivesMocks.focusOverlay,
    isTopMost: computed(() => true),
    portalTarget: computed(() => null),
    restoreFocus: primitivesMocks.restoreFocus,
  }),
}));

import { useOverlay } from './useOverlay';

describe('useOverlay', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    primitivesMocks.leaveCount = 0;
    primitivesMocks.isLeaving.value = false;
    document.documentElement.style.setProperty('--ui-motion-duration-sm', '16ms');
  });

  afterEach(() => {
    vi.clearAllMocks();
    document.documentElement.style.removeProperty('--ui-motion-duration-sm');
  });

  it('derives ids and applies motion presets for titled overlays', () => {
    const close = vi.fn();

    const wrapper = mount(
      defineComponent({
        props: {
          open: { type: Boolean, required: true },
          title: { type: String, required: false },
          description: { type: String, required: false },
          ariaLabel: { type: String, required: false },
        },
        setup(props, { expose }) {
          const overlay = useOverlay(props, close, {
            prefix: 'dialog',
            surfacePreset: 'modal-fade-scale',
            backdropPreset: 'backdrop-soften',
          });

          expose({ overlay });
          return { overlay };
        },
        template: '<div />',
      }),
      {
        props: {
          open: true,
          title: 'Dialog title',
          description: 'Dialog description',
        },
      }
    );

    const vm = wrapper.vm as unknown as {
      overlay: ReturnType<typeof useOverlay>;
    };

    expect(vm.overlay.labelledBy.value).toBe('dialog-title-id');
    expect(vm.overlay.describedBy.value).toBe('dialog-description-id');
    expect(vm.overlay.titleId.value).toBe('dialog-title-id');
    expect(vm.overlay.descriptionId.value).toBe('dialog-description-id');
    expect(vm.overlay.backdropStyle.value).toEqual({ zIndex: '4000' });
    expect(vm.overlay.contentStyle.value).toEqual({ zIndex: '4002' });
    expect(vm.overlay.portalTarget.value).toBeNull();

    const element = document.createElement('div');
    vm.overlay.handleBackdropBeforeEnter(element);
    vm.overlay.handleSurfaceBeforeLeave(element);
    vm.overlay.handleBackdropAfterEnter(element);
    primitivesMocks.isLeaving.value = false;
    vm.overlay.handleSurfaceAfterLeave(element);

    expect(primitivesMocks.handleBeforeEnter).toHaveBeenCalled();
    expect(primitivesMocks.handleBeforeLeave).toHaveBeenCalled();
    expect(primitivesMocks.handleAfterEnter).toHaveBeenCalled();
    expect(primitivesMocks.handleAfterLeave).toHaveBeenCalled();
    expect(primitivesMocks.resolveTransitionMotionPreset).toHaveBeenCalledWith(
      'backdrop-soften',
      'fade-in'
    );
    expect(primitivesMocks.resolveTransitionMotionPreset).toHaveBeenCalledWith(
      'modal-fade-scale',
      'fade-in'
    );
    expect(primitivesMocks.applyTransitionMotionVariables).toHaveBeenCalled();
    expect(primitivesMocks.clearTransitionMotionVariables).toHaveBeenCalled();
    expect(primitivesMocks.restoreFocus).toHaveBeenCalled();

    wrapper.unmount();
  });

  it('falls back to aria-label flow and restores focus only after the leave cycle completes', async () => {
    const close = vi.fn();

    const wrapper = mount(
      defineComponent({
        props: {
          open: { type: Boolean, required: true },
          title: { type: String, required: false },
          description: { type: String, required: false },
          ariaLabel: { type: String, required: false },
          portalTarget: { type: String, required: false },
        },
        setup(props, { expose }) {
          const overlay = useOverlay(props, close, {
            prefix: 'drawer',
            surfacePreset: () => 'drawer-slide-left',
          });

          expose({ overlay });
          return { overlay };
        },
        template: '<div />',
      }),
      {
        props: {
          open: true,
          ariaLabel: 'Drawer label',
        },
      }
    );

    const vm = wrapper.vm as unknown as {
      overlay: ReturnType<typeof useOverlay>;
    };

    expect(vm.overlay.labelledBy.value).toBeUndefined();
    expect(vm.overlay.describedBy.value).toBeUndefined();

    const element = document.createElement('div');
    vm.overlay.handleBackdropBeforeLeave(element);
    vm.overlay.handleSurfaceBeforeLeave(element);

    await wrapper.setProps({ open: false });
    await nextTick();
    await Promise.resolve();

    expect(primitivesMocks.restoreFocus).not.toHaveBeenCalled();

    vm.overlay.handleSurfaceAfterLeave(element);
    expect(primitivesMocks.restoreFocus).not.toHaveBeenCalled();

    vm.overlay.handleBackdropAfterLeave(element);
    expect(primitivesMocks.restoreFocus).toHaveBeenCalledTimes(1);

    wrapper.unmount();
  });

  it('ignores non-html elements for motion helpers and uses backdrop leave handlers', () => {
    const close = vi.fn();

    const wrapper = mount(
      defineComponent({
        props: {
          open: { type: Boolean, required: true },
          title: { type: String, required: false },
          description: { type: String, required: false },
          ariaLabel: { type: String, required: false },
        },
        setup(props, { expose }) {
          const overlay = useOverlay(props, close, {
            prefix: 'dialog',
            surfacePreset: 'modal-fade-scale',
          });

          expose({ overlay });
          return { overlay };
        },
        template: '<div />',
      }),
      {
        props: {
          open: true,
          ariaLabel: 'Label only',
        },
      }
    );

    const vm = wrapper.vm as unknown as {
      overlay: ReturnType<typeof useOverlay>;
    };
    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    vm.overlay.handleBackdropBeforeEnter(svgElement);
    vm.overlay.handleBackdropBeforeLeave(svgElement);
    vm.overlay.handleSurfaceBeforeLeave(svgElement);
    vm.overlay.handleBackdropAfterLeave(svgElement);

    expect(primitivesMocks.applyTransitionMotionVariables).not.toHaveBeenCalled();
    expect(primitivesMocks.clearTransitionMotionVariables).not.toHaveBeenCalled();
    expect(primitivesMocks.handleBeforeEnter).toHaveBeenCalledTimes(1);
    expect(primitivesMocks.handleBeforeLeave).toHaveBeenCalledTimes(2);
    expect(primitivesMocks.handleAfterLeave).toHaveBeenCalledTimes(1);
    expect(primitivesMocks.restoreFocus).not.toHaveBeenCalled();

    wrapper.unmount();
  });

  it('does not request focus restoration on the initial closed render branch', async () => {
    const close = vi.fn();

    const wrapper = mount(
      defineComponent({
        props: {
          open: { type: Boolean, required: true },
        },
        setup(props) {
          return {
            overlay: useOverlay(props, close, {
              prefix: 'dialog',
              surfacePreset: 'modal-fade-scale',
            }),
          };
        },
        template: '<div />',
      }),
      {
        props: {
          open: false,
        },
      }
    );

    await nextTick();
    await Promise.resolve();

    expect(primitivesMocks.restoreFocus).not.toHaveBeenCalled();

    wrapper.unmount();
  });

  it('forces a leave completion when a transition finalizer does not arrive', async () => {
    vi.useFakeTimers();
    const close = vi.fn();

    const wrapper = mount(
      defineComponent({
        props: {
          open: { type: Boolean, required: true },
        },
        setup(props) {
          return {
            overlay: useOverlay(props, close, {
              prefix: 'dialog',
              surfacePreset: 'modal-fade-scale',
            }),
          };
        },
        template: '<div />',
      }),
      {
        props: {
          open: true,
        },
      }
    );

    const vm = wrapper.vm as unknown as {
      overlay: ReturnType<typeof useOverlay>;
    };
    const element = document.createElement('div');

    document.documentElement.style.setProperty('--ui-motion-duration-sm', '24');
    vm.overlay.handleSurfaceBeforeLeave(element);
    await wrapper.setProps({ open: false });
    vi.advanceTimersByTime(23);

    expect(primitivesMocks.forceCompleteLeave).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);

    expect(primitivesMocks.forceCompleteLeave).toHaveBeenCalledTimes(1);
    expect(primitivesMocks.restoreFocus).toHaveBeenCalledTimes(1);

    vm.overlay.handleBackdropAfterLeave(element);
    expect(primitivesMocks.restoreFocus).toHaveBeenCalledTimes(1);

    wrapper.unmount();
    vi.useRealTimers();
  });

  it('parses second-based duration tokens when arming the leave fallback', async () => {
    vi.useFakeTimers();
    const close = vi.fn();

    const wrapper = mount(
      defineComponent({
        props: {
          open: { type: Boolean, required: true },
        },
        setup(props) {
          return {
            overlay: useOverlay(props, close, {
              prefix: 'dialog',
              surfacePreset: 'modal-fade-scale',
            }),
          };
        },
        template: '<div />',
      }),
      {
        props: {
          open: true,
        },
      }
    );

    const vm = wrapper.vm as unknown as {
      overlay: ReturnType<typeof useOverlay>;
    };
    const element = document.createElement('div');

    document.documentElement.style.setProperty('--ui-motion-duration-sm', '0.024s');
    vm.overlay.handleSurfaceBeforeLeave(element);
    await wrapper.setProps({ open: false });
    vi.advanceTimersByTime(23);
    expect(primitivesMocks.forceCompleteLeave).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(primitivesMocks.forceCompleteLeave).toHaveBeenCalledTimes(1);

    wrapper.unmount();
    vi.useRealTimers();
  });

  it('falls back immediately when the leave duration token is missing', async () => {
    vi.useFakeTimers();
    const close = vi.fn();

    const wrapper = mount(
      defineComponent({
        props: {
          open: { type: Boolean, required: true },
        },
        setup(props) {
          return {
            overlay: useOverlay(props, close, {
              prefix: 'dialog',
              surfacePreset: 'modal-fade-scale',
            }),
          };
        },
        template: '<div />',
      }),
      {
        props: {
          open: true,
        },
      }
    );

    const vm = wrapper.vm as unknown as {
      overlay: ReturnType<typeof useOverlay>;
    };
    const element = document.createElement('div');

    document.documentElement.style.removeProperty('--ui-motion-duration-sm');
    vm.overlay.handleSurfaceBeforeLeave(element);
    await wrapper.setProps({ open: false });
    vi.advanceTimersByTime(0);

    expect(primitivesMocks.forceCompleteLeave).toHaveBeenCalledTimes(1);

    wrapper.unmount();
    vi.useRealTimers();
  });

  it('treats invalid millisecond tokens as zero-duration leave fallbacks', async () => {
    vi.useFakeTimers();
    const close = vi.fn();

    const wrapper = mount(
      defineComponent({
        props: {
          open: { type: Boolean, required: true },
        },
        setup(props) {
          return {
            overlay: useOverlay(props, close, {
              prefix: 'dialog',
              surfacePreset: 'modal-fade-scale',
            }),
          };
        },
        template: '<div />',
      }),
      {
        props: {
          open: true,
        },
      }
    );

    const vm = wrapper.vm as unknown as {
      overlay: ReturnType<typeof useOverlay>;
    };
    const element = document.createElement('div');

    document.documentElement.style.setProperty('--ui-motion-duration-sm', 'badms');
    vm.overlay.handleSurfaceBeforeLeave(element);
    await wrapper.setProps({ open: false });
    vi.advanceTimersByTime(0);

    expect(primitivesMocks.forceCompleteLeave).toHaveBeenCalledTimes(1);

    wrapper.unmount();
    vi.useRealTimers();
  });

  it('treats invalid second and raw duration tokens as zero-duration leave fallbacks', async () => {
    vi.useFakeTimers();
    const close = vi.fn();

    const wrapper = mount(
      defineComponent({
        props: {
          open: { type: Boolean, required: true },
        },
        setup(props) {
          return {
            overlay: useOverlay(props, close, {
              prefix: 'dialog',
              surfacePreset: 'modal-fade-scale',
            }),
          };
        },
        template: '<div />',
      }),
      {
        props: {
          open: true,
        },
      }
    );

    const vm = wrapper.vm as unknown as {
      overlay: ReturnType<typeof useOverlay>;
    };
    const element = document.createElement('div');

    document.documentElement.style.setProperty('--ui-motion-duration-sm', 'bads');
    vm.overlay.handleSurfaceBeforeLeave(element);
    await wrapper.setProps({ open: false });
    vi.advanceTimersByTime(0);
    expect(primitivesMocks.forceCompleteLeave).toHaveBeenCalledTimes(1);

    primitivesMocks.forceCompleteLeave.mockClear();
    primitivesMocks.restoreFocus.mockClear();
    await wrapper.setProps({ open: true });

    document.documentElement.style.setProperty('--ui-motion-duration-sm', 'bad');
    vm.overlay.handleSurfaceBeforeLeave(element);
    await wrapper.setProps({ open: false });
    vi.advanceTimersByTime(0);
    expect(primitivesMocks.forceCompleteLeave).toHaveBeenCalledTimes(1);

    wrapper.unmount();
    vi.useRealTimers();
  });
});
