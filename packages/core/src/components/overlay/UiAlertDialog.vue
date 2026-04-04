<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';

import UiButton from '../buttons/UiButton.vue';
import UiIcon from '../display/UiIcon.vue';
import UiDialog from './UiDialog.vue';

defineOptions({ name: 'UiAlertDialog' });

const props = withDefaults(
  defineProps<{
    open: boolean;
    title: string;
    description?: string;
    tone?: 'info' | 'warning' | 'danger';
    confirmText?: string;
    cancelText?: string;
    confirmVariant?: 'primary' | 'danger';
    portalTarget?: string | HTMLElement | null;
    defaultFocus?: 'confirm' | 'cancel';
  }>(),
  {
    tone: 'warning',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    confirmVariant: 'primary',
    defaultFocus: 'confirm',
  }
);

const emit = defineEmits<{
  'update:open': [value: boolean];
  confirm: [];
  cancel: [];
}>();

const confirmRef = ref<InstanceType<typeof UiButton> | null>(null);
const cancelButtonRef = ref<HTMLButtonElement | null>(null);

const toneIcon = computed(() => (props.tone === 'info' ? 'info' : 'warning'));

const close = () => emit('update:open', false);
const onCancel = () => {
  emit('cancel');
  close();
};
const onConfirm = () => {
  emit('confirm');
  close();
};

watch(
  () => props.open,
  async (isOpen) => {
    if (!isOpen) {
      return;
    }

    await nextTick();
    if (props.defaultFocus === 'cancel') {
      cancelButtonRef.value?.focus();
      return;
    }

    const button = confirmRef.value?.$el;
    if (button instanceof HTMLButtonElement) {
      button.focus();
    }
  }
);
</script>

<template>
  <UiDialog
    :open="props.open"
    role="alertdialog"
    :portal-target="props.portalTarget"
    :aria-label="props.title"
    @update:open="close"
  >
    <div class="ui-alert-dialog" :data-tone="props.tone">
      <div class="ui-alert-dialog__hero">
        <UiIcon :name="toneIcon" class="ui-alert-dialog__icon" />
        <div class="ui-alert-dialog__copy">
          <h2 class="ui-alert-dialog__title">{{ props.title }}</h2>
          <p v-if="props.description" class="ui-alert-dialog__description">
            {{ props.description }}
          </p>
        </div>
      </div>
    </div>

    <template #footer>
      <button
        ref="cancelButtonRef"
        type="button"
        class="ui-alert-dialog__button ui-alert-dialog__button--secondary"
        data-ui-motion="ring-focus-soft"
        @click="onCancel"
      >
        {{ props.cancelText }}
      </button>
      <UiButton ref="confirmRef" :variant="props.confirmVariant" @click="onConfirm">
        {{ props.confirmText }}
      </UiButton>
    </template>
  </UiDialog>
</template>
