<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

import { getTargetClientRect, resolveScrollTarget, type UiScrollTarget } from '../shared/scroll';

defineOptions({ name: 'UiAffix' });

const props = withDefaults(
  defineProps<{
    offsetTop?: number;
    offsetBottom?: number;
    target?: UiScrollTarget;
    disabled?: boolean;
  }>(),
  {
    disabled: false,
    offsetTop: 0,
  }
);

const emit = defineEmits<{
  'update:stuck': [value: boolean];
  'stuck-change': [value: boolean];
}>();

const rootRef = ref<HTMLElement | null>(null);
const stuck = ref(false);

let detachListeners: (() => void) | null = null;

const affixStyle = computed<Record<string, string> | undefined>(() => {
  if (props.disabled) {
    return undefined;
  }

  if (props.offsetBottom !== undefined) {
    return {
      bottom: `${props.offsetBottom}px`,
    };
  }

  return {
    top: `${props.offsetTop}px`,
  };
});

const setStuck = (nextValue: boolean) => {
  if (stuck.value === nextValue) {
    return;
  }

  stuck.value = nextValue;
  emit('update:stuck', nextValue);
  emit('stuck-change', nextValue);
};

const updateStuck = () => {
  if (props.disabled || !rootRef.value) {
    setStuck(false);
    return;
  }

  const target = resolveScrollTarget(props.target);
  const boundary = getTargetClientRect(target);

  if (!boundary) {
    setStuck(false);
    return;
  }

  const rect = rootRef.value.getBoundingClientRect();

  if (props.offsetBottom !== undefined) {
    setStuck(rect.bottom >= boundary.bottom - props.offsetBottom - 0.5);
    return;
  }

  setStuck(rect.top <= boundary.top + props.offsetTop + 0.5);
};

const bindListeners = () => {
  detachListeners?.();

  const target = resolveScrollTarget(props.target);
  if (!target) {
    return;
  }

  const scrollHost = target === window ? window : target;
  const options = { passive: true } as const;

  scrollHost.addEventListener('scroll', updateStuck, options);
  window.addEventListener('resize', updateStuck, options);

  detachListeners = () => {
    scrollHost.removeEventListener('scroll', updateStuck);
    window.removeEventListener('resize', updateStuck);
  };

  updateStuck();
};

watch(
  () => [props.target, props.offsetTop, props.offsetBottom, props.disabled] as const,
  bindListeners
);

onMounted(bindListeners);

onBeforeUnmount(() => {
  detachListeners?.();
});
</script>

<template>
  <div
    ref="rootRef"
    class="ui-affix"
    :class="{
      'is-stuck': stuck,
      'ui-affix--bottom': props.offsetBottom !== undefined,
      'ui-affix--disabled': props.disabled,
    }"
    :style="affixStyle"
    :data-stuck="stuck || undefined"
  >
    <slot :stuck="stuck" />
  </div>
</template>
