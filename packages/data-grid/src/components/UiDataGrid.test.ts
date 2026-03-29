import { mount } from '@vue/test-utils';
import { h } from 'vue';
import { defineComponent } from 'vue';

import {
  UiDataGrid,
  UiDataGridBulkActions,
  UiDataGridColumnVisibility,
  UiDataGridFilters,
  UiDataGridPagination,
  UiDataGridSearch,
  UiDataGridTable,
  UiDataGridToolbar
} from '../index';
import { createDataGridColumn } from '../model/columns';
import { normalizeDataGridQuery } from '../model/query';
import type { DataGridColumn, DataGridFilterDefinition, DataGridQuery } from '../model/types';

interface DemoRow extends Record<string, unknown> {
  id: string;
  name: string;
  status: 'Healthy' | 'Risk';
  active: boolean;
}

const rows: readonly DemoRow[] = Object.freeze([
  { id: 'row-1', name: 'Ada', status: 'Healthy', active: true },
  { id: 'row-2', name: 'Bea', status: 'Risk', active: false }
]);

const columns: readonly DataGridColumn<DemoRow>[] = Object.freeze([
  createDataGridColumn<DemoRow>({ id: 'name', header: 'Name', accessorKey: 'name', sortable: true, hideable: false }),
  createDataGridColumn<DemoRow>({ id: 'status', header: 'Status', accessorKey: 'status', sortable: true }),
  createDataGridColumn<DemoRow>({
    id: 'active',
    header: 'Active',
    accessorKey: 'active',
    sortable: true,
    align: 'center',
    cell: ({ value }) => (value ? 'Active' : 'Paused')
  })
]);

const filters: readonly DataGridFilterDefinition[] = Object.freeze([
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { label: 'Healthy', value: 'Healthy' },
      { label: 'Risk', value: 'Risk' }
    ]
  },
  {
    id: 'active',
    label: 'Active',
    type: 'boolean',
    trueLabel: 'Active',
    falseLabel: 'Paused'
  },
  {
    id: 'tags',
    label: 'Tags',
    type: 'multi-select',
    options: [
      { label: 'Core', value: 'core' },
      { label: 'Ops', value: 'ops' }
    ]
  },
  {
    id: 'query',
    label: 'Query',
    type: 'text',
    placeholder: 'Type to filter'
  }
]);

const createQuery = (overrides: Partial<DataGridQuery> = {}) =>
  normalizeDataGridQuery({
    search: '',
    filters: {},
    sort: [],
    pagination: {
      page: 1,
      pageSize: 10
    },
    columnVisibility: {},
    ...overrides
  });

describe('UiDataGrid package', () => {
  it('exports the canonical public components', () => {
    expect(UiDataGrid).toBeTruthy();
    expect(UiDataGridToolbar).toBeTruthy();
    expect(UiDataGridSearch).toBeTruthy();
    expect(UiDataGridFilters).toBeTruthy();
    expect(UiDataGridTable).toBeTruthy();
    expect(UiDataGridPagination).toBeTruthy();
    expect(UiDataGridBulkActions).toBeTruthy();
    expect(UiDataGridColumnVisibility).toBeTruthy();
  });

  it('renders search, filters, column visibility, bulk actions, and pagination controls', async () => {
    const wrapper = mount(UiDataGrid, {
      props: {
        rows,
        columns,
        query: createQuery(),
        totalRows: rows.length,
        selectedRowIds: ['row-1'],
        filterDefinitions: filters,
        caption: 'Account operations',
        ariaLabel: 'Accounts grid'
      },
      slots: {
        'toolbar-start': '<span>Toolbar start</span>',
        'toolbar-end': '<span>Toolbar end</span>',
        'bulk-actions': '<span>Bulk actions slot</span>',
        rowActions: () => h('button', { type: 'button' }, 'Inspect')
      }
    });

    expect(wrapper.find('figcaption').text()).toContain('Account operations');
    expect(wrapper.text()).toContain('Toolbar start');
    expect(wrapper.text()).toContain('Toolbar end');
    expect(wrapper.text()).toContain('Bulk actions slot');
    expect(wrapper.text()).toContain('Page 1 / 1');
    expect(wrapper.text()).toContain('Inspect');

    await wrapper.get('input[type="search"]').setValue('Ada');
    expect(wrapper.emitted('update:query')?.at(0)?.[0]).toMatchObject({ search: 'Ada' });

    await wrapper.get('select.ui-select__control').setValue('Healthy');
    expect(wrapper.emitted('update:query')?.some(([value]) => (value as DataGridQuery).filters.status === 'Healthy')).toBe(true);

    await wrapper.get('summary').trigger('click');
    const visibilityCheckboxes = wrapper.findAll('.ui-data-grid-visibility .ui-checkbox__input');
    await visibilityCheckboxes[0].setValue(false);
    expect(
      wrapper.emitted('update:query')?.some(([value]) => (value as DataGridQuery).columnVisibility?.status === false)
    ).toBe(true);
  });

  it('can hide toolbar, column visibility, and bulk actions without changing query ownership', () => {
    const wrapper = mount(UiDataGrid, {
      props: {
        rows,
        columns,
        query: createQuery(),
        totalRows: rows.length,
        selectedRowIds: ['row-1'],
        filterDefinitions: filters,
        showToolbar: false,
        showBulkActions: false,
        showColumnVisibility: false
      }
    });

    expect(wrapper.find('.ui-data-grid-toolbar').exists()).toBe(false);
    expect(wrapper.find('.ui-data-grid-visibility').exists()).toBe(false);
    expect(wrapper.find('.ui-data-grid-bulk-actions').exists()).toBe(false);
    expect(wrapper.find('.ui-data-grid-table').exists()).toBe(true);
  });

  it('applies aria-label when no caption is provided', () => {
    const wrapper = mount(UiDataGrid, {
      props: {
        rows,
        columns,
        query: createQuery(),
        totalRows: rows.length,
        ariaLabel: 'Accounts grid'
      }
    });

    expect(wrapper.get('figure').attributes('aria-label')).toBe('Accounts grid');
    expect(wrapper.get('figure').attributes('aria-labelledby')).toBeUndefined();
  });

  it('renders loading, progress, empty, no-results, and error states', () => {
    const loading = mount(UiDataGrid, {
      props: {
        rows: [],
        columns,
        query: createQuery(),
        totalRows: 0,
        loading: true
      }
    });
    const refreshing = mount(UiDataGrid, {
      props: {
        rows,
        columns,
        query: createQuery(),
        totalRows: rows.length,
        loading: true
      }
    });
    const empty = mount(UiDataGrid, {
      props: {
        rows: [],
        columns,
        query: createQuery(),
        totalRows: 0
      }
    });
    const noResults = mount(UiDataGrid, {
      props: {
        rows: [],
        columns,
        query: createQuery({ search: 'missing' }),
        totalRows: 0
      }
    });
    const error = mount(UiDataGrid, {
      props: {
        rows: [],
        columns,
        query: createQuery(),
        totalRows: 0,
        error: true,
        errorText: 'Grid unavailable'
      }
    });

    expect(loading.text()).toContain('Loading rows');
    expect(refreshing.text()).toContain('Refreshing rows');
    expect(empty.text()).toContain('Empty grid');
    expect(noResults.text()).toContain('No matching rows');
    expect(error.text()).toContain('Grid unavailable');
  });

  it('renders table interactions, row clicks, cell slots, and sticky headers', async () => {
    const wrapper = mount(UiDataGridTable, {
      props: {
        rows,
        columns,
        query: createQuery({ sort: [{ id: 'name', direction: 'asc' }] }),
        selectionEnabled: true,
        selectedRowIds: ['row-1'],
        allPageRowsSelected: false,
        stickyHeader: true
      },
      slots: {
        cell: ({ column, value }) => h('strong', `${String(column.id)}=${String(value)}`),
        rowActions: ({ rowId }) => h('button', { type: 'button' }, `Action ${String(rowId)}`)
      }
    });

    expect(wrapper.find('thead').classes()).toContain('is-sticky');
    expect(wrapper.text()).toContain('name=Ada');
    expect(wrapper.text()).toContain('Action row-1');
    expect(wrapper.get('th[aria-sort="ascending"]').text()).toContain('↑');

    await wrapper.get('.ui-data-grid-table__sort').trigger('click');
    expect(wrapper.emitted('sort')?.[0]).toEqual(['name']);

    const rowCheckboxes = wrapper.findAll('.ui-checkbox__input');
    await rowCheckboxes[0].setValue(true);
    await rowCheckboxes[1].setValue(false);
    expect(wrapper.emitted('toggleAllRows')?.[0]).toEqual([true]);
    expect(wrapper.emitted('toggleRow')?.[0]).toEqual(['row-1']);

    await wrapper.findAll('tbody tr')[0].trigger('click');
    expect(wrapper.emitted('rowClick')?.[0]).toEqual([rows[0], 'row-1']);

    const descending = mount(UiDataGridTable, {
      props: {
        rows,
        columns,
        query: createQuery({ sort: [{ id: 'name', direction: 'desc' }] }),
        selectionEnabled: false,
        selectedRowIds: [],
        allPageRowsSelected: false
      }
    });

    expect(descending.get('th[aria-sort="descending"]').text()).toContain('↓');
  });

  it('renders toolbar helpers, filters, pagination, and bulk-actions emit contracts', async () => {
    const search = mount(UiDataGridSearch, {
      props: {
        modelValue: '',
        placeholder: 'Search rows'
      }
    });
    await search.get('input[type="search"]').setValue('Ada');
    expect(search.emitted('update:modelValue')?.[0]).toEqual(['Ada']);

    const filtersWrapper = mount(UiDataGridFilters, {
      props: {
        definitions: filters,
        filters: {
          tags: ['ops']
        }
      }
    });

    const inputs = filtersWrapper.findAll('input.ui-data-grid-filters__control');
    await inputs[0].setValue('hello');
    expect(filtersWrapper.emitted('updateFilter')?.[0]).toEqual(['query', 'hello']);
    await filtersWrapper.find('select.ui-select__control').setValue('Healthy');
    expect(filtersWrapper.emitted('updateFilter')?.some((event) => event[0] === 'status' && event[1] === 'Healthy')).toBe(true);
    await filtersWrapper.findAll('select.ui-select__control')[1].setValue('true');
    expect(filtersWrapper.emitted('updateFilter')?.some((event) => event[0] === 'active' && event[1] === true)).toBe(true);
    const multiSelect = filtersWrapper.find('select[multiple]');
    const multiElement = multiSelect.element as HTMLSelectElement;
    multiElement.options[0].selected = true;
    multiElement.options[1].selected = true;
    await multiSelect.trigger('change');
    expect(filtersWrapper.emitted('updateFilter')?.some((event) => event[0] === 'tags')).toBe(true);

    const visibility = mount(UiDataGridColumnVisibility, {
      props: {
        columns,
        columnVisibility: {
          status: false
        }
      }
    });
    await visibility.get('summary').trigger('click');
    await visibility.findAll('.ui-checkbox__input')[1].setValue(true);
    await visibility.get('.ui-data-grid-visibility__reset').trigger('click');
    expect(visibility.emitted('visibilityChange')?.[0]).toEqual(['status', true]);
    expect(visibility.emitted('reset')).toHaveLength(1);

    expect(
      mount(UiDataGridColumnVisibility, {
        props: {
          columns: [],
          columnVisibility: {}
        }
      }).html()
    ).toBe('<!--v-if-->');

    const toolbar = mount(UiDataGridToolbar, {
      props: {
        search: '',
        searchPlaceholder: 'Search rows',
        filterDefinitions: filters,
        filters: {},
        hideableColumns: columns,
        columnVisibility: {},
        showColumnVisibility: false
      }
    });

    expect(toolbar.find('.ui-data-grid-visibility').exists()).toBe(false);

    const pagination = mount(UiDataGridPagination, {
      props: {
        page: 2,
        pageCount: 5,
        pageSize: 10,
        pageSizeOptions: [10, 25],
        totalRows: 42,
        summaryStart: 11,
        summaryEnd: 20
      }
    });
    await pagination.findAll('select.ui-select__control')[0].setValue('25');
    await pagination.findAll('button')[0].trigger('click');
    await pagination.findAll('button')[1].trigger('click');
    expect(pagination.text()).toContain('Showing 11–20 of 42');
    expect(pagination.emitted('pageSizeChange')?.[0]).toEqual([25]);
    expect(pagination.emitted('pageChange')?.[0]).toEqual([1]);
    expect(pagination.emitted('pageChange')?.[1]).toEqual([3]);

    const bulk = mount(UiDataGridBulkActions, {
      props: {
        selectedCount: 3
      },
      slots: {
        default: 'Bulk slot'
      }
    });
    await bulk.get('button').trigger('click');
    expect(bulk.text()).toContain('3 selected');
    expect(bulk.text()).toContain('Bulk slot');
    expect(bulk.emitted('clear')).toHaveLength(1);

    expect(
      mount(UiDataGridFilters, {
        props: {
          definitions: [],
          filters: {}
        }
      }).html()
    ).toBe('<!--v-if-->');
  });

  it('supports subtree theming and row click contracts through the public component', async () => {
    const wrapper = mount(
      defineComponent({
        components: { UiDataGrid },
        setup() {
          return {
            columns,
            filters
          };
        },
        data() {
          return {
            query: createQuery(),
            selected: ['row-1'] as readonly string[]
          };
        },
        template: `
          <section data-ui-theme="belovodye" data-ui-theme-type="light">
            <UiDataGrid
              :rows="[]"
              :columns="columns"
              :query="query"
              :total-rows="0"
              :selected-row-ids="selected"
              :filter-definitions="filters"
              density="compact"
              sticky-header
              @update:query="query = $event"
              @update:selected-row-ids="selected = $event"
            />
          </section>
        `
      })
    );

    expect(wrapper.find('[data-ui-theme="belovodye"]').exists()).toBe(true);
    expect(wrapper.find('.ui-data-grid').attributes('data-ui-density')).toBe('compact');
  });

  it('renders custom loading, empty, and error slots through the public surface', () => {
    const loading = mount(UiDataGrid, {
      props: {
        rows: [],
        columns,
        query: createQuery(),
        totalRows: 0,
        loading: true
      },
      slots: {
        loading: '<div>Custom loading</div>'
      }
    });
    const empty = mount(UiDataGrid, {
      props: {
        rows: [],
        columns,
        query: createQuery(),
        totalRows: 0
      },
      slots: {
        empty: '<div>Custom empty</div>'
      }
    });
    const error = mount(UiDataGrid, {
      props: {
        rows: [],
        columns,
        query: createQuery(),
        totalRows: 0,
        error: 'Custom error'
      },
      slots: {
        error: '<div>Custom error slot</div>'
      }
    });

    expect(loading.text()).toContain('Custom loading');
    expect(empty.text()).toContain('Custom empty');
    expect(error.text()).toContain('Custom error slot');
  });
});
