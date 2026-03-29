import {
  createDataGridColumn,
  normalizeDataGridQuery,
  type DataGridColumn,
  type DataGridFilterDefinition,
  type DataGridQuery
} from '@ww/data-grid';

export interface DataGridDemoRow extends Record<string, unknown> {
  id: string;
  account: string;
  owner: string;
  region: 'North' | 'South' | 'East' | 'West';
  status: 'Healthy' | 'Watch' | 'Risk';
  plan: 'Core' | 'Growth' | 'Scale';
  spend: number;
  active: boolean;
  seats: number;
}

export const dataGridRows: readonly DataGridDemoRow[] = Object.freeze([
  { id: 'row-001', account: 'Northwind', owner: 'Anya', region: 'North', status: 'Healthy', plan: 'Scale', spend: 18200, active: true, seats: 124 },
  { id: 'row-002', account: 'Aster Labs', owner: 'Mika', region: 'East', status: 'Watch', plan: 'Growth', spend: 9400, active: true, seats: 48 },
  { id: 'row-003', account: 'Cinder Works', owner: 'Leif', region: 'West', status: 'Risk', plan: 'Core', spend: 3200, active: false, seats: 12 },
  { id: 'row-004', account: 'Blue Slate', owner: 'Nika', region: 'South', status: 'Healthy', plan: 'Growth', spend: 12100, active: true, seats: 72 },
  { id: 'row-005', account: 'Helio Freight', owner: 'Iris', region: 'East', status: 'Watch', plan: 'Scale', spend: 15400, active: true, seats: 96 },
  { id: 'row-006', account: 'Marrow Studio', owner: 'Theo', region: 'North', status: 'Healthy', plan: 'Core', spend: 4700, active: false, seats: 19 },
  { id: 'row-007', account: 'Riverframe', owner: 'Sana', region: 'West', status: 'Risk', plan: 'Growth', spend: 8800, active: true, seats: 41 },
  { id: 'row-008', account: 'Pine Crest', owner: 'Elin', region: 'South', status: 'Healthy', plan: 'Scale', spend: 20100, active: true, seats: 138 },
  { id: 'row-009', account: 'Orbit Forge', owner: 'Mara', region: 'North', status: 'Watch', plan: 'Growth', spend: 11300, active: true, seats: 56 },
  { id: 'row-010', account: 'Stellar Mint', owner: 'Yuri', region: 'East', status: 'Healthy', plan: 'Scale', spend: 22100, active: true, seats: 152 },
  { id: 'row-011', account: 'Tundra Ops', owner: 'Rian', region: 'West', status: 'Risk', plan: 'Core', spend: 2800, active: false, seats: 9 },
  { id: 'row-012', account: 'Vela Source', owner: 'Nora', region: 'South', status: 'Healthy', plan: 'Growth', spend: 9900, active: true, seats: 44 }
]);

export const dataGridColumns: readonly DataGridColumn<DataGridDemoRow>[] = Object.freeze([
  createDataGridColumn<DataGridDemoRow>({ id: 'account', header: 'Account', accessorKey: 'account', sortable: true, hideable: false, width: '16rem' }),
  createDataGridColumn<DataGridDemoRow>({ id: 'owner', header: 'Owner', accessorKey: 'owner', sortable: true, width: '10rem' }),
  createDataGridColumn<DataGridDemoRow>({ id: 'region', header: 'Region', accessorKey: 'region', sortable: true, width: '8rem' }),
  createDataGridColumn<DataGridDemoRow>({ id: 'status', header: 'Status', accessorKey: 'status', sortable: true, width: '8rem' }),
  createDataGridColumn<DataGridDemoRow>({ id: 'plan', header: 'Plan', accessorKey: 'plan', sortable: true, width: '8rem' }),
  createDataGridColumn<DataGridDemoRow>({ id: 'seats', header: 'Seats', accessorKey: 'seats', sortable: true, align: 'end', width: '7rem' }),
  createDataGridColumn<DataGridDemoRow>({
    id: 'spend',
    header: 'Annual spend',
    accessorKey: 'spend',
    sortable: true,
    align: 'end',
    width: '9rem',
    cell: ({ value }) => `$${Number(value).toLocaleString()}`
  }),
  createDataGridColumn<DataGridDemoRow>({
    id: 'active',
    header: 'Active',
    accessorKey: 'active',
    sortable: true,
    align: 'center',
    width: '7rem',
    cell: ({ value }) => (value ? 'Active' : 'Paused')
  })
]);

export const denseAdminColumns: readonly DataGridColumn<DataGridDemoRow>[] = Object.freeze([
  ...dataGridColumns,
  createDataGridColumn<DataGridDemoRow>({ id: 'renewal', header: 'Renewal', accessor: (row) => `${row.region} / ${row.plan}`, width: '11rem' }),
  createDataGridColumn<DataGridDemoRow>({ id: 'segment', header: 'Segment', accessor: (row) => (row.spend > 15000 ? 'Strategic' : 'Scaled'), width: '9rem' }),
  createDataGridColumn<DataGridDemoRow>({ id: 'health', header: 'Health score', accessor: (row) => (row.status === 'Healthy' ? 92 : row.status === 'Watch' ? 71 : 46), align: 'end', width: '8rem' })
]);

export const dataGridUiRows = dataGridRows as readonly Record<string, unknown>[];
export const dataGridUiColumns = dataGridColumns as unknown as readonly DataGridColumn<Record<string, unknown>>[];
export const denseAdminUiColumns = denseAdminColumns as unknown as readonly DataGridColumn<Record<string, unknown>>[];

export const dataGridFilterDefinitions: readonly DataGridFilterDefinition[] = Object.freeze([
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    placeholder: 'All statuses',
    options: [
      { label: 'Healthy', value: 'Healthy' },
      { label: 'Watch', value: 'Watch' },
      { label: 'Risk', value: 'Risk' }
    ]
  },
  {
    id: 'region',
    label: 'Regions',
    type: 'multi-select',
    options: [
      { label: 'North', value: 'North' },
      { label: 'South', value: 'South' },
      { label: 'East', value: 'East' },
      { label: 'West', value: 'West' }
    ]
  },
  {
    id: 'active',
    label: 'Active',
    type: 'boolean',
    trueLabel: 'Active',
    falseLabel: 'Paused'
  }
]);

export const createBaseQuery = (overrides: Partial<DataGridQuery> = {}): DataGridQuery =>
  normalizeDataGridQuery({
    search: '',
    filters: {},
    sort: [],
    pagination: {
      page: 1,
      pageSize: 5
    },
    columnVisibility: {},
    ...overrides
  });

const toComparableText = (value: unknown): string => {
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'bigint') {
    return String(value);
  }

  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }

  if (value === null || value === undefined) {
    return '';
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === 'symbol') {
    return value.description ? `Symbol(${value.description})` : 'Symbol()';
  }

  try {
    return JSON.stringify(value) ?? Object.prototype.toString.call(value);
  } catch {
    return Object.prototype.toString.call(value);
  }
};

const compareValues = (left: unknown, right: unknown) => {
  if (typeof left === 'number' && typeof right === 'number') {
    return left - right;
  }

  return toComparableText(left).localeCompare(toComparableText(right), undefined, { sensitivity: 'base' });
};

const getColumnValue = (row: DataGridDemoRow, column: DataGridColumn<DataGridDemoRow>) => {
  if (column.accessor) {
    return column.accessor(row);
  }

  if (column.accessorKey) {
    return row[column.accessorKey];
  }

  return undefined;
};

export function applyDataGridQuery(
  rows: readonly DataGridDemoRow[],
  columns: readonly DataGridColumn<DataGridDemoRow>[],
  query: DataGridQuery
) {
  const normalized = normalizeDataGridQuery(query);
  const search = normalized.search.trim().toLowerCase();

  let nextRows = [...rows];

  if (search) {
    nextRows = nextRows.filter((row) =>
      [row.account, row.owner, row.region, row.plan].some((value) => value.toLowerCase().includes(search))
    );
  }

  for (const [filterId, value] of Object.entries(normalized.filters)) {
    if (value === undefined || value === null || value === '') {
      continue;
    }

    nextRows = nextRows.filter((row) => {
      const cellValue = row[filterId as keyof DataGridDemoRow];
      if (Array.isArray(value)) {
        return value.includes(String(cellValue));
      }

      return String(cellValue) === String(value);
    });
  }

  const primarySort = normalized.sort[0];
  if (primarySort) {
    const sortColumn = columns.find((column) => column.id === primarySort.id);
    if (sortColumn) {
      nextRows.sort((leftRow, rightRow) => {
        const direction = primarySort.direction === 'asc' ? 1 : -1;
        return compareValues(getColumnValue(leftRow, sortColumn), getColumnValue(rightRow, sortColumn)) * direction;
      });
    }
  }

  const totalRows = nextRows.length;
  const startIndex = (normalized.pagination.page - 1) * normalized.pagination.pageSize;

  return {
    normalizedQuery: normalized,
    totalRows,
    pageRows: nextRows.slice(startIndex, startIndex + normalized.pagination.pageSize)
  };
}
