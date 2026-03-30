Сгруппировано по приоритетам: 🔴 P0 (must-have), 🟡 P1 (important), 🟢 P2 (nice-to-have)

1. 🔴 FORM — Ввод данных
   UiRadio / UiRadioGroup
   Инварианты:

RadioGroup управляет единственным выбранным значением (modelValue: string | number)
Roving focus по стрелкам (↑↓ между radio в группе)
orientation: 'horizontal' | 'vertical'
Каждый Radio имеет value, disabled, label (slot)
Группа имеет name, required, invalid, ariaDescribedby
Интеграция с UiField (label, hint, error)
disabled на группе каскадируется на всех детей
UiNumberInput (Stepper)
Инварианты:

modelValue: number | null, min, max, step, precision
Кнопки increment/decrement (слоты incrementIcon, decrementIcon)
Keyboard: ↑/↓ для step, PageUp/PageDown для ×10, Home/End для min/max
format: 'decimal' | 'currency' | 'percent' с locale-aware форматированием
allowEmpty: boolean — разрешает null
disabled, readonly, invalid, size: 'sm' | 'md' | 'lg'
inputMode: 'numeric' для мобильных
clampOnBlur: boolean — приведение к min/max при потере фокуса
UiSlider / UiRangeSlider
Инварианты:

Slider: modelValue: number, min, max, step
RangeSlider: modelValue: [number, number], minRange (минимальная дельта)
orientation: 'horizontal' | 'vertical'
marks: { value: number, label?: string }[] — метки на дорожке
tooltip: 'always' | 'hover' | 'focus' | 'never'
formatTooltip: (value: number) => string
Keyboard: ←→ для step, PageUp/PageDown для ×10, Home/End
ARIA: role="slider", aria-valuemin/max/now/text
disabled state блокирует взаимодействие, но оставляет видимость
showInput: boolean — показать числовое поле рядом
UiColorPicker
Инварианты:

modelValue: string (hex, rgb, hsl)
format: 'hex' | 'rgb' | 'hsl'
presets: string[] — предзаготовленные цвета
showAlpha: boolean — канал прозрачности
showInput: boolean — текстовое поле для ввода
Gradient area (saturation × lightness) + hue strip + alpha strip
Режим inline или popup (использует overlay)
disabled, size
UiDatePicker / UiDateRangePicker
Инварианты:

DatePicker: modelValue: Date | string | null
DateRangePicker: modelValue: [Date, Date] | null
mode: 'date' | 'month' | 'year' | 'datetime' | 'time'
locale: string, firstDayOfWeek: 0-6
disabledDates: (date: Date) => boolean
minDate, maxDate
format: string (dayjs/date-fns формат)
placeholder, clearable
Навигация: месяц/год переключатели, keyboard navigation внутри сетки
panelCount: 1 | 2 — одна или две панели (для range)
Интеграция с UiField
Inline или popup режим
showWeekNumbers: boolean
UiTimePicker
Инварианты:

modelValue: string (HH:mm или HH:mm:ss)
format: '12' | '24'
minuteStep: number, secondStep: number
showSeconds: boolean
disabledHours: number[], disabledMinutes: (hour) => number[]
Spinner или dropdown колонки для часов/минут/секунд
Keyboard: ↑↓ для значения, Tab между колонками
UiAutocomplete
Инварианты:

modelValue: string | string[] (single / multiple)
suggestions: T[] или fetchSuggestions: (query: string) => Promise<T[]>
field: keyof T — поле для отображения
minLength: number — минимум символов для поиска
delay: number — debounce в ms
multiple: boolean
maxSuggestions: number
Keyboard: ↑↓ навигация, Enter выбор, Escape закрытие
loading state при async-загрузке
Slot item для кастомного рендера предложений
completeOnFocus: boolean — показать список при фокусе
UiSelect (rich select, замена UiSelectSimple)
Инварианты:

modelValue: T | T[]
options: SelectOption<T>[] с { label, value, group?, disabled?, icon? }
multiple: boolean, searchable: boolean, clearable: boolean
groupBy: string — группировка опций
placeholder, maxSelection: number
virtualScroll: boolean — виртуализация для 1000+ опций
remote: boolean + onSearch: (query: string) => Promise<Option[]>
Keyboard: type-ahead, ↑↓ навигация, Space/Enter выбор
chip mode для multiple — выбранные как теги
Slots: option, selected, header, footer, empty
filter: 'contains' | 'startsWith' | custom
Использует overlay system для dropdown
UiCascader
Инварианты:

modelValue: (string | number)[] — path в дереве
options: CascaderOption[] с { label, value, children?, disabled?, leaf? }
expandTrigger: 'click' | 'hover'
multiple: boolean, checkStrictly: boolean
showAllLevels: boolean — показывать полный путь или только last level
searchable: boolean с flat-search по всем уровням
lazy: boolean + lazyLoad: (node) => Promise<children>
Keyboard: ←→ для уровней, ↑↓ для элементов
UiTransfer
Инварианты:

modelValue: (string | number)[] — IDs правого списка
data: { key, label, disabled? }[]
filterable: boolean
titles: [string, string]
format: { noChecked, hasChecked } — шаблоны счётчика
Двунаправленный перенос с кнопками ←→
Checkbox-based выбор элементов для переноса
Slots: default (кастомный рендер строки), leftFooter, rightFooter
UiRating
Инварианты:

modelValue: number
max: number (default: 5)
allowHalf: boolean, allowClear: boolean
icon slot / icons: Component[] (разные иконки для уровней)
colors: string[] — цвет по уровню
disabled, readonly, size: 'sm' | 'md' | 'lg'
Keyboard: ←→ для значения
ARIA: role="radiogroup" с value announcement
tooltips: string[] — подсказки при hover
UiUpload / UiFilePicker
Инварианты:

fileList: UploadFile[] (modelValue)
accept: string (MIME types), maxSize: number (bytes)
maxCount: number, multiple: boolean
action: string | ((file: File) => Promise<string>) — endpoint или handler
beforeUpload: (file: File) => boolean | Promise<boolean>
listType: 'text' | 'picture' | 'picture-card'
draggable: boolean — drag & drop zone
auto: boolean — авто-загрузка или ручной trigger
Slots: default (trigger area), file (рендер элемента списка)
Emits: select, upload, success, error, remove, progress
Показ прогресса загрузки каждого файла
UiMention
Инварианты:

modelValue: string
suggestions: MentionOption[] с { label, value, avatar? }
trigger: string (default: '@'), можно несколько (['@', '#'])
prefix: string[], placement: 'top' | 'bottom'
Popup при вводе триггер-символа
Keyboard: ↑↓ навигация, Enter/Tab выбор
loading, notFoundContent 2. 🔴 OVERLAY / FLOATING — Всплывающие элементы
UiTooltip
Инварианты:

content: string (или slot)
placement: Placement (12 позиций: top, top-start, top-end, right, ...)
trigger: 'hover' | 'focus' | 'click' | 'manual'
delay: { show: number, hide: number } (default: 200/0)
offset: number (default: 8)
disabled: boolean
arrow: boolean — показать стрелку
maxWidth: number | string
Auto-flip при выходе за viewport (используя Floating UI)
ARIA: role="tooltip", aria-describedby на trigger
Layer kind: tooltip (slot 6 в overlay system)
Reduced motion: instant appear без анимации
Одновременно может быть виден только 1 tooltip (singleton опционально)
UiPopover
Инварианты:

open: boolean (v-model)
placement: Placement (12 позиций)
trigger: 'click' | 'hover' | 'focus' | 'manual'
offset, arrow, closeOnClickOutside: boolean
Фокус не трапается (в отличие от Dialog)
Layer kind: floating
Slots: trigger (reference element), default (content)
width: 'trigger' | number | 'auto' — ширина относительно trigger
Close при Escape, но focus возвращается на trigger
Может содержать интерактивные элементы (кнопки, ссылки)
UiPopconfirm
Инварианты:

Расширение UiPopover + подтверждающий UI
title: string, description?: string
icon, confirmText, cancelText
confirmVariant: ButtonVariant
onConfirm, onCancel callbacks
Фокус на confirmButton при открытии
disabled: boolean
UiDropdown / UiDropdownMenu
Инварианты:

trigger: 'click' | 'hover' | 'contextmenu'
placement: Placement
Items: { label, value, icon?, disabled?, divider?, children? }
DropdownItem — элемент меню (может быть вложенным)
DropdownDivider — разделитель
DropdownGroup — группа с заголовком
Keyboard: ↑↓ навигация, Enter выбор, → для submenu, ← назад, Escape закрытие
ARIA: role="menu", role="menuitem"
Roving focus по пунктам
Type-ahead: печать букв для поиска пункта
Submenu: вложенные dropdown при hover/→
UiContextMenu
Инварианты:

trigger: 'contextmenu' (правый клик на trigger area)
Тот же UiDropdownMenu, но привязан к позиции курсора
event: MouseEvent координаты для позиционирования
Автоматический flip при выходе за экран
Закрытие при scroll / resize
UiToast / UiNotification
Инварианты:

Imperative API: toast.success('Saved!'), toast.error('Failed', { duration: 5000 })
position: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
duration: number (auto-dismiss), 0 = persistent
type: 'info' | 'success' | 'warning' | 'error'
closable: boolean, action: { label, onClick }
Stack behaviour: новые появляются сверху/снизу (зависит от position)
max: number — максимальное количество одновременных
Layer kind: toast (slot 8 — самый высокий)
Компонент-провайдер: <UiToastProvider> в корне приложения
Transition: slide-in + fade, exit slide-out
Pause on hover (таймер паузится при наведении)
ARIA: role="status", aria-live="polite" (info/success), "assertive" (error) 3. 🔴 NAVIGATION — Навигация
UiMenu / UiSidebar
Инварианты:

items: MenuItem[] с { label, icon?, to?, href?, children?, disabled?, badge? }
collapsed: boolean (свёрнутое состояние для sidebar)
mode: 'vertical' | 'horizontal' | 'inline'
openKeys: string[] — раскрытые подменю (v-model)
selectedKeys: string[] — активные пункты (v-model)
accordion: boolean — только один открытый submenu
Keyboard: ↑↓ навигация, Enter/Space активация, →/← submenu
ARIA: role="menubar" / role="menu", aria-expanded
indent: number — отступ вложенных уровней
Tooltip при collapsed для label
UiBreadcrumb
Инварианты:

items: BreadcrumbItem[] с { label, to?, href?, icon? }
separator: string | Component (default: '/')
maxItems: number + ellipsis collapse (показать первые N и последний)
Последний элемент — текущая страница (aria-current="page")
ARIA: nav с aria-label="Breadcrumb", ol > li
Slot item для кастомного рендера
router-link интеграция опциональна
UiPagination
Инварианты:

modelValue: number (текущая страница)
totalItems: number, pageSize: number
siblingCount: number — количество страниц рядом с текущей
boundaryCount: number — страниц у краёв
showFirstLast: boolean — кнопки «в начало» / «в конец»
showPrevNext: boolean
showSizeChanger: boolean + pageSizeOptions: number[]
showQuickJumper: boolean — «Перейти к странице N»
showTotal: (total, range) => string — отображение счётчика
disabled, size: 'sm' | 'md' | 'lg'
simple: boolean — упрощённый вид (только «Prev 1/10 Next»)
ARIA: nav с aria-label="Pagination", текущая страница aria-current="page"
UiSteps / UiStepper
Инварианты:

activeStep: number (v-model)
orientation: 'horizontal' | 'vertical'
items: StepItem[] с { title, description?, icon?, status? }
status per step: 'pending' | 'active' | 'completed' | 'error'
clickable: boolean — можно ли кликать по шагам для навигации
linear: boolean — только последовательный прогресс
Connector line между шагами (с анимацией заполнения)
size: 'sm' | 'md' | 'lg'
ARIA: role="tablist", aria-current="step" на активном
Slots: icon, title, description на каждом шаге
UiAnchor (page section navigation)
Инварианты:

items: AnchorItem[] с { href: '#section', title }
offset: number — offset от верха при scroll
affix: boolean — липкое позиционирование
targetContainer: HTMLElement — скролл-контейнер
Active link tracking при scroll
Smooth scroll при клике
direction: 'vertical' | 'horizontal'
Indicator line/dot на активном 4. 🟡 DATA DISPLAY — Отображение данных
UiAvatar / UiAvatarGroup
Инварианты:

Avatar: src, alt, fallback (initials или icon), size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number
shape: 'circle' | 'square'
color: string — фон для fallback
Fallback cascade: image → initials → icon → default icon
onError — обработка ошибки загрузки
AvatarGroup: max: number, size, surplus показывается как +N
spacing: 'tight' | 'normal' | 'loose' — overlap между аватарами
UiTag / UiChip
Инварианты:

label: string (или slot)
variant: 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info'
appearance: 'solid' | 'outline' | 'soft'
size: 'sm' | 'md' | 'lg'
closable: boolean → emit close
icon slot, rounded: boolean (pill shape)
clickable: boolean → keyboard accessible, cursor pointer
disabled: boolean
maxWidth с text-overflow: ellipsis
UiAlert
Инварианты:

type: 'info' | 'success' | 'warning' | 'error'
title: string, description: string | slot
closable: boolean, showIcon: boolean
banner: boolean — полноширинный режим без border-radius
appearance: 'solid' | 'outline' | 'soft'
ARIA: role="alert" (для error/warning), role="status" (для info/success)
Slot: icon, action, close
Close animation (collapse)
UiTimeline
Инварианты:

items: TimelineItem[] с { content, timestamp?, icon?, color?, type? }
mode: 'left' | 'right' | 'alternate'
reverse: boolean
pending: boolean | string — показать «загружается» последним пунктом
Slots: dot (кастомная точка), content, opposite (для alternate)
Connector line между элементами
UiDescriptions
Инварианты:

column: number (количество колонок, default: 3)
layout: 'horizontal' | 'vertical'
bordered: boolean
size: 'sm' | 'md' | 'lg'
title, extra slots
Children: UiDescriptionItem с { label, span?, labelAlign? }
Responsive: column count меняется по breakpoints
UiStatistic
Инварианты:

title: string, value: number | string
prefix, suffix (string или slot)
precision: number — десятичные знаки
formatter: (value) => string — кастомное форматирование
valueStyle: CSSProperties
loading: boolean
Sub-компонент UiCountdown: value: number (timestamp), format: string, emit finish
UiResult
Инварианты:

status: 'success' | 'error' | 'info' | 'warning' | '403' | '404' | '500'
title: string, subtitle: string
icon slot, extra slot (actions)
Предустановленные иконки для каждого status
Обычно fullscreen / centered
UiCollapse / UiAccordion
Инварианты:

modelValue: string | string[] — раскрытые панели
accordion: boolean — только одна открытая панель
Children: UiCollapsePanel с { value, title, disabled? }
Keyboard: Enter/Space toggle, ↑↓ между панелями
ARIA: role="region", aria-expanded, aria-controls
expandIcon slot / position: 'left' | 'right'
Animated height transition (используя collapseMotion())
bordered: boolean, ghost: boolean
UiTree
Инварианты:

data: TreeNode[] с { key, label, children?, disabled?, isLeaf? }
modelValue: (string | number)[] — checked nodes (v-model)
expandedKeys: (string | number)[] (v-model)
selectedKeys: (string | number)[] (v-model)
checkable: boolean, selectable: boolean
checkStrictly: boolean — parent/child check independence
draggable: boolean
lazy: boolean + loadData: (node) => Promise<children>
searchable: boolean + filterMethod
virtualScroll: boolean — для 10,000+ узлов
Keyboard: ↑↓ навигация, →/← expand/collapse, Space check, Enter select
ARIA: role="tree", role="treeitem", aria-expanded
Slots: title, icon, switcherIcon
showLine: boolean
UiTreeSelect
Инварианты:

Комбинация UiSelect + UiTree
Dropdown содержит дерево вместо flat list
treeData, treeCheckable, showSearch, multiple
treeDefaultExpandAll, treeExpandedKeys
UiImage / UiImagePreview
Инварианты:

src, alt, fallback, placeholder (компонент при загрузке)
lazy: boolean — ленивая загрузка (IntersectionObserver)
fit: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
preview: boolean — клик для увеличения (opens overlay)
ImagePreview: галерея с навигацией, zoom, rotate
previewGroup — группа для пролистывания
UiList / UiListItem
Инварианты:

dataSource: T[], renderItem slot
grid: { column, gutter } — grid layout
loading: boolean, loadMore slot
pagination: PaginationConfig
bordered: boolean, size: 'sm' | 'md' | 'lg'
UiListItem: title, description, avatar, actions slots
UiListItemMeta: structured metadata display
UiTable (простая таблица, не DataGrid)
Инварианты:

columns: Column[], data: T[]
bordered: boolean, striped: boolean
size: 'sm' | 'md' | 'lg'
stickyHeader: boolean
scroll: { x?, y? } — scroll dimensions
Simpler API чем DataGrid (без toolbar, filters, pagination)
rowClassName, cellClassName
Column: title, dataIndex, width, align, fixed, sorter, render
UiCalendar
Инварианты:

modelValue: Date
mode: 'month' | 'year'
fullscreen: boolean
disabledDate: (date) => boolean
dateCellRender slot — кастомное содержимое ячейки
headerRender slot
locale, validRange: [Date, Date]
Переключение месяцев/лет 5. 🟡 LAYOUT — Компоновка
UiGrid (Row + Col)
Инварианты:

UiRow: gutter: number | [number, number], justify, align, wrap
UiCol: span: 1-24, offset, push, pull, order
Responsive: xs, sm, md, lg, xl, xxl breakpoint overrides
CSS Grid или Flexbox based
gutter может быть responsive: { xs: 8, sm: 16, md: 24 }
UiSpace
Инварианты:

direction: 'horizontal' | 'vertical'
size: 'sm' | 'md' | 'lg' | number
align: 'start' | 'end' | 'center' | 'baseline'
wrap: boolean
separator slot (элемент между children)
Compact mode (removes spacing)
UiFlex
Инварианты:

direction: 'row' | 'column' | 'row-reverse' | 'column-reverse'
wrap: 'nowrap' | 'wrap' | 'wrap-reverse'
justify, align, gap: number | string
Utility component — тонкая обёртка над CSS flex
UiLayout (App Shell)
Инварианты:

UiLayout, UiLayoutHeader, UiLayoutSider, UiLayoutContent, UiLayoutFooter
Sider: collapsed (v-model), collapsedWidth, width, breakpoint, trigger slot
Layout: auto-detects sider и adjusts content margin
Responsive collapse через media queries
theme: 'light' | 'dark' на sider
UiScrollArea (custom scrollbar)
Инварианты:

Кастомные скроллбары (overlay поверх content)
type: 'auto' | 'always' | 'scroll' | 'hover' — когда показывать
orientation: 'vertical' | 'horizontal' | 'both'
scrollbarSize: number
Touch-friendly на мобильных
onScroll event, scrollTo() API
UiAffix (Sticky)
Инварианты:

offsetTop: number, offsetBottom: number
target: () => HTMLElement — scroll container
Emits: change: (affixed: boolean)
CSS position: sticky с JS fallback
UiSplitter (Resizable Panels)
Инварианты:

orientation: 'horizontal' | 'vertical'
Children: UiSplitterPanel с { size, minSize, maxSize, collapsible }
Drag handle между панелями
Keyboard: ←→/↑↓ для resize, Enter для collapse
onResize callback
gutterSize: number 6. 🟡 FEEDBACK — Обратная связь
UiProgress (Linear + Circular)
Инварианты:

value: number (0-100), max: number
type: 'linear' | 'circle' | 'dashboard'
size: 'sm' | 'md' | 'lg' или width: number (для circle)
strokeWidth: number
status: 'active' | 'success' | 'exception'
showValue: boolean, format: (percent) => string
indeterminate: boolean — анимация без значения
color: string | ((percent) => string) — кастомный цвет / gradient
ARIA: role="progressbar", aria-valuenow/min/max
UiMessage (inline message, lightweight toast)
Инварианты:

Imperative API: message.info('Hello'), message.success('Done')
Упрощённый UiToast: появляется сверху по центру
duration: number, closable: boolean
type: 'info' | 'success' | 'warning' | 'error' | 'loading'
loading type: возвращает handler для закрытия/обновления
Стек: одновременно несколько, но compact
UiAlertDialog (confirmation dialog)
Инварианты:

Расширение UiDialog для confirm/alert actions
type: 'info' | 'success' | 'warning' | 'error'
Imperative API: confirm({ title, content, onOk, onCancel })
okText, cancelText, okVariant
Focus trap обязателен
closable: boolean (может быть false для force-confirm)
UiDrawerForm / UiDialogForm
Инварианты:

Composition of Dialog/Drawer + Form
initialValues, onSubmit, onCancel
Закрытие при успешном submit
Unsaved changes warning при закрытии с изменениями 7. 🟢 FORM ADVANCED — Сложные формы
UiForm / UiFormItem
Инварианты:

UiForm: model: Record<string, any>, rules: ValidationRules
layout: 'horizontal' | 'vertical' | 'inline'
labelWidth: number | string, labelAlign: 'left' | 'right'
disabled: boolean — каскадируется на все поля
Methods: validate(), validateField(name), resetFields(), clearValidation()
UiFormItem: field: string, label, rules, required
Валидация: trigger: 'blur' | 'change' | 'submit'
Rule format: { required?, type?, min?, max?, pattern?, validator?, message }
Async validation support
Cross-field validation
Scroll-to-first-error при submit
UiInputGroup
Инварианты:

Объединение нескольких inputs визуально
compact: boolean — убрать gap между элементами
Поддержка prepend/append addons (текст, select, button)
Unified border-radius (rounded только у первого и последнего)
UiInputTag / UiChipInput
Инварианты:

modelValue: string[]
Ввод текста → Enter → добавление тега
max: number, allowDuplicates: boolean
validation: (tag: string) => boolean | string
Backspace удаляет последний тег
separator: string — можно вставить несколько через paste
disabled, readonly, placeholder
UiInputPassword
Инварианты:

Расширение UiInput с toggle visibility
showToggle: boolean (default: true)
strengthMeter: boolean — показать индикатор сложности
strengthRules: PasswordRule[] — чеклист правил
Иконка eye/eye-off для toggle
UiInputOtp (One-Time Password)
Инварианты:

modelValue: string, length: number (default: 6)
type: 'numeric' | 'alphanumeric'
mask: boolean — скрывать введённые символы
Auto-focus следующего поля при вводе
Backspace → фокус на предыдущее
Paste: распределить по полям
separator между группами (после 3-го символа)
disabled, invalid 8. 🟢 MISC — Утилитарные
UiIcon
Инварианты:

name: string (из иконочного набора)
size: number | 'sm' | 'md' | 'lg'
color: string
spin: boolean — вращение (для loading)
rotate: number — угол поворота
Рендер через SVG спрайт или inline SVG
ariaLabel для accessibility
Поддержка кастомных SVG через slot
UiScrollTop (Back to Top)
Инварианты:

target: HTMLElement | Window
visibilityHeight: number — порог появления
behavior: 'smooth' | 'instant'
bottom, right — позиция
Slot: кастомная кнопка
Transition: fade-in/out
UiConfigProvider
Инварианты:

locale: Locale
theme: ThemeName
size: 'sm' | 'md' | 'lg' — глобальный размер
componentDefaults: Record<ComponentName, DefaultProps>
Wraps всё приложение, provides context
Nested providers для overrides
UiWatermark
Инварианты:

content: string | string[]
rotate: number (default: -22)
gap: [number, number]
offset: [number, number]
font: { color, fontSize, fontFamily, fontWeight }
Canvas-rendered watermark overlay
MutationObserver protection от удаления
UiTour (Guide / Walkthrough)
Инварианты:

steps: TourStep[] с { target, title, description, placement }
current: number (v-model)
open: boolean (v-model)
type: 'default' | 'primary'
Highlight target element + overlay вокруг
Prev/Next/Finish buttons
Scroll-to-step автоматически
mask: boolean — затемнение вокруг target
UiVirtualScroll / UiVirtualList
Инварианты:

items: T[], itemSize: number | ((index) => number)
renderItem: (item, index) => VNode
overscan: number — дополнительные элементы за viewport
orientation: 'vertical' | 'horizontal'
scrollToIndex(index) API
Поддержка 100,000+ элементов
Dynamic height (measured) mode
UiInfiniteScroll
Инварианты:

loading: boolean, disabled: boolean
distance: number — расстояние до конца для trigger
direction: 'top' | 'bottom'
Emit: load-more
Slot: loading (спиннер)
📊 Сводка
Группа Уже есть Нужно добавить Итого
Form Basic 6 13 19
Form Advanced 0 5 5
Overlay/Floating 2 7 9
Navigation 4 5 9
Data Display 5 14 19
Feedback 1 4 5
Layout 2 7 9
Utility 3 7 10
Data (complex) 8 0 8
Visualization 2 0 2
Page Templates 6 0 6
Widgets 6 0 6
ИТОГО ~45 ~62 ~107
🗓️ Рекомендуемый порядок реализации
Phase 1 — «Ежедневные» компоненты (2-3 недели)
Без них невозможно собрать production-приложение

UiTooltip + UiPopover — используют готовый overlay system
UiDropdown / UiDropdownMenu — зависит от overlay
UiToast / UiNotification — toast slot уже зарезервирован
UiAlert — простой, но критичный
UiAvatar / UiAvatarGroup — визуальный базис
UiTag / UiChip — нужен для UiSelect с chips
UiRadioGroup — базовая форма
UiCollapse / UiAccordion — collapseMotion() уже есть
UiBreadcrumb — navigation must-have
UiPagination — standalone (DataGrid имеет встроенную)
Phase 2 — «Составные» компоненты (3-4 недели)
Компоненты, которые собираются из Phase 1

UiSelect (rich) — использует UiDropdown + UiTag
UiAutocomplete — использует overlay
UiMenu / UiSidebar — navigation core
UiForm / UiFormItem — валидация
UiProgress — feedback
UiTree — data display
UiDatePicker — complex form input
UiSteps — navigation
UiLayout — app shell
Phase 3 — «Продвинутые» компоненты (3-4 недели)
Polish и сложные компоненты

20-30. Всё остальное: Transfer, Cascader, Upload, VirtualScroll, Tour, etc.
