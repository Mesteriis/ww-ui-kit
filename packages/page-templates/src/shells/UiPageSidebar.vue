<script setup lang="ts">
withDefaults(
  defineProps<{
    padded?: boolean;
  }>(),
  {
    padded: true
  }
);

defineOptions({ name: 'UiPageSidebar' });
</script>

<template>
  <aside class="ui-page-sidebar" :data-ui-padded="padded">
    <slot />
  </aside>
</template>
