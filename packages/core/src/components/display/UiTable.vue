<script setup lang="ts">
import { computed } from 'vue';

defineOptions({ name: 'UiTable' });

type UiTableSize = 'sm' | 'md' | 'lg';

interface UiTableColumn {
  key: string;
  header: string;
  field?: string;
  align?: 'start' | 'center' | 'end';
  width?: number | string;
}

const props = withDefaults(
  defineProps<{
    columns: UiTableColumn[];
    data: Record<string, unknown>[];
    size?: UiTableSize;
    bordered?: boolean;
    striped?: boolean;
    stickyHeader?: boolean;
    maxHeight?: number | string | undefined;
    caption?: string | undefined;
    ariaLabel?: string | undefined;
    emptyText?: string;
  }>(),
  {
    bordered: false,
    emptyText: 'No rows to display.',
    size: 'md',
    stickyHeader: false,
    striped: false,
  }
);

const hasRows = computed(() => props.data.length > 0);
const scrollLabel = computed(() => props.ariaLabel ?? props.caption ?? 'Data table');
const scrollStyle = computed<Record<string, string> | undefined>(() => {
  if (props.maxHeight === undefined || props.maxHeight === null) {
    return undefined;
  }

  return {
    maxHeight: typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight,
  };
});
const isScrollable = computed(() => scrollStyle.value !== undefined);

const resolveCellValue = (row: Record<string, unknown>, column: UiTableColumn) =>
  column.field ? row[column.field] : row[column.key];

const resolveColumnWidth = (width: number | string | undefined) => {
  if (width === undefined) {
    return undefined;
  }

  return typeof width === 'number' ? `${width}px` : width;
};
</script>

<template>
  <div
    class="ui-table"
    :class="[
      `ui-table--${props.size}`,
      {
        'ui-table--bordered': props.bordered,
        'ui-table--striped': props.striped,
        'ui-table--sticky': props.stickyHeader,
      },
    ]"
  >
    <div
      class="ui-table__scroll"
      :style="scrollStyle"
      :role="isScrollable ? 'region' : undefined"
      :tabindex="isScrollable ? 0 : undefined"
      :aria-label="isScrollable ? scrollLabel : undefined"
    >
      <table class="ui-table__element">
        <caption v-if="props.caption" class="ui-table__caption">
          {{
            props.caption
          }}
        </caption>
        <thead>
          <tr>
            <th
              v-for="column in props.columns"
              :key="column.key"
              scope="col"
              :style="
                resolveColumnWidth(column.width)
                  ? { width: resolveColumnWidth(column.width) }
                  : undefined
              "
              :data-align="column.align ?? 'start'"
            >
              {{ column.header }}
            </th>
          </tr>
        </thead>
        <tbody v-if="hasRows">
          <tr v-for="(row, rowIndex) in props.data" :key="rowIndex">
            <td
              v-for="column in props.columns"
              :key="column.key"
              :data-align="column.align ?? 'start'"
            >
              <slot
                name="cell"
                :column="column"
                :row="row"
                :row-index="rowIndex"
                :value="resolveCellValue(row, column)"
              >
                {{ resolveCellValue(row, column) }}
              </slot>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td :colspan="props.columns.length" class="ui-table__empty">
              <slot name="empty">
                {{ props.emptyText }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
