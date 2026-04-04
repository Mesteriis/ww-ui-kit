<script setup lang="ts">
import { computed, getCurrentInstance, ref, type CSSProperties } from 'vue';

import { PrimitivePortal, useControllable, useId } from '@ww/primitives';

import UiIcon from '../display/UiIcon.vue';
import { useFloatingSurface } from '../overlay/useFloatingSurface';
import UiCalendar from './UiCalendar.vue';
import { formatDisplayDate } from './date-utils';

defineOptions({ name: 'UiDatePicker' });
const instance = getCurrentInstance();

const props = withDefaults(
  defineProps<{
    modelValue?: string | null;
    open?: boolean;
    defaultOpen?: boolean;
    locale?: string;
    min?: string;
    max?: string;
    disabledDates?: ((value: string) => boolean) | undefined;
    placeholder?: string;
    disabled?: boolean;
    clearable?: boolean;
    ariaLabel?: string;
    portalTarget?: string | HTMLElement | null;
  }>(),
  {
    ariaLabel: 'Date picker',
    clearable: true,
    defaultOpen: false,
    locale: 'en-US',
    placeholder: 'Select date',
  }
);

const emit = defineEmits<{
  'update:modelValue': [value: string | null];
  'update:open': [value: boolean];
}>();

const fallbackId = useId('date-picker');
const triggerRef = ref<HTMLElement | null>(null);
const surfaceRef = ref<HTMLElement | null>(null);

const openState = useControllable({
  defaultValue: props.defaultOpen,
  onChange: (value) => emit('update:open', value),
  value: computed(() =>
    Object.prototype.hasOwnProperty.call(instance?.vnode.props ?? {}, 'open') ? props.open : undefined
  ),
});

const displayValue = computed(() =>
  props.modelValue ? formatDisplayDate(props.modelValue, props.locale) : props.placeholder
);
const floatingSurfaceStyle = computed<CSSProperties>(() => surfaceStyle.value as CSSProperties);

const {
  handleSurfaceAfterEnter,
  handleSurfaceAfterLeave,
  handleSurfaceBeforeEnter,
  handleSurfaceBeforeLeave,
  placement,
  portalTarget,
  surfaceStyle,
} = useFloatingSurface(
  {
    open: computed(() => openState.currentValue.value),
    placement: computed(() => 'bottom-start'),
    offset: computed(() => 8),
    portalTarget: computed(() => props.portalTarget),
  },
  {
    kind: 'floating',
    motionPreset: 'fade-up-xs',
    close: () => openState.setValue(false),
    triggerRef,
    surfaceRef,
    dismissOnEscape: true,
    dismissOnFocusOutside: true,
    dismissOnPointerOutside: true,
    autoFocus: true,
    restoreFocus: true,
  }
);

const onSelect = (value: string | [string | null, string | null] | null) => {
  emit('update:modelValue', typeof value === 'string' ? value : null);
  openState.setValue(false);
};
</script>

<template>
  <div class="ui-date-field">
    <button
      :id="fallbackId"
      ref="triggerRef"
      type="button"
      class="ui-date-field__trigger ui-input"
      :class="{ 'is-placeholder': !props.modelValue }"
      :disabled="props.disabled"
      :aria-label="props.ariaLabel"
      :aria-expanded="openState.currentValue.value"
      aria-haspopup="dialog"
      data-ui-motion="ring-focus-soft"
      @click="openState.setValue(!openState.currentValue.value)"
    >
      <span>{{ displayValue }}</span>
      <span class="ui-date-field__actions">
        <button
          v-if="props.clearable && props.modelValue"
          type="button"
          class="ui-date-field__clear"
          aria-label="Clear date"
          @click.stop="emit('update:modelValue', null)"
        >
          <UiIcon name="close" />
        </button>
        <UiIcon name="calendar" decorative />
      </span>
    </button>

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
          v-if="openState.currentValue.value"
          ref="surfaceRef"
          class="ui-floating ui-date-surface"
          :data-placement="placement"
          :style="floatingSurfaceStyle"
        >
          <UiCalendar
            :model-value="props.modelValue ?? null"
            :locale="props.locale"
            :min="props.min"
            :max="props.max"
            :disabled-dates="props.disabledDates"
            @update:modelValue="onSelect"
          />
        </section>
      </Transition>
    </PrimitivePortal>
  </div>
</template>
