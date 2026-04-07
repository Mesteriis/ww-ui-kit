type StoryShellOption = {
  label: string;
  value: string;
};

type StoryShellMeta = {
  options: StoryShellOption[];
};

const toOption = (label: string): StoryShellOption => ({
  label,
  value: label.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
});

const createMeta = (...labels: string[]): StoryShellMeta => ({
  options: labels.map(toOption),
});

const mapSurfaces = (surfaceNames: string[], meta: StoryShellMeta) =>
  surfaceNames.map((surfaceName) => [surfaceName, meta] as const);

const surfaceMeta = new Map<string, StoryShellMeta>([
  ...mapSurfaces(['PrimitivePortal', 'PrimitiveFocusTrap', 'PrimitiveVisuallyHidden'], createMeta('Overview')),
  ...mapSurfaces(['UiAffix', 'UiScrollArea', 'UiScrollTop'], createMeta('Scroll utilities')),
  ...mapSurfaces(['UiAnchor'], createMeta('Section anchor')),
  ...mapSurfaces(['UiAlert', 'UiCollapse', 'UiCollapsePanel', 'UiEmptyState'], createMeta('Empty state')),
  ...mapSurfaces(
    ['UiAvatar', 'UiAvatarGroup', 'UiProgress', 'UiTable', 'UiBadge', 'UiCard', 'UiDivider', 'UiSpinner', 'UiSkeleton', 'UiTag'],
    createMeta('Surfaces and status')
  ),
  ...mapSurfaces(['UiBreadcrumb', 'UiMenu', 'UiSteps', 'UiPagination'], createMeta('Breadcrumb and pagination')),
  ...mapSurfaces(['UiButton'], createMeta('All variants and props', 'Loading and sizes')),
  ...mapSurfaces(['UiButtonGroup'], createMeta('Groups')),
  ...mapSurfaces(['UiIconButton'], createMeta('Loading and sizes')),
  ...mapSurfaces(
    ['UiCalendar', 'UiDatePicker', 'UiDateRangePicker', 'UiTimePicker', 'UiColorPicker', 'UiFilePicker', 'UiMention', 'UiIcon', 'UiWatermark', 'UiSplitter', 'UiAlertDialog', 'UiImagePreview', 'UiImagePreviewGroup'],
    createMeta('Advanced surfaces')
  ),
  ...mapSurfaces(['UiCheckbox', 'UiSwitch', 'UiRadio', 'UiRadioGroup'], createMeta('Boolean controls')),
  ...mapSurfaces(['UiField', 'UiInput', 'UiTextarea', 'UiSelectSimple', 'UiNumberInput', 'UiSelect', 'UiAutocomplete'], createMeta('Inputs')),
  ...mapSurfaces(['UiGrid', 'UiFlex'], createMeta('Utility layouts')),
  ...mapSurfaces(['UiSpace'], createMeta('Compact and responsive')),
  ...mapSurfaces(['UiImage'], createMeta('Images and fallbacks')),
  ...mapSurfaces(['UiInputPassword', 'UiInputGroup', 'UiInputTag', 'UiInputOtp'], createMeta('Input enrichments')),
  ...mapSurfaces(['UiRating'], createMeta('Rating states')),
  ...mapSurfaces(['UiResult'], createMeta('Result states')),
  ...mapSurfaces(['UiSlider'], createMeta('Slider states')),
  ...mapSurfaces(['UiRangeSlider'], createMeta('Slider edge cases')),
  ...mapSurfaces(['UiTabsRoot', 'UiTabsList', 'UiTabsTrigger', 'UiTabsPanel'], createMeta('Compound tabs')),
  ...mapSurfaces(['UiTimeline', 'UiDescriptions', 'UiStatistic', 'UiList'], createMeta('Information edge cases')),
  ...mapSurfaces(['UiContextMenu', 'UiDialog', 'UiDrawer', 'UiDropdown', 'UiPopconfirm', 'UiPopover', 'UiToast', 'UiTooltip'], createMeta('Dialog and drawer')),
  ...mapSurfaces(['UiApexChart'], createMeta('Overview', 'States', 'Responsive', 'Interactions', 'Theme type', 'Theming')),
  ...mapSurfaces(['UiTsParticlesBackdrop'], createMeta('Overview', 'States', 'Responsive', 'Theming')),
  ...mapSurfaces(['UiDataGrid'], createMeta('Overview', 'Bulk actions', 'Column visibility')),
  ...mapSurfaces(
    ['UiDataGridToolbar', 'UiDataGridSearch', 'UiDataGridFilters', 'UiDataGridTable', 'UiDataGridPagination'],
    createMeta('Subcomponents')
  ),
  ...mapSurfaces(['UiDataGridBulkActions'], createMeta('Bulk actions')),
  ...mapSurfaces(['UiDataGridColumnVisibility'], createMeta('Column visibility')),
  ...mapSurfaces(['UiVirtualScroll', 'UiVirtualList', 'UiInfiniteScroll'], createMeta('Overview', 'States', 'Interactions')),
  ...mapSurfaces(['UiForm', 'UiFormItem', 'UiTree', 'UiTreeSelect', 'UiCascader', 'UiTransfer', 'UiUpload'], createMeta('Overview')),
  ...mapSurfaces(['UiTour'], createMeta('Overview', 'Theming', 'Interactions')),
  ...mapSurfaces(
    ['UiSignalGraph'],
    createMeta(
      'Overview',
      'States',
      'Signals',
      'Focus and depth',
      'Nodes as components',
      'Overlays in nodes',
      'Reduced motion',
      'Theming',
      'Use cases'
    )
  ),
  ...mapSurfaces(['DataTableWidget'], createMeta('Overview')),
  ...mapSurfaces(['UiWidgetShell', 'UiWidgetHeader', 'UiWidgetBody', 'UiWidgetFooter'], createMeta('Overview')),
  ...mapSurfaces(['UiDashboardLayout'], createMeta('Overview')),
  ...mapSurfaces(
    ['UiLayout', 'UiLayoutHeader', 'UiLayoutSider', 'UiLayoutContent', 'UiLayoutFooter', 'UiLayoutSection', 'UiLayoutToolbar', 'UiVerticalLayout', 'UiHorizontalLayout'],
    createMeta('Overview')
  ),
]);

const titleMeta = new Map<string, StoryShellMeta>([
  ['Architecture/Layering', createMeta('Overview')],
  ['Architecture/Page Templates/Overview', createMeta('Overview')],
  ['Architecture/Widgets/Data Table Widget', createMeta('Overview')],
  ['Architecture/Widgets/Overview', createMeta('Overview')],
  ['Foundations/Belovodye Theme', createMeta('System showcase')],
  ['Foundations/Motion Overview', createMeta('Utilities and tokens', 'Preset lab and collapse')],
  ['Foundations/Overlay Layers', createMeta('Layer scale and nested stack')],
  ['Foundations/Theme Scoped Overlay', createMeta('Scoped theme and explicit target')],
  ['Foundations/Theme System Overview', createMeta('Overview')],
  ['Public Surfaces', createMeta('Manifest group')],
  ['Workspace/Canvas', createMeta('Canvas')],
]);

const getStoryShellMeta = (title: string, storyName: string): StoryShellMeta =>
  surfaceMeta.get(storyName) ?? titleMeta.get(title) ?? createMeta(storyName);

export type { StoryShellMeta, StoryShellOption };
export { getStoryShellMeta };
