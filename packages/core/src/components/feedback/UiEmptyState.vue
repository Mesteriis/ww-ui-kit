<script setup lang="ts">
defineOptions({ name: 'UiEmptyState' });

defineProps<{
  title: string;
  description?: string;
}>();
</script>

<template>
  <section class="ui-empty-state">
    <div v-if="$slots.icon" class="ui-empty-state__icon">
      <slot name="icon" />
    </div>
    <div class="ui-empty-state__content">
      <h2 class="ui-empty-state__title">
        {{ title }}
      </h2>
      <p v-if="description" class="ui-empty-state__description">
        {{ description }}
      </p>
    </div>
    <div v-if="$slots.actions" class="ui-empty-state__actions">
      <slot name="actions" />
    </div>
  </section>
</template>
