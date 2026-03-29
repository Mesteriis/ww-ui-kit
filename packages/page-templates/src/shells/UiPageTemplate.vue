<script setup lang="ts">
import { computed, useSlots } from 'vue';

import UiPageBody from './UiPageBody.vue';
import UiPageHeader from './UiPageHeader.vue';
import UiPageSidebar from './UiPageSidebar.vue';
import UiPageToolbar from './UiPageToolbar.vue';
import type { PageTemplateWidth } from '../shared/types';

defineOptions({ name: 'UiPageTemplate' });

const props = withDefaults(
  defineProps<{
    title?: string;
    description?: string;
    width?: PageTemplateWidth;
    hasSidebar?: boolean;
    padded?: boolean;
  }>(),
  {
    width: 'content',
    hasSidebar: false,
    padded: true
  }
);

defineSlots<{
  topbar?: () => unknown;
  header?: () => unknown;
  toolbar?: () => unknown;
  default?: () => unknown;
  sidebar?: () => unknown;
  footer?: () => unknown;
}>();

const slots = useSlots();

const hasHeader = computed(() => Boolean(props.title || props.description || slots.header));
const hasSidebar = computed(() => Boolean(props.hasSidebar || slots.sidebar));
</script>

<template>
  <section
    class="ui-page-template"
    :data-ui-width="props.width"
    :data-ui-has-sidebar="hasSidebar"
  >
    <div v-if="$slots.topbar" class="ui-page-template__topbar">
      <slot name="topbar" />
    </div>

    <UiPageHeader v-if="hasHeader">
      <slot name="header">
        <div class="ui-page-template__header-copy">
          <h1 v-if="props.title" class="ui-page-template__title">{{ props.title }}</h1>
          <p v-if="props.description" class="ui-page-template__description">
            {{ props.description }}
          </p>
        </div>
      </slot>
    </UiPageHeader>

    <UiPageToolbar v-if="$slots.toolbar">
      <slot name="toolbar" />
    </UiPageToolbar>

    <div class="ui-page-template__content">
      <UiPageBody :padded="props.padded">
        <slot />
      </UiPageBody>

      <UiPageSidebar v-if="hasSidebar" :padded="props.padded">
        <slot name="sidebar" />
      </UiPageSidebar>
    </div>

    <footer v-if="$slots.footer" class="ui-page-template__footer">
      <slot name="footer" />
    </footer>
  </section>
</template>
