import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';

import {
  createDataGridColumn,
  normalizeDataGridQuery,
  type DataGridColumn,
  type DataGridFilterDefinition,
  type DataGridQuery,
} from '@ww/data-grid';

import { DataTableWidget } from '../../index';
import { useDataTableWidgetState } from './composables/useDataTableWidgetState';

interface DemoRow extends Record<string, unknown> {
  id: string;
  name: string;
  status: 'Healthy' | 'Risk';
}

const rows: readonly DemoRow[] = Object.freeze([
  { id: 'row-001', name: 'Northwind', status: 'Healthy' },
  { id: 'row-002', name: 'Aster', status: 'Risk' },
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

const filterDefinitions: readonly DataGridFilterDefinition[] = Object.freeze([
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { label: 'Healthy', value: 'Healthy' },
      { label: 'Risk', value: 'Risk' },
    ],
  },
]);

const createQuery = (overrides: Partial<DataGridQuery> = {}) =>
  normalizeDataGridQuery({
    search: '',
    filters: {},
    sort: [],
    pagination: {
      page: 1,
      pageSize: 10,
    },
    columnVisibility: {},
    ...overrides,
  });

describe('DataTableWidget', () => {
  it('exports the public widget surface', () => {
    expect(DataTableWidget).toBeTruthy();
  });

  it('renders header, actions, grid, and footer slots inside the widget shell', () => {
    const wrapper = mount(DataTableWidget, {
      props: {
        title: 'Accounts',
        description: 'Reusable widget surface',
        rows,
        columns: columns as readonly DataGridColumn<Record<string, unknown>>[],
        query: createQuery(),
        totalRows: rows.length,
        selectedRowIds: ['row-001'],
      },
      slots: {
        'header-actions': '<button type="button">Refresh</button>',
        'toolbar-start': '<span>Toolbar start</span>',
        'toolbar-end': '<span>Toolbar end</span>',
        'bulk-actions': '<span>Custom bulk actions</span>',
        footer: '<span>Footer meta</span>',
      },
    });

    expect(wrapper.find('.ui-widget-header').exists()).toBe(true);
    expect(wrapper.text()).toContain('Accounts');
    expect(wrapper.text()).toContain('Reusable widget surface');
    expect(wrapper.text()).toContain('Refresh');
    expect(wrapper.text()).toContain('Toolbar start');
    expect(wrapper.text()).toContain('Toolbar end');
    expect(wrapper.text()).toContain('Custom bulk actions');
    expect(wrapper.find('.ui-data-grid').exists()).toBe(true);
    expect(wrapper.text()).toContain('Footer meta');
  });

  it('keeps header and footer composition available through slots when chrome toggles stay enabled', () => {
    const wrapper = mount(DataTableWidget, {
      props: {
        rows,
        columns: columns as readonly DataGridColumn<Record<string, unknown>>[],
        query: createQuery(),
        totalRows: rows.length,
        rowId: 'id',
        density: 'compact',
        showStatusBar: false,
      },
      slots: {
        'header-actions': '<button type="button">Inspect widget</button>',
        status: ({ pageCount }: { pageCount: number }) => h('span', `Pages ${pageCount}`),
      },
    });

    expect(wrapper.find('.ui-widget-header').exists()).toBe(true);
    expect(wrapper.text()).toContain('Inspect widget');
    expect(wrapper.find('.ui-data-grid').attributes('data-ui-density')).toBe('compact');
    expect(wrapper.text()).toContain('Pages 1');
    expect(wrapper.findComponent({ name: 'DataTableWidgetStatus' }).exists()).toBe(false);
  });

  it('hides header and toolbar when the widget-level composition flags are disabled', () => {
    const wrapper = mount(DataTableWidget, {
      props: {
        title: 'Accounts',
        rows,
        columns: columns as readonly DataGridColumn<Record<string, unknown>>[],
        query: createQuery(),
        totalRows: rows.length,
        showHeader: false,
        showToolbar: false,
      },
    });

    expect(wrapper.find('.ui-widget-header').exists()).toBe(false);
    expect(wrapper.find('.ui-data-grid-toolbar').exists()).toBe(false);
  });

  it('can hide column visibility and footer chrome while keeping an a11y fallback label', () => {
    const wrapper = mount(DataTableWidget, {
      props: {
        rows,
        columns: columns as readonly DataGridColumn<Record<string, unknown>>[],
        query: createQuery(),
        totalRows: rows.length,
        showStatusBar: false,
        showColumnVisibility: false,
      },
    });

    expect(wrapper.find('.ui-data-grid-visibility').exists()).toBe(false);
    expect(wrapper.find('.ui-widget-footer').exists()).toBe(false);
    expect(wrapper.get('figure').attributes('aria-label')).toBe('Data table widget');
  });

  it('keeps footer slots visible when status chrome is disabled', () => {
    const wrapper = mount(DataTableWidget, {
      props: {
        rows,
        columns: columns as readonly DataGridColumn<Record<string, unknown>>[],
        query: createQuery(),
        totalRows: rows.length,
        showStatusBar: false,
      },
      slots: {
        footer: '<span>Footer only</span>',
      },
    });

    expect(wrapper.find('.ui-widget-footer').exists()).toBe(true);
    expect(wrapper.text()).toContain('Footer only');
    expect(wrapper.findComponent({ name: 'DataTableWidgetStatus' }).exists()).toBe(false);
  });

  it('passes query, selection, and row click events through without mutating inputs', async () => {
    const frozenRows = Object.freeze([...rows]) as readonly Record<string, unknown>[];
    const frozenColumns = Object.freeze(columns) as readonly DataGridColumn<
      Record<string, unknown>
    >[];
    const wrapper = mount(DataTableWidget, {
      props: {
        rows: frozenRows,
        columns: frozenColumns,
        query: createQuery(),
        totalRows: rows.length,
        selectedRowIds: [],
      },
    });

    await wrapper.get('input[type="search"]').setValue('North');
    await wrapper.findAll('tbody .ui-checkbox__input')[0].setValue(true);
    await wrapper.findAll('tbody tr')[0].trigger('click');

    expect(wrapper.emitted('update:query')?.at(0)?.[0]).toMatchObject({ search: 'North' });
    expect(wrapper.emitted('update:selectedRowIds')?.at(0)?.[0]).toEqual(['row-001']);
    expect(wrapper.emitted('rowClick')?.at(0)?.[0]).toMatchObject({
      id: 'row-001',
      name: 'Northwind',
    });
    expect(frozenRows[0]).toMatchObject({ id: 'row-001', name: 'Northwind' });
  });

  it('shows bulk actions only when enabled and selection exists', () => {
    const visible = mount(DataTableWidget, {
      props: {
        rows,
        columns: columns as readonly DataGridColumn<Record<string, unknown>>[],
        query: createQuery(),
        totalRows: rows.length,
        selectedRowIds: ['row-001'],
      },
    });
    const hidden = mount(DataTableWidget, {
      props: {
        rows,
        columns: columns as readonly DataGridColumn<Record<string, unknown>>[],
        query: createQuery(),
        totalRows: rows.length,
        selectedRowIds: ['row-001'],
        showBulkActions: false,
      },
    });

    expect(visible.find('.ui-data-grid-bulk-actions').exists()).toBe(true);
    expect(hidden.find('.ui-data-grid-bulk-actions').exists()).toBe(false);
  });

  it('renders status badges for active search and filters', () => {
    const wrapper = mount(DataTableWidget, {
      props: {
        rows,
        columns: columns as readonly DataGridColumn<Record<string, unknown>>[],
        query: createQuery({
          search: 'North',
          filters: {
            status: 'Healthy',
          },
        }),
        totalRows: 8,
        selectedRowIds: ['row-001'],
      },
    });

    expect(wrapper.text()).toContain('Rows: 8');
    expect(wrapper.text()).toContain('1 selected');
    expect(wrapper.text()).toContain('Filters: 1');
    expect(wrapper.text()).toContain('Search active');
  });

  it('renders default and custom loading, empty, error, status, and footer surfaces predictably', () => {
    const loading = mount(DataTableWidget, {
      props: {
        rows: [],
        columns: columns as readonly DataGridColumn<Record<string, unknown>>[],
        query: createQuery(),
        totalRows: 0,
        loading: true,
      },
    });
    const empty = mount(DataTableWidget, {
      props: {
        rows: [],
        columns: columns as readonly DataGridColumn<Record<string, unknown>>[],
        query: createQuery(),
        totalRows: 0,
      },
    });
    const error = mount(DataTableWidget, {
      props: {
        rows: [],
        columns: columns as readonly DataGridColumn<Record<string, unknown>>[],
        query: createQuery(),
        totalRows: 0,
        error: 'Controlled error',
      },
    });
    const customLoading = mount(DataTableWidget, {
      props: {
        rows: [],
        columns: columns as readonly DataGridColumn<Record<string, unknown>>[],
        query: createQuery(),
        totalRows: 0,
        loading: true,
      },
      slots: {
        loading: '<div>Custom loading</div>',
      },
    });
    const customEmpty = mount(DataTableWidget, {
      props: {
        rows: [],
        columns: columns as readonly DataGridColumn<Record<string, unknown>>[],
        query: createQuery(),
        totalRows: 0,
      },
      slots: {
        empty: '<div>Custom empty</div>',
      },
    });
    const customError = mount(DataTableWidget, {
      props: {
        rows: [],
        columns: columns as readonly DataGridColumn<Record<string, unknown>>[],
        query: createQuery(),
        totalRows: 0,
        error: 'Controlled error',
      },
      slots: {
        error: '<div>Custom error slot</div>',
      },
    });
    const footerAndStatus = mount(DataTableWidget, {
      props: {
        rows,
        columns: columns as readonly DataGridColumn<Record<string, unknown>>[],
        query: createQuery({ pagination: { page: 2, pageSize: 1 } }),
        totalRows: 4,
      },
      slots: {
        status: (slotProps: Record<string, unknown>) =>
          h('div', `Status ${String(slotProps.totalRows)}`),
        footer: '<span>Widget footer</span>',
      },
    });

    expect(loading.text()).toContain('Loading table data.');
    expect(empty.text()).toContain('No rows yet');
    expect(error.text()).toContain('Controlled error');
    expect(customLoading.text()).toContain('Custom loading');
    expect(customEmpty.text()).toContain('Custom empty');
    expect(customError.text()).toContain('Custom error slot');
    expect(footerAndStatus.text()).toContain('Status 4');
    expect(footerAndStatus.text()).toContain('Widget footer');
  });

  it('renders inside a themed subtree and keeps the shared grid theme contract intact', () => {
    const wrapper = mount(
      defineComponent({
        components: { DataTableWidget },
        setup() {
          return {
            columns,
            filterDefinitions,
          };
        },
        data() {
          return {
            query: createQuery(),
          };
        },
        template: `
          <section data-ui-theme="belovodye" data-ui-theme-type="light">
            <DataTableWidget
              title="Scoped accounts"
              :rows="[]"
              :columns="columns"
              :query="query"
              :total-rows="0"
              :filter-definitions="filterDefinitions"
            />
          </section>
        `,
      })
    );

    expect(wrapper.find('[data-ui-theme="belovodye"]').exists()).toBe(true);
    expect(wrapper.find('.data-table-widget').exists()).toBe(true);
    expect(wrapper.find('.ui-data-grid').exists()).toBe(true);
  });

  it('derives widget status summary from the controlled query and selection model', () => {
    const state = useDataTableWidgetState({
      query: {
        value: createQuery({
          search: 'North',
          filters: { status: 'Healthy' },
          sort: [{ id: 'name', direction: 'asc' }],
          pagination: { page: 2, pageSize: 5 },
        }),
      },
      totalRows: { value: 12 },
      selectedRowIds: { value: ['row-001', 'row-002'] },
    });

    expect(state.selectedCount.value).toBe(2);
    expect(state.activeFilterCount.value).toBe(1);
    expect(state.hasSearch.value).toBe(true);
    expect(state.hasActiveQuery.value).toBe(true);
    expect(state.pageCount.value).toBe(3);
    expect(state.statusSummary.value).toMatchObject({
      totalRows: 12,
      selectedCount: 2,
      activeFilterCount: 1,
      page: 2,
      pageCount: 3,
      pageSize: 5,
    });
  });
});
