import type { LabSurfaceDefinition } from '../manifest/component-lab.types';

import dataTableWidget from '../schemas/data-table-widget.lab';
import uiApexChart from '../schemas/ui-apex-chart.lab';
import uiAlert from '../schemas/ui-alert.lab';
import uiBadge from '../schemas/ui-badge.lab';
import uiAvatar from '../schemas/ui-avatar.lab';
import uiButton from '../schemas/ui-button.lab';
import uiCard from '../schemas/ui-card.lab';
import uiCheckbox from '../schemas/ui-checkbox.lab';
import uiDataGrid from '../schemas/ui-data-grid.lab';
import uiDialog from '../schemas/ui-dialog.lab';
import uiDropdown from '../schemas/ui-dropdown.lab';
import uiDrawer from '../schemas/ui-drawer.lab';
import uiEmptyState from '../schemas/ui-empty-state.lab';
import uiIconButton from '../schemas/ui-icon-button.lab';
import uiInput from '../schemas/ui-input.lab';
import uiLayout from '../schemas/ui-layout.lab';
import uiNumberInput from '../schemas/ui-number-input.lab';
import uiPopover from '../schemas/ui-popover.lab';
import uiProgress from '../schemas/ui-progress.lab';
import uiSelect from '../schemas/ui-select.lab';
import uiSelectSimple from '../schemas/ui-select-simple.lab';
import uiSignalGraph from '../schemas/ui-signal-graph.lab';
import uiSwitch from '../schemas/ui-switch.lab';
import uiTag from '../schemas/ui-tag.lab';
import uiTabsRoot from '../schemas/ui-tabs-root.lab';
import uiTextarea from '../schemas/ui-textarea.lab';
import uiTooltip from '../schemas/ui-tooltip.lab';
import uiWidgetShell from '../schemas/ui-widget-shell.lab';

const definitions = [
  uiButton,
  uiIconButton,
  uiInput,
  uiTextarea,
  uiSelectSimple,
  uiNumberInput,
  uiSelect,
  uiCheckbox,
  uiSwitch,
  uiAlert,
  uiBadge,
  uiAvatar,
  uiCard,
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
  uiSignalGraph,
  uiDataGrid,
  uiWidgetShell,
  dataTableWidget,
  uiLayout,
] as const;

export const componentLabRegistry = Object.freeze(
  Object.fromEntries(
    definitions.map((definition) => [
      definition.id,
      definition as unknown as LabSurfaceDefinition<Record<string, unknown>>,
    ])
  )
) as Readonly<Record<string, LabSurfaceDefinition<Record<string, unknown>>>>;
