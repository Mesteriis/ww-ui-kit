<script setup lang="ts">
import { computed } from 'vue';

import { UiBadge } from '@ww/core';
import { UiHorizontalLayout, UiVerticalLayout } from '@ww/page-templates';

import type { LabPreviewContext, LabSurfaceDefinition } from '../manifest/component-lab.types';

defineOptions({ name: 'FlowLayoutLabPreview' });

const props = defineProps<{
  definition: LabSurfaceDefinition<Record<string, unknown>>;
  state: Record<string, unknown>;
  previewContext: LabPreviewContext;
}>();

const resolved = computed(
  () =>
    props.definition.buildPreviewProps?.(props.state, props.previewContext) as {
      description: string;
      direction: 'horizontal' | 'vertical';
      gap: string;
      items: readonly string[];
      scroll: boolean;
      title: string;
      wrapperAttrs?: Record<string, unknown>;
    }
);

const frameStyle = computed(() =>
  resolved.value?.direction === 'vertical'
    ? {
        border: '1px dashed var(--ui-border-subtle)',
        borderRadius: 'var(--ui-radius-lg)',
        inlineSize: 'min(100%, 16rem)',
        maxBlockSize: resolved.value.scroll ? '12rem' : 'none',
        minBlockSize: '8rem',
        overflow: 'hidden',
        padding: 'var(--ui-space-4)',
      }
    : {
        border: '1px dashed var(--ui-border-subtle)',
        borderRadius: 'var(--ui-radius-lg)',
        inlineSize: resolved.value?.scroll ? 'min(100%, 18rem)' : '100%',
        minBlockSize: '8rem',
        overflow: 'hidden',
        padding: 'var(--ui-space-4)',
      }
);
</script>

<template>
  <div class="lab-preview lab-preview--layout" data-lab-preview-canvas="layout">
    <section class="lab-preview__layout-surface" v-bind="resolved?.wrapperAttrs ?? {}">
      <div class="ui-stack" style="gap: var(--ui-space-4)">
        <div style="display: grid; gap: var(--ui-space-2)">
          <div class="ui-cluster">
            <UiBadge variant="brand">{{ resolved?.title }}</UiBadge>
            <UiBadge>{{ resolved?.scroll ? 'Scroll enabled' : 'Shrink-wrap default' }}</UiBadge>
          </div>
          <p style="margin: 0; color: var(--ui-text-secondary)">
            {{ resolved?.description }}
          </p>
        </div>

        <div :style="frameStyle">
          <UiVerticalLayout
            v-if="resolved?.direction === 'vertical'"
            :gap="resolved?.gap"
            :scroll="resolved?.scroll"
          >
            <div
              v-for="item in resolved?.items ?? []"
              :key="item"
              style="
                padding: var(--ui-space-3) var(--ui-space-4);
                border: 1px solid var(--ui-border-subtle);
                border-radius: var(--ui-radius-lg);
                background: color-mix(in srgb, var(--ui-surface-default) 94%, transparent);
                white-space: nowrap;
              "
            >
              {{ item }}
            </div>
          </UiVerticalLayout>

          <UiHorizontalLayout v-else :gap="resolved?.gap" :scroll="resolved?.scroll">
            <div
              v-for="item in resolved?.items ?? []"
              :key="item"
              style="
                padding: var(--ui-space-3) var(--ui-space-4);
                border: 1px solid var(--ui-border-subtle);
                border-radius: var(--ui-radius-lg);
                background: color-mix(in srgb, var(--ui-surface-default) 94%, transparent);
                white-space: nowrap;
              "
            >
              {{ item }}
            </div>
          </UiHorizontalLayout>
        </div>
      </div>
    </section>
  </div>
</template>
