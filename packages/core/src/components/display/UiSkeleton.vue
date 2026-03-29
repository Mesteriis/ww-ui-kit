<script setup lang="ts">
import { computed } from 'vue';

defineOptions({ name: 'UiSkeleton' });

const props = withDefaults(
  defineProps<{
    width?: string;
    height?: string;
    shape?: 'rect' | 'rounded' | 'circle';
  }>(),
  {
    shape: 'rounded'
  }
);

const style = computed(() => ({
  '--ui-skeleton-width': props.width ?? '100%',
  '--ui-skeleton-height': props.height ?? '1rem'
}));
</script>

<template>
  <span class="ui-skeleton" :class="`ui-skeleton--${props.shape}`" :style="style" aria-hidden="true" />
</template>
