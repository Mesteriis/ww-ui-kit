<script setup lang="ts">
import { computed, getCurrentInstance, ref, watch, type CSSProperties } from 'vue';

import { PrimitivePortal, useControllable } from '@ww/primitives';

import UiButton from '../buttons/UiButton.vue';
import UiIcon from '../display/UiIcon.vue';
import { useFloatingSurface } from '../overlay/useFloatingSurface';
import { formatTimeValue, normalizeTimeValue, padDatePart } from './date-utils';

defineOptions({ name: 'UiTimePicker' });
const instance = getCurrentInstance();

const props = withDefaults(
  defineProps<{
    modelValue?: string | null;
    open?: boolean;
    defaultOpen?: boolean;
    minuteStep?: number;
    min?: string;
    max?: string;
    placeholder?: string;
    disabled?: boolean;
    ariaLabel?: string;
    portalTarget?: string | HTMLElement | null;
  }>(),
  {
    ariaLabel: 'Time picker',
    defaultOpen: false,
    minuteStep: 5,
    placeholder: 'Select time',
  }
);

const emit = defineEmits<{
  'update:modelValue': [value: string | null];
  'update:open': [value: boolean];
}>();

const triggerRef = ref<HTMLElement | null>(null);
const surfaceRef = ref<HTMLElement | null>(null);
const hour = ref('09');
const minute = ref('00');

const openState = useControllable({
  defaultValue: props.defaultOpen,
  onChange: (value) => emit('update:open', value),
  value: computed(() =>
    Object.prototype.hasOwnProperty.call(instance?.vnode.props ?? {}, 'open') ? props.open : undefined
  ),
});

const syncFromValue = () => {
  const normalized = normalizeTimeValue(props.modelValue);
  hour.value = padDatePart(normalized?.hours ?? 9);
  minute.value = padDatePart(normalized?.minutes ?? 0);
};

watch(
  () => props.modelValue,
  () => syncFromValue(),
  { immediate: true }
);

const minuteOptions = computed(() =>
  Array.from({ length: Math.ceil(60 / props.minuteStep) }, (_, index) =>
    padDatePart(index * props.minuteStep)
  ).filter((value) => Number.parseInt(value, 10) < 60)
);
const hourOptions = Array.from({ length: 24 }, (_, index) => padDatePart(index));

const displayValue = computed(() => props.modelValue ?? props.placeholder);
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

const applyValue = () => {
  const nextValue = formatTimeValue(Number.parseInt(hour.value, 10), Number.parseInt(minute.value, 10));
  emit('update:modelValue', nextValue);
  openState.setValue(false);
};
</script>

<template>
  <div class="ui-date-field">
    <button
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
      <UiIcon name="chevronDown" decorative />
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
          class="ui-floating ui-time-picker"
          :data-placement="placement"
          :style="floatingSurfaceStyle"
        >
          <div class="ui-time-picker__controls">
            <label>
              Hour
              <select v-model="hour" class="ui-input" aria-label="Hours">
                <option v-for="value in hourOptions" :key="value" :value="value">{{ value }}</option>
              </select>
            </label>
            <label>
              Minute
              <select v-model="minute" class="ui-input" aria-label="Minutes">
                <option v-for="value in minuteOptions" :key="value" :value="value">{{ value }}</option>
              </select>
            </label>
          </div>

          <div class="ui-time-picker__actions">
            <UiButton variant="secondary" size="sm" @click="emit('update:modelValue', null)">
              Clear
            </UiButton>
            <UiButton size="sm" @click="applyValue">Apply</UiButton>
          </div>
        </section>
      </Transition>
    </PrimitivePortal>
  </div>
</template>
