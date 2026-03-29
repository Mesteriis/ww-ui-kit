export { default as UiWidgetShell } from './shells/UiWidgetShell.vue';
export { default as UiWidgetHeader } from './shells/UiWidgetHeader.vue';
export { default as UiWidgetBody } from './shells/UiWidgetBody.vue';
export { default as UiWidgetFooter } from './shells/UiWidgetFooter.vue';
export { DataTableWidget } from './data/data-table-widget';
export type {
  DataTableWidgetBulkActionsSlotProps,
  DataTableWidgetProps,
  DataTableWidgetStatusSummary,
} from './data/data-table-widget';
export {
  RESERVED_WIDGET_NAMESPACES,
  WIDGET_LAYER_RULES,
  type WidgetLayerRule,
} from './shared/widget-contracts';
export {
  WIDGET_SURFACES,
  type WidgetErrorState,
  type WidgetShellProps,
  type WidgetSurface,
} from './shared/types';
