<script setup lang="ts">
import { computed } from 'vue';

import { UiBadge, UiButton } from '@ww/core';
import { UiHorizontalLayout, UiVerticalLayout } from '@ww/page-templates';
import { UiTsParticlesBackdrop } from '@ww/tsparticles';

import type { LabPreviewContext, LabSurfaceDefinition } from '../manifest/component-lab.types';

defineOptions({ name: 'TsParticlesBackdropLabPreview' });

const props = defineProps<{
  definition: LabSurfaceDefinition<Record<string, unknown>>;
  state: Record<string, unknown>;
  previewContext: LabPreviewContext;
}>();

const resolved = computed(
  () =>
    props.definition.buildPreviewProps?.(props.state, props.previewContext) as {
      componentProps: Record<string, unknown>;
      densityLabel: string;
      frameStyle: Record<string, string>;
      wrapperAttrs?: Record<string, unknown>;
    }
);

const stageStyle = computed(() =>
  resolved.value?.componentProps.size === 'fill'
    ? {
        blockSize: '100%',
        display: 'grid',
        gap: 'var(--ui-space-5)',
        alignContent: 'space-between',
        padding: 'var(--ui-space-5)',
      }
    : {
        display: 'grid',
        gap: 'var(--ui-space-5)',
        padding: 'var(--ui-space-5)',
      }
);

const badgeItems = ['Neutral wrapper', 'Token-driven', 'Vendor-backed'] as const;
const actionItems = ['Inspect', 'Share', 'Ship'] as const;
</script>

<template>
  <div class="lab-preview lab-preview--layout" data-lab-preview-canvas="layout">
    <section class="lab-preview__layout-surface" v-bind="resolved?.wrapperAttrs ?? {}">
      <div :style="resolved?.frameStyle">
        <UiTsParticlesBackdrop v-bind="resolved?.componentProps ?? {}">
          <div :style="stageStyle">
            <div style="display: grid; gap: var(--ui-space-2)">
              <div class="ui-cluster">
                <UiBadge variant="brand">UiTsParticlesBackdrop</UiBadge>
                <UiBadge>{{ resolved?.componentProps.size }}</UiBadge>
                <UiBadge>{{ resolved?.densityLabel }}</UiBadge>
              </div>
              <p style="margin: 0; color: var(--ui-text-secondary)">
                Decorative background wrapper around reusable content surfaces.
              </p>
            </div>

            <UiVerticalLayout gap="var(--ui-space-3)">
              <UiBadge v-for="item in badgeItems" :key="item" variant="brand">
                {{ item }}
              </UiBadge>
            </UiVerticalLayout>

            <UiHorizontalLayout gap="var(--ui-space-3)">
              <UiButton v-for="item in actionItems" :key="item" size="sm" variant="secondary">
                {{ item }}
              </UiButton>
            </UiHorizontalLayout>
          </div>
        </UiTsParticlesBackdrop>
      </div>
    </section>
  </div>
</template>
