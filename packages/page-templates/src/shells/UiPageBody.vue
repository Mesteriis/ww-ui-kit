<script setup lang="ts">
withDefaults(
  defineProps<{
    padded?: boolean;
  }>(),
  {
    padded: true,
  }
);

defineOptions({ name: 'UiPageBody' });
</script>

<template>
  <div class="ui-page-body" :data-ui-padded="padded">
    <slot />
  </div>
</template>
