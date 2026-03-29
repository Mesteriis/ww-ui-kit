<script setup lang="ts">
import { computed } from 'vue';

import { UiBadge, UiButton } from '@ww/core';
import { UiWidgetShell } from '@ww/widgets';

import type { LabPreviewContext, LabSurfaceDefinition } from '../manifest/component-lab.types';

defineOptions({ name: 'WidgetShellLabPreview' });

const props = defineProps<{
  definition: LabSurfaceDefinition<Record<string, unknown>>;
  state: Record<string, unknown>;
  previewContext: LabPreviewContext;
}>();

const resolved = computed(
  () =>
    props.definition.buildPreviewProps?.(props.state, props.previewContext) as {
      wrapperAttrs?: Record<string, unknown>;
      widgetProps: Record<string, unknown>;
      footerText?: string;
      bodyText?: string;
      badges?: readonly string[];
    }
);
</script>

<template>
  <div class="lab-preview lab-preview--widget-shell" data-lab-preview-canvas="widget-shell">
    <section class="lab-preview__widget-surface" v-bind="resolved?.wrapperAttrs ?? {}">
      <UiWidgetShell v-bind="resolved?.widgetProps ?? {}">
        <template #actions>
          <UiButton variant="secondary" size="sm">Inspector action</UiButton>
        </template>
        <div class="ui-stack">
          <div v-if="resolved?.badges?.length" class="ui-cluster">
            <UiBadge v-for="badge in resolved.badges" :key="badge" variant="brand">
              {{ badge }}
            </UiBadge>
          </div>
          <p>{{ resolved?.bodyText }}</p>
        </div>
        <template #footer>
          {{ resolved?.footerText }}
        </template>
      </UiWidgetShell>
    </section>
  </div>
</template>
