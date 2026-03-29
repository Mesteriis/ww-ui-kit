<script setup lang="ts">
defineOptions({ name: 'UiPageSection' });

withDefaults(
  defineProps<{
    title?: string;
    description?: string;
  }>(),
  {}
);
</script>

<template>
  <section class="ui-page-section">
    <div v-if="title || description" class="ui-page-section__header">
      <h3 v-if="title" class="ui-page-section__title">{{ title }}</h3>
      <p v-if="description" class="ui-page-section__description">{{ description }}</p>
    </div>
    <div class="ui-page-section__body">
      <slot />
    </div>
  </section>
</template>
