import { nextTick, defineComponent, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import PrimitiveFocusTrap from './PrimitiveFocusTrap.vue';

describe('PrimitiveFocusTrap', () => {
  it('cycles focus and restores focus on unmount', async () => {
    const opener = document.createElement('button');
    opener.textContent = 'open';
    document.body.appendChild(opener);
    opener.focus();

    const Harness = defineComponent({
      components: { PrimitiveFocusTrap },
      template: `
        <PrimitiveFocusTrap>
          <button id="first" type="button">First</button>
          <button id="last" type="button">Last</button>
        </PrimitiveFocusTrap>
      `
    });

    const wrapper = mount(Harness, {
      attachTo: document.body
    });

    await nextTick();
    expect((document.activeElement as HTMLElement | null)?.id).toBe('first');

    const last = wrapper.get('#last').element as HTMLButtonElement;
    last.focus();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    await nextTick();

    expect((document.activeElement as HTMLElement | null)?.id).toBe('first');

    wrapper.unmount();
    expect(document.activeElement).toBe(opener);

    opener.remove();
  });

  it('supports inactive mode, focus-in redirects, and container fallback when no focusable children exist', async () => {
    const outside = document.createElement('button');
    outside.textContent = 'outside';
    document.body.append(outside);

    const Harness = defineComponent({
      components: { PrimitiveFocusTrap },
      setup() {
        const active = ref(false);
        return { active };
      },
      template: `
        <PrimitiveFocusTrap :active="active">
          <div id="empty">No focusable content</div>
        </PrimitiveFocusTrap>
      `
    });

    const wrapper = mount(Harness, {
      attachTo: document.body
    });

    expect(document.activeElement).not.toBe(wrapper.element);

    (wrapper.vm as typeof wrapper.vm & { active: boolean }).active = true;
    await nextTick();
    await nextTick();

    const container = wrapper.get('div[tabindex="-1"]').element as HTMLDivElement;
    expect(document.activeElement).toBe(container);

    outside.focus();
    document.dispatchEvent(new FocusEvent('focusin', { bubbles: true, relatedTarget: container }));
    await nextTick();
    expect(document.activeElement).toBe(container);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
    await nextTick();
    expect(document.activeElement).toBe(container);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }));
    await nextTick();
    expect(document.activeElement).toBe(container);

    wrapper.unmount();
    outside.remove();
  });

  it('supports reverse tab wrapping and ignores focus events that stay inside the trap', async () => {
    const Harness = defineComponent({
      components: { PrimitiveFocusTrap },
      template: `
        <PrimitiveFocusTrap>
          <button id="first" type="button">First</button>
          <button id="last" type="button">Last</button>
        </PrimitiveFocusTrap>
      `
    });

    const wrapper = mount(Harness, {
      attachTo: document.body
    });

    await nextTick();

    const first = wrapper.get('#first').element as HTMLButtonElement;
    first.focus();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true }));
    await nextTick();
    expect((document.activeElement as HTMLElement | null)?.id).toBe('last');

    const insideFocus = new FocusEvent('focusin', { bubbles: true });
    Object.defineProperty(insideFocus, 'target', {
      value: wrapper.get('#last').element
    });
    document.dispatchEvent(insideFocus);
    await nextTick();
    expect((document.activeElement as HTMLElement | null)?.id).toBe('last');

    wrapper.unmount();
  });

  it('captures a null previously focused element when activeElement is not an HTMLElement', async () => {
    const originalActiveElement = Object.getOwnPropertyDescriptor(document, 'activeElement');
    Object.defineProperty(document, 'activeElement', {
      configurable: true,
      get: () => document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    });

    const Harness = defineComponent({
      components: { PrimitiveFocusTrap },
      template: `
        <PrimitiveFocusTrap>
          <button id="only" type="button">Only</button>
        </PrimitiveFocusTrap>
      `
    });

    const wrapper = mount(Harness, {
      attachTo: document.body
    });

    if (originalActiveElement) {
      Object.defineProperty(document, 'activeElement', originalActiveElement);
    }

    expect(wrapper.find('#only').exists()).toBe(true);
    await nextTick();

    wrapper.unmount();
  });

  it('tolerates teardown before the deferred focus pass runs', async () => {
    const Harness = defineComponent({
      components: { PrimitiveFocusTrap },
      template: `
        <PrimitiveFocusTrap>
          <button id="only" type="button">Only</button>
        </PrimitiveFocusTrap>
      `
    });

    const wrapper = mount(Harness, {
      attachTo: document.body
    });

    wrapper.unmount();
    await nextTick();
    await nextTick();

    expect(document.body.contains(wrapper.element)).toBe(false);
  });
});
