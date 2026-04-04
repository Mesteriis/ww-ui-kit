<script setup lang="ts">
import { computed, nextTick, ref, watch, type ComponentPublicInstance } from 'vue';

import { useControllable } from '@ww/primitives';

import UiIcon from '../display/UiIcon.vue';
import UiIconButton from '../buttons/UiIconButton.vue';
import {
  addDays,
  addMonths,
  addYears,
  buildWeekdayLabels,
  endOfMonth,
  formatDateValue,
  formatMonthValue,
  getRangeSelectionState,
  isDateDisabled,
  isSameMonth,
  parseDateValue,
  parseMonthValue,
  startOfMonth,
  startOfWeek,
  type UiDateRangeValue,
} from './date-utils';

defineOptions({ name: 'UiCalendar' });

export type UiCalendarMode = 'single' | 'range';
export type UiCalendarValue = string | UiDateRangeValue | null;

const props = withDefaults(
  defineProps<{
    modelValue?: UiCalendarValue | undefined;
    month?: string | undefined;
    defaultMonth?: string | undefined;
    mode?: UiCalendarMode;
    locale?: string;
    min?: string | undefined;
    max?: string | undefined;
    disabledDates?: ((value: string) => boolean) | undefined;
    ariaLabel?: string;
  }>(),
  {
    ariaLabel: 'Calendar',
    defaultMonth: '',
    locale: 'en-US',
    mode: 'single',
  }
);

const emit = defineEmits<{
  'update:modelValue': [value: UiCalendarValue];
  'update:month': [value: string];
}>();

const todayValue = formatDateValue(new Date());

const selectionState = useControllable<UiCalendarValue>({
  defaultValue: props.mode === 'range' ? [null, null] : null,
  onChange: (value) => emit('update:modelValue', value),
  value: computed(() => props.modelValue),
});

const monthState = useControllable<string>({
  defaultValue:
    props.defaultMonth ||
    formatMonthValue(parseDateValue(typeof props.modelValue === 'string' ? props.modelValue : null) ?? new Date()),
  onChange: (value) => emit('update:month', value),
  value: computed(() => props.month),
});

const activeDate = ref(
  typeof selectionState.currentValue.value === 'string' && selectionState.currentValue.value
    ? selectionState.currentValue.value
    : todayValue
);
const cellRefs = new Map<string, HTMLButtonElement>();

const visibleMonth = computed(() => parseMonthValue(monthState.currentValue.value) ?? startOfMonth(new Date()));
const monthLabel = computed(() =>
  new Intl.DateTimeFormat(props.locale, { month: 'long', year: 'numeric' }).format(visibleMonth.value)
);
const weekdayLabels = computed(() => buildWeekdayLabels(props.locale));
const selectedRange = computed<UiDateRangeValue>(() => {
  if (props.mode !== 'range') {
    return [null, null];
  }

  const value = selectionState.currentValue.value;
  return Array.isArray(value) ? value : [null, null];
});

const cells = computed(() => {
  const start = startOfWeek(startOfMonth(visibleMonth.value));
  return Array.from({ length: 42 }, (_, index) => {
    const date = addDays(start, index);
    const value = formatDateValue(date);
    const rangeState = getRangeSelectionState(selectedRange.value, value);
    const singleSelected =
      props.mode === 'single' && selectionState.currentValue.value === value;
    const disabled = isDateDisabled(value, props.min, props.max, props.disabledDates);

    return {
      date,
      day: date.getDate(),
      disabled,
      inCurrentMonth: isSameMonth(date, visibleMonth.value),
      isToday: value === todayValue,
      isActive: value === activeDate.value,
      rangeState,
      selected: singleSelected || rangeState !== 'none',
      value,
    };
  });
});

const focusCell = async (value: string) => {
  await nextTick();
  cellRefs.get(value)?.focus();
};

const setCellRef = (
  value: string,
  element: Element | ComponentPublicInstance | null
) => {
  if (element instanceof HTMLElement) {
    cellRefs.set(value, element as HTMLButtonElement);
    return;
  }

  cellRefs.delete(value);
};

const setActiveDate = async (value: string) => {
  activeDate.value = value;
  const parsed = parseDateValue(value);
  if (parsed && !isSameMonth(parsed, visibleMonth.value)) {
    monthState.setValue(formatMonthValue(parsed));
  }
  await focusCell(value);
};

const selectDate = (value: string) => {
  if (isDateDisabled(value, props.min, props.max, props.disabledDates)) {
    return;
  }

  if (props.mode === 'range') {
    const [start, end] = selectedRange.value;
    if (!start || (start && end)) {
      selectionState.setValue([value, null]);
      return;
    }

    if (value < start) {
      selectionState.setValue([value, start]);
      return;
    }

    selectionState.setValue([start, value]);
    return;
  }

  selectionState.setValue(value);
};

const moveMonth = (delta: number) => {
  monthState.setValue(formatMonthValue(addMonths(visibleMonth.value, delta)));
};

const onKeydownCell = async (event: KeyboardEvent, value: string) => {
  const parsed = parseDateValue(value);
  if (!parsed) {
    return;
  }

  let nextDate: Date | null = null;
  if (event.key === 'ArrowRight') {
    nextDate = addDays(parsed, 1);
  } else if (event.key === 'ArrowLeft') {
    nextDate = addDays(parsed, -1);
  } else if (event.key === 'ArrowDown') {
    nextDate = addDays(parsed, 7);
  } else if (event.key === 'ArrowUp') {
    nextDate = addDays(parsed, -7);
  } else if (event.key === 'Home') {
    nextDate = startOfWeek(parsed);
  } else if (event.key === 'End') {
    nextDate = addDays(startOfWeek(parsed), 6);
  } else if (event.key === 'PageUp') {
    nextDate = event.shiftKey ? addYears(parsed, -1) : addMonths(parsed, -1);
  } else if (event.key === 'PageDown') {
    nextDate = event.shiftKey ? addYears(parsed, 1) : addMonths(parsed, 1);
  } else if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    selectDate(value);
    return;
  }

  if (nextDate) {
    event.preventDefault();
    await setActiveDate(formatDateValue(nextDate));
  }
};

watch(
  () => selectionState.currentValue.value,
  (value) => {
    if (typeof value === 'string' && value) {
      activeDate.value = value;
    } else if (Array.isArray(value) && value[0]) {
      activeDate.value = value[0];
    }
  }
);
</script>

<template>
  <div class="ui-calendar" :aria-label="props.ariaLabel">
    <header class="ui-calendar__header">
      <UiIconButton ariaLabel="Previous month" @click="moveMonth(-1)">
        <UiIcon name="chevronLeft" />
      </UiIconButton>
      <div class="ui-calendar__month">{{ monthLabel }}</div>
      <UiIconButton ariaLabel="Next month" @click="moveMonth(1)">
        <UiIcon name="chevronRight" />
      </UiIconButton>
    </header>

    <div class="ui-calendar__weekdays" aria-hidden="true">
      <span v-for="label in weekdayLabels" :key="label">{{ label }}</span>
    </div>

    <div class="ui-calendar__grid" role="grid">
      <button
        v-for="cell in cells"
        :key="cell.value"
        :ref="(element) => setCellRef(cell.value, element)"
        type="button"
        class="ui-calendar__cell"
        :class="[
          {
            'is-active': cell.isActive,
            'is-disabled': cell.disabled,
            'is-outside': !cell.inCurrentMonth,
            'is-selected': cell.selected,
            'is-today': cell.isToday,
            'is-range-between': cell.rangeState === 'between',
          },
          cell.rangeState === 'start' ? 'is-range-start' : '',
          cell.rangeState === 'end' ? 'is-range-end' : '',
        ]"
        role="gridcell"
        :tabindex="cell.isActive ? 0 : -1"
        :aria-selected="cell.selected || undefined"
        :disabled="cell.disabled"
        @click="selectDate(cell.value)"
        @focus="activeDate = cell.value"
        @keydown="(event) => void onKeydownCell(event, cell.value)"
      >
        {{ cell.day }}
      </button>
    </div>
  </div>
</template>
