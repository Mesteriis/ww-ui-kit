import { computed, defineComponent, effectScope, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

import { useOutsideClick } from './useOutsideClick';

describe('useOutsideClick', () => {
  it('ignores inside clicks and reacts to outside clicks', async () => {
    const handler = vi.fn();

    const Harness = defineComponent({
      setup() {
        const target = ref<HTMLElement | null>(null);
        useOutsideClick(target, handler);
        return { target };
      },
      template: `
        <div>
          <div id="target" ref="target">inside</div>
          <button id="outside" type="button">outside</button>
        </div>
      `
    });

    const wrapper = mount(Harness, {
      attachTo: document.body
    });

    await wrapper.get('#target').trigger('pointerdown');
    expect(handler).not.toHaveBeenCalled();

    await wrapper.get('#outside').trigger('pointerdown');
    expect(handler).toHaveBeenCalledTimes(1);

    wrapper.unmount();
  });

  it('supports inactive mode, ignore targets, fallback event targets, and missing document access', async () => {
    const handler = vi.fn();

    const Harness = defineComponent({
      props: {
        active: {
          type: Boolean,
          required: true
        }
      },
      setup(props) {
        const target = ref<HTMLElement | null>(null);
        const ignore = ref<HTMLElement | null>(null);
        useOutsideClick(target, handler, {
          active: computed(() => props.active),
          ignore: [ignore]
        });
        return { ignore, target };
      },
      template: `
        <div>
          <div id="target" ref="target">inside</div>
          <div id="ignore" ref="ignore">ignore</div>
          <button id="outside" type="button">outside</button>
        </div>
      `
    });

    const wrapper = mount(Harness, {
      attachTo: document.body,
      props: {
        active: false
      }
    });

    await wrapper.get('#outside').trigger('pointerdown');
    expect(handler).not.toHaveBeenCalled();

    await wrapper.setProps({ active: true });

    const ignoreElement = wrapper.get('#ignore').element as HTMLElement;
    const ignoreEvent = new Event('pointerdown', { bubbles: true, cancelable: true }) as PointerEvent;
    Object.defineProperty(ignoreEvent, 'composedPath', {
      value: () => [ignoreElement]
    });
    wrapper.get('#outside').element.dispatchEvent(ignoreEvent);
    expect(handler).not.toHaveBeenCalled();

    const fallbackEvent = new Event('pointerdown', { bubbles: true, cancelable: true }) as PointerEvent;
    Object.defineProperty(fallbackEvent, 'composedPath', {
      value: undefined
    });
    wrapper.get('#outside').element.dispatchEvent(fallbackEvent);
    expect(handler).toHaveBeenCalledTimes(1);

    const nonNodeTargetEvent = new Event('pointerdown', { bubbles: true, cancelable: true }) as PointerEvent;
    Object.defineProperty(nonNodeTargetEvent, 'composedPath', {
      value: undefined
    });
    Object.defineProperty(nonNodeTargetEvent, 'target', {
      value: 'outside'
    });
    document.dispatchEvent(nonNodeTargetEvent);
    expect(handler).toHaveBeenCalledTimes(2);

    wrapper.unmount();

    const nullIgnoreScope = effectScope();
    const detachedTarget = ref<HTMLElement | null>(document.createElement('div'));
    nullIgnoreScope.run(() => {
      useOutsideClick(detachedTarget, handler, {
        ignore: [ref(null)]
      });
    });
    document.dispatchEvent(new Event('pointerdown', { bubbles: true, cancelable: true }) as PointerEvent);
    expect(handler).toHaveBeenCalledTimes(3);
    nullIgnoreScope.stop();

    const scope = effectScope();
    const originalDocument = globalThis.document;
    Object.defineProperty(globalThis, 'document', {
      configurable: true,
      value: undefined
    });

    expect(() => {
      scope.run(() => {
        useOutsideClick(ref(null), handler);
      });
    }).not.toThrow();

    scope.stop();
    Object.defineProperty(globalThis, 'document', {
      configurable: true,
      value: originalDocument
    });
  });
});
