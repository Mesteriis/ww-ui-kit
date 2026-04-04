import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import UiAlertDialog from './UiAlertDialog.vue';
import { confirmAlertDialog } from './confirmAlertDialog';

describe('alert dialog surface', () => {
  it('renders alertdialog semantics and emits confirm/cancel flows', async () => {
    const wrapper = mount(UiAlertDialog, {
      attachTo: document.body,
      props: {
        open: true,
        title: 'Delete release?',
        description: 'This cannot be undone.',
        confirmVariant: 'danger',
      },
      global: {
        stubs: {
          transition: false,
        },
      },
    });

    const surface = document.body.querySelector('.ui-overlay__surface');
    expect(surface?.getAttribute('role')).toBe('alertdialog');
    await nextTick();
    expect(document.activeElement?.textContent).toContain('Confirm');

    const cancelButton = document.body.querySelector('.ui-alert-dialog__button') as HTMLButtonElement;
    cancelButton.click();
    expect(wrapper.emitted('cancel')).toHaveLength(1);
    expect(wrapper.emitted('update:open')).toEqual([[false]]);

    wrapper.unmount();
  });

  it('resolves the imperative confirm helper promise', async () => {
    const resultPromise = confirmAlertDialog({
      title: 'Confirm archive',
      description: 'Archive the current release?',
    });

    await nextTick();
    await nextTick();

    const confirmButton = [...document.querySelectorAll('button')].find((element) =>
      element.textContent?.includes('Confirm')
    );
    expect(confirmButton).toBeTruthy();
    confirmButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    await expect(resultPromise).resolves.toBe(true);
  });
});
