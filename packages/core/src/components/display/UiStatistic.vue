<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

import UiSkeleton from './UiSkeleton.vue';

defineOptions({ name: 'UiStatistic' });

const props = withDefaults(
  defineProps<{
    title?: string;
    value?: number | string | null;
    prefix?: string;
    suffix?: string;
    precision?: number;
    formatter?:
      | ((
          context: Readonly<{
            precision?: number;
            remainingMs: number | null;
            value: number | string | null;
          }>
        ) => string)
      | undefined;
    loading?: boolean;
    countdownTo?: Date | number | string | undefined;
    ariaLabel?: string;
  }>(),
  {
    ariaLabel: 'Statistic',
    loading: false,
    value: null,
  }
);

const emit = defineEmits<{
  finish: [];
}>();

const now = ref(Date.now());
let timer: ReturnType<typeof globalThis.setInterval> | null = null;
let finished = false;

const countdownTarget = computed<number | null>(() => {
  if (props.countdownTo === undefined) {
    return null;
  }

  if (props.countdownTo instanceof Date) {
    return Number.isNaN(props.countdownTo.getTime()) ? null : props.countdownTo.getTime();
  }

  if (typeof props.countdownTo === 'number') {
    return Number.isNaN(props.countdownTo) ? null : props.countdownTo;
  }

  const parsed = Date.parse(props.countdownTo);
  return Number.isNaN(parsed) ? null : parsed;
});

const remainingMs = computed(() => {
  if (countdownTarget.value === null) {
    return null;
  }

  return Math.max(0, countdownTarget.value - now.value);
});

const countdownText = computed(() => {
  if (remainingMs.value === null) {
    return null;
  }

  const totalSeconds = Math.floor(remainingMs.value / 1000);
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  const seconds = totalSeconds % 60;
  const padded = [hours, minutes, seconds].map((value) => String(value).padStart(2, '0'));

  return days > 0 ? `${days}d ${padded.join(':')}` : padded.join(':');
});

const formatPlainValue = (value: number | string | null | undefined) => {
  if (value === null || value === undefined || value === '') {
    return '—';
  }

  if (typeof value === 'number') {
    return new Intl.NumberFormat(undefined, {
      maximumFractionDigits: props.precision ?? 20,
      minimumFractionDigits: props.precision ?? 0,
    }).format(value);
  }

  return String(value);
};

const displayValue = computed(() => {
  if (props.formatter) {
    return props.formatter({
      remainingMs: remainingMs.value,
      value: countdownText.value ?? props.value ?? null,
      ...(props.precision !== undefined ? { precision: props.precision } : {}),
    });
  }

  return countdownText.value ?? formatPlainValue(props.value);
});

const syncTimer = () => {
  if (timer !== null) {
    globalThis.clearInterval(timer);
    timer = null;
  }

  if (countdownTarget.value === null || props.loading) {
    return;
  }

  now.value = Date.now();
  timer = globalThis.setInterval(() => {
    now.value = Date.now();
  }, 1_000);
};

watch(
  () => props.loading,
  () => {
    syncTimer();
  }
);

watch(countdownTarget, () => {
  finished = false;
  syncTimer();
});

watch(remainingMs, (nextRemainingMs) => {
  if (nextRemainingMs === null) {
    finished = false;
    return;
  }

  if (nextRemainingMs === 0 && !finished) {
    finished = true;
    emit('finish');
  }
});

onMounted(() => {
  syncTimer();
});

onBeforeUnmount(() => {
  if (timer !== null) {
    globalThis.clearInterval(timer);
  }
});
</script>

<template>
  <div class="ui-statistic" :aria-label="props.ariaLabel" :aria-busy="props.loading || undefined">
    <div v-if="props.title || $slots.title" class="ui-statistic__title">
      <slot name="title">{{ props.title }}</slot>
    </div>

    <div class="ui-statistic__value">
      <UiSkeleton v-if="props.loading" width="9rem" height="2.5rem" />
      <template v-else>
        <span v-if="props.prefix || $slots.prefix" class="ui-statistic__prefix">
          <slot name="prefix">{{ props.prefix }}</slot>
        </span>
        <output
          class="ui-statistic__number"
          :aria-live="countdownTarget !== null ? 'polite' : undefined"
        >
          {{ displayValue }}
        </output>
        <span v-if="props.suffix || $slots.suffix" class="ui-statistic__suffix">
          <slot name="suffix">{{ props.suffix }}</slot>
        </span>
      </template>
    </div>

    <div v-if="$slots.default" class="ui-statistic__content">
      <slot />
    </div>
  </div>
</template>
