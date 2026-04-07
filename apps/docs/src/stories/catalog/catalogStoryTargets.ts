type CatalogStoryTarget = {
  labTitle?: string;
  title: string;
};

const mapSurfaces = (surfaceNames: string[], target: CatalogStoryTarget) =>
  surfaceNames.map((surfaceName) => [surfaceName, target] as const);

const toStorybookIdSegment = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const catalogStoryTargets = new Map<string, CatalogStoryTarget>([
  ...mapSurfaces(['PrimitivePortal', 'PrimitiveFocusTrap', 'PrimitiveVisuallyHidden'], {
    title: 'Foundations/Primitives/Overview',
  }),
  ...mapSurfaces(['UiAffix', 'UiScrollTop', 'UiAnchor', 'UiGrid', 'UiFlex', 'UiSpace'], {
    title: 'Core/Scenarios/Layout',
  }),
  ...mapSurfaces(['UiScrollArea'], {
    labTitle: 'Core/Labs/UiScrollArea',
    title: 'Core/Scenarios/Layout',
  }),
  ...mapSurfaces(['UiEmptyState'], {
    title: 'Core/Scenarios/Feedback',
  }),
  ...mapSurfaces(['UiAlert'], {
    labTitle: 'Core/Labs/UiAlert',
    title: 'Core/Scenarios/Feedback',
  }),
  ...mapSurfaces(['UiCollapse', 'UiCollapsePanel'], {
    title: 'Core/Scenarios/Advanced Surfaces',
  }),
  ...mapSurfaces(
    [
      'UiAvatarGroup',
      'UiTable',
      'UiDivider',
      'UiSpinner',
      'UiSkeleton',
      'UiImage',
      'UiTimeline',
      'UiDescriptions',
      'UiStatistic',
      'UiList',
      'UiResult',
    ],
    {
      title: 'Core/Scenarios/Display',
    }
  ),
  ...mapSurfaces(['UiAvatar'], {
    labTitle: 'Core/Labs/UiAvatar',
    title: 'Core/Scenarios/Display',
  }),
  ...mapSurfaces(['UiProgress'], {
    labTitle: 'Core/Labs/UiProgress',
    title: 'Core/Scenarios/Display',
  }),
  ...mapSurfaces(['UiCard'], {
    labTitle: 'Core/Labs/UiCard',
    title: 'Core/Scenarios/Display',
  }),
  ...mapSurfaces(['UiBreadcrumb', 'UiMenu', 'UiSteps', 'UiPagination'], {
    title: 'Core/Scenarios/Navigation',
  }),
  ...mapSurfaces(['UiButton', 'UiButtonGroup'], {
    labTitle: 'Core/Labs/UiButton',
    title: 'Core/Scenarios/Buttons',
  }),
  ...mapSurfaces(['UiIconButton'], {
    labTitle: 'Core/Labs/UiIconButton',
    title: 'Core/Scenarios/Buttons',
  }),
  ...mapSurfaces(
    [
      'UiCalendar',
      'UiDatePicker',
      'UiDateRangePicker',
      'UiTimePicker',
      'UiColorPicker',
      'UiFilePicker',
      'UiMention',
      'UiIcon',
      'UiWatermark',
      'UiSplitter',
    ],
    {
      title: 'Core/Scenarios/Advanced Surfaces',
    }
  ),
  ...mapSurfaces(['UiRadio', 'UiRadioGroup'], {
    title: 'Core/Scenarios/Selection',
  }),
  ...mapSurfaces(['UiCheckbox'], {
    labTitle: 'Core/Labs/UiCheckbox',
    title: 'Core/Scenarios/Selection',
  }),
  ...mapSurfaces(['UiSwitch'], {
    labTitle: 'Core/Labs/UiSwitch',
    title: 'Core/Scenarios/Selection',
  }),
  ...mapSurfaces(
    ['UiField'],
    {
      title: 'Core/Scenarios/Fields',
    }
  ),
  ...mapSurfaces(
    [
      'UiInput',
      'UiTextarea',
      'UiSelectSimple',
      'UiNumberInput',
      'UiSelect',
      'UiAutocomplete',
      'UiInputPassword',
      'UiInputGroup',
      'UiInputTag',
      'UiInputOtp',
      'UiRangeSlider',
      'UiRating',
    ],
    {
      labTitle: 'Core/Labs/UiInput',
      title: 'Core/Scenarios/Fields',
    }
  ),
  ...mapSurfaces(['UiTextarea'], {
    labTitle: 'Core/Labs/UiTextarea',
    title: 'Core/Scenarios/Fields',
  }),
  ...mapSurfaces(['UiSelectSimple'], {
    labTitle: 'Core/Labs/UiSelectSimple',
    title: 'Core/Scenarios/Fields',
  }),
  ...mapSurfaces(['UiNumberInput'], {
    labTitle: 'Core/Labs/UiNumberInput',
    title: 'Core/Scenarios/Fields',
  }),
  ...mapSurfaces(['UiSlider'], {
    labTitle: 'Core/Labs/UiSlider',
    title: 'Core/Scenarios/Fields',
  }),
  ...mapSurfaces(['UiTabsRoot', 'UiTabsList', 'UiTabsTrigger', 'UiTabsPanel'], {
    title: 'Core/Scenarios/Tabs',
  }),
  ...mapSurfaces(
    [
      'UiAlertDialog',
      'UiContextMenu',
      'UiDialog',
      'UiDrawer',
      'UiDropdown',
      'UiImagePreview',
      'UiImagePreviewGroup',
      'UiPopconfirm',
      'UiPopover',
      'UiToast',
      'UiTooltip',
    ],
    {
      title: 'Core/Scenarios/Overlay',
    }
  ),
  ...mapSurfaces(['UiApexChart'], {
    title: 'Foundations/Charts/Apex Overview',
  }),
  ...mapSurfaces(['UiTsParticlesBackdrop'], {
    title: 'Foundations/Particles/Overview',
  }),
  ...mapSurfaces(
    [
      'UiDataGrid',
      'UiDataGridToolbar',
      'UiDataGridSearch',
      'UiDataGridFilters',
      'UiDataGridTable',
      'UiDataGridPagination',
      'UiDataGridBulkActions',
      'UiDataGridColumnVisibility',
    ],
    {
      title: 'Systems/Scenarios/Data Grid/Overview',
    }
  ),
  ...mapSurfaces(
    [
      'UiVirtualScroll',
      'UiVirtualList',
      'UiInfiniteScroll',
      'UiForm',
      'UiFormItem',
      'UiTree',
      'UiTreeSelect',
      'UiCascader',
      'UiTransfer',
      'UiUpload',
      'UiTour',
    ],
    {
      title: 'Systems/Scenarios/Interaction/Overview',
    }
  ),
  ...mapSurfaces(['UiSignalGraph'], {
    title: 'Foundations/Signal Graph/Overview',
  }),
  ...mapSurfaces(['DataTableWidget'], {
    title: 'Widgets/Scenarios/Data Table Widget/Overview',
  }),
  ...mapSurfaces(['UiWidgetShell', 'UiWidgetHeader', 'UiWidgetBody', 'UiWidgetFooter'], {
    title: 'Widgets/Scenarios/Shell',
  }),
  ...mapSurfaces(['UiDashboardLayout'], {
    title: 'Page Templates/Scenarios/Dashboard Layout',
  }),
  ...mapSurfaces(['UiBadge'], {
    labTitle: 'Core/Labs/UiBadge',
    title: 'Core/Scenarios/Display',
  }),
  ...mapSurfaces(['UiTag'], {
    labTitle: 'Core/Labs/UiTag',
    title: 'Core/Scenarios/Display',
  }),
  ...mapSurfaces(
    [
      'UiLayout',
      'UiLayoutHeader',
      'UiLayoutSider',
      'UiLayoutContent',
      'UiLayoutFooter',
      'UiLayoutSection',
      'UiLayoutToolbar',
      'UiVerticalLayout',
      'UiHorizontalLayout',
    ],
    {
      title: 'Page Templates/Scenarios/Shell',
    }
  ),
]);

const getCatalogStoryTarget = (surfaceName: string) => catalogStoryTargets.get(surfaceName) ?? null;

const getStorybookDocsPath = (title: string) => `?path=/docs/${toStorybookIdSegment(title)}--docs`;

export { getCatalogStoryTarget, getStorybookDocsPath };
export type { CatalogStoryTarget };
