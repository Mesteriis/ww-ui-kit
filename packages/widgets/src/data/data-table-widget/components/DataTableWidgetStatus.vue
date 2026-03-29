<script setup lang="ts">
import { UiBadge } from '@ww/core';

import type { DataTableWidgetStatusSummary } from '../types';

defineOptions({ name: 'DataTableWidgetStatus' });

defineProps<DataTableWidgetStatusSummary>();
</script>

<template>
  <div class="data-table-widget__status" role="status" aria-live="polite">
    <p class="data-table-widget__status-copy">
      Page {{ page }} / {{ pageCount }} · {{ pageSize }} per page
    </p>
    <div class="data-table-widget__status-badges">
      <UiBadge>Rows: {{ totalRows }}</UiBadge>
      <UiBadge v-if="selectedCount > 0" variant="brand">{{ selectedCount }} selected</UiBadge>
      <UiBadge v-if="activeFilterCount > 0">Filters: {{ activeFilterCount }}</UiBadge>
      <UiBadge v-if="hasSearch">Search active</UiBadge>
    </div>
  </div>
</template>
