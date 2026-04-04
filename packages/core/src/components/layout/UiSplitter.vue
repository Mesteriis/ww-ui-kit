<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';

defineOptions({ name: 'UiSplitter' });

const props = withDefaults(
  defineProps<{
    modelValue?: [number, number];
    orientation?: 'horizontal' | 'vertical';
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    separatorLabel?: string;
  }>(),
  {
    modelValue: () => [50, 50],
    orientation: 'horizontal',
    min: 20,
    max: 80,
    step: 5,
    disabled: false,
    separatorLabel: 'Resize panels',
  }
);

const emit = defineEmits<{
  'update:modelValue': [value: [number, number]];
}>();

const rootRef = ref<HTMLElement | null>(null);
const dragging = ref(false);

const primarySize = computed(() => {
  const [first] = props.modelValue;
  return Math.min(Math.max(first, props.min), props.max);
});

const rootStyle = computed<Record<string, string>>(() =>
  props.orientation === 'horizontal'
    ? { gridTemplateColumns: `${primarySize.value}% auto minmax(0, 1fr)` }
    : { gridTemplateRows: `${primarySize.value}% auto minmax(0, 1fr)` }
);

const updateSize = (nextPrimarySize: number) => {
  const resolved = Math.min(Math.max(nextPrimarySize, props.min), props.max);
  emit('update:modelValue', [resolved, 100 - resolved]);
};

const resolvePointerRatio = (event: PointerEvent) => {
  if (!rootRef.value) {
    return primarySize.value;
  }

  const rect = rootRef.value.getBoundingClientRect();
  if (props.orientation === 'horizontal') {
    return ((event.clientX - rect.left) / rect.width) * 100;
  }

  return ((event.clientY - rect.top) / rect.height) * 100;
};

const stopDragging = () => {
  dragging.value = false;
  window.removeEventListener('pointermove', handlePointerMove);
  window.removeEventListener('pointerup', stopDragging);
};

const handlePointerMove = (event: PointerEvent) => {
  if (!dragging.value) {
    return;
  }

  updateSize(resolvePointerRatio(event));
};

const startDragging = (event: PointerEvent) => {
  if (props.disabled) {
    return;
  }

  dragging.value = true;
  window.addEventListener('pointermove', handlePointerMove);
  window.addEventListener('pointerup', stopDragging);
  handlePointerMove(event);
};

const onKeydown = (event: KeyboardEvent) => {
  if (props.disabled) {
    return;
  }

  const decreaseKeys = props.orientation === 'horizontal' ? ['ArrowLeft'] : ['ArrowUp'];
  const increaseKeys = props.orientation === 'horizontal' ? ['ArrowRight'] : ['ArrowDown'];

  if (decreaseKeys.includes(event.key)) {
    event.preventDefault();
    updateSize(primarySize.value - props.step);
  } else if (increaseKeys.includes(event.key)) {
    event.preventDefault();
    updateSize(primarySize.value + props.step);
  } else if (event.key === 'Home') {
    event.preventDefault();
    updateSize(props.min);
  } else if (event.key === 'End') {
    event.preventDefault();
    updateSize(props.max);
  }
};

onBeforeUnmount(() => {
  stopDragging();
});
</script>

<template>
  <div
    ref="rootRef"
    class="ui-splitter"
    :class="[`ui-splitter--${props.orientation}`, { 'ui-splitter--dragging': dragging }]"
    :style="rootStyle"
  >
    <section class="ui-splitter__pane">
      <slot name="first" />
    </section>

    <button
      type="button"
      class="ui-splitter__separator"
      :disabled="props.disabled"
      role="separator"
      :aria-orientation="props.orientation"
      :aria-label="props.separatorLabel"
      :aria-valuemin="props.min"
      :aria-valuemax="props.max"
      :aria-valuenow="Math.round(primarySize)"
      data-ui-motion="ring-focus-soft"
      @keydown="onKeydown"
      @pointerdown.prevent="startDragging"
    >
      <span class="ui-splitter__handle" aria-hidden="true" />
    </button>

    <section class="ui-splitter__pane">
      <slot name="second" />
    </section>
  </div>
</template>
