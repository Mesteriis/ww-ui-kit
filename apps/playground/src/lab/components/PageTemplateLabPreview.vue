<script setup lang="ts">
import { computed } from 'vue';

import { UiBadge, UiButton } from '@ww/core';
import { UiPageSection, UiPageTemplate } from '@ww/page-templates';
import { UiWidgetShell } from '@ww/widgets';

import type { LabPreviewContext, LabSurfaceDefinition } from '../manifest/component-lab.types';

defineOptions({ name: 'PageTemplateLabPreview' });

const props = defineProps<{
  definition: LabSurfaceDefinition<Record<string, unknown>>;
  state: Record<string, unknown>;
  previewContext: LabPreviewContext;
}>();

const resolved = computed(
  () =>
    props.definition.buildPreviewProps?.(props.state, props.previewContext) as {
      wrapperAttrs?: Record<string, unknown>;
      templateProps: Record<string, unknown>;
      sectionTitle: string;
      sectionDescription: string;
      widgetTitle: string;
      widgetDescription: string;
      sidebarNotes: readonly string[];
      footerText: string;
    }
);
</script>

<template>
  <div class="lab-preview lab-preview--page-template" data-lab-preview-canvas="page-template">
    <section class="lab-preview__page-template-surface" v-bind="resolved?.wrapperAttrs ?? {}">
      <UiPageTemplate v-bind="resolved?.templateProps ?? {}">
        <template #toolbar>
          <UiButton variant="secondary" size="sm">Toolbar action</UiButton>
          <UiBadge variant="brand">Page shell</UiBadge>
        </template>
        <UiPageSection
          :title="resolved?.sectionTitle ?? 'Workspace section'"
          :description="resolved?.sectionDescription ?? 'Reusable shell section'"
        >
          <UiWidgetShell
            :title="resolved?.widgetTitle ?? 'Widget surface'"
            :description="
              resolved?.widgetDescription ?? 'Nested widget shell inside the page template.'
            "
            surface="subtle"
          >
            Route pages stay in apps while the page template stays reusable.
          </UiWidgetShell>
        </UiPageSection>
        <template #sidebar>
          <UiPageSection
            title="Sidebar notes"
            description="Layered dependencies visible from the template shell."
          >
            <div class="ui-stack">
              <UiBadge v-for="note in resolved?.sidebarNotes ?? []" :key="note">
                {{ note }}
              </UiBadge>
            </div>
          </UiPageSection>
        </template>
        <template #footer>
          {{ resolved?.footerText }}
        </template>
      </UiPageTemplate>
    </section>
  </div>
</template>
