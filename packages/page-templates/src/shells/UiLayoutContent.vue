<script setup lang="ts">
withDefaults(
  defineProps<{
    padded?: boolean;
  }>(),
  {
    padded: true,
  }
);

defineOptions({ name: 'UiLayoutContent' });
</script>

<template>
  <div class="ui-layout-content" :data-ui-padded="padded">
    <slot />
  </div>
</template>
