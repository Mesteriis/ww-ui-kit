import type { LabSurfaceDefinition } from '../manifest/component-lab.types';
type LabSurfaceModule = {
  default: unknown;
};

type LabSurfaceDefinitionLoader = () => Promise<LabSurfaceModule>;

export const componentLabDefinitionLoaders = Object.freeze({
  'data-table-widget': () => import('../schemas/data-table-widget.lab'),
  'ui-alert': () => import('../schemas/ui-alert.lab'),
  'ui-apex-chart': () => import('../schemas/ui-apex-chart.lab'),
  'ui-avatar': () => import('../schemas/ui-avatar.lab'),
  'ui-badge': () => import('../schemas/ui-badge.lab'),
  'ui-button': () => import('../schemas/ui-button.lab'),
  'ui-button-group': () => import('../schemas/ui-button-group.lab'),
  'ui-card': () => import('../schemas/ui-card.lab'),
  'ui-checkbox': () => import('../schemas/ui-checkbox.lab'),
  'ui-dashboard-layout': () => import('../schemas/ui-dashboard-layout.lab'),
  'ui-data-grid': () => import('../schemas/ui-data-grid.lab'),
  'ui-dialog': () => import('../schemas/ui-dialog.lab'),
  'ui-drawer': () => import('../schemas/ui-drawer.lab'),
  'ui-dropdown': () => import('../schemas/ui-dropdown.lab'),
  'ui-empty-state': () => import('../schemas/ui-empty-state.lab'),
  'ui-flex': () => import('../schemas/ui-flex.lab'),
  'ui-horizontal-layout': () => import('../schemas/ui-horizontal-layout.lab'),
  'ui-icon-button': () => import('../schemas/ui-icon-button.lab'),
  'ui-image': () => import('../schemas/ui-image.lab'),
  'ui-input': () => import('../schemas/ui-input.lab'),
  'ui-layout': () => import('../schemas/ui-layout.lab'),
  'ui-number-input': () => import('../schemas/ui-number-input.lab'),
  'ui-popover': () => import('../schemas/ui-popover.lab'),
  'ui-progress': () => import('../schemas/ui-progress.lab'),
  'ui-scroll-area': () => import('../schemas/ui-scroll-area.lab'),
  'ui-select': () => import('../schemas/ui-select.lab'),
  'ui-select-simple': () => import('../schemas/ui-select-simple.lab'),
  'ui-signal-graph': () => import('../schemas/ui-signal-graph.lab'),
  'ui-slider': () => import('../schemas/ui-slider.lab'),
  'ui-space': () => import('../schemas/ui-space.lab'),
  'ui-switch': () => import('../schemas/ui-switch.lab'),
  'ui-tabs-root': () => import('../schemas/ui-tabs-root.lab'),
  'ui-tag': () => import('../schemas/ui-tag.lab'),
  'ui-textarea': () => import('../schemas/ui-textarea.lab'),
  'ui-tooltip': () => import('../schemas/ui-tooltip.lab'),
  'ui-tsparticles-backdrop': () => import('../schemas/ui-tsparticles-backdrop.lab'),
  'ui-vertical-layout': () => import('../schemas/ui-vertical-layout.lab'),
  'ui-widget-shell': () => import('../schemas/ui-widget-shell.lab'),
}) as Readonly<Record<string, LabSurfaceDefinitionLoader>>;

export async function loadComponentLabDefinition(surfaceId: string) {
  const loader = componentLabDefinitionLoaders[surfaceId];
  if (!loader) {
    throw new Error(`Missing runtime component lab definition for "${surfaceId}".`);
  }

  const module = await loader();
  if (!module.default) {
    throw new Error(`Component lab definition "${surfaceId}" does not declare a default export.`);
  }

  return module.default as LabSurfaceDefinition<Record<string, unknown>>;
}
