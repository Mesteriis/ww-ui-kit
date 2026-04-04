<script setup lang="ts">
import { computed, getCurrentInstance, ref, watch, type CSSProperties } from 'vue';

import { PrimitivePortal, useControllable } from '@ww/primitives';

import UiButton from '../buttons/UiButton.vue';
import { useFloatingSurface } from '../overlay/useFloatingSurface';

defineOptions({ name: 'UiColorPicker' });
const instance = getCurrentInstance();

function clampAlpha(value: number) {
  return Math.min(Math.max(value, 0), 1);
}

function parseColor(value: string | null | undefined) {
  if (!value) {
    return { hex: '#1d4ed8', alpha: 1 };
  }

  if (/^#[0-9a-fA-F]{6}$/.test(value)) {
    return { hex: value.toLowerCase(), alpha: 1 };
  }

  const rgbaMatch = value.match(
    /^rgba\(\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*([0-9.]+)\s*\)$/i
  );
  if (!rgbaMatch) {
    return { hex: '#1d4ed8', alpha: 1 };
  }

  const red = Number(rgbaMatch[1] ?? 0);
  const green = Number(rgbaMatch[2] ?? 0);
  const blue = Number(rgbaMatch[3] ?? 0);
  const alpha = Number(rgbaMatch[4] ?? 1);
  const hex = `#${[red, green, blue]
    .map((part) => Math.min(Math.max(part, 0), 255).toString(16).padStart(2, '0'))
    .join('')}`;
  return { hex, alpha: clampAlpha(alpha) };
}

function toOutputColor(hex: string, alpha: number) {
  if (alpha >= 1) {
    return hex;
  }

  const red = Number.parseInt(hex.slice(1, 3), 16);
  const green = Number.parseInt(hex.slice(3, 5), 16);
  const blue = Number.parseInt(hex.slice(5, 7), 16);
  return `rgba(${red}, ${green}, ${blue}, ${alpha.toFixed(2)})`;
}

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    open?: boolean;
    defaultOpen?: boolean;
    presets?: string[];
    disabled?: boolean;
    alpha?: boolean;
    ariaLabel?: string;
    portalTarget?: string | HTMLElement | null;
  }>(),
  {
    alpha: true,
    ariaLabel: 'Color picker',
    defaultOpen: false,
    disabled: false,
    presets: () => ['#1d4ed8', '#10b981', '#f59e0b', '#ef4444', '#111827'],
  }
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
  'update:open': [value: boolean];
}>();

const triggerRef = ref<HTMLElement | null>(null);
const surfaceRef = ref<HTMLElement | null>(null);
const hex = ref('#1d4ed8');
const alphaValue = ref(1);

const openState = useControllable({
  defaultValue: props.defaultOpen,
  onChange: (value) => emit('update:open', value),
  value: computed(() =>
    Object.prototype.hasOwnProperty.call(instance?.vnode.props ?? {}, 'open') ? props.open : undefined
  ),
});

watch(
  () => props.modelValue,
  () => {
    const parsed = parseColor(props.modelValue);
    hex.value = parsed.hex;
    alphaValue.value = parsed.alpha;
  },
  { immediate: true }
);

const previewStyle = computed<Record<string, string>>(() => ({
  background: toOutputColor(hex.value, alphaValue.value),
}));
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

const applyColor = () => {
  emit('update:modelValue', toOutputColor(hex.value, alphaValue.value));
};
</script>

<template>
  <div class="ui-color-picker">
    <button
      ref="triggerRef"
      type="button"
      class="ui-color-picker__trigger ui-input"
      :disabled="props.disabled"
      :aria-label="props.ariaLabel"
      data-ui-motion="ring-focus-soft"
      @click="openState.setValue(!openState.currentValue.value)"
    >
      <span class="ui-color-picker__swatch" :style="previewStyle" aria-hidden="true" />
      <span>{{ props.modelValue ?? hex }}</span>
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
          class="ui-floating ui-color-picker__surface"
          :data-placement="placement"
          :style="floatingSurfaceStyle"
        >
          <div class="ui-color-picker__panel">
            <input v-model="hex" type="color" class="ui-color-picker__native" @input="applyColor" />
            <input
              v-model="hex"
              class="ui-input"
              type="text"
              inputmode="text"
              aria-label="Hex value"
              @change="applyColor"
            />
            <label v-if="props.alpha" class="ui-color-picker__alpha">
              Alpha
              <input
                v-model="alphaValue"
                type="range"
                min="0"
                max="1"
                step="0.01"
                @input="applyColor"
              />
            </label>
            <div class="ui-color-picker__presets">
              <button
                v-for="preset in props.presets"
                :key="preset"
                type="button"
                class="ui-color-picker__preset"
                :style="{ background: preset }"
                :aria-label="`Use ${preset}`"
                @click="
                  hex = preset;
                  applyColor();
                "
              />
            </div>
          </div>

          <div class="ui-color-picker__actions">
            <UiButton size="sm" @click="openState.setValue(false)">Done</UiButton>
          </div>
        </section>
      </Transition>
    </PrimitivePortal>
  </div>
</template>
