export type UiDateValue = string;
export type UiDateRangeValue = [UiDateValue | null, UiDateValue | null];

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function padDatePart(value: number) {
  return String(value).padStart(2, '0');
}

export function parseDateValue(value?: string | null) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const [year, month, day] = value.split('-').map((part) => Number.parseInt(part, 10));
  if (!year || !month || !day) {
    return null;
  }

  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

export function parseMonthValue(value?: string | null) {
  if (!value || !/^\d{4}-\d{2}$/.test(value)) {
    return null;
  }

  const [year, month] = value.split('-').map((part) => Number.parseInt(part, 10));
  if (!year || !month) {
    return null;
  }

  return new Date(year, month - 1, 1);
}

export function formatDateValue(date: Date) {
  return `${date.getFullYear()}-${padDatePart(date.getMonth() + 1)}-${padDatePart(date.getDate())}`;
}

export function formatMonthValue(date: Date) {
  return `${date.getFullYear()}-${padDatePart(date.getMonth() + 1)}`;
}

export function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * MS_PER_DAY);
}

export function addMonths(date: Date, months: number) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

export function addYears(date: Date, years: number) {
  return new Date(date.getFullYear() + years, date.getMonth(), date.getDate());
}

export function startOfWeek(date: Date) {
  return addDays(date, -date.getDay());
}

export function isSameDay(left: Date, right: Date) {
  return formatDateValue(left) === formatDateValue(right);
}

export function isSameMonth(left: Date, right: Date) {
  return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth();
}

export function buildWeekdayLabels(locale: string) {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  const base = startOfWeek(new Date(2026, 0, 4));
  return Array.from({ length: 7 }, (_, index) => formatter.format(addDays(base, index)));
}

export function formatDisplayDate(
  value: string | null | undefined,
  locale: string,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' }
) {
  const date = parseDateValue(value);
  if (!date) {
    return '';
  }

  return new Intl.DateTimeFormat(locale, options).format(date);
}

export function isDateDisabled(
  value: string,
  min?: string | null,
  max?: string | null,
  disabledDates?: ((value: string) => boolean) | undefined
) {
  if ((min && value < min) || (max && value > max)) {
    return true;
  }

  return disabledDates?.(value) ?? false;
}

export function getRangeSelectionState(
  value: UiDateRangeValue,
  candidate: string
): 'start' | 'end' | 'between' | 'none' {
  const [start, end] = value;
  if (candidate === start) {
    return 'start';
  }

  if (candidate === end) {
    return 'end';
  }

  if (start && end && candidate > start && candidate < end) {
    return 'between';
  }

  return 'none';
}

export function normalizeTimeValue(value?: string | null) {
  if (!value || !/^\d{2}:\d{2}$/.test(value)) {
    return null;
  }

  const parts = value.split(':');
  if (parts.length !== 2) {
    return null;
  }

  const hours = Number.parseInt(parts[0] ?? '', 10);
  const minutes = Number.parseInt(parts[1] ?? '', 10);
  if (!Number.isInteger(hours) || !Number.isInteger(minutes)) {
    return null;
  }

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return null;
  }

  return { hours, minutes };
}

export function formatTimeValue(hours: number, minutes: number) {
  return `${padDatePart(hours)}:${padDatePart(minutes)}`;
}
