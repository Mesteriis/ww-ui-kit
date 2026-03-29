<script setup lang="ts">
import { computed, useSlots } from 'vue';

import { UiEmptyState, UiSpinner } from '@ww/core';

import UiWidgetBody from './UiWidgetBody.vue';
import UiWidgetFooter from './UiWidgetFooter.vue';
import UiWidgetHeader from './UiWidgetHeader.vue';
import type { WidgetSurface } from '../shared/types';

defineOptions({ name: 'UiWidgetShell' });

const props = withDefaults(
  defineProps<{
    title?: string;
    description?: string;
    loading?: boolean;
    error?: boolean | string;
    surface?: WidgetSurface;
    padded?: boolean;
  }>(),
  {
    loading: false,
    error: false,
    surface: 'default',
    padded: true,
  }
);

defineSlots<{
  header?: () => unknown;
  default?: () => unknown;
  footer?: () => unknown;
  actions?: () => unknown;
  empty?: () => unknown;
}>();

const slots = useSlots();

const hasHeader = computed(() =>
  Boolean(props.title || props.description || slots.header || slots.actions)
);

const hasFooter = computed(() => Boolean(slots.footer));

const hasDefault = computed(() => Boolean(slots.default));
const hasEmpty = computed(() => Boolean(slots.empty));

const resolvedErrorDescription = computed(() => {
  if (typeof props.error === 'string' && props.error.length > 0) {
    return props.error;
  }

  return 'This widget surface is unavailable. Keep backend and routing concerns in the app layer.';
});
</script>

<template>
  <section
    class="ui-widget-shell"
    :class="`ui-widget-shell--${props.surface}`"
    :data-ui-surface="props.surface"
    :data-ui-loading="props.loading"
    :data-ui-error="Boolean(props.error)"
  >
    <UiWidgetHeader v-if="hasHeader">
      <div class="ui-widget-shell__header-copy">
        <slot name="header">
          <div v-if="props.title || props.description" class="ui-widget-shell__copy">
            <h3 v-if="props.title" class="ui-widget-shell__title">{{ props.title }}</h3>
            <p v-if="props.description" class="ui-widget-shell__description">
              {{ props.description }}
            </p>
          </div>
        </slot>
      </div>
      <div v-if="$slots.actions" class="ui-widget-shell__header-actions">
        <slot name="actions" />
      </div>
    </UiWidgetHeader>

    <UiWidgetBody :padded="props.padded">
      <div v-if="props.loading" class="ui-widget-shell__state ui-widget-shell__state--loading">
        <UiSpinner />
        <p class="ui-widget-shell__state-text">Loading widget content.</p>
      </div>

      <UiEmptyState
        v-else-if="props.error"
        title="Widget unavailable"
        :description="resolvedErrorDescription"
      >
        <template #icon>!</template>
      </UiEmptyState>

      <slot v-else-if="hasDefault" />

      <slot v-else-if="hasEmpty" name="empty" />

      <UiEmptyState
        v-else
        title="Widget shell ready"
        description="Compose future widgets here without moving business logic into the UI kit."
      >
        <template #icon>◇</template>
      </UiEmptyState>
    </UiWidgetBody>

    <UiWidgetFooter v-if="hasFooter">
      <slot name="footer" />
    </UiWidgetFooter>
  </section>
</template>
