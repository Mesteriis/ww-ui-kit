<script setup lang="ts">
import { ref } from 'vue';

import {
  UiAffix,
  UiBadge,
  UiButton,
  UiCard,
  UiFlex,
  UiGrid,
  UiScrollArea,
  UiScrollTop,
  UiSpace,
  UiTag,
} from '@ww/core';

defineOptions({ name: 'TestingHarnessLayoutUtilitiesCard' });

const affixState = ref('resting');

const layoutItems = [
  {
    key: 'summary',
    title: 'Release summary',
    description:
      'Responsive utility spans stay inside core instead of drifting into page-template shell ownership.',
    span: 12,
    responsive: { md: 7, lg: 8 },
  },
  {
    key: 'actions',
    title: 'Action rail',
    description:
      'Supporting actions keep narrower structure while inheriting the same gap and theme contracts.',
    span: 12,
    responsive: { md: 5, lg: 4 },
  },
];

const scrollUtilityCards = [
  'Affix keeps the review summary visible inside the sanctioned scroll region.',
  'Scroll areas provide reusable region semantics instead of app-local wrappers.',
  'Scroll-top targets the same viewport without drifting into shell ownership.',
];
</script>

<template>
  <UiCard>
    <template #header>Layout utility coverage</template>
    <div class="ui-stack">
      <UiFlex justify="between" align="center" gap="4" block>
        <UiBadge variant="brand">Utility-only layout</UiBadge>
        <UiSpace size="2">
          <UiButton size="sm" variant="secondary">Preview</UiButton>
          <UiButton size="sm">Ship</UiButton>
        </UiSpace>
      </UiFlex>

      <UiSpace separator="•" size="3" role="group" aria-label="Core layout utility markers">
        <UiTag variant="brand">UiFlex</UiTag>
        <UiTag variant="success" appearance="outline">UiGrid</UiTag>
        <UiTag variant="warning" appearance="outline">UiSpace</UiTag>
      </UiSpace>

      <UiGrid
        :items="layoutItems"
        :columns="12"
        gap="4"
        role="group"
        aria-label="Core wave layout grid"
      >
        <template #item="{ item }">
          <UiCard>
            <template #header>{{ item.title }}</template>
            <p style="margin: 0">{{ item.description }}</p>
          </UiCard>
        </template>
      </UiGrid>

      <UiScrollArea
        id="core-wave-scroll-area"
        :max-height="240"
        aria-label="Core wave layout utility scroll area"
      >
        <div class="ui-stack" style="padding-inline-end: var(--ui-space-2)">
          <UiAffix
            :offset-top="0"
            target="#core-wave-scroll-area"
            @stuck-change="affixState = $event ? 'stuck' : 'resting'"
          >
            <UiCard>
              <template #header>Affixed release summary</template>
              <p style="margin: 0">
                Sticky utility content stays in core instead of drifting into shell scope.
              </p>
            </UiCard>
          </UiAffix>

          <UiCard v-for="(copy, index) in scrollUtilityCards" :key="index">
            <template #header>Scroll utility {{ index + 1 }}</template>
            <p style="margin: 0">{{ copy }}</p>
          </UiCard>
        </div>
      </UiScrollArea>

      <p style="margin: 0">Affix state: {{ affixState }}</p>
      <UiScrollTop
        target="#core-wave-scroll-area"
        :threshold="72"
        behavior="auto"
        aria-label="Scroll core wave utility area to top"
      >
        Top
      </UiScrollTop>
    </div>
  </UiCard>
</template>
