<script setup lang="ts">
import { computed, nextTick, ref, watch, type CSSProperties } from 'vue';

import { PrimitivePortal, useId } from '@ww/primitives';

import { useFloatingSurface } from '../overlay/useFloatingSurface';

defineOptions({ name: 'UiMention' });

export interface UiMentionItem {
  id: string;
  label: string;
  value?: string;
  description?: string;
}

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    items: UiMentionItem[];
    trigger?: string;
    placeholder?: string;
    disabled?: boolean;
    ariaLabel?: string;
  }>(),
  {
    ariaLabel: 'Mention input',
    disabled: false,
    modelValue: '',
    placeholder: 'Type text and mention with @',
    trigger: '@',
  }
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
  select: [payload: UiMentionItem];
}>();

const fallbackId = useId('mention');
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const surfaceRef = ref<HTMLElement | null>(null);
const activeIndex = ref(0);
const query = ref('');
const mentionStart = ref<number | null>(null);
const open = ref(false);

const filteredItems = computed(() => {
  if (!query.value) {
    return props.items;
  }

  const lowered = query.value.toLowerCase();
  return props.items.filter((item) => item.label.toLowerCase().includes(lowered));
});

const close = () => {
  open.value = false;
  query.value = '';
  mentionStart.value = null;
};

const {
  handleSurfaceAfterEnter,
  handleSurfaceAfterLeave,
  handleSurfaceBeforeEnter,
  handleSurfaceBeforeLeave,
  placement,
  portalTarget,
  surfaceStyle,
} = useFloatingSurface(
  {
    open,
    placement: computed(() => 'bottom-start'),
    offset: computed(() => 8),
  },
  {
    kind: 'floating',
    motionPreset: 'fade-up-xs',
    close,
    triggerRef: textareaRef,
    surfaceRef,
    dismissOnEscape: true,
    dismissOnFocusOutside: true,
    dismissOnPointerOutside: true,
    autoFocus: false,
    restoreFocus: false,
  }
);
const floatingSurfaceStyle = computed<CSSProperties>(() => surfaceStyle.value as CSSProperties);

const updateMentionContext = () => {
  const textarea = textareaRef.value;
  if (!textarea) {
    return;
  }

  const caret = textarea.selectionStart ?? props.modelValue.length;
  const slice = props.modelValue.slice(0, caret);
  const triggerIndex = slice.lastIndexOf(props.trigger);
  if (triggerIndex < 0) {
    close();
    return;
  }

  const candidate = slice.slice(triggerIndex + props.trigger.length);
  if (candidate.includes(' ') || candidate.includes('\n')) {
    close();
    return;
  }

  mentionStart.value = triggerIndex;
  query.value = candidate;
  open.value = true;
  activeIndex.value = 0;
};

const insertItem = async (item: UiMentionItem) => {
  const textarea = textareaRef.value;
  if (!textarea || mentionStart.value === null) {
    return;
  }

  const caret = textarea.selectionStart ?? props.modelValue.length;
  const before = props.modelValue.slice(0, mentionStart.value);
  const after = props.modelValue.slice(caret);
  const insertion = `${props.trigger}${item.value ?? item.label} `;
  emit('update:modelValue', `${before}${insertion}${after}`);
  emit('select', item);
  close();

  await nextTick();
  textarea.focus();
};

const onKeydown = async (event: KeyboardEvent) => {
  if (!open.value) {
    return;
  }

  if (event.key === 'ArrowDown') {
    event.preventDefault();
    activeIndex.value = Math.min(activeIndex.value + 1, filteredItems.value.length - 1);
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    activeIndex.value = Math.max(activeIndex.value - 1, 0);
  } else if (event.key === 'Enter') {
    event.preventDefault();
    const item = filteredItems.value[activeIndex.value];
    if (item) {
      await insertItem(item);
    }
  } else if (event.key === 'Escape') {
    event.preventDefault();
    close();
  }
};

watch(filteredItems, (items) => {
  if (items.length === 0) {
    close();
  }
});
</script>

<template>
  <div class="ui-mention">
    <textarea
      :id="fallbackId"
      ref="textareaRef"
      class="ui-input ui-input--textarea"
      :value="props.modelValue"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      :aria-label="props.ariaLabel"
      data-ui-motion="ring-focus-soft"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      @click="updateMentionContext"
      @keyup="updateMentionContext"
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
        <section
          v-if="open"
          ref="surfaceRef"
          class="ui-floating ui-mention__surface"
          :data-placement="placement"
          :style="floatingSurfaceStyle"
          role="listbox"
        >
          <button
            v-for="(item, index) in filteredItems"
            :key="item.id"
            type="button"
            class="ui-mention__option"
            :class="{ 'is-active': index === activeIndex }"
            role="option"
            :aria-selected="index === activeIndex"
            @mouseenter="activeIndex = index"
            @click="() => void insertItem(item)"
          >
            <span class="ui-mention__option-label">{{ item.label }}</span>
            <span v-if="item.description" class="ui-mention__option-description">
              {{ item.description }}
            </span>
          </button>
        </section>
      </Transition>
    </PrimitivePortal>
  </div>
</template>
