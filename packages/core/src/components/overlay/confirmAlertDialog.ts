import { createApp, h, ref } from 'vue';

import UiAlertDialog from './UiAlertDialog.vue';

export interface ConfirmAlertDialogOptions {
  title: string;
  description?: string;
  tone?: 'info' | 'warning' | 'danger';
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'danger';
  defaultFocus?: 'confirm' | 'cancel';
}

export function confirmAlertDialog(options: ConfirmAlertDialogOptions) {
  return new Promise<boolean>((resolve) => {
    const host = document.createElement('div');
    document.body.append(host);

    const open = ref(true);
    let settled = false;

    const cleanup = (result: boolean) => {
      if (settled) {
        return;
      }

      settled = true;
      app.unmount();
      host.remove();
      resolve(result);
    };

    const app = createApp({
      render() {
        return h(UiAlertDialog, {
          ...options,
          open: open.value,
          'onUpdate:open': (value: boolean) => {
            open.value = value;
            if (!value) {
              cleanup(false);
            }
          },
          onConfirm: () => cleanup(true),
          onCancel: () => cleanup(false),
        });
      },
    });

    app.mount(host);
  });
}
