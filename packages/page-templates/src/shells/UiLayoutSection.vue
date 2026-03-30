<script setup lang="ts">
defineOptions({ name: 'UiLayoutSection' });

withDefaults(
  defineProps<{
    title?: string;
    description?: string;
  }>(),
  {}
);
</script>

<template>
  <section class="ui-layout-section">
    <div v-if="title || description" class="ui-layout-section__header">
      <h3 v-if="title" class="ui-layout-section__title">{{ title }}</h3>
      <p v-if="description" class="ui-layout-section__description">{{ description }}</p>
    </div>
    <div class="ui-layout-section__body">
      <slot />
    </div>
  </section>
</template>
