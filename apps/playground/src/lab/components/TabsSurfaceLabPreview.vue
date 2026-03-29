<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import { UiTabsList, UiTabsPanel, UiTabsRoot, UiTabsTrigger } from '@ww/core';

import type { LabPreviewContext, LabSurfaceDefinition } from '../manifest/component-lab.types';

defineOptions({ name: 'TabsSurfaceLabPreview' });

const props = defineProps<{
  definition: LabSurfaceDefinition<Record<string, unknown>>;
  state: Record<string, unknown>;
  previewContext: LabPreviewContext;
}>();

const resolved = computed(
  () =>
    props.definition.buildPreviewProps?.(props.state, props.previewContext) as {
      tabs: readonly {
        id: string;
        label: string;
        content: string;
      }[];
      orientation: 'horizontal' | 'vertical';
      wrapperAttrs?: Record<string, unknown>;
    }
);

const currentTab = ref(resolved.value?.tabs[0]?.id ?? 'overview');

watch(
  resolved,
  (nextResolved) => {
    if (nextResolved?.tabs?.some((tab) => tab.id === currentTab.value)) {
      return;
    }

    currentTab.value = nextResolved?.tabs[0]?.id ?? 'overview';
  },
  { immediate: true }
);
</script>

<template>
  <div class="lab-preview lab-preview--tabs" data-lab-preview-canvas="tabs">
    <section class="lab-preview__tabs-surface" v-bind="resolved?.wrapperAttrs ?? {}">
      <UiTabsRoot v-model="currentTab" :orientation="resolved?.orientation ?? 'horizontal'">
        <UiTabsList>
          <UiTabsTrigger v-for="tab in resolved?.tabs ?? []" :key="tab.id" :value="tab.id">
            {{ tab.label }}
          </UiTabsTrigger>
        </UiTabsList>
        <UiTabsPanel v-for="tab in resolved?.tabs ?? []" :key="tab.id" :value="tab.id">
          {{ tab.content }}
        </UiTabsPanel>
      </UiTabsRoot>
    </section>
  </div>
</template>
