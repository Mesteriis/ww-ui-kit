<script setup lang="ts">
withDefaults(
  defineProps<{
    padded?: boolean;
  }>(),
  {
    padded: true,
  }
);

defineOptions({ name: 'UiLayoutSider' });
</script>

<template>
  <aside class="ui-layout-sider" :data-ui-padded="padded">
    <slot />
  </aside>
</template>
