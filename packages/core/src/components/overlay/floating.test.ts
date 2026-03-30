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

    menu?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await flushOverlayLeave();
    expect(onSelect).toHaveBeenCalledWith({
      label: 'Bravo',
      value: 'bravo',
    });

    await trigger.trigger('click');
    await nextTick();
    await nextTick();
    const reopenedMenu = document.querySelector<HTMLElement>('[role="menu"]');
    const dropdownSetupState = wrapper.vm.$.setupState as {
      selectItem: (item: { disabled: boolean; label: string; value: string }) => void;
    };
    dropdownSetupState.selectItem({
      disabled: true,
      label: 'Blocked',
      value: 'blocked',
    });
    expect(onSelect).toHaveBeenCalledTimes(1);

    reopenedMenu?.dispatchEvent(new KeyboardEvent('keydown', { key: 'c', bubbles: true }));
    vi.runAllTimers();
    await nextTick();
    expect(document.activeElement?.textContent).toContain('Charlie');

    (document.activeElement as HTMLElement | null)?.click();
    await flushOverlayLeave();

    expect(onSelect).toHaveBeenNthCalledWith(2, {
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

  it('covers tooltip focus/click/manual branches, arrow rendering, and disabled content guards', async () => {
    const focusTooltip = mount(UiTooltip, {
      attachTo: document.body,
      props: {
        trigger: 'focus',
        delay: { show: 25, hide: 10 },
        arrow: true,
        maxWidth: 180,
      },
      slots: {
        default: '<button id="focus-trigger" type="button">Focus tooltip</button>',
        content: 'Focusable tooltip',
      },
      global: {
        stubs: {
          transition: false,
        },
      },
    });

    const focusTrigger = focusTooltip.get('#focus-trigger');
    await focusTrigger.trigger('focusin');
    vi.advanceTimersByTime(25);
    await nextTick();
    await nextTick();

    const tooltip = document.querySelector<HTMLElement>('[role="tooltip"]');
    expect(tooltip?.style.maxWidth).toBe('180px');
    expect(document.querySelector('.ui-floating__arrow')).not.toBeNull();

    const tooltipElement = document.querySelector('.ui-tooltip') as HTMLElement;
    tooltipElement.dispatchEvent(new Event('pointerenter', { bubbles: true }));
    await focusTooltip.get('.ui-tooltip__trigger').trigger('pointerleave');
    vi.advanceTimersByTime(10);
    await nextTick();
    expect(document.querySelector('[role="tooltip"]')).not.toBeNull();

    const focusTooltipSetupState = focusTooltip.vm.$.setupState as {
      onFocusIn: () => void;
      onFocusOut: (event: FocusEvent) => void;
    };
    focusTooltipSetupState.onFocusIn();
    focusTooltipSetupState.onFocusOut(
      new FocusEvent('focusout', { relatedTarget: tooltipElement })
    );
    vi.advanceTimersByTime(10);
    await nextTick();
    expect(document.querySelector('[role="tooltip"]')).not.toBeNull();

    tooltipElement.dispatchEvent(new Event('pointerleave', { bubbles: true }));
    focusTooltipSetupState.onFocusOut(new FocusEvent('focusout', { relatedTarget: document.body }));
    vi.advanceTimersByTime(10);
    await flushOverlayLeave();
    expect(document.querySelector('[role="tooltip"]')).toBeNull();

    const clickTooltip = mount(UiTooltip, {
      attachTo: document.body,
      props: {
        content: 'Click tooltip',
        trigger: 'click',
        maxWidth: '20rem',
      },
      slots: {
        default: '<button id="click-trigger" type="button">Click tooltip</button>',
      },
      global: {
        stubs: {
          transition: false,
        },
      },
    });

    const clickTrigger = clickTooltip.get('#click-trigger');
    await clickTrigger.trigger('click');
    await nextTick();
    expect(document.querySelector<HTMLElement>('[role="tooltip"]')?.style.maxWidth).toBe('20rem');

    await clickTrigger.trigger('click');
    await flushOverlayLeave();
    expect(document.querySelector('[role="tooltip"]')).toBeNull();

    const guardedTooltip = mount(UiTooltip, {
      attachTo: document.body,
      props: {
        content: 'Disabled tooltip',
        trigger: 'manual',
        open: true,
        disabled: true,
      },
      slots: {
        default: '<button id="manual-trigger" type="button">Manual tooltip</button>',
      },
      global: {
        stubs: {
          transition: false,
        },
      },
    });

    await nextTick();
    expect(document.querySelector('[role="tooltip"]')).toBeNull();

    const guardedTooltipSetupState = guardedTooltip.vm.$.setupState as {
      onClick: () => void;
      onFocusOut: (event: FocusEvent) => void;
    };
    guardedTooltipSetupState.onClick();
    guardedTooltipSetupState.onFocusOut(
      new FocusEvent('focusout', { relatedTarget: document.body })
    );

    focusTooltip.unmount();
    clickTooltip.unmount();
    guardedTooltip.unmount();
  });

  it('covers popover hover/focus branches, width variants, and outside-click rules', async () => {
    const hoverPopover = mount(UiPopover, {
      attachTo: document.body,
      props: {
        trigger: 'hover',
        delay: { show: 15, hide: 10 },
        width: 'trigger',
        arrow: true,
      },
      slots: {
        trigger: '<button id="hover-popover" type="button">Hover popover</button>',
        default: '<button id="hover-popover-action" type="button">Action</button>',
      },
      global: {
        stubs: {
          transition: false,
        },
      },
    });

    await hoverPopover.get('.ui-popover__trigger').trigger('pointerenter');
    vi.advanceTimersByTime(15);
    await nextTick();
    await nextTick();
    expect(document.querySelector('[role="dialog"]')).not.toBeNull();
    expect(document.querySelector('.ui-floating__arrow')).not.toBeNull();

    const hoverContent = document.querySelector('.ui-popover') as HTMLElement;
    hoverContent.dispatchEvent(new Event('pointerenter', { bubbles: true }));
    await hoverPopover.get('.ui-popover__trigger').trigger('pointerleave');
    vi.advanceTimersByTime(10);
    await nextTick();
    expect(document.querySelector('[role="dialog"]')).not.toBeNull();

    hoverContent.dispatchEvent(new Event('pointerleave', { bubbles: true }));
    vi.advanceTimersByTime(10);
    await flushOverlayLeave();
    expect(document.querySelector('[role="dialog"]')).toBeNull();

    const focusPopover = mount(UiPopover, {
      attachTo: document.body,
      props: {
        trigger: 'focus',
        width: 240,
        closeOnClickOutside: false,
      },
      slots: {
        trigger: '<button id="focus-popover" type="button">Focus popover</button>',
        default: '<button id="focus-popover-action" type="button">Focus action</button>',
      },
      global: {
        stubs: {
          transition: false,
        },
      },
    });

    await focusPopover.get('#focus-popover').trigger('focusin');
    vi.runAllTimers();
    await nextTick();
    await nextTick();
    expect(document.querySelector<HTMLElement>('.ui-popover')?.style.width).toBe('240px');

    document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    await nextTick();
    expect(document.querySelector('[role="dialog"]')).not.toBeNull();

    await focusPopover.setProps({ disabled: true });
    await flushOverlayLeave();
    expect(document.querySelector('[role="dialog"]')).toBeNull();

    const focusSetupState = focusPopover.vm.$.setupState as {
      onClick: () => void;
      onPointerEnter: () => void;
      onFocusOut: (event: FocusEvent) => void;
    };
    focusSetupState.onPointerEnter();
    focusSetupState.onClick();
    focusSetupState.onFocusOut(
      new FocusEvent('focusout', { relatedTarget: document.getElementById('focus-popover-action') })
    );
    focusSetupState.onFocusOut(new FocusEvent('focusout', { relatedTarget: document.body }));

    hoverPopover.unmount();
    focusPopover.unmount();
  });

  it('covers dropdown hover opening, pointer focus, icons, and closeOnSelect=false', async () => {
    const wrapper = mount(UiDropdown, {
      attachTo: document.body,
      props: {
        trigger: 'hover',
        closeOnSelect: false,
        arrow: true,
        items: [
          { label: 'Top icon', value: 'top', icon: '▲' },
          {
            type: 'group',
            label: 'Group',
            items: [{ label: 'Group icon', value: 'group', icon: '◆' }],
          },
        ],
      },
      slots: {
        trigger: '<button id="hover-menu" type="button">Hover menu</button>',
      },
      global: {
        stubs: {
          transition: false,
        },
      },
    });

    await wrapper.get('.ui-dropdown__trigger').trigger('pointerenter');
    vi.runAllTimers();
    await nextTick();
    await nextTick();

    expect(document.querySelectorAll('.ui-dropdown__icon')).toHaveLength(2);
    const menuItems = Array.from(document.querySelectorAll<HTMLElement>('[role="menuitem"]'));
    menuItems[0]?.dispatchEvent(new Event('mouseenter', { bubbles: true }));
    menuItems[1]?.dispatchEvent(new Event('mouseenter', { bubbles: true }));
    await nextTick();

    menuItems[1]?.click();
    await nextTick();
    expect(wrapper.emitted('select')).toEqual([[{ label: 'Group icon', value: 'group' }]]);
    expect(document.querySelector('[role="menu"]')).not.toBeNull();

    menuItems[0]?.click();
    await nextTick();
    expect(wrapper.emitted('select')).toEqual([
      [{ label: 'Group icon', value: 'group' }],
      [{ label: 'Top icon', value: 'top' }],
    ]);

    wrapper.unmount();
  });

  it('covers dropdown fallback keyboard branches and tooltip dismiss callbacks', async () => {
    const disabledDropdown = mount(UiDropdown, {
      attachTo: document.body,
      props: {
        trigger: 'manual',
        open: true,
        items: [{ label: 'Disabled', value: 'disabled', disabled: true }],
      },
      slots: {
        trigger: '<button id="disabled-menu" type="button">Disabled menu</button>',
      },
      global: {
        stubs: {
          transition: false,
        },
      },
    });

    const disabledMenu = document.querySelector('[role="menu"]') as HTMLElement;
    disabledMenu.dispatchEvent(new KeyboardEvent('keydown', { key: 'd', bubbles: true }));
    vi.runAllTimers();
    await nextTick();
    expect(document.activeElement).not.toBe(disabledMenu);

    const clickDropdown = mount(UiDropdown, {
      attachTo: document.body,
      props: {
        items: [{ label: 'Solo', value: 'solo' }],
      },
      slots: {
        trigger: '<button id="click-menu" type="button">Click menu</button>',
      },
      global: {
        stubs: {
          transition: false,
        },
      },
    });

    await clickDropdown.get('#click-menu').trigger('click');
    await nextTick();
    await nextTick();
    const clickMenu = Array.from(document.querySelectorAll<HTMLElement>('[role="menu"]'));
    clickMenu.at(-1)?.dispatchEvent(new KeyboardEvent('keydown', { key: 's', bubbles: true }));
    clickMenu.at(-1)?.dispatchEvent(new KeyboardEvent('keydown', { key: 'o', bubbles: true }));
    vi.runAllTimers();
    await nextTick();
    clickMenu.at(-1)?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await flushOverlayLeave();

    await clickDropdown.get('#click-menu').trigger('click');
    await nextTick();
    await nextTick();
    const clickMenuItems = Array.from(
      document.querySelectorAll<HTMLButtonElement>('[role="menuitem"]')
    );
    clickMenuItems.at(-1)?.click();
    await flushOverlayLeave();
    expect(clickDropdown.emitted('select')).toEqual([[{ label: 'Solo', value: 'solo' }]]);

    const controlledTooltip = mount(UiTooltip, {
      attachTo: document.body,
      props: {
        content: 'Controlled tooltip',
        open: true,
      },
      slots: {
        default: '<button id="controlled-tooltip" type="button">Controlled</button>',
      },
      global: {
        stubs: {
          transition: false,
        },
      },
    });

    await nextTick();
    await nextTick();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await flushOverlayLeave();
    expect(controlledTooltip.emitted('update:open')).toEqual([[false]]);

    await controlledTooltip.setProps({ open: false });
    await flushOverlayLeave();
    expect(document.querySelector('[role="tooltip"]')).toBeNull();

    disabledDropdown.unmount();
    clickDropdown.unmount();
    controlledTooltip.unmount();
  });

  it('clears overlay timers and dropdown typeahead timers on unmount', async () => {
    const setTimeoutSpy = vi.spyOn(window, 'setTimeout');
    const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout');

    const tooltip = mount(UiTooltip, {
      attachTo: document.body,
      props: {
        content: 'Delayed tooltip',
        trigger: 'hover',
        delay: { show: 25, hide: 10 },
      },
      slots: {
        default: '<button id="tooltip-cleanup" type="button">Tooltip</button>',
      },
      global: {
        stubs: {
          transition: false,
        },
      },
    });

    await tooltip.get('.ui-tooltip__trigger').trigger('pointerenter');
    const tooltipTimer = setTimeoutSpy.mock.results.at(-1)?.value as number;
    tooltip.unmount();
    expect(clearTimeoutSpy).toHaveBeenCalledWith(tooltipTimer);

    const popover = mount(UiPopover, {
      attachTo: document.body,
      props: {
        trigger: 'hover',
        delay: { show: 20, hide: 10 },
      },
      slots: {
        trigger: '<button id="popover-cleanup" type="button">Popover</button>',
        default: '<button type="button">Action</button>',
      },
      global: {
        stubs: {
          transition: false,
        },
      },
    });

    await popover.get('.ui-popover__trigger').trigger('pointerenter');
    const popoverTimer = setTimeoutSpy.mock.results.at(-1)?.value as number;
    popover.unmount();
    expect(clearTimeoutSpy).toHaveBeenCalledWith(popoverTimer);

    const dropdown = mount(UiDropdown, {
      attachTo: document.body,
      props: {
        items: [{ label: 'Alpha', value: 'alpha' }],
      },
      slots: {
        trigger: '<button id="dropdown-cleanup" type="button">Dropdown</button>',
      },
      global: {
        stubs: {
          transition: false,
        },
      },
    });

    await dropdown.get('#dropdown-cleanup').trigger('click');
    await nextTick();
    await nextTick();
    await (
      dropdown.vm.$.setupState as {
        onMenuKeydown: (event: KeyboardEvent) => Promise<void>;
      }
    ).onMenuKeydown(new KeyboardEvent('keydown', { key: 'a' }));
    const dropdownClearCalls = clearTimeoutSpy.mock.calls.length;
    dropdown.unmount();
    expect(clearTimeoutSpy.mock.calls.length).toBeGreaterThan(dropdownClearCalls);

    setTimeoutSpy.mockRestore();
    clearTimeoutSpy.mockRestore();
  });
});
