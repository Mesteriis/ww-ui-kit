import { computed, defineComponent, ref, type PropType } from 'vue';

import type { DataGridQuery } from '@ww/data-grid';
import { UiBadge, UiButton, UiCard } from '@ww/core';
import { UiPageSection, UiPageTemplate } from '@ww/page-templates';
import { getThemeMeta, type ThemeName } from '@ww/themes';
import { DataTableWidget } from '@ww/widgets';

import {
  applyDataGridQuery,
  createBaseQuery,
  dataGridColumns,
  dataGridFilterDefinitions,
  dataGridRows,
  dataGridUiColumns
} from '../systems/data-grid/data-grid-fixtures';

export const DataTableWidgetStoryHarness = defineComponent({
  name: 'DataTableWidgetStoryHarness',
  components: {
    DataTableWidget,
    UiBadge,
    UiButton,
    UiCard,
    UiPageSection,
    UiPageTemplate
  },
  props: {
    mode: {
      type: String as PropType<'default' | 'loading' | 'empty' | 'no-results' | 'error'>,
      default: 'default'
    },
    subtreeTheme: {
      type: String as PropType<ThemeName | undefined>,
      default: undefined
    },
    composed: {
      type: Boolean,
      default: false
    },
    customSlots: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const query = ref<DataGridQuery>(
      createBaseQuery(
        props.mode === 'no-results'
          ? {
              search: 'No matches'
            }
          : {}
      )
    );
    const selectedRowIds = ref<readonly string[]>(props.customSlots ? ['acc-001'] : []);
    const effectiveRows = computed(() => (props.mode === 'empty' || props.mode === 'loading' ? [] : dataGridRows));
    const result = computed(() => applyDataGridQuery(effectiveRows.value, dataGridColumns, query.value));
    const uiRows = computed(() => result.value.pageRows as readonly Record<string, unknown>[]);
    const themeMeta = computed(() => (props.subtreeTheme ? getThemeMeta(props.subtreeTheme) : null));

    return {
      dataGridFilterDefinitions,
      dataGridUiColumns,
      query,
      result,
      selectedRowIds,
      themeMeta,
      uiRows
    };
  },
  template: `
    <section
      class="ui-stack"
      :data-ui-theme="themeMeta?.name"
      :data-ui-theme-type="themeMeta?.type"
      style="gap: var(--ui-space-4);"
    >
      <UiPageTemplate
        v-if="composed"
        title="Operations workspace"
        description="Widget-level proof above the data-grid system package"
      >
        <UiPageSection title="Accounts table widget" description="Reusable black-box surface over @ww/data-grid.">
          <DataTableWidget
            title="Accounts"
            description="Widget framing for dense admin table usage."
            :rows="uiRows"
            :columns="dataGridUiColumns"
            :query="query"
            :total-rows="result.totalRows"
            :selected-row-ids="selectedRowIds"
            :filter-definitions="dataGridFilterDefinitions"
            :loading="mode === 'loading'"
            :error="mode === 'error' ? 'Apps remain responsible for backend retry and data orchestration.' : false"
            caption="Accounts table widget"
            aria-label="Accounts table widget"
            search-placeholder="Search accounts"
            @update:query="query = $event"
            @update:selected-row-ids="selectedRowIds = $event"
          >
            <template #header-actions>
              <UiButton variant="secondary" size="sm">Refresh widget</UiButton>
            </template>
            <template #toolbar-end>
              <UiBadge>Rows: {{ result.totalRows }}</UiBadge>
            </template>
            <template #bulk-actions="{ selectedCount, clearSelection }">
              <UiButton size="sm" variant="secondary" @click="clearSelection">Clear {{ selectedCount }}</UiButton>
            </template>
            <template #footer>
              Widget footer metadata stays outside app routing and backend logic.
            </template>
          </DataTableWidget>
        </UiPageSection>
      </UiPageTemplate>

      <DataTableWidget
        v-else
        title="Accounts"
        description="Opinionated widget shell above the controlled data-grid system package."
        :rows="uiRows"
        :columns="dataGridUiColumns"
        :query="query"
        :total-rows="result.totalRows"
        :selected-row-ids="selectedRowIds"
        :filter-definitions="dataGridFilterDefinitions"
        :loading="mode === 'loading'"
        :error="mode === 'error' ? 'Apps remain responsible for backend retry and data orchestration.' : false"
        caption="Accounts table widget"
        aria-label="Accounts table widget"
        search-placeholder="Search accounts"
        @update:query="query = $event"
        @update:selected-row-ids="selectedRowIds = $event"
      >
        <template #header-actions>
          <UiButton variant="secondary" size="sm">Refresh widget</UiButton>
        </template>
        <template #toolbar-end>
          <UiBadge>Rows: {{ result.totalRows }}</UiBadge>
        </template>
        <template #bulk-actions="{ selectedCount, clearSelection, selectedRowIds }">
          <template v-if="customSlots">
            <UiBadge variant="brand">{{ selectedCount }} selected</UiBadge>
            <UiBadge>Ids: {{ selectedRowIds.join(', ') }}</UiBadge>
            <UiButton size="sm" variant="secondary" @click="clearSelection">Reset selection</UiButton>
          </template>
          <UiButton v-else size="sm" variant="secondary" @click="clearSelection">Clear {{ selectedCount }}</UiButton>
        </template>
        <template v-if="customSlots" #status="{ totalRows, pageCount }">
          <div class="ui-cluster">
            <UiBadge variant="brand">Total {{ totalRows }}</UiBadge>
            <UiBadge>Pages {{ pageCount }}</UiBadge>
          </div>
        </template>
        <template v-if="customSlots" #footer>
          Custom widget footer
        </template>
      </DataTableWidget>
    </section>
  `
});
