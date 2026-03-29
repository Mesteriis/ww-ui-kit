<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import { UiButton } from '@ww/core';

import type { LabPreviewContext, LabSurfaceDefinition } from '../manifest/component-lab.types';
import { DynamicSlotRenderer } from './dynamic-slot-renderer';

defineOptions({ name: 'OverlaySurfaceLabPreview' });

const props = defineProps<{
  definition: LabSurfaceDefinition<Record<string, unknown>>;
  state: Record<string, unknown>;
  previewContext: LabPreviewContext;
}>();

const resolved = computed(
  () =>
    props.definition.buildPreviewProps?.(props.state, props.previewContext) as {
      component: unknown;
      componentProps?: Record<string, unknown>;
      wrapperAttrs?: Record<string, unknown>;
      bodyText?: string;
      triggerLabel?: string;
      footerActions?: readonly string[];
    }
);

const localOpen = ref(Boolean(props.state.open));

watch(
  () => props.state.open,
  (nextOpen) => {
    localOpen.value = Boolean(nextOpen);
  }
);

const overlayProps = computed(() => ({
  ...(resolved.value?.componentProps ?? {}),
  open: localOpen.value,
  'onUpdate:open': (value: boolean) => {
    localOpen.value = value;
  },
}));

const slots = computed(
  () => props.definition.buildPreviewSlots?.(props.state, props.previewContext) ?? {}
);
</script>

<template>
  <div class="lab-preview lab-preview--overlay" data-lab-preview-canvas="overlay">
    <section class="lab-preview__overlay-surface" v-bind="resolved?.wrapperAttrs ?? {}">
      <div class="lab-preview__overlay-trigger">
        <UiButton variant="secondary" @click="localOpen = true">
          {{ resolved?.triggerLabel ?? 'Open preview overlay' }}
        </UiButton>
      </div>
      <component :is="resolved?.component" v-bind="overlayProps">
        <template v-for="(slotRender, slotName) in slots" :key="slotName" #[slotName]="slotProps">
          <DynamicSlotRenderer :render="slotRender" :slot-props="slotProps" />
        </template>
        <p v-if="resolved?.bodyText">{{ resolved.bodyText }}</p>
        <template v-if="resolved?.footerActions?.length" #footer>
          <div class="ui-cluster">
            <UiButton
              v-for="action in resolved.footerActions"
              :key="action"
              size="sm"
              variant="secondary"
              @click="localOpen = false"
            >
              {{ action }}
            </UiButton>
          </div>
        </template>
      </component>
    </section>
  </div>
</template>
