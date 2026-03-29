<script setup lang="ts">
import { UiBadge, UiButton } from '@ww/core';

defineOptions({ name: 'UiDataGridBulkActions' });

defineProps<{
  selectedCount: number;
}>();

const emit = defineEmits<{
  clear: [];
}>();
</script>

<template>
  <div class="ui-data-grid-bulk-actions">
    <div class="ui-data-grid-bulk-actions__meta">
      <UiBadge variant="brand">{{ selectedCount }} selected</UiBadge>
      <slot :selected-count="selectedCount" />
    </div>
    <UiButton variant="secondary" size="sm" @click="emit('clear')">
      Clear selection
    </UiButton>
  </div>
</template>
