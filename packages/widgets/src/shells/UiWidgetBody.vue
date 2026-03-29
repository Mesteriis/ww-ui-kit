<script setup lang="ts">
withDefaults(
  defineProps<{
    padded?: boolean;
  }>(),
  {
    padded: true
  }
);

defineOptions({ name: 'UiWidgetBody' });
</script>

<template>
  <div class="ui-widget-body" :data-ui-padded="padded">
    <slot />
  </div>
</template>
