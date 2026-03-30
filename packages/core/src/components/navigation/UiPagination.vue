<script setup lang="ts">
import { computed } from 'vue';

import { useControllable } from '@ww/primitives';

import { buildPaginationItems, getTotalPages } from './pagination';

defineOptions({ name: 'UiPagination' });

const props = withDefaults(
  defineProps<{
    modelValue?: number;
    defaultPage?: number;
    totalItems: number;
    pageSize: number;
    siblingCount?: number;
    boundaryCount?: number;
    showFirstLast?: boolean;
    showPrevNext?: boolean;
    simple?: boolean;
    disabled?: boolean;
    ariaLabel?: string;
  }>(),
  {
    ariaLabel: 'Pagination',
    boundaryCount: 1,
    defaultPage: 1,
    disabled: false,
    showFirstLast: true,
    showPrevNext: true,
    siblingCount: 1,
    simple: false,
  }
);

const emit = defineEmits<{
  'update:modelValue': [value: number];
}>();

const state = useControllable({
  defaultValue: props.defaultPage,
  onChange: (value) => emit('update:modelValue', value),
  value: computed(() => props.modelValue),
});

const totalPages = computed(() => getTotalPages(props.totalItems, props.pageSize));
const currentPage = computed(() =>
  Math.min(Math.max(1, state.currentValue.value), totalPages.value)
);
const items = computed(() =>
  buildPaginationItems({
    currentPage: currentPage.value,
    totalPages: totalPages.value,
    siblingCount: props.siblingCount,
    boundaryCount: props.boundaryCount,
  })
);

const setPage = (page: number) => {
  if (props.disabled) {
    return;
  }

  state.setValue(Math.min(Math.max(1, page), totalPages.value));
};
</script>

<template>
  <nav class="ui-pagination" :aria-label="props.ariaLabel">
    <div v-if="props.simple" class="ui-pagination__simple">
      <button
        v-if="props.showPrevNext"
        type="button"
        class="ui-pagination__nav"
        :disabled="props.disabled || currentPage <= 1"
        data-ui-motion="ring-focus-soft"
        aria-label="Previous page"
        @click="setPage(currentPage - 1)"
      >
        Prev
      </button>
      <span class="ui-pagination__simple-status">
        Page <span aria-current="page">{{ currentPage }}</span> of {{ totalPages }}
      </span>
      <button
        v-if="props.showPrevNext"
        type="button"
        class="ui-pagination__nav"
        :disabled="props.disabled || currentPage >= totalPages"
        data-ui-motion="ring-focus-soft"
        aria-label="Next page"
        @click="setPage(currentPage + 1)"
      >
        Next
      </button>
    </div>

    <ol v-else class="ui-pagination__list">
      <li v-if="props.showFirstLast" class="ui-pagination__item">
        <button
          type="button"
          class="ui-pagination__nav"
          :disabled="props.disabled || currentPage <= 1"
          data-ui-motion="ring-focus-soft"
          aria-label="First page"
          @click="setPage(1)"
        >
          First
        </button>
      </li>
      <li v-if="props.showPrevNext" class="ui-pagination__item">
        <button
          type="button"
          class="ui-pagination__nav"
          :disabled="props.disabled || currentPage <= 1"
          data-ui-motion="ring-focus-soft"
          aria-label="Previous page"
          @click="setPage(currentPage - 1)"
        >
          Prev
        </button>
      </li>
      <li
        v-for="item in items"
        :key="item.kind === 'page' ? `page-${item.page}` : item.id"
        class="ui-pagination__item"
      >
        <span v-if="item.kind === 'ellipsis'" class="ui-pagination__ellipsis" aria-hidden="true">
          …
        </span>
        <button
          v-else
          type="button"
          class="ui-pagination__page"
          :class="{ 'is-current': currentPage === item.page }"
          :aria-current="currentPage === item.page ? 'page' : undefined"
          :disabled="props.disabled"
          data-ui-motion="ring-focus-soft"
          @click="setPage(item.page)"
        >
          {{ item.page }}
        </button>
      </li>
      <li v-if="props.showPrevNext" class="ui-pagination__item">
        <button
          type="button"
          class="ui-pagination__nav"
          :disabled="props.disabled || currentPage >= totalPages"
          data-ui-motion="ring-focus-soft"
          aria-label="Next page"
          @click="setPage(currentPage + 1)"
        >
          Next
        </button>
      </li>
      <li v-if="props.showFirstLast" class="ui-pagination__item">
        <button
          type="button"
          class="ui-pagination__nav"
          :disabled="props.disabled || currentPage >= totalPages"
          data-ui-motion="ring-focus-soft"
          aria-label="Last page"
          @click="setPage(totalPages)"
        >
          Last
        </button>
      </li>
    </ol>
  </nav>
</template>
