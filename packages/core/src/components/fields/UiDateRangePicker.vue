<script setup lang="ts">
import { computed, getCurrentInstance, ref, type CSSProperties } from 'vue';

import { PrimitivePortal, useControllable } from '@ww/primitives';

import UiIcon from '../display/UiIcon.vue';
import { useFloatingSurface } from '../overlay/useFloatingSurface';
import UiCalendar from './UiCalendar.vue';
import { formatDisplayDate, type UiDateRangeValue } from './date-utils';

defineOptions({ name: 'UiDateRangePicker' });
const instance = getCurrentInstance();

const props = withDefaults(
  defineProps<{
    modelValue?: UiDateRangeValue;
    open?: boolean;
    defaultOpen?: boolean;
    locale?: string;
    min?: string;
    max?: string;
    disabledDates?: ((value: string) => boolean) | undefined;
    placeholder?: string;
    disabled?: boolean;
    ariaLabel?: string;
    portalTarget?: string | HTMLElement | null;
  }>(),
  {
    ariaLabel: 'Date range picker',
    defaultOpen: false,
    locale: 'en-US',
    placeholder: 'Select range',
  }
);

const emit = defineEmits<{
  'update:modelValue': [value: UiDateRangeValue];
  'update:open': [value: boolean];
}>();

const triggerRef = ref<HTMLElement | null>(null);
const surfaceRef = ref<HTMLElement | null>(null);

const openState = useControllable({
  defaultValue: props.defaultOpen,
  onChange: (value) => emit('update:open', value),
  value: computed(() =>
    Object.prototype.hasOwnProperty.call(instance?.vnode.props ?? {}, 'open') ? props.open : undefined
  ),
});

const displayValue = computed(() => {
  const [start, end] = props.modelValue ?? [null, null];
  if (!start && !end) {
    return props.placeholder;
  }

  const formattedStart = formatDisplayDate(start, props.locale);
  const formattedEnd = formatDisplayDate(end, props.locale);
  return [formattedStart, formattedEnd].filter(Boolean).join(' - ');
});
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

const onSelect = (value: string | UiDateRangeValue | null) => {
  if (Array.isArray(value)) {
    emit('update:modelValue', value);
    if (value[0] && value[1]) {
      openState.setValue(false);
    }
  }
};
</script>

<template>
  <div class="ui-date-field">
    <button
      ref="triggerRef"
      type="button"
      class="ui-date-field__trigger ui-input"
      :class="{ 'is-placeholder': !(props.modelValue?.[0] || props.modelValue?.[1]) }"
      :disabled="props.disabled"
      :aria-label="props.ariaLabel"
      :aria-expanded="openState.currentValue.value"
      aria-haspopup="dialog"
      data-ui-motion="ring-focus-soft"
      @click="openState.setValue(!openState.currentValue.value)"
    >
      <span>{{ displayValue }}</span>
      <UiIcon name="calendar" decorative />
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
            mode="range"
            :model-value="props.modelValue ?? [null, null]"
            :locale="props.locale"
            :min="props.min"
            :max="props.max"
            :disabled-dates="props.disabledDates"
            @update:model-value="onSelect"
          />
        </section>
      </Transition>
    </PrimitivePortal>
  </div>
</template>
