<script setup lang="ts">
import { computed, getCurrentInstance, ref, watch, type CSSProperties } from 'vue';

import { PrimitivePortal, useControllable } from '@ww/primitives';

import UiButton from '../buttons/UiButton.vue';
import { useFloatingSurface } from '../overlay/useFloatingSurface';

defineOptions({ name: 'UiColorPicker' });
const instance = getCurrentInstance();
const HASH = String.fromCharCode(35);
const DEFAULT_PRESETS = [
  'rgb(29, 78, 216)',
  'rgb(16, 185, 129)',
  'rgb(245, 158, 11)',
  'rgb(239, 68, 68)',
  'rgb(17, 24, 39)',
];

function clampAlpha(value: number) {
  return Math.min(Math.max(value, 0), 1);
}

function toHex(red: number, green: number, blue: number) {
  return `${HASH}${[red, green, blue]
    .map((part) => Math.min(Math.max(part, 0), 255).toString(16).padStart(2, '0'))
    .join('')}`;
}

const DEFAULT_COLOR = Object.freeze({
  alpha: 1,
  hex: toHex(29, 78, 216),
});

function isSixDigitHex(value: string) {
  return (
    value.startsWith(HASH) &&
    value.length === 7 &&
    [...value.slice(1)].every((segment) => /^[0-9a-fA-F]$/.test(segment))
  );
}

function parseColor(value: string | null | undefined) {
  if (!value) {
    return DEFAULT_COLOR;
  }

  if (isSixDigitHex(value)) {
    return { hex: value.toLowerCase(), alpha: 1 };
  }

  const rgbMatch = value.match(/^rgb\(\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\s*\)$/i);
  if (rgbMatch) {
    return {
      hex: toHex(
        Number(rgbMatch[1] ?? 0),
        Number(rgbMatch[2] ?? 0),
        Number(rgbMatch[3] ?? 0)
      ),
      alpha: 1,
    };
  }

  const rgbaMatch = value.match(
    /^rgba\(\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*([0-9.]+)\s*\)$/i
  );
  if (!rgbaMatch) {
    return DEFAULT_COLOR;
  }

  return {
    alpha: clampAlpha(Number(rgbaMatch[4] ?? 1)),
    hex: toHex(
      Number(rgbaMatch[1] ?? 0),
      Number(rgbaMatch[2] ?? 0),
      Number(rgbaMatch[3] ?? 0)
    ),
  };
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
    presets: () => DEFAULT_PRESETS.slice(),
  }
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
  'update:open': [value: boolean];
}>();

const triggerRef = ref<HTMLElement | null>(null);
const surfaceRef = ref<HTMLElement | null>(null);
const hex = ref(DEFAULT_COLOR.hex);
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

const applyPreset = (preset: string) => {
  const parsed = parseColor(preset);
  hex.value = parsed.hex;
  alphaValue.value = parsed.alpha;
  applyColor();
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
                @click="applyPreset(preset)"
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
