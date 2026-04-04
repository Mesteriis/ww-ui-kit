<script setup lang="ts">
import { computed, getCurrentInstance, ref, watch } from 'vue';

import { PrimitivePortal, useControllable, useId, type FloatingPlacement } from '@ww/primitives';

import UiButton from '../buttons/UiButton.vue';
import type { UiButtonVariant } from '../buttons/button.types';
import UiIcon from '../display/UiIcon.vue';
import { useManagedTriggerAttributes, useTriggerElement } from './floating-utils';
import { useFloatingSurface } from './useFloatingSurface';

defineOptions({ name: 'UiPopconfirm' });
const instance = getCurrentInstance();

const props = withDefaults(
  defineProps<{
    open?: boolean;
    defaultOpen?: boolean;
    title: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    confirmVariant?: UiButtonVariant;
    icon?: string;
    placement?: FloatingPlacement;
    offset?: number;
    arrow?: boolean;
    disabled?: boolean;
    closeOnClickOutside?: boolean;
    portalTarget?: string | HTMLElement | null;
    id?: string;
  }>(),
  {
    arrow: false,
    cancelText: 'Cancel',
    closeOnClickOutside: true,
    confirmText: 'Confirm',
    confirmVariant: 'primary',
    disabled: false,
    icon: '!',
    offset: 10,
    placement: 'bottom-start',
  }
);

const emit = defineEmits<{
  'update:open': [value: boolean];
  cancel: [];
  confirm: [];
}>();

const fallbackId = useId('popconfirm');
const titleId = useId('popconfirm-title');
const descriptionId = useId('popconfirm-description');
const contentId = computed(() => props.id ?? fallbackId.value);
const { triggerRef, wrapperRef } = useTriggerElement();
const surfaceRef = ref<HTMLElement | null>(null);

const state = useControllable({
  defaultValue: props.defaultOpen ?? false,
  onChange: (value) => emit('update:open', value),
  value: computed(() =>
    Object.prototype.hasOwnProperty.call(instance?.vnode.props ?? {}, 'open')
      ? props.open
      : undefined
  ),
});
const openState = computed(() => !props.disabled && state.currentValue.value);

const setOpen = (nextOpen: boolean) => {
  if (nextOpen && props.disabled) {
    return;
  }

  state.setValue(nextOpen);
};

const onTriggerClick = () => {
  if (props.disabled) {
    return;
  }

  setOpen(!openState.value);
};

const onCancel = () => {
  emit('cancel');
  setOpen(false);
};

const onConfirm = () => {
  emit('confirm');
  setOpen(false);
};

watch(
  () => props.disabled,
  (disabled) => {
    if (disabled) {
      setOpen(false);
    }
  },
  { immediate: true }
);

useManagedTriggerAttributes(triggerRef, () => ({
  'aria-controls': props.disabled ? undefined : openState.value ? contentId.value : undefined,
  'aria-expanded': props.disabled ? undefined : String(openState.value),
  'aria-haspopup': props.disabled ? undefined : 'dialog',
}));

const {
  arrowStyle,
  handleSurfaceAfterEnter,
  handleSurfaceAfterLeave,
  handleSurfaceBeforeEnter,
  handleSurfaceBeforeLeave,
  placement,
  portalTarget,
  surfaceStyle,
} = useFloatingSurface(
  {
    open: openState,
    placement: computed(() => props.placement),
    offset: computed(() => props.offset),
    arrow: computed(() => props.arrow),
    portalTarget: computed(() => props.portalTarget),
  },
  {
    kind: 'floating',
    motionPreset: 'fade-up-xs',
    close: () => setOpen(false),
    triggerRef,
    surfaceRef,
    dismissOnEscape: true,
    dismissOnFocusOutside: true,
    dismissOnPointerOutside: props.closeOnClickOutside,
    autoFocus: true,
    restoreFocus: true,
    initialFocus: () =>
      surfaceRef.value?.querySelector<HTMLElement>('[data-ui-popconfirm-confirm="true"]') ?? null,
    getBoundaryElements: () => [wrapperRef.value],
  }
);

const popconfirmStyle = computed<Record<string, string>>(() => ({
  ...surfaceStyle.value,
}));
</script>

<template>
  <span ref="wrapperRef" class="ui-floating-trigger ui-popconfirm__trigger" @click="onTriggerClick">
    <slot name="trigger" />
  </span>

  <PrimitivePortal :to="portalTarget">
    <Transition
      appear
      name="ui-motion"
      @before-enter="handleSurfaceBeforeEnter"
      @after-enter="handleSurfaceAfterEnter"
      @before-leave="handleSurfaceBeforeLeave"
      @after-leave="handleSurfaceAfterLeave"
    >
      <section
        v-if="openState"
        :id="contentId"
        ref="surfaceRef"
        class="ui-floating ui-popconfirm"
        :data-placement="placement"
        :style="popconfirmStyle"
        role="dialog"
        aria-modal="false"
        :aria-labelledby="titleId"
        :aria-describedby="props.description ? descriptionId : undefined"
      >
        <div class="ui-popconfirm__header">
          <UiIcon class="ui-popconfirm__icon" decorative>{{ props.icon }}</UiIcon>
          <div class="ui-popconfirm__copy">
            <h2 :id="titleId" class="ui-popconfirm__title">{{ props.title }}</h2>
            <p v-if="props.description" :id="descriptionId" class="ui-popconfirm__description">
              {{ props.description }}
            </p>
          </div>
        </div>

        <div class="ui-popconfirm__actions">
          <UiButton size="sm" variant="secondary" @click="onCancel">
            {{ props.cancelText }}
          </UiButton>
          <UiButton
            size="sm"
            :variant="props.confirmVariant"
            data-ui-popconfirm-confirm="true"
            @click="onConfirm"
          >
            {{ props.confirmText }}
          </UiButton>
        </div>

        <span
          v-if="props.arrow"
          class="ui-floating__arrow"
          aria-hidden="true"
          :style="arrowStyle"
        />
      </section>
    </Transition>
  </PrimitivePortal>
</template>
