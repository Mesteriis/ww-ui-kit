<script setup lang="ts">
import { computed, useSlots } from 'vue';

defineOptions({ name: 'UiIcon' });

const ICON_PATHS = {
  calendar: ['M7 2v2', 'M17 2v2', 'M3 8h18', 'M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z'],
  check: ['M5 12.5 9 16.5 19 6.5'],
  chevronDown: ['M6 9l6 6 6-6'],
  chevronLeft: ['M15 6 9 12 15 18'],
  chevronRight: ['M9 6 15 12 9 18'],
  chevronUp: ['m6 15 6-6 6 6'],
  close: ['M6 6l12 12', 'M18 6 6 18'],
  copy: ['M9 9h9v11H9z', 'M6 15H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v1'],
  eye: ['M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z', 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z'],
  eyeOff: [
    'M3 3l18 18',
    'M10.6 10.6A3 3 0 0 0 13.4 13.4',
    'M9.9 5.1A10.3 10.3 0 0 1 12 5c6 0 10 7 10 7a18.7 18.7 0 0 1-3.4 4.4',
    'M6.2 6.2A18.5 18.5 0 0 0 2 12s4 7 10 7a9.7 9.7 0 0 0 4.1-.9',
  ],
  image: ['M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z', 'm3 16 5-5 4 4 3-3 5 5', 'M9 9h.01'],
  info: ['M12 17v-5', 'M12 7h.01', 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z'],
  minus: ['M5 12h14'],
  plus: ['M12 5v14', 'M5 12h14'],
  rotateCw: ['M21 12a9 9 0 1 1-2.64-6.36', 'M21 3v6h-6'],
  search: ['m21 21-4.35-4.35', 'M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z'],
  upload: ['M12 16V4', 'm7 9 5-5 5 5', 'M4 20h16'],
  warning: ['M12 9v4', 'M12 17h.01', 'M10.3 3.86 1.82 18a2 2 0 0 0 1.72 3h16.36A2 2 0 0 0 21.6 18L13.12 3.86a2 2 0 0 0-3.46 0Z'],
  zoomIn: ['M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z', 'M21 21l-4.35-4.35', 'M10.5 7.5v6', 'M7.5 10.5h6'],
  zoomOut: ['M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z', 'M21 21l-4.35-4.35', 'M7.5 10.5h6'],
} as const;

export type UiIconName = keyof typeof ICON_PATHS;

const props = withDefaults(
  defineProps<{
    name?: UiIconName;
    label?: string;
    decorative?: boolean;
    size?: 'sm' | 'md' | 'lg' | number;
    strokeWidth?: number;
  }>(),
  {
    decorative: true,
    size: 'md',
    strokeWidth: 1.8,
  }
);

const slots = useSlots();
const hasCustomContent = computed(() => Boolean(slots.default));
const iconPaths = computed(() => (props.name ? ICON_PATHS[props.name] : []));
const isDecorative = computed(() => (props.label ? false : props.decorative));
const rootStyle = computed<Record<string, string> | undefined>(() =>
  typeof props.size === 'number' ? { '--ui-icon-size': `${props.size}px` } : undefined
);
</script>

<template>
  <span
    class="ui-icon"
    :class="[`ui-icon--${typeof props.size === 'number' ? 'custom' : props.size}`]"
    :style="rootStyle"
    :aria-hidden="isDecorative || undefined"
    :aria-label="!isDecorative ? props.label : undefined"
    role="img"
  >
    <svg
      v-if="props.name"
      class="ui-icon__svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      :stroke-width="props.strokeWidth"
      focusable="false"
    >
      <path v-for="path in iconPaths" :key="path" :d="path" />
    </svg>
    <span v-else-if="hasCustomContent" class="ui-icon__slot">
      <slot />
    </span>
  </span>
</template>
