<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, type ComponentPublicInstance, watch } from 'vue';

import { PrimitivePortal, useId } from '@ww/primitives';

import {
  findBoundaryListboxRecord,
  findListboxTypeaheadRecord,
  filterListboxRecords,
} from './listbox';
import { mergeDescribedBy, useFieldContext } from './field-context';
import { useFloatingSurface } from '../overlay/useFloatingSurface';

defineOptions({ name: 'UiAutocomplete' });

export interface UiAutocompleteItem {
  label: string;
  value?: string;
  disabled?: boolean;
  description?: string;
  keywords?: readonly string[];
}

type NormalizedAutocompleteItem = UiAutocompleteItem & {
  id: string;
  resolvedValue: string;
};

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    id?: string;
    name?: string;
    ariaLabel?: string;
    items: UiAutocompleteItem[];
    loading?: boolean;
    placeholder?: string;
    disabled?: boolean;
    invalid?: boolean;
    ariaDescribedby?: string;
  }>(),
  {
    disabled: false,
    invalid: false,
    loading: false,
    modelValue: '',
    placeholder: 'Search',
  }
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
  select: [payload: { item: UiAutocompleteItem; value: string }];
}>();

const field = useFieldContext();
const fallbackId = useId('autocomplete');
const inputId = computed(() => props.id ?? field?.inputId.value ?? fallbackId.value);
const labelId = computed(() => (props.ariaLabel ? undefined : field?.labelId.value));
const describedBy = computed(() =>
  mergeDescribedBy(props.ariaDescribedby, field?.describedBy.value)
);
const isInvalid = computed(() => props.invalid || field?.invalid.value || false);
const controlRef = ref<HTMLElement | null>(null);
const surfaceRef = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
const open = ref(false);
const activeId = ref<string | null>(null);
const typeaheadBuffer = ref('');
let typeaheadTimer: number | null = null;

const registerInputRef = (element: Element | ComponentPublicInstance | null) => {
  if (element instanceof HTMLInputElement) {
    inputRef.value = element;
    controlRef.value = element;
    return;
  }

  inputRef.value = null;
  controlRef.value = null;
};

const normalizedItems = computed<NormalizedAutocompleteItem[]>(() =>
  props.items.map((item, index) => ({
    ...item,
    id: `${inputId.value}-option-${index}`,
    resolvedValue: item.value ?? item.label,
  }))
);
const filteredItems = computed(() => filterListboxRecords(normalizedItems.value, props.modelValue));

const ensureActiveItem = () => {
  if (activeId.value && filteredItems.value.some((item) => item.id === activeId.value)) {
    return;
  }

  activeId.value = findBoundaryListboxRecord(filteredItems.value, 'first')?.id ?? null;
};

watch(filteredItems, ensureActiveItem, { immediate: true });

const {
  handleSurfaceAfterEnter,
  handleSurfaceAfterLeave,
  handleSurfaceBeforeEnter,
  handleSurfaceBeforeLeave,
  placement,
  portalTarget,
  surfaceStyle,
  triggerWidth,
} = useFloatingSurface(
  {
    open,
    placement: computed(() => 'bottom-start'),
    offset: computed(() => 8),
  },
  {
    kind: 'floating',
    motionPreset: 'fade-up-xs',
    close: () => {
      open.value = false;
    },
    triggerRef: controlRef,
    surfaceRef,
    dismissOnEscape: true,
    dismissOnFocusOutside: true,
    dismissOnPointerOutside: true,
    autoFocus: false,
    restoreFocus: false,
  }
);

const dropdownStyle = computed<Record<string, string>>(() => ({
  ...surfaceStyle.value,
  minWidth: `${Math.max(triggerWidth.value, 0)}px`,
}));

const onInput = async (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).value);
  open.value = true;
  await nextTick();
  ensureActiveItem();
};

const onSelect = (item: NormalizedAutocompleteItem) => {
  if (item.disabled) {
    return;
  }

  const { id: _id, resolvedValue: _resolvedValue, ...payloadItem } = item;
  emit('update:modelValue', item.resolvedValue);
  emit('select', {
    item: payloadItem,
    value: item.resolvedValue,
  });
  open.value = false;
};

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    open.value = true;
    const currentIndex = filteredItems.value.findIndex((item) => item.id === activeId.value);
    const nextItem = filteredItems.value
      .slice(Math.max(0, currentIndex + 1))
      .find((item) => !item.disabled);
    activeId.value = nextItem?.id ?? activeId.value;
    return;
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault();
    open.value = true;
    const currentIndex = filteredItems.value.findIndex((item) => item.id === activeId.value);
    const candidates =
      currentIndex < 0
        ? filteredItems.value.slice()
        : filteredItems.value.slice(0, currentIndex);
    const previousItem = candidates.reverse().find((item) => !item.disabled);
    activeId.value = previousItem?.id ?? activeId.value;
    return;
  }

  if (event.key === 'Home') {
    event.preventDefault();
    activeId.value = findBoundaryListboxRecord(filteredItems.value, 'first')?.id ?? null;
    return;
  }

  if (event.key === 'End') {
    event.preventDefault();
    activeId.value = findBoundaryListboxRecord(filteredItems.value, 'last')?.id ?? null;
    return;
  }

  if (event.key === 'Enter') {
    const item = filteredItems.value.find((entry) => entry.id === activeId.value);
    if (!item) {
      return;
    }

    event.preventDefault();
    onSelect(item);
    return;
  }

  if (event.key === 'Escape') {
    event.preventDefault();
    open.value = false;
    return;
  }

  if (event.key.length !== 1 || event.altKey || event.ctrlKey || event.metaKey) {
    return;
  }

  typeaheadBuffer.value = `${typeaheadBuffer.value}${event.key.toLowerCase()}`;
  window.clearTimeout(typeaheadTimer ?? undefined);
  typeaheadTimer = window.setTimeout(() => {
    typeaheadBuffer.value = '';
    typeaheadTimer = null;
  }, 500);

  const match = findListboxTypeaheadRecord(
    filteredItems.value,
    typeaheadBuffer.value,
    activeId.value
  );
  activeId.value = match?.id ?? activeId.value;
};

onBeforeUnmount(() => {
  window.clearTimeout(typeaheadTimer ?? undefined);
  typeaheadTimer = null;
});
</script>

<template>
  <div class="ui-autocomplete">
    <input
      :id="inputId"
      :ref="registerInputRef"
      class="ui-input ui-autocomplete__control"
      :class="{ 'is-invalid': isInvalid }"
      type="text"
      :name="props.name"
      :value="props.modelValue"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      :aria-label="props.ariaLabel"
      :aria-labelledby="labelId"
      :aria-invalid="isInvalid || undefined"
      :aria-describedby="describedBy"
      :aria-expanded="open ? 'true' : 'false'"
      :aria-controls="open ? `${inputId}-listbox` : undefined"
      :aria-activedescendant="open && activeId ? activeId : undefined"
      aria-autocomplete="list"
      autocomplete="off"
      role="combobox"
      data-ui-motion="ring-focus-soft"
      @focus="open = true"
      @input="onInput"
      @keydown="(event) => void onKeydown(event)"
    />

    <PrimitivePortal :to="portalTarget">
      <Transition
        appear
        name="ui-motion"
        @before-enter="handleSurfaceBeforeEnter"
        @after-enter="handleSurfaceAfterEnter"
        @before-leave="handleSurfaceBeforeLeave"
        @after-leave="handleSurfaceAfterLeave"
      >
        <div
          v-if="open"
          :id="`${inputId}-listbox`"
          ref="surfaceRef"
          class="ui-floating ui-autocomplete__dropdown"
          :data-placement="placement"
          :style="dropdownStyle"
          role="listbox"
        >
          <div v-if="props.loading" class="ui-autocomplete__state">Loading…</div>
          <div v-else-if="filteredItems.length === 0" class="ui-autocomplete__state">
            No suggestions.
          </div>
          <button
            v-for="item in filteredItems"
            :id="item.id"
            :key="item.id"
            type="button"
            class="ui-autocomplete__option"
            :class="{
              'is-active': activeId === item.id,
            }"
            role="option"
            :aria-selected="activeId === item.id"
            :disabled="item.disabled"
            data-ui-motion="ring-focus-soft"
            @mouseenter="activeId = item.id"
            @click="onSelect(item)"
          >
            <slot name="item" :item="item" :active="activeId === item.id">
              <span class="ui-autocomplete__option-label">{{ item.label }}</span>
              <span v-if="item.description" class="ui-autocomplete__option-description">
                {{ item.description }}
              </span>
            </slot>
          </button>
        </div>
      </Transition>
    </PrimitivePortal>
  </div>
</template>
