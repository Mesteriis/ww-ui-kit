import { defineComponent, nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import {
  normalizeDelayConfig,
  resolveTriggerElement,
  useManagedTriggerAttributes,
  useTriggerElement,
} from './floating-utils';

describe('floating utils', () => {
  it('normalizes delay configs and resolves focusable trigger elements', () => {
    expect(normalizeDelayConfig(undefined, { show: 20, hide: 40 })).toEqual({
      show: 20,
      hide: 40,
    });
    expect(normalizeDelayConfig(15, { show: 1, hide: 1 })).toEqual({
      show: 15,
      hide: 15,
    });
    expect(normalizeDelayConfig({ show: 12 }, { show: 20, hide: 40 })).toEqual({
      show: 12,
      hide: 40,
    });

    const wrapper = document.createElement('span');
    wrapper.innerHTML = '<button id="child-trigger" type="button">Trigger</button>';

    expect(resolveTriggerElement(null)).toBeNull();
    expect(resolveTriggerElement(wrapper)?.id).toBe('child-trigger');

    const directButton = document.createElement('button');
    directButton.type = 'button';
    directButton.id = 'direct-trigger';
    expect(resolveTriggerElement(directButton)?.id).toBe('direct-trigger');

    const fallback = document.createElement('div');
    fallback.id = 'fallback-trigger';
    expect(resolveTriggerElement(fallback)?.id).toBe('fallback-trigger');
  });

  it('tracks trigger refs and cleans up managed attributes across target changes', async () => {
    const wrapper = mount(
      defineComponent({
        setup(_, { expose }) {
          const nested = ref(false);
          const attributes = ref<Record<string, string | undefined>>({
            'aria-controls': 'overlay-id',
            'aria-expanded': 'false',
          });
          const { triggerRef, wrapperRef, syncTriggerElement } = useTriggerElement();
          const { applyAttributes } = useManagedTriggerAttributes(
            triggerRef,
            () => attributes.value
          );

          expose({
            applyAttributes,
            attributes,
            nested,
            syncTriggerElement,
            triggerRef,
          });

          return {
            nested,
            wrapperRef,
          };
        },
        template: `
          <div>
            <button v-if="!nested" id="first-trigger" ref="wrapperRef" type="button">First</button>
            <span v-else ref="wrapperRef">
              <button id="second-trigger" type="button">Second</button>
            </span>
          </div>
        `,
      }),
      {
        attachTo: document.body,
      }
    );

    const vm = wrapper.vm as typeof wrapper.vm & {
      attributes: Record<string, string | undefined>;
      nested: boolean;
      syncTriggerElement: () => Promise<void>;
    };

    await nextTick();
    await nextTick();

    const first = document.getElementById('first-trigger') as HTMLElement;
    expect(first.getAttribute('aria-controls')).toBe('overlay-id');
    expect(first.getAttribute('aria-expanded')).toBe('false');

    vm.nested = true;
    await nextTick();
    await vm.syncTriggerElement();
    await nextTick();

    const second = document.getElementById('second-trigger') as HTMLElement;
    expect(first.hasAttribute('aria-controls')).toBe(false);
    expect(first.hasAttribute('aria-expanded')).toBe(false);
    expect(second.getAttribute('aria-controls')).toBe('overlay-id');

    vm.attributes = {
      'aria-controls': undefined,
    };
    await nextTick();
    await nextTick();
    expect(second.hasAttribute('aria-controls')).toBe(false);
    expect(second.hasAttribute('aria-expanded')).toBe(false);

    vm.attributes = {
      'aria-haspopup': 'dialog',
    };
    await nextTick();
    await nextTick();
    expect(second.getAttribute('aria-haspopup')).toBe('dialog');

    wrapper.unmount();
    expect(second.hasAttribute('aria-haspopup')).toBe(false);
  });

  it('does not attempt cleanup when no managed target was ever assigned', () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          const targetRef = ref<HTMLElement | null>(null);
          useManagedTriggerAttributes(targetRef, () => ({
            'aria-controls': 'never-applied',
          }));

          return () => null;
        },
      })
    );

    wrapper.unmount();
  });
});
