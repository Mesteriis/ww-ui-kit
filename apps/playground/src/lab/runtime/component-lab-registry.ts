import type { LabSurfaceDefinition } from '../manifest/component-lab.types';

import dataTableWidget from '../schemas/data-table-widget.lab';
import uiApexChart from '../schemas/ui-apex-chart.lab';
import uiAlert from '../schemas/ui-alert.lab';
import uiBadge from '../schemas/ui-badge.lab';
import uiAvatar from '../schemas/ui-avatar.lab';
import uiButton from '../schemas/ui-button.lab';
import uiButtonGroup from '../schemas/ui-button-group.lab';
import uiCard from '../schemas/ui-card.lab';
import uiCheckbox from '../schemas/ui-checkbox.lab';
import uiDashboardLayout from '../schemas/ui-dashboard-layout.lab';
import uiDataGrid from '../schemas/ui-data-grid.lab';
import uiDialog from '../schemas/ui-dialog.lab';
import uiDropdown from '../schemas/ui-dropdown.lab';
import uiDrawer from '../schemas/ui-drawer.lab';
import uiEmptyState from '../schemas/ui-empty-state.lab';
import uiFlex from '../schemas/ui-flex.lab';
import uiHorizontalLayout from '../schemas/ui-horizontal-layout.lab';
import uiIconButton from '../schemas/ui-icon-button.lab';
import uiImage from '../schemas/ui-image.lab';
import uiInput from '../schemas/ui-input.lab';
import uiLayout from '../schemas/ui-layout.lab';
import uiNumberInput from '../schemas/ui-number-input.lab';
import uiPopover from '../schemas/ui-popover.lab';
import uiProgress from '../schemas/ui-progress.lab';
import uiScrollArea from '../schemas/ui-scroll-area.lab';
import uiSelect from '../schemas/ui-select.lab';
import uiSelectSimple from '../schemas/ui-select-simple.lab';
import uiSignalGraph from '../schemas/ui-signal-graph.lab';
import uiSlider from '../schemas/ui-slider.lab';
import uiSwitch from '../schemas/ui-switch.lab';
import uiSpace from '../schemas/ui-space.lab';
import uiTag from '../schemas/ui-tag.lab';
import uiTabsRoot from '../schemas/ui-tabs-root.lab';
import uiTextarea from '../schemas/ui-textarea.lab';
import uiTsParticlesBackdrop from '../schemas/ui-tsparticles-backdrop.lab';
import uiTooltip from '../schemas/ui-tooltip.lab';
import uiVerticalLayout from '../schemas/ui-vertical-layout.lab';
import uiWidgetShell from '../schemas/ui-widget-shell.lab';

const definitions = [
  uiButton,
  uiButtonGroup,
  uiIconButton,
  uiFlex,
  uiSpace,
  uiInput,
  uiTextarea,
  uiSelectSimple,
  uiNumberInput,
  uiScrollArea,
  uiSlider,
  uiSelect,
  uiCheckbox,
  uiSwitch,
  uiAlert,
  uiBadge,
  uiAvatar,
  uiCard,
  uiImage,
  uiTag,
  uiProgress,
  uiEmptyState,
  uiDialog,
  uiTooltip,
  uiPopover,
  uiDropdown,
  uiDrawer,
  uiTabsRoot,
  uiApexChart,
  uiTsParticlesBackdrop,
  uiSignalGraph,
  uiDataGrid,
  uiWidgetShell,
  dataTableWidget,
  uiLayout,
  uiVerticalLayout,
  uiHorizontalLayout,
  uiDashboardLayout,
] as const;

export const componentLabRegistry = Object.freeze(
  Object.fromEntries(
    definitions.map((definition) => [
      definition.id,
      definition as unknown as LabSurfaceDefinition<Record<string, unknown>>,
    ])
  )
) as Readonly<Record<string, LabSurfaceDefinition<Record<string, unknown>>>>;
