<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';

import { PrimitivePortal, useId } from '@ww/primitives';

import {
  findBoundaryListboxRecord,
  findListboxTypeaheadRecord,
  filterListboxRecords,
} from './listbox';
import { mergeDescribedBy, useFieldContext } from './field-context';
import { useFloatingSurface } from '../overlay/useFloatingSurface';
import UiTag from '../display/UiTag.vue';

defineOptions({ name: 'UiSelect' });

export type UiSelectValue = string | number;

export interface UiSelectOption {
  label: string;
  value: UiSelectValue;
  disabled?: boolean;
  icon?: string;
  keywords?: readonly string[];
}

export interface UiSelectOptionGroup {
  type: 'group';
  label: string;
  options: UiSelectOption[];
}

type UiSelectEntry = UiSelectOption | UiSelectOptionGroup;

type NormalizedSelectOption = UiSelectOption & {
  id: string;
};

type NormalizedSelectGroup = {
  id: string;
  label: string;
  options: NormalizedSelectOption[];
};

function isSelectGroup(entry: UiSelectEntry): entry is UiSelectOptionGroup {
  return 'type' in entry && entry.type === 'group';
}

const props = withDefaults(
  defineProps<{
    modelValue?: UiSelectValue | UiSelectValue[] | null;
    id?: string;
    name?: string;
    ariaLabel?: string;
    options: UiSelectEntry[];
    multiple?: boolean;
    searchable?: boolean;
    clearable?: boolean;
    placeholder?: string;
    disabled?: boolean;
    invalid?: boolean;
    ariaDescribedby?: string;
  }>(),
  {
    clearable: false,
    disabled: false,
    invalid: false,
    modelValue: null,
    multiple: false,
    placeholder: 'Select an option',
    searchable: false,
  }
);

const emit = defineEmits<{
  'update:modelValue': [value: UiSelectValue | UiSelectValue[] | null];
  open: [];
  close: [];
}>();

const field = useFieldContext();
const fallbackId = useId('select-rich');
const inputId = computed(() => props.id ?? field?.inputId.value ?? fallbackId.value);
const labelId = computed(() => (props.ariaLabel ? undefined : field?.labelId.value));
const describedBy = computed(() =>
  mergeDescribedBy(props.ariaDescribedby, field?.describedBy.value)
);
const isInvalid = computed(() => props.invalid || field?.invalid.value || false);

const normalizedGroups = computed<NormalizedSelectGroup[]>(() =>
  props.options.map((entry, index) => {
    if (isSelectGroup(entry)) {
      return {
        id: `${inputId.value}-group-${index}`,
        label: entry.label,
        options: entry.options.map((option, optionIndex) => ({
          ...option,
          id: `${inputId.value}-option-${index}-${optionIndex}`,
        })),
      };
    }

    return {
      id: `${inputId.value}-group-${index}`,
      label: '',
      options: [
        {
          ...entry,
          id: `${inputId.value}-option-${index}`,
        },
      ],
    };
  })
);

const allOptions = computed(() => normalizedGroups.value.flatMap((group) => group.options));
const selectedValues = computed<UiSelectValue[]>(() => {
  if (props.multiple) {
    return Array.isArray(props.modelValue) ? props.modelValue : [];
  }

  if (props.modelValue === null || props.modelValue === undefined) {
    return [];
  }

  return Array.isArray(props.modelValue) ? props.modelValue.slice(0, 1) : [props.modelValue];
});
const selectedOptions = computed(() =>
  allOptions.value.filter((option) => selectedValues.value.includes(option.value))
);
const controlLabel = computed(() =>
  props.multiple ? '' : (selectedOptions.value[0]?.label ?? '')
);
const query = ref('');
const open = ref(false);
const activeId = ref<string | null>(null);
const controlRef = ref<HTMLElement | null>(null);
const surfaceRef = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
const typeaheadBuffer = ref('');
let typeaheadTimer: number | null = null;

const filteredGroups = computed(() =>
  normalizedGroups.value
    .map((group) => ({
      ...group,
      options: filterListboxRecords(group.options, props.searchable ? query.value : ''),
    }))
    .filter((group) => group.options.length > 0)
);
const filteredOptions = computed(() => filteredGroups.value.flatMap((group) => group.options));
const selectedValueSet = computed(() => new Set(selectedValues.value));

const ensureActiveId = () => {
  if (activeId.value && filteredOptions.value.some((option) => option.id === activeId.value)) {
    return;
  }

  const selectedOption = filteredOptions.value.find(
    (option) => selectedValueSet.value.has(option.value) && !option.disabled
  );
  if (selectedOption) {
    activeId.value = selectedOption.id;
    return;
  }

  activeId.value = findBoundaryListboxRecord(filteredOptions.value, 'first')?.id ?? null;
};

watch(filteredOptions, ensureActiveId, { immediate: true });

watch(open, async (isOpen) => {
  if (isOpen) {
    ensureActiveId();
    emit('open');
    if (props.searchable) {
      await nextTick();
      inputRef.value?.focus();
    }
    return;
  }

  query.value = '';
  typeaheadBuffer.value = '';
  emit('close');
});

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
    restoreFocus: !props.searchable,
  }
);

const dropdownStyle = computed<Record<string, string>>(() => ({
  ...surfaceStyle.value,
  minWidth: `${Math.max(triggerWidth.value, 0)}px`,
}));

const openDropdown = async () => {
  if (props.disabled) {
    return;
  }

  open.value = true;
  await nextTick();
  ensureActiveId();
};

const closeDropdown = () => {
  open.value = false;
};

const updateModelValue = (nextValue: UiSelectValue) => {
  if (!props.multiple) {
    emit('update:modelValue', nextValue);
    closeDropdown();
    return;
  }

  const nextValues = selectedValueSet.value.has(nextValue)
    ? selectedValues.value.filter((value) => value !== nextValue)
    : [...selectedValues.value, nextValue];
  emit('update:modelValue', nextValues);
};

const clearSelection = () => {
  emit('update:modelValue', props.multiple ? [] : null);
  closeDropdown();
};

const removeSelectedValue = (value: UiSelectValue) => {
  if (!props.multiple) {
    clearSelection();
    return;
  }

  emit(
    'update:modelValue',
    selectedValues.value.filter((entry) => entry !== value)
  );
};

const onControlClick = async () => {
  await openDropdown();
};

const onControlWrapperKeydown = (event: KeyboardEvent) => {
  if (props.searchable) {
    return;
  }

  void onControlKeydown(event);
};

const onQueryInput = async (event: Event) => {
  query.value = (event.target as HTMLInputElement).value;
  await openDropdown();
  if (open.value) {
    ensureActiveId();
  }
};

const moveActive = (direction: 'first' | 'last') => {
  activeId.value = findBoundaryListboxRecord(filteredOptions.value, direction)?.id ?? null;
};

const selectActiveOption = () => {
  const option = filteredOptions.value.find((entry) => entry.id === activeId.value);
  if (!option || option.disabled) {
    return;
  }

  updateModelValue(option.value);
};

const onControlKeydown = async (event: KeyboardEvent) => {
  if (props.disabled) {
    return;
  }

  if (event.key === 'ArrowDown') {
    event.preventDefault();
    await openDropdown();
    const currentIndex = filteredOptions.value.findIndex((option) => option.id === activeId.value);
    const nextOption = filteredOptions.value
      .slice(Math.max(0, currentIndex + 1))
      .find((option) => !option.disabled);
    activeId.value = nextOption?.id ?? activeId.value;
    return;
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault();
    await openDropdown();
    const currentIndex = filteredOptions.value.findIndex((option) => option.id === activeId.value);
    const candidates =
      currentIndex < 0
        ? filteredOptions.value.slice()
        : filteredOptions.value.slice(0, currentIndex);
    const nextOption = candidates.reverse().find((option) => !option.disabled);
    activeId.value = nextOption?.id ?? activeId.value;
    return;
  }

  if (event.key === 'Home') {
    event.preventDefault();
    moveActive('first');
    return;
  }

  if (event.key === 'End') {
    event.preventDefault();
    moveActive('last');
    return;
  }

  if (event.key === 'Enter') {
    event.preventDefault();
    if (!open.value) {
      await openDropdown();
      return;
    }

    selectActiveOption();
    return;
  }

  if (event.key === 'Escape') {
    event.preventDefault();
    closeDropdown();
    return;
  }

  if (
    props.searchable ||
    event.key.length !== 1 ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey
  ) {
    return;
  }

  typeaheadBuffer.value = `${typeaheadBuffer.value}${event.key.toLowerCase()}`;
  window.clearTimeout(typeaheadTimer ?? undefined);
  typeaheadTimer = window.setTimeout(() => {
    typeaheadBuffer.value = '';
    typeaheadTimer = null;
  }, 500);

  const match = findListboxTypeaheadRecord(
    filteredOptions.value,
    typeaheadBuffer.value,
    activeId.value
  );
  activeId.value = match?.id ?? activeId.value;
};

onBeforeUnmount(() => {
  if (typeaheadTimer !== null) {
    window.clearTimeout(typeaheadTimer);
    typeaheadTimer = null;
  }
});

const displayInputValue = computed(() => {
  if (props.searchable) {
    return open.value ? query.value : controlLabel.value;
  }

  return controlLabel.value;
});
</script>

<template>
  <div class="ui-rich-select">
    <div
      :id="props.searchable ? undefined : inputId"
      ref="controlRef"
      class="ui-input ui-rich-select__control"
      :class="{
        'is-invalid': isInvalid,
        'is-open': open,
        'is-disabled': props.disabled,
      }"
      :role="props.searchable ? undefined : 'button'"
      :tabindex="props.searchable ? undefined : props.disabled ? -1 : 0"
      :aria-label="props.searchable ? undefined : props.ariaLabel"
      :aria-labelledby="props.searchable ? undefined : labelId"
      :aria-haspopup="props.searchable ? undefined : 'listbox'"
      :aria-controls="props.searchable ? undefined : open ? `${inputId}-listbox` : undefined"
      :aria-expanded="props.searchable ? undefined : open ? 'true' : 'false'"
      :aria-activedescendant="
        props.searchable ? undefined : open && activeId ? activeId : undefined
      "
      :aria-invalid="props.searchable ? undefined : isInvalid || undefined"
      :aria-describedby="props.searchable ? undefined : describedBy"
      data-ui-motion="ring-focus-soft"
      @click="void onControlClick()"
      @keydown="onControlWrapperKeydown"
    >
      <div class="ui-rich-select__selected">
        <slot
          name="selected"
          :selected="selectedOptions"
          :remove="removeSelectedValue"
          :clear="clearSelection"
        >
          <template v-if="props.multiple && selectedOptions.length > 0">
            <UiTag
              v-for="option in selectedOptions"
              :key="option.value"
              variant="brand"
              appearance="soft"
              size="sm"
              closable
              @close.stop="removeSelectedValue(option.value)"
            >
              {{ option.label }}
            </UiTag>
          </template>
          <span
            v-if="
              (!props.multiple && !displayInputValue) ||
              (props.multiple && !props.searchable && selectedOptions.length === 0)
            "
            class="ui-rich-select__placeholder"
          >
            {{ props.placeholder }}
          </span>
        </slot>

        <input
          v-if="props.searchable"
          :id="inputId"
          ref="inputRef"
          class="ui-rich-select__input"
          type="text"
          :name="props.name"
          :value="displayInputValue"
          :placeholder="
            props.multiple && selectedOptions.length === 0 ? props.placeholder : undefined
          "
          :disabled="props.disabled"
          :readonly="!props.searchable"
          role="combobox"
          aria-autocomplete="list"
          :aria-label="props.ariaLabel"
          :aria-labelledby="labelId"
          :aria-haspopup="'listbox'"
          :aria-controls="open ? `${inputId}-listbox` : undefined"
          :aria-expanded="open ? 'true' : 'false'"
          :aria-activedescendant="open && activeId ? activeId : undefined"
          :aria-invalid="isInvalid || undefined"
          :aria-describedby="describedBy"
          @input="onQueryInput"
          @focus="void openDropdown()"
          @keydown="(event) => void onControlKeydown(event)"
        />
        <span v-else-if="!props.multiple && displayInputValue" class="ui-rich-select__value">
          {{ displayInputValue }}
        </span>
      </div>

      <button
        v-if="props.clearable && selectedOptions.length > 0"
        type="button"
        class="ui-rich-select__clear"
        aria-label="Clear selection"
        data-ui-motion="ring-focus-soft"
        @click.stop="clearSelection"
      >
        ×
      </button>
      <span class="ui-rich-select__caret" aria-hidden="true">▾</span>
    </div>

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
          class="ui-floating ui-rich-select__dropdown"
          :data-placement="placement"
          :style="dropdownStyle"
          role="listbox"
          :aria-multiselectable="props.multiple || undefined"
        >
          <div v-if="filteredOptions.length === 0" class="ui-rich-select__empty">
            <slot name="empty" :query="query"> No matching options. </slot>
          </div>
          <template v-for="group in filteredGroups" :key="group.id">
            <div v-if="group.label" class="ui-rich-select__group-label">{{ group.label }}</div>
            <button
              v-for="option in group.options"
              :id="option.id"
              :key="option.id"
              type="button"
              class="ui-rich-select__option"
              :class="{
                'is-active': activeId === option.id,
                'is-selected': selectedValueSet.has(option.value),
              }"
              role="option"
              :aria-selected="selectedValueSet.has(option.value)"
              :disabled="option.disabled"
              data-ui-motion="ring-focus-soft"
              @mouseenter="activeId = option.id"
              @click="updateModelValue(option.value)"
            >
              <slot
                name="option"
                :option="option"
                :active="activeId === option.id"
                :selected="selectedValueSet.has(option.value)"
              >
                <span v-if="option.icon" class="ui-rich-select__option-icon" aria-hidden="true">
                  {{ option.icon }}
                </span>
                <span class="ui-rich-select__option-label">{{ option.label }}</span>
              </slot>
            </button>
          </template>
        </div>
      </Transition>
    </PrimitivePortal>
  </div>
</template>
