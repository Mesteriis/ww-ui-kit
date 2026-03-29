import { describe, expect, it, vi } from 'vitest';

import {
  createDataGridColumn,
  normalizeDataGridQuery,
  type DataGridColumn,
  type DataGridQuery,
} from '../index';
import {
  getDataGridColumnValue,
  getHideableDataGridColumns,
  getVisibleDataGridColumns,
  isDataGridColumnVisible,
  renderDataGridCellValue,
  resetDataGridColumnVisibility,
  setDataGridColumnVisibility,
  toggleDataGridColumnVisibility,
} from './columns';
import { setDataGridFilter, clearDataGridFilters } from './filters';
import { createDerivedDataGridState } from '../internal/state/derived-grid-state';
import { normalizeDataGridColumns } from '../internal/normalize/normalize-columns';
import { normalizeInternalDataGridQuery } from '../internal/normalize/normalize-query';
import { __resetDataGridRowIdWarnings, resolveDataGridRowId } from '../internal/utils/row-id';
import {
  clearDataGridSelection,
  isDataGridRowSelected,
  normalizeDataGridSelection,
  setDataGridPageSelection,
  toggleDataGridRowSelection,
} from './selection';
import {
  getDataGridPaginationSummary,
  getDataGridPageCount,
  setDataGridPage,
  setDataGridPageSize,
} from './pagination';
import { getDataGridSortDirection, toggleDataGridSort } from './sorting';
import {
  getActiveDataGridFilterCount,
  hasActiveDataGridFilters,
  hasActiveDataGridQuery,
  hasActiveDataGridSearch,
} from './query';

interface DemoRow extends Record<string, unknown> {
  id?: string | number;
  name: string;
  team: string;
  active: boolean;
  score: number;
}

const columns: readonly DataGridColumn<DemoRow>[] = Object.freeze([
  createDataGridColumn<DemoRow>({
    id: 'name',
    header: 'Name',
    accessorKey: 'name',
    sortable: true,
    hideable: false,
  }),
  createDataGridColumn<DemoRow>({
    id: 'team',
    header: 'Team',
    accessorKey: 'team',
    sortable: true,
  }),
  createDataGridColumn<DemoRow>({
    id: 'score',
    header: 'Score',
    accessor: (row) => row.score,
    sortable: true,
    align: 'end',
    cell: ({ value }) => Number(value),
  }),
]);

const rows: readonly DemoRow[] = Object.freeze([
  { id: 'a', name: 'Ada', team: 'North', active: true, score: 12 },
  { id: 'b', name: 'Bea', team: 'South', active: false, score: 4 },
]);

describe('data-grid model', () => {
  it('normalizes query state without mutating inputs', () => {
    const query: Partial<DataGridQuery> = {
      search: ' Ada ',
      filters: {
        team: 'North',
        tags: ['core'],
      },
      sort: [
        { id: 'name', direction: 'asc' },
        { id: '', direction: 'desc' } as unknown as DataGridQuery['sort'][number],
        { id: 'team', direction: 'noop' } as unknown as DataGridQuery['sort'][number],
      ],
      pagination: {
        page: 0.2,
        pageSize: 0.4,
      },
      columnVisibility: {
        team: false,
      },
    };

    const normalized = normalizeDataGridQuery(query);

    expect(normalized).toEqual({
      search: ' Ada ',
      filters: {
        team: 'North',
        tags: ['core'],
      },
      sort: [{ id: 'name', direction: 'asc' }],
      pagination: {
        page: 1,
        pageSize: 1,
      },
      columnVisibility: {
        team: false,
      },
    });
    expect(normalized.filters).not.toBe(query.filters);
    expect(normalized.sort).not.toBe(query.sort);
    expect(normalized.columnVisibility).not.toBe(query.columnVisibility);
    expect(normalizeDataGridQuery(query)).toEqual(normalized);
    expect(
      normalizeDataGridQuery({
        search: 42 as unknown as string,
        filters: {
          enabled: true,
          tags: ['ops'],
        },
        sort: [{ id: 'team', direction: 'desc' }],
        pagination: {
          page: 2.9,
          pageSize: 12.2,
        },
      })
    ).toEqual({
      search: '42',
      filters: {
        enabled: true,
        tags: ['ops'],
      },
      sort: [{ id: 'team', direction: 'desc' }],
      pagination: {
        page: 2,
        pageSize: 12,
      },
    });
    expect(normalizeDataGridQuery({})).toEqual({
      search: '',
      filters: {},
      sort: [],
      pagination: {
        page: 1,
        pageSize: 10,
      },
    });
    expect(normalizeInternalDataGridQuery(query)).toEqual(normalized);
  });

  it('tracks active query state and filter counts', () => {
    const empty = normalizeDataGridQuery({
      search: '',
      filters: {},
      sort: [],
      pagination: { page: 1, pageSize: 10 },
    });
    const active = normalizeDataGridQuery({
      search: 'Ada',
      filters: { team: 'North' },
      sort: [{ id: 'name', direction: 'desc' }],
      pagination: { page: 1, pageSize: 10 },
    });

    expect(hasActiveDataGridSearch(empty)).toBe(false);
    expect(hasActiveDataGridFilters(empty)).toBe(false);
    expect(getActiveDataGridFilterCount(empty)).toBe(0);
    expect(hasActiveDataGridQuery(empty)).toBe(false);

    expect(hasActiveDataGridSearch(active)).toBe(true);
    expect(hasActiveDataGridFilters(active)).toBe(true);
    expect(getActiveDataGridFilterCount(active)).toBe(1);
    expect(hasActiveDataGridQuery(active)).toBe(true);
  });

  it('updates filters predictably and clears empty values', () => {
    const base = normalizeDataGridQuery({
      search: '',
      filters: {},
      sort: [],
      pagination: { page: 2, pageSize: 10 },
    });

    const textFilter = setDataGridFilter(base, 'team', 'North');
    const booleanFilter = setDataGridFilter(base, 'active', false);
    const multiFilter = setDataGridFilter(base, 'tags', ['core', 'ops']);
    const clearedText = setDataGridFilter(textFilter, 'team', '');
    const clearedBoolean = setDataGridFilter(booleanFilter, 'active', undefined);
    const clearedArray = setDataGridFilter(multiFilter, 'tags', []);

    expect(textFilter.filters).toEqual({ team: 'North' });
    expect(booleanFilter.filters).toEqual({ active: false });
    expect(multiFilter.filters).toEqual({ tags: ['core', 'ops'] });
    expect(textFilter.pagination.page).toBe(1);
    expect(clearedText.filters).toEqual({});
    expect(clearedBoolean.filters).toEqual({});
    expect(clearedArray.filters).toEqual({});
    expect(clearDataGridFilters(textFilter).filters).toEqual({});
  });

  it('toggles sort state in asc, desc, and reset order', () => {
    const base = normalizeDataGridQuery({
      search: '',
      filters: {},
      sort: [],
      pagination: { page: 3, pageSize: 10 },
    });

    const asc = toggleDataGridSort(base, 'name');
    const desc = toggleDataGridSort(asc, 'name');
    const cleared = toggleDataGridSort(desc, 'name');

    expect(getDataGridSortDirection(base, 'name')).toBeNull();
    expect(getDataGridSortDirection(asc, 'name')).toBe('asc');
    expect(getDataGridSortDirection(desc, 'name')).toBe('desc');
    expect(cleared.sort).toEqual([]);
    expect(asc.pagination.page).toBe(1);
  });

  it('updates pagination and computes summaries', () => {
    const base = normalizeDataGridQuery({
      search: '',
      filters: {},
      sort: [],
      pagination: { page: 1, pageSize: 10 },
    });

    expect(getDataGridPageCount(0, 10)).toBe(1);
    expect(getDataGridPageCount(42, 10)).toBe(5);
    expect(setDataGridPage(base, 4).pagination.page).toBe(4);
    expect(setDataGridPage(base, 0).pagination.page).toBe(1);
    expect(setDataGridPageSize(base, 25).pagination).toEqual({ page: 1, pageSize: 25 });
    expect(getDataGridPaginationSummary({ page: 1, pageSize: 10 }, 0)).toEqual({
      start: 0,
      end: 0,
    });
    expect(getDataGridPaginationSummary({ page: 2, pageSize: 10 }, 42)).toEqual({
      start: 11,
      end: 20,
    });
  });

  it('normalizes selection and page selection flows', () => {
    const normalized = normalizeDataGridSelection(['a', 'b']);
    expect(normalizeDataGridSelection(undefined)).toEqual([]);
    expect(normalized).toEqual(['a', 'b']);
    expect(isDataGridRowSelected(normalized, 'a')).toBe(true);
    expect(toggleDataGridRowSelection(normalized, 'c')).toEqual(['a', 'b', 'c']);
    expect(toggleDataGridRowSelection(normalized, 'a')).toEqual(['b']);
    expect(setDataGridPageSelection(normalized, ['b', 'c'], true)).toEqual(['a', 'b', 'c']);
    expect(setDataGridPageSelection(normalized, ['a'], false)).toEqual(['b']);
    expect(clearDataGridSelection()).toEqual([]);
  });

  it('normalizes columns and column visibility contracts', () => {
    const normalized = normalizeDataGridColumns(columns);
    const baseQuery = normalizeDataGridQuery({
      search: '',
      filters: {},
      sort: [],
      pagination: { page: 1, pageSize: 10 },
      columnVisibility: { team: false },
    });

    expect(normalized[1]).toMatchObject({ sortable: true, hideable: true, align: 'start' });
    expect(isDataGridColumnVisible(normalized[0], baseQuery)).toBe(true);
    expect(isDataGridColumnVisible(normalized[1], baseQuery)).toBe(false);
    expect(getHideableDataGridColumns(normalized)).toHaveLength(2);
    expect(getVisibleDataGridColumns(normalized, baseQuery).map((column) => column.id)).toEqual([
      'name',
      'score',
    ]);
    expect(setDataGridColumnVisibility(baseQuery, 'team', true).columnVisibility).toEqual({
      team: true,
    });
    expect(
      setDataGridColumnVisibility(
        normalizeDataGridQuery({
          search: '',
          filters: {},
          sort: [],
          pagination: { page: 1, pageSize: 10 },
        }),
        'team',
        false
      ).columnVisibility
    ).toEqual({
      team: false,
    });
    expect(toggleDataGridColumnVisibility(baseQuery, 'team').columnVisibility).toEqual({
      team: true,
    });
    expect(resetDataGridColumnVisibility(baseQuery).columnVisibility).toEqual({});
  });

  it('resolves column values and default cell rendering', () => {
    const nameColumn = columns[0];
    const scoreColumn = columns[2];
    const row = rows[0];

    expect(createDataGridColumn(nameColumn)).toBe(nameColumn);
    expect(getDataGridColumnValue(row, nameColumn)).toBe('Ada');
    expect(getDataGridColumnValue(row, scoreColumn)).toBe(12);
    expect(getDataGridColumnValue(row, { id: 'empty', header: 'Empty' })).toBeUndefined();
    expect(
      renderDataGridCellValue({
        row,
        rowId: 'a',
        rowIndex: 0,
        column: scoreColumn,
        value: 12,
        selected: false,
      })
    ).toBe(12);
    expect(
      renderDataGridCellValue({
        row,
        rowId: 'a',
        rowIndex: 0,
        column: { id: 'active', header: 'Active' },
        value: true,
        selected: false,
      })
    ).toBe('Yes');
    expect(
      renderDataGridCellValue({
        row,
        rowId: 'a',
        rowIndex: 0,
        column: { id: 'inactive', header: 'Inactive' },
        value: false,
        selected: false,
      })
    ).toBe('No');
    expect(
      renderDataGridCellValue({
        row,
        rowId: 'a',
        rowIndex: 0,
        column: { id: 'created', header: 'Created' },
        value: new Date('2026-01-01T00:00:00.000Z'),
        selected: false,
      })
    ).toBe('2026-01-01T00:00:00.000Z');
    expect(
      renderDataGridCellValue({
        row,
        rowId: 'a',
        rowIndex: 0,
        column: { id: 'blank', header: 'Blank' },
        value: '',
        selected: false,
      })
    ).toBe('—');
    expect(
      renderDataGridCellValue({
        row,
        rowId: 'a',
        rowIndex: 0,
        column: { id: 'text', header: 'Text' },
        value: 'Value',
        selected: false,
      })
    ).toBe('Value');
    expect(
      renderDataGridCellValue({
        row,
        rowId: 'a',
        rowIndex: 0,
        column: { id: 'bigint', header: 'BigInt' },
        value: 42n,
        selected: false,
      })
    ).toBe('42');
    expect(
      renderDataGridCellValue({
        row,
        rowId: 'a',
        rowIndex: 0,
        column: { id: 'symbol', header: 'Symbol' },
        value: Symbol('focus'),
        selected: false,
      })
    ).toBe('Symbol(focus)');
    expect(
      renderDataGridCellValue({
        row,
        rowId: 'a',
        rowIndex: 0,
        column: { id: 'anonymous-symbol', header: 'Anonymous symbol' },
        value: Symbol(),
        selected: false,
      })
    ).toBe('Symbol()');
    expect(
      renderDataGridCellValue({
        row,
        rowId: 'a',
        rowIndex: 0,
        column: { id: 'object', header: 'Object' },
        value: { name: 'Ada' },
        selected: false,
      })
    ).toBe('{"name":"Ada"}');
    const circular: Record<string, unknown> = {};
    circular.self = circular;
    expect(
      renderDataGridCellValue({
        row,
        rowId: 'a',
        rowIndex: 0,
        column: { id: 'circular', header: 'Circular' },
        value: circular,
        selected: false,
      })
    ).toBe('[object Object]');
    expect(
      renderDataGridCellValue({
        row,
        rowId: 'a',
        rowIndex: 0,
        column: { id: 'function', header: 'Function' },
        value: () => 'noop',
        selected: false,
      })
    ).toBe('[object Function]');
  });

  it('derives visible grid state for empty, no-results, and selected pages', () => {
    const normalizedColumns = normalizeDataGridColumns(columns);
    const baseQuery = normalizeDataGridQuery({
      search: '',
      filters: {},
      sort: [],
      pagination: { page: 1, pageSize: 10 },
      columnVisibility: { team: false },
    });
    const emptyState = createDerivedDataGridState({
      rows: [],
      columns: normalizedColumns,
      query: baseQuery,
      totalRows: 0,
      selectionEnabled: false,
      selectedRowIds: undefined,
      pageRowIds: [],
    });
    const noResultsState = createDerivedDataGridState({
      rows: [],
      columns: normalizedColumns,
      query: normalizeDataGridQuery({
        ...baseQuery,
        search: 'Ada',
      }),
      totalRows: 0,
      selectionEnabled: true,
      selectedRowIds: ['a'],
      pageRowIds: ['a', 'b'],
    });
    const selectedState = createDerivedDataGridState({
      rows,
      columns: normalizedColumns,
      query: baseQuery,
      totalRows: rows.length,
      selectionEnabled: true,
      selectedRowIds: ['a'],
      pageRowIds: ['a', 'b'],
    });

    expect(emptyState.isEmpty).toBe(true);
    expect(emptyState.isNoResults).toBe(false);
    expect(noResultsState.isNoResults).toBe(true);
    expect(noResultsState.isEmpty).toBe(false);
    expect(selectedState.activeFilterCount).toBe(0);
    expect(selectedState.pageCount).toBe(1);
    expect(selectedState.paginationSummary).toEqual({ start: 1, end: 2 });
    expect(selectedState.selectedCount).toBe(1);
    expect(selectedState.allPageRowsSelected).toBe(false);
    expect(selectedState.somePageRowsSelected).toBe(true);
    expect(selectedState.visibleColumns.map((column) => column.id)).toEqual(['name', 'score']);
  });

  it('resolves row ids through accessors and warns once on index fallback', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    expect(resolveDataGridRowId(rows[0], 0, (row) => `fn-${row.name}`)).toBe('fn-Ada');
    expect(resolveDataGridRowId(rows[0], 0, 'name')).toBe('Ada');
    expect(resolveDataGridRowId(rows[0], 0, undefined)).toBe('a');
    expect(
      resolveDataGridRowId(
        { id: 42, name: 'Id', team: 'Core', active: true, score: 1 },
        0,
        undefined
      )
    ).toBe('42');
    expect(
      resolveDataGridRowId(
        { name: 'Fallback', team: 'Core', active: true, score: 1 },
        3,
        undefined,
        'scope-a'
      )
    ).toBe('3');
    expect(
      resolveDataGridRowId(
        { name: 'Fallback', team: 'Core', active: true, score: 1 },
        4,
        undefined,
        'scope-a'
      )
    ).toBe('4');
    expect(warn).toHaveBeenCalledTimes(1);

    __resetDataGridRowIdWarnings();
    resolveDataGridRowId(
      { name: 'Fallback', team: 'Core', active: true, score: 1 },
      5,
      undefined,
      'scope-a'
    );
    expect(warn).toHaveBeenCalledTimes(2);

    const originalConsole = globalThis.console;
    // @ts-expect-error coverage branch for non-browser-like runtimes
    globalThis.console = undefined;
    expect(
      resolveDataGridRowId(
        { name: 'NoConsole', team: 'Core', active: true, score: 1 },
        6,
        undefined,
        'scope-b'
      )
    ).toBe('6');
    globalThis.console = originalConsole;
  });
});
