import { computed, toValue, type MaybeRefOrGetter } from 'vue';

import {
  clearDataGridSelection,
  isDataGridRowSelected,
  normalizeDataGridSelection,
  setDataGridPageSelection,
  toggleDataGridRowSelection,
} from '../model/selection';
import { resolveDataGridRowId } from '../internal/utils/row-id';
import type { DataGridRowId, DataGridRowIdAccessor, DataGridSelectionState } from '../model/types';

interface DataGridSelectionOptions<TRow extends Record<string, unknown>> {
  rows: MaybeRefOrGetter<readonly TRow[]>;
  rowId: MaybeRefOrGetter<DataGridRowIdAccessor<TRow> | undefined>;
  selectedRowIds: MaybeRefOrGetter<readonly DataGridRowId[] | undefined>;
  selectionEnabled: MaybeRefOrGetter<boolean>;
  onChange: (nextSelection: DataGridSelectionState) => void;
}

export function useDataGridSelection<TRow extends Record<string, unknown>>(
  options: DataGridSelectionOptions<TRow>
) {
  const pageRowIds = computed(() =>
    toValue(options.rows).map((row, rowIndex) =>
      resolveDataGridRowId(row, rowIndex, toValue(options.rowId), 'data-grid')
    )
  );
  const selection = computed(() =>
    normalizeDataGridSelection(
      toValue(options.selectionEnabled) ? toValue(options.selectedRowIds) : []
    )
  );

  return {
    pageRowIds,
    selection,
    selectedCount: computed(() => selection.value.length),
    isSelected(rowId: DataGridRowId) {
      return isDataGridRowSelected(selection.value, rowId);
    },
    toggleRow(rowId: DataGridRowId) {
      if (!toValue(options.selectionEnabled)) {
        return;
      }

      options.onChange(toggleDataGridRowSelection(selection.value, rowId));
    },
    toggleAllPageRows(checked: boolean) {
      if (!toValue(options.selectionEnabled)) {
        return;
      }

      options.onChange(setDataGridPageSelection(selection.value, pageRowIds.value, checked));
    },
    clearSelection() {
      if (!toValue(options.selectionEnabled)) {
        return;
      }

      options.onChange(clearDataGridSelection());
    },
  };
}
