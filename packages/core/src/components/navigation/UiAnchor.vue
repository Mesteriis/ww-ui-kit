<script setup lang="ts">
import { computed, getCurrentInstance, onBeforeUnmount, onMounted, watch } from 'vue';

import { useControllable } from '@ww/primitives';

import UiAffix from '../layout/UiAffix.vue';
import {
  getScrollTop,
  getScrollOffsetForElement,
  isScrollTargetAtEnd,
  getTargetClientRect,
  resolveAnchorElement,
  resolveScrollTarget,
  scrollTargetTo,
  type UiScrollTarget,
} from '../shared/scroll';

defineOptions({ name: 'UiAnchor' });

export type UiAnchorItem = {
  key: string;
  label: string;
  href: string;
  disabled?: boolean;
};

const props = withDefaults(
  defineProps<{
    items: UiAnchorItem[];
    modelValue?: string | null;
    defaultValue?: string | null;
    target?: UiScrollTarget;
    affix?: boolean;
    offsetTop?: number;
    smooth?: boolean;
    ariaLabel?: string;
  }>(),
  {
    affix: false,
    ariaLabel: 'Section navigation',
    defaultValue: null,
    offsetTop: 0,
    smooth: true,
  }
);

const emit = defineEmits<{
  'update:modelValue': [value: string | null];
  change: [value: string | null];
}>();

const instance = getCurrentInstance();

const state = useControllable({
  defaultValue: props.defaultValue,
  onChange: (value) => emit('update:modelValue', value),
  value: computed(() =>
    Object.prototype.hasOwnProperty.call(instance?.vnode.props ?? {}, 'modelValue')
      ? props.modelValue
      : undefined
  ),
});

const activeKey = computed(() => state.currentValue.value);

let detachListeners: (() => void) | null = null;

const setActiveKey = (nextValue: string | null) => {
  if (activeKey.value === nextValue) {
    return;
  }

  state.setValue(nextValue);
  emit('change', nextValue);
};

const updateActiveKey = () => {
  const target = resolveScrollTarget(props.target);
  const boundary = getTargetClientRect(target);
  const enabledItems = props.items.filter((item) => !item.disabled);

  if (!boundary || enabledItems.length === 0) {
    return;
  }

  if (getScrollTop(target) > 0 && isScrollTargetAtEnd(target)) {
    setActiveKey(enabledItems.at(-1)?.key ?? null);
    return;
  }

  let fallbackKey: string | null = null;
  let resolvedKey: string | null = null;

  for (const item of enabledItems) {
    const element = resolveAnchorElement(item.href);
    if (!(element instanceof HTMLElement)) {
      continue;
    }

    fallbackKey ??= item.key;

    const relativeTop = element.getBoundingClientRect().top - boundary.top;

    if (relativeTop <= props.offsetTop + 1) {
      resolvedKey = item.key;
      continue;
    }

    if (!resolvedKey) {
      resolvedKey = fallbackKey;
    }
    break;
  }

  setActiveKey(resolvedKey ?? fallbackKey);
};

const bindListeners = () => {
  detachListeners?.();

  const target = resolveScrollTarget(props.target);
  if (!target) {
    return;
  }

  const scrollHost = target === window ? window : target;
  const options = { passive: true } as const;

  scrollHost.addEventListener('scroll', updateActiveKey, options);
  window.addEventListener('resize', updateActiveKey, options);

  detachListeners = () => {
    scrollHost.removeEventListener('scroll', updateActiveKey);
    window.removeEventListener('resize', updateActiveKey);
  };

  updateActiveKey();
};

const onItemClick = (event: MouseEvent, item: UiAnchorItem) => {
  if (item.disabled) {
    event.preventDefault();
    return;
  }

  const target = resolveScrollTarget(props.target);
  const element = resolveAnchorElement(item.href);

  if (!(element instanceof HTMLElement)) {
    return;
  }

  event.preventDefault();

  scrollTargetTo(target, {
    top: getScrollOffsetForElement(target, element, props.offsetTop),
    behavior: props.smooth ? 'smooth' : 'auto',
  });
  setActiveKey(item.key);
};

watch(() => [props.items, props.target, props.offsetTop] as const, bindListeners, {
  deep: true,
});

onMounted(bindListeners);

onBeforeUnmount(() => {
  detachListeners?.();
});
</script>

<template>
  <nav class="ui-anchor" :aria-label="props.ariaLabel">
    <UiAffix v-if="props.affix" :offset-top="props.offsetTop" :target="props.target">
      <ul class="ui-anchor__list">
        <li v-for="item in props.items" :key="item.key" class="ui-anchor__item">
          <a
            class="ui-anchor__link"
            :class="{
              'is-active': activeKey === item.key,
              'is-disabled': item.disabled,
            }"
            :href="item.href"
            :aria-current="activeKey === item.key ? 'location' : undefined"
            :aria-disabled="item.disabled || undefined"
            data-ui-motion="ring-focus-soft"
            @click="onItemClick($event, item)"
          >
            <span class="ui-anchor__indicator" aria-hidden="true" />
            <slot name="item" :item="item" :active="activeKey === item.key">
              <span>{{ item.label }}</span>
            </slot>
          </a>
        </li>
      </ul>
    </UiAffix>

    <ul v-else class="ui-anchor__list">
      <li v-for="item in props.items" :key="item.key" class="ui-anchor__item">
        <a
          class="ui-anchor__link"
          :class="{
            'is-active': activeKey === item.key,
            'is-disabled': item.disabled,
          }"
          :href="item.href"
          :aria-current="activeKey === item.key ? 'location' : undefined"
          :aria-disabled="item.disabled || undefined"
          data-ui-motion="ring-focus-soft"
          @click="onItemClick($event, item)"
        >
          <span class="ui-anchor__indicator" aria-hidden="true" />
          <slot name="item" :item="item" :active="activeKey === item.key">
            <span>{{ item.label }}</span>
          </slot>
        </a>
      </li>
    </ul>
  </nav>
</template>
