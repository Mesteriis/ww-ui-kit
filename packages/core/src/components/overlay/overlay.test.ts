import { defineComponent, nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';

import UiButton from '../buttons/UiButton.vue';
import UiDialog from './UiDialog.vue';
import UiDrawer from './UiDrawer.vue';

describe('overlay components', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('restores focus and shared layer styles when closing a dialog', async () => {
    const wrapper = mount(
      defineComponent({
        components: { UiButton, UiDialog },
        setup() {
          const open = ref(false);
          return { open };
        },
        template: `
          <div>
            <UiButton id="opener" @click="open = true">Open</UiButton>
            <UiDialog v-model:open="open" title="Dialog title">
              <button id="inside" type="button">Inside</button>
            </UiDialog>
          </div>
        `
      }),
      {
        attachTo: document.body,
        global: {
          stubs: {
            transition: false
          }
        }
      }
    );

    const opener = wrapper.get('#opener');
    (opener.element as HTMLButtonElement).focus();
    await opener.trigger('click');
    await nextTick();

    const dialog = document.querySelector<HTMLElement>('.ui-dialog');
    const backdrop = document.querySelector<HTMLElement>('.ui-overlay__backdrop');

    expect(dialog).not.toBeNull();
    expect(dialog?.style.zIndex).toBe('4002');
    expect(backdrop?.style.zIndex).toBe('4000');
    expect(document.body.querySelector('[data-ui-portal-root="true"]')).not.toBeNull();
    expect(document.body.style.overflow).toBe('hidden');

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await nextTick();
    await nextTick();
    await new Promise((resolve) => window.setTimeout(resolve, 0));

    expect(document.querySelector('.ui-dialog')).toBeNull();
    expect(document.activeElement).toBe(opener.element);

    await opener.trigger('click');
    await nextTick();
    (document.querySelector('.ui-overlay__backdrop') as HTMLElement).dispatchEvent(
      new Event('pointerdown', { bubbles: true, cancelable: true })
    );
    await nextTick();
    await nextTick();
    await new Promise((resolve) => window.setTimeout(resolve, 0));

    expect(document.querySelector('.ui-dialog')).toBeNull();

    wrapper.unmount();
  });

  it('uses the shared overlay stack for nested drawer and dialog dismissal', async () => {
    const wrapper = mount(
      defineComponent({
        components: { UiButton, UiDialog, UiDrawer },
        setup() {
          const drawerOpen = ref(false);
          const dialogOpen = ref(false);
          return { dialogOpen, drawerOpen };
        },
        template: `
          <div>
            <UiButton id="drawer-opener" @click="drawerOpen = true">Open drawer</UiButton>
            <UiDrawer v-model:open="drawerOpen" side="right" title="Drawer title">
              <UiButton id="dialog-opener" @click="dialogOpen = true">Open nested dialog</UiButton>
              <UiDialog v-model:open="dialogOpen" title="Nested dialog">
                <button id="nested-action" type="button">Nested action</button>
              </UiDialog>
            </UiDrawer>
          </div>
        `
      }),
      {
        attachTo: document.body,
        global: {
          stubs: {
            transition: false
          }
        }
      }
    );

    await wrapper.get('#drawer-opener').trigger('click');
    await nextTick();
    const dialogOpener = document.getElementById('dialog-opener') as HTMLButtonElement;
    dialogOpener.focus();
    dialogOpener.click();
    await nextTick();

    const surfaces = Array.from(document.querySelectorAll<HTMLElement>('.ui-overlay__surface'));
    expect(surfaces).toHaveLength(2);
    expect(Number(surfaces[1]?.style.zIndex)).toBeGreaterThan(Number(surfaces[0]?.style.zIndex));

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await nextTick();
    await nextTick();
    await new Promise((resolve) => window.setTimeout(resolve, 0));

    expect(document.querySelectorAll('.ui-overlay__surface')).toHaveLength(1);
    expect(document.activeElement).toBe(dialogOpener);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await nextTick();
    await nextTick();

    expect(document.querySelector('.ui-drawer')).toBeNull();

    wrapper.unmount();
  });

  it('keeps scoped theme overlays inside the themed subtree and supports explicit portal targets', async () => {
    const wrapper = mount(
      defineComponent({
        components: { UiButton, UiDialog, UiDrawer },
        setup() {
          const dialogOpen = ref(false);
          const drawerOpen = ref(false);
          const explicitTarget = ref<HTMLElement | null>(null);
          return { dialogOpen, drawerOpen, explicitTarget };
        },
        template: `
          <section id="scope" data-ui-theme="belovodye" data-ui-theme-type="light">
            <div id="explicit-target" ref="explicitTarget"></div>
            <UiButton id="dialog-open" @click="dialogOpen = true">Open scoped dialog</UiButton>
            <UiButton id="drawer-open" @click="drawerOpen = true">Open scoped drawer</UiButton>
            <UiDialog v-model:open="dialogOpen" title="Scoped dialog">
              Scoped content
            </UiDialog>
            <UiDrawer
              v-model:open="drawerOpen"
              title="Scoped drawer"
              :portal-target="explicitTarget"
            >
              Scoped drawer
            </UiDrawer>
          </section>
        `
      }),
      {
        attachTo: document.body,
        global: {
          stubs: {
            transition: false
          }
        }
      }
    );

    await wrapper.get('#dialog-open').trigger('click');
    await nextTick();

    const scope = wrapper.get('#scope').element as HTMLElement;
    const scopedPortalRoot = scope.querySelector('[data-ui-portal-root="true"]');
    expect(scopedPortalRoot).not.toBeNull();
    expect(scopedPortalRoot?.contains(document.querySelector('.ui-dialog'))).toBe(true);
    expect(scopedPortalRoot?.closest('[data-ui-theme]')).toBe(scope);
    expect(scopedPortalRoot?.closest('[data-ui-theme-type]')).toBe(scope);

    await wrapper.get('#drawer-open').trigger('click');
    await nextTick();

    const explicitTarget = wrapper.get('#explicit-target').element as HTMLElement;
    const explicitPortalRoot = explicitTarget.querySelector('[data-ui-portal-root="true"]');
    expect(explicitPortalRoot?.contains(document.querySelector('.ui-drawer'))).toBe(true);
    expect(explicitPortalRoot?.closest('[data-ui-theme]')).toBe(scope);
    expect(explicitPortalRoot?.closest('[data-ui-theme-type]')).toBe(scope);

    wrapper.unmount();
  });

  it('covers aria-label-only overlays, custom slots, and left-side drawers', async () => {
    const wrapper = mount(
      defineComponent({
        components: { UiDialog, UiDrawer },
        setup() {
          const dialogOpen = ref(true);
          const drawerOpen = ref(true);
          return { dialogOpen, drawerOpen };
        },
        template: `
          <div>
            <UiDialog v-model:open="dialogOpen" aria-label="Label only dialog">
              <template #title="{ titleId }">
                <span :id="titleId">Slotted dialog title</span>
              </template>
              <template #footer>
                <button type="button">Dialog footer</button>
              </template>
              Dialog body
            </UiDialog>

            <UiDrawer v-model:open="drawerOpen" side="left" aria-label="Label only drawer">
              <template #header="{ titleId }">
                <div :id="titleId">Drawer header</div>
              </template>
              <template #footer>
                <button type="button">Drawer footer</button>
              </template>
              Drawer body
            </UiDrawer>
          </div>
        `
      }),
      {
        attachTo: document.body,
        global: {
          stubs: {
            transition: false
          }
        }
      }
    );

    await nextTick();

    const dialog = document.querySelector('.ui-dialog');
    const drawer = document.querySelector('.ui-drawer');

    expect(dialog?.getAttribute('aria-label')).toBeNull();
    expect(dialog?.textContent).toContain('Slotted dialog title');
    expect(dialog?.textContent).toContain('Dialog footer');
    expect(drawer?.className).toContain('ui-drawer--left');
    expect(drawer?.textContent).toContain('Drawer header');
    expect(drawer?.textContent).toContain('Drawer footer');

    wrapper.unmount();
  });

  it('covers unlabeled-title branches and close buttons for aria-label-only overlays', async () => {
    const wrapper = mount(
      defineComponent({
        components: { UiDialog, UiDrawer },
        setup() {
          const dialogOpen = ref(true);
          const drawerOpen = ref(true);
          return { dialogOpen, drawerOpen };
        },
        template: `
          <div>
            <UiDialog v-model:open="dialogOpen" aria-label="Bare dialog">
              Dialog body
            </UiDialog>
            <UiDrawer v-model:open="drawerOpen" aria-label="Bare drawer">
              Drawer body
            </UiDrawer>
          </div>
        `
      }),
      {
        attachTo: document.body,
        global: {
          stubs: {
            transition: false
          }
        }
      }
    );

    await nextTick();

    const closeButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('.ui-overlay__close'));
    expect(document.querySelector('.ui-dialog')?.getAttribute('aria-label')).toBe('Bare dialog');
    expect(document.querySelector('.ui-drawer')?.getAttribute('aria-label')).toBe('Bare drawer');
    expect(document.querySelector('.ui-dialog .ui-overlay__footer')).toBeNull();
    expect(document.querySelector('.ui-drawer .ui-overlay__footer')).toBeNull();

    closeButtons[0]?.click();
    closeButtons[1]?.click();
    await nextTick();

    expect(document.querySelector('.ui-dialog')).toBeNull();
    expect(document.querySelector('.ui-drawer')).toBeNull();

    wrapper.unmount();
  });
});
