<script setup lang="ts">
defineOptions({ name: 'UiDivider' });

const props = withDefaults(
  defineProps<{
    orientation?: 'horizontal' | 'vertical';
  }>(),
  {
    orientation: 'horizontal',
  }
);
</script>

<template>
  <div
    class="ui-divider"
    :class="`ui-divider--${props.orientation}`"
    role="separator"
    :aria-orientation="props.orientation"
  />
</template>
