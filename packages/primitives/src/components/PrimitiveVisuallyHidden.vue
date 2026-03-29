<script setup lang="ts">
defineOptions({ name: 'PrimitiveVisuallyHidden' });
</script>

<template>
  <span class="primitive-visually-hidden">
    <slot />
  </span>
</template>

<style scoped>
.primitive-visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
