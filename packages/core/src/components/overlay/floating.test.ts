import { defineComponent, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import UiButton from '../buttons/UiButton.vue';
import UiDropdown from './UiDropdown.vue';
import UiPopover from './UiPopover.vue';
import UiTooltip from './UiTooltip.vue';

async function flushOverlayLeave() {
  await nextTick();
  await nextTick();
  vi.runAllTimers();
  await nextTick();
}

describe('floating overlays', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    document.body.innerHTML = '';
  });

  it('opens a tooltip on hover and keeps aria-describedby on the trigger', async () => {
    const wrapper = mount(
      defineComponent({
        components: { UiButton, UiTooltip },
        template: `
          <UiTooltip content="Context help">
            <UiButton id="tooltip-trigger">Hover me</UiButton>
          </UiTooltip>
        `,
      }),
      {
        attachTo: document.body,
        global: {
          stubs: {
            transition: false,
          },
        },
      }
    );

    const trigger = wrapper.get('#tooltip-trigger');
    await wrapper.get('.ui-tooltip__trigger').trigger('pointerenter');
    vi.runAllTimers();
    await nextTick();
    await nextTick();

    expect(document.querySelector('[role="tooltip"]')?.textContent).toContain('Context help');
    expect((trigger.element as HTMLElement).getAttribute('aria-describedby')).toMatch(/^tooltip-/);

    await wrapper.get('.ui-tooltip__trigger').trigger('pointerleave');
    vi.runAllTimers();
    await flushOverlayLeave();

    expect(document.querySelector('[role="tooltip"]')).toBeNull();

    wrapper.unmount();
  });

  it('opens a popover, closes on escape, and restores focus to the trigger', async () => {
    const wrapper = mount(
      defineComponent({
        components: { UiButton, UiPopover },
        template: `
          <UiPopover width="auto">
            <template #trigger>
              <UiButton id="popover-trigger">Open popover</UiButton>
            </template>
            <button id="popover-action" type="button">Popover action</button>
          </UiPopover>
        `,
      }),
      {
        attachTo: document.body,
        global: {
          stubs: {
            transition: false,
          },
        },
      }
    );

    const trigger = wrapper.get('#popover-trigger');
    (trigger.element as HTMLButtonElement).focus();
    await trigger.trigger('click');
    await nextTick();
    await nextTick();

    expect(document.querySelector('[role="dialog"]')).not.toBeNull();

    const popoverAction = document.getElementById('popover-action');
    popoverAction?.focus();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await flushOverlayLeave();

    expect(document.querySelector('[role="dialog"]')).toBeNull();
    expect(document.activeElement).toBe(trigger.element);

    wrapper.unmount();
  });

  it('supports dropdown menu roles, roving focus, typeahead, and selection', async () => {
    const onSelect = vi.fn();

    const wrapper = mount(UiDropdown, {
      attachTo: document.body,
      props: {
        items: [
          { label: 'Alpha', value: 'alpha' },
          { label: 'Blocked', value: 'blocked', disabled: true },
          { type: 'divider' },
          {
            type: 'group',
            label: 'Deploy',
            items: [
              { label: 'Bravo', value: 'bravo' },
              { label: 'Charlie', value: 'charlie' },
            ],
          },
        ],
        onSelect,
      },
      slots: {
        trigger: '<button id="menu-trigger" type="button">Open menu</button>',
      },
      global: {
        stubs: {
          transition: false,
        },
      },
    });

    const trigger = wrapper.get('#menu-trigger');
    await trigger.trigger('click');
    await nextTick();
    await nextTick();

    const menu = document.querySelector<HTMLElement>('[role="menu"]');
    expect(menu).not.toBeNull();
    expect(document.querySelectorAll('[role="menuitem"]')).toHaveLength(4);

    menu?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await nextTick();
    expect(document.activeElement?.textContent).toContain('Bravo');

    menu?.dispatchEvent(new KeyboardEvent('keydown', { key: 'c', bubbles: true }));
    vi.runAllTimers();
    await nextTick();
    expect(document.activeElement?.textContent).toContain('Charlie');

    (document.activeElement as HTMLElement | null)?.click();
    await flushOverlayLeave();

    expect(onSelect).toHaveBeenCalledWith({
      label: 'Charlie',
      value: 'charlie',
    });
    expect(document.querySelector('[role="menu"]')).toBeNull();

    wrapper.unmount();
  });

  it('keeps reduced-motion tooltip open and close paths synchronous', async () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation(() => ({
      addEventListener: vi.fn(),
      addListener: vi.fn(),
      dispatchEvent: vi.fn(),
      matches: true,
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      removeEventListener: vi.fn(),
      removeListener: vi.fn(),
    })) as typeof window.matchMedia;

    const wrapper = mount(UiTooltip, {
      attachTo: document.body,
      props: {
        content: 'Reduced motion',
        trigger: 'click',
      },
      slots: {
        default: '<button id="reduced-trigger" type="button">Toggle</button>',
      },
      global: {
        stubs: {
          transition: false,
        },
      },
    });

    const trigger = wrapper.get('#reduced-trigger');
    await trigger.trigger('click');
    await nextTick();
    await nextTick();
    expect(document.querySelector('[role="tooltip"]')).not.toBeNull();

    await trigger.trigger('click');
    await flushOverlayLeave();
    expect(document.querySelector('[role="tooltip"]')).toBeNull();

    window.matchMedia = originalMatchMedia;
    wrapper.unmount();
  });
});
