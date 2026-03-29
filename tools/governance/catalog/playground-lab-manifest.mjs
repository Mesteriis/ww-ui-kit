import { PACKAGE_CLASSIFICATION_MAP } from './package-classification.mjs';

const visualSurface = (entry) => {
  const packageMeta = PACKAGE_CLASSIFICATION_MAP[entry.packageName];
  if (!packageMeta) {
    throw new Error(`Unknown package in playground lab manifest: ${entry.packageName}`);
  }

  return Object.freeze({
    family: 'Display',
    labEligible: false,
    labExemptionReason: '',
    previewModes: [],
    copyFormats: [],
    runtimeFiles: Object.freeze({ schema: '', preview: '' }),
    usageSource: 'generated',
    packageLayer: packageMeta.packageLayer,
    stability: packageMeta.stability,
    ...entry,
  });
};

export const PLAYGROUND_VISUAL_SURFACE_MANIFEST = Object.freeze([
  visualSurface({
    id: 'ui-button',
    title: 'UiButton',
    packageName: '@ww/core',
    exportName: 'UiButton',
    parentManifestExportName: 'UiButton',
    family: 'Actions',
    labEligible: true,
    previewModes: ['single', 'matrix'],
    copyFormats: ['json', 'ts-object', 'vue'],
    runtimeFiles: Object.freeze({
      schema: 'apps/playground/src/lab/schemas/ui-button.lab.ts',
      preview: 'apps/playground/src/lab/components/SimpleSurfaceLabPreview.vue',
    }),
  }),
  visualSurface({
    id: 'ui-icon-button',
    title: 'UiIconButton',
    packageName: '@ww/core',
    exportName: 'UiIconButton',
    parentManifestExportName: 'UiIconButton',
    family: 'Actions',
    labEligible: true,
    previewModes: ['single', 'matrix'],
    copyFormats: ['json', 'ts-object', 'vue'],
    runtimeFiles: Object.freeze({
      schema: 'apps/playground/src/lab/schemas/ui-icon-button.lab.ts',
      preview: 'apps/playground/src/lab/components/SimpleSurfaceLabPreview.vue',
    }),
  }),
  visualSurface({
    id: 'ui-field',
    title: 'UiField',
    packageName: '@ww/core',
    exportName: 'UiField',
    parentManifestExportName: 'UiField / UiInput / UiTextarea / UiSelectSimple',
    family: 'Fields',
    labEligible: false,
    labExemptionReason:
      'UiField is reviewed through UiInput, UiTextarea, and UiSelectSimple because it is a wrapper context rather than a standalone styling surface.',
  }),
  visualSurface({
    id: 'ui-input',
    title: 'UiInput',
    packageName: '@ww/core',
    exportName: 'UiInput',
    parentManifestExportName: 'UiField / UiInput / UiTextarea / UiSelectSimple',
    family: 'Fields',
    labEligible: true,
    previewModes: ['single', 'matrix'],
    copyFormats: ['json', 'ts-object', 'vue'],
    runtimeFiles: Object.freeze({
      schema: 'apps/playground/src/lab/schemas/ui-input.lab.ts',
      preview: 'apps/playground/src/lab/components/FieldSurfaceLabPreview.vue',
    }),
  }),
  visualSurface({
    id: 'ui-textarea',
    title: 'UiTextarea',
    packageName: '@ww/core',
    exportName: 'UiTextarea',
    parentManifestExportName: 'UiField / UiInput / UiTextarea / UiSelectSimple',
    family: 'Fields',
    labEligible: true,
    previewModes: ['single', 'matrix'],
    copyFormats: ['json', 'ts-object', 'vue'],
    runtimeFiles: Object.freeze({
      schema: 'apps/playground/src/lab/schemas/ui-textarea.lab.ts',
      preview: 'apps/playground/src/lab/components/FieldSurfaceLabPreview.vue',
    }),
  }),
  visualSurface({
    id: 'ui-select-simple',
    title: 'UiSelectSimple',
    packageName: '@ww/core',
    exportName: 'UiSelectSimple',
    parentManifestExportName: 'UiField / UiInput / UiTextarea / UiSelectSimple',
    family: 'Fields',
    labEligible: true,
    previewModes: ['single', 'matrix'],
    copyFormats: ['json', 'ts-object', 'vue'],
    runtimeFiles: Object.freeze({
      schema: 'apps/playground/src/lab/schemas/ui-select-simple.lab.ts',
      preview: 'apps/playground/src/lab/components/FieldSurfaceLabPreview.vue',
    }),
  }),
  visualSurface({
    id: 'ui-checkbox',
    title: 'UiCheckbox',
    packageName: '@ww/core',
    exportName: 'UiCheckbox',
    parentManifestExportName: 'UiCheckbox / UiSwitch',
    family: 'Selection',
    labEligible: true,
    previewModes: ['single', 'matrix'],
    copyFormats: ['json', 'ts-object', 'vue'],
    runtimeFiles: Object.freeze({
      schema: 'apps/playground/src/lab/schemas/ui-checkbox.lab.ts',
      preview: 'apps/playground/src/lab/components/SimpleSurfaceLabPreview.vue',
    }),
  }),
  visualSurface({
    id: 'ui-switch',
    title: 'UiSwitch',
    packageName: '@ww/core',
    exportName: 'UiSwitch',
    parentManifestExportName: 'UiCheckbox / UiSwitch',
    family: 'Selection',
    labEligible: true,
    previewModes: ['single', 'matrix'],
    copyFormats: ['json', 'ts-object', 'vue'],
    runtimeFiles: Object.freeze({
      schema: 'apps/playground/src/lab/schemas/ui-switch.lab.ts',
      preview: 'apps/playground/src/lab/components/SimpleSurfaceLabPreview.vue',
    }),
  }),
  visualSurface({
    id: 'ui-badge',
    title: 'UiBadge',
    packageName: '@ww/core',
    exportName: 'UiBadge',
    parentManifestExportName: 'UiBadge / UiCard / UiDivider / UiSpinner / UiSkeleton',
    family: 'Display',
    labEligible: true,
    previewModes: ['single', 'matrix'],
    copyFormats: ['json', 'ts-object', 'vue'],
    runtimeFiles: Object.freeze({
      schema: 'apps/playground/src/lab/schemas/ui-badge.lab.ts',
      preview: 'apps/playground/src/lab/components/SimpleSurfaceLabPreview.vue',
    }),
  }),
  visualSurface({
    id: 'ui-card',
    title: 'UiCard',
    packageName: '@ww/core',
    exportName: 'UiCard',
    parentManifestExportName: 'UiBadge / UiCard / UiDivider / UiSpinner / UiSkeleton',
    family: 'Display',
    labEligible: true,
    previewModes: ['single', 'matrix'],
    copyFormats: ['json', 'ts-object', 'vue'],
    runtimeFiles: Object.freeze({
      schema: 'apps/playground/src/lab/schemas/ui-card.lab.ts',
      preview: 'apps/playground/src/lab/components/SimpleSurfaceLabPreview.vue',
    }),
  }),
  visualSurface({
    id: 'ui-divider',
    title: 'UiDivider',
    packageName: '@ww/core',
    exportName: 'UiDivider',
    parentManifestExportName: 'UiBadge / UiCard / UiDivider / UiSpinner / UiSkeleton',
    family: 'Display',
    labEligible: false,
    labExemptionReason:
      'UiDivider is intentionally minimal and is reviewed inside higher-order display surfaces instead of receiving a dedicated maintainer workbench tab.',
  }),
  visualSurface({
    id: 'ui-spinner',
    title: 'UiSpinner',
    packageName: '@ww/core',
    exportName: 'UiSpinner',
    parentManifestExportName: 'UiBadge / UiCard / UiDivider / UiSpinner / UiSkeleton',
    family: 'Feedback',
    labEligible: false,
    labExemptionReason:
      'UiSpinner is a micro-state primitive with low standalone tuning value; it is reviewed in story states and in system/widget loading flows.',
  }),
  visualSurface({
    id: 'ui-skeleton',
    title: 'UiSkeleton',
    packageName: '@ww/core',
    exportName: 'UiSkeleton',
    parentManifestExportName: 'UiBadge / UiCard / UiDivider / UiSpinner / UiSkeleton',
    family: 'Feedback',
    labEligible: false,
    labExemptionReason:
      'UiSkeleton is a micro-state primitive with low standalone tuning value; it is reviewed in story states and complex loading surfaces.',
  }),
  visualSurface({
    id: 'ui-empty-state',
    title: 'UiEmptyState',
    packageName: '@ww/core',
    exportName: 'UiEmptyState',
    parentManifestExportName: 'UiEmptyState',
    family: 'Feedback',
    labEligible: true,
    previewModes: ['single', 'matrix'],
    copyFormats: ['json', 'ts-object', 'vue'],
    runtimeFiles: Object.freeze({
      schema: 'apps/playground/src/lab/schemas/ui-empty-state.lab.ts',
      preview: 'apps/playground/src/lab/components/SimpleSurfaceLabPreview.vue',
    }),
  }),
  visualSurface({
    id: 'ui-dialog',
    title: 'UiDialog',
    packageName: '@ww/core',
    exportName: 'UiDialog',
    parentManifestExportName: 'UiDialog / UiDrawer',
    family: 'Overlays',
    labEligible: true,
    previewModes: ['single', 'matrix'],
    copyFormats: ['json', 'ts-object', 'vue'],
    runtimeFiles: Object.freeze({
      schema: 'apps/playground/src/lab/schemas/ui-dialog.lab.ts',
      preview: 'apps/playground/src/lab/components/OverlaySurfaceLabPreview.vue',
    }),
  }),
  visualSurface({
    id: 'ui-drawer',
    title: 'UiDrawer',
    packageName: '@ww/core',
    exportName: 'UiDrawer',
    parentManifestExportName: 'UiDialog / UiDrawer',
    family: 'Overlays',
    labEligible: true,
    previewModes: ['single', 'matrix'],
    copyFormats: ['json', 'ts-object', 'vue'],
    runtimeFiles: Object.freeze({
      schema: 'apps/playground/src/lab/schemas/ui-drawer.lab.ts',
      preview: 'apps/playground/src/lab/components/OverlaySurfaceLabPreview.vue',
    }),
  }),
  visualSurface({
    id: 'ui-tabs-root',
    title: 'UiTabs',
    packageName: '@ww/core',
    exportName: 'UiTabsRoot',
    parentManifestExportName: 'UiTabsRoot / UiTabsList / UiTabsTrigger / UiTabsPanel',
    family: 'Navigation',
    labEligible: true,
    previewModes: ['single', 'matrix'],
    copyFormats: ['json', 'ts-object', 'vue'],
    runtimeFiles: Object.freeze({
      schema: 'apps/playground/src/lab/schemas/ui-tabs-root.lab.ts',
      preview: 'apps/playground/src/lab/components/TabsSurfaceLabPreview.vue',
    }),
  }),
  visualSurface({
    id: 'ui-tabs-list',
    title: 'UiTabsList',
    packageName: '@ww/core',
    exportName: 'UiTabsList',
    parentManifestExportName: 'UiTabsRoot / UiTabsList / UiTabsTrigger / UiTabsPanel',
    family: 'Navigation',
    labEligible: false,
    labExemptionReason:
      'UiTabsList is tuned through the UiTabs composite entry because list, triggers, and panels are only meaningful together.',
  }),
  visualSurface({
    id: 'ui-tabs-trigger',
    title: 'UiTabsTrigger',
    packageName: '@ww/core',
    exportName: 'UiTabsTrigger',
    parentManifestExportName: 'UiTabsRoot / UiTabsList / UiTabsTrigger / UiTabsPanel',
    family: 'Navigation',
    labEligible: false,
    labExemptionReason:
      'UiTabsTrigger is tuned through the UiTabs composite entry because list, triggers, and panels are only meaningful together.',
  }),
  visualSurface({
    id: 'ui-tabs-panel',
    title: 'UiTabsPanel',
    packageName: '@ww/core',
    exportName: 'UiTabsPanel',
    parentManifestExportName: 'UiTabsRoot / UiTabsList / UiTabsTrigger / UiTabsPanel',
    family: 'Navigation',
    labEligible: false,
    labExemptionReason:
      'UiTabsPanel is tuned through the UiTabs composite entry because list, triggers, and panels are only meaningful together.',
  }),
  visualSurface({
    id: 'ui-apex-chart',
    title: 'UiApexChart',
    packageName: '@ww/charts-apex',
    exportName: 'UiApexChart',
    parentManifestExportName: 'UiApexChart',
    family: 'Third-party adapters',
    labEligible: true,
    previewModes: ['single', 'matrix'],
    copyFormats: ['json', 'ts-object', 'vue'],
    runtimeFiles: Object.freeze({
      schema: 'apps/playground/src/lab/schemas/ui-apex-chart.lab.ts',
      preview: 'apps/playground/src/lab/components/ChartSurfaceLabPreview.vue',
    }),
  }),
  visualSurface({
    id: 'ui-signal-graph',
    title: 'UiSignalGraph',
    packageName: '@ww/signal-graph',
    exportName: 'UiSignalGraph',
    parentManifestExportName: 'UiSignalGraph',
    family: 'Systems',
    labEligible: true,
    previewModes: ['single', 'matrix'],
    copyFormats: ['json', 'ts-object', 'vue'],
    runtimeFiles: Object.freeze({
      schema: 'apps/playground/src/lab/schemas/ui-signal-graph.lab.ts',
      preview: 'apps/playground/src/lab/components/SignalGraphLabPreview.vue',
    }),
  }),
  visualSurface({
    id: 'ui-data-grid',
    title: 'UiDataGrid',
    packageName: '@ww/data-grid',
    exportName: 'UiDataGrid',
    parentManifestExportName:
      'UiDataGrid / UiDataGridToolbar / UiDataGridSearch / UiDataGridFilters / UiDataGridTable / UiDataGridPagination / UiDataGridBulkActions / UiDataGridColumnVisibility',
    family: 'Systems',
    labEligible: true,
    previewModes: ['single', 'matrix'],
    copyFormats: ['json', 'ts-object', 'vue'],
    runtimeFiles: Object.freeze({
      schema: 'apps/playground/src/lab/schemas/ui-data-grid.lab.ts',
      preview: 'apps/playground/src/lab/components/DataGridLabPreview.vue',
    }),
  }),
  visualSurface({
    id: 'ui-data-grid-toolbar',
    title: 'UiDataGridToolbar',
    packageName: '@ww/data-grid',
    exportName: 'UiDataGridToolbar',
    parentManifestExportName:
      'UiDataGrid / UiDataGridToolbar / UiDataGridSearch / UiDataGridFilters / UiDataGridTable / UiDataGridPagination / UiDataGridBulkActions / UiDataGridColumnVisibility',
    family: 'Systems',
    labEligible: false,
    labExemptionReason:
      'UiDataGridToolbar is tuned through UiDataGrid because it depends on the controlled query model and sibling sub-surfaces.',
  }),
  visualSurface({
    id: 'ui-data-grid-search',
    title: 'UiDataGridSearch',
    packageName: '@ww/data-grid',
    exportName: 'UiDataGridSearch',
    parentManifestExportName:
      'UiDataGrid / UiDataGridToolbar / UiDataGridSearch / UiDataGridFilters / UiDataGridTable / UiDataGridPagination / UiDataGridBulkActions / UiDataGridColumnVisibility',
    family: 'Systems',
    labEligible: false,
    labExemptionReason:
      'UiDataGridSearch is tuned through UiDataGrid because it depends on the controlled query model and toolbar composition.',
  }),
  visualSurface({
    id: 'ui-data-grid-filters',
    title: 'UiDataGridFilters',
    packageName: '@ww/data-grid',
    exportName: 'UiDataGridFilters',
    parentManifestExportName:
      'UiDataGrid / UiDataGridToolbar / UiDataGridSearch / UiDataGridFilters / UiDataGridTable / UiDataGridPagination / UiDataGridBulkActions / UiDataGridColumnVisibility',
    family: 'Systems',
    labEligible: false,
    labExemptionReason:
      'UiDataGridFilters is tuned through UiDataGrid because it depends on filter definitions and toolbar composition.',
  }),
  visualSurface({
    id: 'ui-data-grid-table',
    title: 'UiDataGridTable',
    packageName: '@ww/data-grid',
    exportName: 'UiDataGridTable',
    parentManifestExportName:
      'UiDataGrid / UiDataGridToolbar / UiDataGridSearch / UiDataGridFilters / UiDataGridTable / UiDataGridPagination / UiDataGridBulkActions / UiDataGridColumnVisibility',
    family: 'Systems',
    labEligible: false,
    labExemptionReason:
      'UiDataGridTable is tuned through UiDataGrid because it depends on controller-derived visibility, sort, and selection state.',
  }),
  visualSurface({
    id: 'ui-data-grid-pagination',
    title: 'UiDataGridPagination',
    packageName: '@ww/data-grid',
    exportName: 'UiDataGridPagination',
    parentManifestExportName:
      'UiDataGrid / UiDataGridToolbar / UiDataGridSearch / UiDataGridFilters / UiDataGridTable / UiDataGridPagination / UiDataGridBulkActions / UiDataGridColumnVisibility',
    family: 'Systems',
    labEligible: false,
    labExemptionReason:
      'UiDataGridPagination is tuned through UiDataGrid because it depends on the controller summary and query model.',
  }),
  visualSurface({
    id: 'ui-data-grid-bulk-actions',
    title: 'UiDataGridBulkActions',
    packageName: '@ww/data-grid',
    exportName: 'UiDataGridBulkActions',
    parentManifestExportName:
      'UiDataGrid / UiDataGridToolbar / UiDataGridSearch / UiDataGridFilters / UiDataGridTable / UiDataGridPagination / UiDataGridBulkActions / UiDataGridColumnVisibility',
    family: 'Systems',
    labEligible: false,
    labExemptionReason:
      'UiDataGridBulkActions is tuned through UiDataGrid because it depends on controlled selection state and bulk action slots.',
  }),
  visualSurface({
    id: 'ui-data-grid-column-visibility',
    title: 'UiDataGridColumnVisibility',
    packageName: '@ww/data-grid',
    exportName: 'UiDataGridColumnVisibility',
    parentManifestExportName:
      'UiDataGrid / UiDataGridToolbar / UiDataGridSearch / UiDataGridFilters / UiDataGridTable / UiDataGridPagination / UiDataGridBulkActions / UiDataGridColumnVisibility',
    family: 'Systems',
    labEligible: false,
    labExemptionReason:
      'UiDataGridColumnVisibility is tuned through UiDataGrid because it depends on toolbar composition and query state.',
  }),
  visualSurface({
    id: 'ui-widget-shell',
    title: 'UiWidgetShell',
    packageName: '@ww/widgets',
    exportName: 'UiWidgetShell',
    parentManifestExportName: 'UiWidgetShell / UiWidgetHeader / UiWidgetBody / UiWidgetFooter',
    family: 'Widgets',
    labEligible: true,
    previewModes: ['single', 'matrix'],
    copyFormats: ['json', 'ts-object', 'vue'],
    runtimeFiles: Object.freeze({
      schema: 'apps/playground/src/lab/schemas/ui-widget-shell.lab.ts',
      preview: 'apps/playground/src/lab/components/WidgetShellLabPreview.vue',
    }),
  }),
  visualSurface({
    id: 'ui-widget-header',
    title: 'UiWidgetHeader',
    packageName: '@ww/widgets',
    exportName: 'UiWidgetHeader',
    parentManifestExportName: 'UiWidgetShell / UiWidgetHeader / UiWidgetBody / UiWidgetFooter',
    family: 'Widgets',
    labEligible: false,
    labExemptionReason:
      'UiWidgetHeader is tuned through UiWidgetShell because header, body, and footer are only meaningful together.',
  }),
  visualSurface({
    id: 'ui-widget-body',
    title: 'UiWidgetBody',
    packageName: '@ww/widgets',
    exportName: 'UiWidgetBody',
    parentManifestExportName: 'UiWidgetShell / UiWidgetHeader / UiWidgetBody / UiWidgetFooter',
    family: 'Widgets',
    labEligible: false,
    labExemptionReason:
      'UiWidgetBody is tuned through UiWidgetShell because header, body, and footer are only meaningful together.',
  }),
  visualSurface({
    id: 'ui-widget-footer',
    title: 'UiWidgetFooter',
    packageName: '@ww/widgets',
    exportName: 'UiWidgetFooter',
    parentManifestExportName: 'UiWidgetShell / UiWidgetHeader / UiWidgetBody / UiWidgetFooter',
    family: 'Widgets',
    labEligible: false,
    labExemptionReason:
      'UiWidgetFooter is tuned through UiWidgetShell because header, body, and footer are only meaningful together.',
  }),
  visualSurface({
    id: 'data-table-widget',
    title: 'DataTableWidget',
    packageName: '@ww/widgets',
    exportName: 'DataTableWidget',
    parentManifestExportName: 'DataTableWidget',
    family: 'Widgets',
    labEligible: true,
    previewModes: ['single', 'matrix'],
    copyFormats: ['json', 'ts-object', 'vue'],
    runtimeFiles: Object.freeze({
      schema: 'apps/playground/src/lab/schemas/data-table-widget.lab.ts',
      preview: 'apps/playground/src/lab/components/DataTableWidgetLabPreview.vue',
    }),
  }),
  visualSurface({
    id: 'ui-page-template',
    title: 'UiPageTemplate',
    packageName: '@ww/page-templates',
    exportName: 'UiPageTemplate',
    parentManifestExportName:
      'UiPageTemplate / UiPageHeader / UiPageBody / UiPageSidebar / UiPageSection / UiPageToolbar',
    family: 'Page Templates',
    labEligible: true,
    previewModes: ['single', 'matrix'],
    copyFormats: ['json', 'ts-object', 'vue'],
    runtimeFiles: Object.freeze({
      schema: 'apps/playground/src/lab/schemas/ui-page-template.lab.ts',
      preview: 'apps/playground/src/lab/components/PageTemplateLabPreview.vue',
    }),
  }),
  visualSurface({
    id: 'ui-page-header',
    title: 'UiPageHeader',
    packageName: '@ww/page-templates',
    exportName: 'UiPageHeader',
    parentManifestExportName:
      'UiPageTemplate / UiPageHeader / UiPageBody / UiPageSidebar / UiPageSection / UiPageToolbar',
    family: 'Page Templates',
    labEligible: false,
    labExemptionReason:
      'UiPageHeader is tuned through UiPageTemplate because page header, body, sidebar, section, and toolbar are only meaningful together.',
  }),
  visualSurface({
    id: 'ui-page-body',
    title: 'UiPageBody',
    packageName: '@ww/page-templates',
    exportName: 'UiPageBody',
    parentManifestExportName:
      'UiPageTemplate / UiPageHeader / UiPageBody / UiPageSidebar / UiPageSection / UiPageToolbar',
    family: 'Page Templates',
    labEligible: false,
    labExemptionReason:
      'UiPageBody is tuned through UiPageTemplate because page header, body, sidebar, section, and toolbar are only meaningful together.',
  }),
  visualSurface({
    id: 'ui-page-sidebar',
    title: 'UiPageSidebar',
    packageName: '@ww/page-templates',
    exportName: 'UiPageSidebar',
    parentManifestExportName:
      'UiPageTemplate / UiPageHeader / UiPageBody / UiPageSidebar / UiPageSection / UiPageToolbar',
    family: 'Page Templates',
    labEligible: false,
    labExemptionReason:
      'UiPageSidebar is tuned through UiPageTemplate because page header, body, sidebar, section, and toolbar are only meaningful together.',
  }),
  visualSurface({
    id: 'ui-page-section',
    title: 'UiPageSection',
    packageName: '@ww/page-templates',
    exportName: 'UiPageSection',
    parentManifestExportName:
      'UiPageTemplate / UiPageHeader / UiPageBody / UiPageSidebar / UiPageSection / UiPageToolbar',
    family: 'Page Templates',
    labEligible: false,
    labExemptionReason:
      'UiPageSection is tuned through UiPageTemplate because page header, body, sidebar, section, and toolbar are only meaningful together.',
  }),
  visualSurface({
    id: 'ui-page-toolbar',
    title: 'UiPageToolbar',
    packageName: '@ww/page-templates',
    exportName: 'UiPageToolbar',
    parentManifestExportName:
      'UiPageTemplate / UiPageHeader / UiPageBody / UiPageSidebar / UiPageSection / UiPageToolbar',
    family: 'Page Templates',
    labEligible: false,
    labExemptionReason:
      'UiPageToolbar is tuned through UiPageTemplate because page header, body, sidebar, section, and toolbar are only meaningful together.',
  }),
]);

export const PLAYGROUND_LAB_MANIFEST = Object.freeze(
  PLAYGROUND_VISUAL_SURFACE_MANIFEST.filter((entry) => entry.labEligible)
);
