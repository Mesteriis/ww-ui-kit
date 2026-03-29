import { computed, ref } from 'vue';
import { describe, expect, it, vi } from 'vitest';

import { createDataGridColumn } from '../model/columns';
import { useDataGridA11y } from './useDataGridA11y';
import { useDataGridColumns } from './useDataGridColumns';
import { useDataGridController, type DataGridControllerProps } from './useDataGridController';
import { useDataGridQuery } from './useDataGridQuery';
import { useDataGridSelection } from './useDataGridSelection';
import type { DataGridColumn, DataGridFilterDefinition, DataGridQuery } from '../model/types';

interface DemoRow extends Record<string, unknown> {
  id: string;
  name: string;
  status: string;
}

const rows: readonly DemoRow[] = Object.freeze([
  { id: 'row-1', name: 'Ada', status: 'Healthy' },
  { id: 'row-2', name: 'Bea', status: 'Watch' },
]);

const columns: readonly DataGridColumn<DemoRow>[] = Object.freeze([
  createDataGridColumn<DemoRow>({
    id: 'name',
    header: 'Name',
    accessorKey: 'name',
    sortable: true,
    hideable: false,
  }),
  createDataGridColumn<DemoRow>({
    id: 'status',
    header: 'Status',
    accessorKey: 'status',
    sortable: true,
  }),
]);

const filters: readonly DataGridFilterDefinition[] = Object.freeze([
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    options: [{ label: 'Healthy', value: 'Healthy' }],
  },
]);

const createQuery = (): DataGridQuery => ({
  search: '',
  filters: {},
  sort: [],
  pagination: {
    page: 1,
    pageSize: 10,
  },
  columnVisibility: {},
});

describe('data-grid composables', () => {
  it('updates query through controlled helpers', () => {
    const currentQuery = ref<DataGridQuery>(createQuery());
    const changes: DataGridQuery[] = [];
    const query = useDataGridQuery({
      query: computed(() => currentQuery.value),
      onChange: (nextQuery) => {
        changes.push(nextQuery);
        currentQuery.value = nextQuery;
      },
    });

    query.updateSearch('Ada');
    query.updateFilter('status', 'Healthy');
    query.toggleSort('name');
    query.setPage(2);
    query.setPageSize(25);
    query.setColumnVisibility('status', false);
    query.resetColumnVisibility();

    expect(changes).toHaveLength(7);
    expect(currentQuery.value.search).toBe('Ada');
    expect(currentQuery.value.filters).toEqual({ status: 'Healthy' });
    expect(currentQuery.value.sort).toEqual([{ id: 'name', direction: 'asc' }]);
    expect(currentQuery.value.pagination).toEqual({ page: 1, pageSize: 25 });
    expect(currentQuery.value.columnVisibility).toEqual({});
    expect(query.normalizedQuery.value.search).toBe('Ada');
  });

  it('tracks selection and respects disabled selection mode', () => {
    const selectionState = ref<readonly string[]>(['row-1']);
    const selection = useDataGridSelection({
      rows: computed(() => rows),
      rowId: computed(() => undefined),
      selectedRowIds: computed(() => selectionState.value),
      selectionEnabled: computed(() => true),
      onChange: (nextSelection) => {
        selectionState.value = nextSelection;
      },
    });

    selection.toggleRow('row-2');
    expect(selection.selection.value).toEqual(['row-1', 'row-2']);
    expect(selection.selectedCount.value).toBe(2);
    expect(selection.isSelected('row-2')).toBe(true);
    selection.toggleAllPageRows(false);
    expect(selection.selection.value).toEqual([]);
    selection.toggleAllPageRows(true);
    expect(selection.pageRowIds.value).toEqual(['row-1', 'row-2']);
    selection.clearSelection();
    expect(selection.selection.value).toEqual([]);

    const disabledOnChange = vi.fn();
    const disabled = useDataGridSelection({
      rows: computed(() => rows),
      rowId: computed(() => undefined),
      selectedRowIds: computed(() => ['row-1']),
      selectionEnabled: computed(() => false),
      onChange: disabledOnChange,
    });

    disabled.toggleRow('row-2');
    disabled.toggleAllPageRows(true);
    disabled.clearSelection();
    expect(disabledOnChange).not.toHaveBeenCalled();
  });

  it('normalizes columns and accessibility metadata', () => {
    const normalizedColumns = useDataGridColumns({
      columns: computed(() => columns),
    });
    const a11y = useDataGridA11y({
      ariaLabel: computed(() => 'Accounts grid'),
      caption: computed(() => 'Account operations'),
    });

    expect(normalizedColumns.normalizedColumns.value[1]).toMatchObject({
      hideable: true,
      align: 'start',
    });
    expect(normalizedColumns.hideableColumns.value).toHaveLength(1);
    expect(a11y.ariaLabel.value).toBe('Accounts grid');
    expect(a11y.caption.value).toBe('Account operations');
    expect(a11y.labelledBy.value).toBe(a11y.captionId.value);

    const unlabelledA11y = useDataGridA11y({
      ariaLabel: computed(() => undefined),
      caption: computed(() => undefined),
    });
    expect(unlabelledA11y.labelledBy.value).toBeUndefined();
  });

  it('builds a controller for the public grid contract', () => {
    const props: DataGridControllerProps<DemoRow> = {
      rows,
      columns,
      query: createQuery(),
      totalRows: 2,
      loading: true,
      error: 'Grid error',
      selectedRowIds: ['row-1'],
      filterDefinitions: filters,
      pageSizeOptions: [10, 25],
      searchPlaceholder: 'Search rows',
      emptyText: 'No rows',
      noResultsText: 'No results',
      errorText: 'Grid unavailable',
      ariaLabel: 'Accounts grid',
      caption: 'Account operations',
      density: 'compact',
      stickyHeader: true,
    };
    const events: Array<{ event: string; value: unknown }> = [];
    const controller = useDataGridController(props, (event, value) => {
      events.push({ event, value });
    });

    expect(controller.selectionEnabled.value).toBe(true);
    expect(controller.pageSizeOptions.value).toEqual([10, 25]);
    expect(controller.density.value).toBe('compact');
    expect(controller.stickyHeader.value).toBe(true);
    expect(controller.isError.value).toBe(true);
    expect(controller.isLoading.value).toBe(true);
    expect(controller.errorMessage.value).toBe('Grid error');
    expect(controller.emptyText.value).toBe('No rows');
    expect(controller.noResultsText.value).toBe('No results');
    expect(controller.filterDefinitions.value).toHaveLength(1);
    expect(controller.searchPlaceholder.value).toBe('Search rows');
    expect(controller.derivedState.value.selectedCount).toBe(1);

    controller.query.updateSearch('Ada');
    controller.selection.toggleRow('row-2');

    expect(events.map((entry) => entry.event)).toEqual(['update:query', 'update:selectedRowIds']);
  });

  it('covers controller defaults, non-selectable grids, and boolean error states', () => {
    const props: DataGridControllerProps<DemoRow> = {
      rows,
      columns,
      query: createQuery(),
      totalRows: 0,
      error: true,
    };
    const events: Array<{ event: string; value: unknown }> = [];
    const controller = useDataGridController(props, (event, value) => {
      events.push({ event, value });
    });

    expect(controller.selectionEnabled.value).toBe(false);
    expect(controller.pageSizeOptions.value).toEqual([10, 20, 50]);
    expect(controller.density.value).toBe('comfortable');
    expect(controller.stickyHeader.value).toBe(false);
    expect(controller.isError.value).toBe(true);
    expect(controller.isLoading.value).toBe(false);
    expect(controller.errorMessage.value).toBe('This data grid surface is unavailable.');
    expect(controller.emptyText.value).toBe('No rows available yet.');
    expect(controller.noResultsText.value).toBe('No rows match the current search and filters.');
    expect(controller.filterDefinitions.value).toEqual([]);
    expect(controller.searchPlaceholder.value).toBe('Search rows');
    expect(controller.selection.selection.value).toEqual([]);

    controller.selection.toggleRow('row-1');
    controller.selection.toggleAllPageRows(true);
    controller.selection.clearSelection();

    expect(events).toEqual([]);

    const customError = useDataGridController(
      {
        ...props,
        errorText: 'Custom data grid failure.',
      },
      () => undefined
    );
    expect(customError.errorMessage.value).toBe('Custom data grid failure.');
  });
});
