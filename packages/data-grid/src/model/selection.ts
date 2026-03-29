import type { DataGridRowId, DataGridSelectionState } from './types';

export function normalizeDataGridSelection(selection: readonly DataGridRowId[] | undefined): DataGridSelectionState {
  return Object.freeze([...(selection ?? [])]);
}

export function isDataGridRowSelected(selection: DataGridSelectionState, rowId: DataGridRowId): boolean {
  return selection.includes(rowId);
}

export function toggleDataGridRowSelection(
  selection: DataGridSelectionState,
  rowId: DataGridRowId
): DataGridSelectionState {
  return isDataGridRowSelected(selection, rowId)
    ? Object.freeze(selection.filter((candidate) => candidate !== rowId))
    : Object.freeze([...selection, rowId]);
}

export function setDataGridPageSelection(
  selection: DataGridSelectionState,
  pageRowIds: readonly DataGridRowId[],
  checked: boolean
): DataGridSelectionState {
  if (checked) {
    const nextSelection = [...selection];
    for (const rowId of pageRowIds) {
      if (!nextSelection.includes(rowId)) {
        nextSelection.push(rowId);
      }
    }

    return Object.freeze(nextSelection);
  }

  return Object.freeze(selection.filter((rowId) => !pageRowIds.includes(rowId)));
}

export function clearDataGridSelection(): DataGridSelectionState {
  return Object.freeze([]);
}
