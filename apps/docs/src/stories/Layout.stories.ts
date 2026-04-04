import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

import {
  UiAffix,
  UiBadge,
  UiButton,
  UiCard,
  UiFlex,
  UiGrid,
  UiInput,
  UiScrollArea,
  UiScrollTop,
  UiSpace,
  UiTag,
} from '@ww/core';

const meta = {
  title: 'Core/Layout',
  component: UiGrid,
} satisfies Meta<typeof UiGrid>;

export default meta;

export const UtilityLayouts: StoryObj<typeof UiGrid> = {
  render: () => ({
    components: {
      UiBadge,
      UiButton,
      UiCard,
      UiFlex,
      UiGrid,
      UiSpace,
      UiTag,
    },
    setup() {
      const layoutItems = [
        {
          key: 'summary',
          title: 'Release summary',
          description: 'Wide evidence block that reflows through sanctioned md/lg breakpoints.',
          span: 12,
          responsive: { md: 7, lg: 8 },
        },
        {
          key: 'actions',
          title: 'Action rail',
          description: 'Narrow support column beside the primary delivery summary.',
          span: 12,
          responsive: { md: 5, lg: 4 },
        },
        {
          key: 'notes',
          title: 'Contract notes',
          description: 'Secondary row proving the same grid can carry lighter metadata cards.',
          span: 12,
          responsive: { lg: 4 },
        },
        {
          key: 'signals',
          title: 'Signals',
          description: 'Supporting metrics stay utility-only and do not turn into page shells.',
          span: 12,
          responsive: { lg: 8 },
        },
      ];

      return { layoutItems };
    },
    template: `
      <div class="ui-stack">
        <UiCard>
          <template #header>Utility wrappers</template>
          <div class="ui-stack">
            <UiFlex justify="between" align="center" gap="4" block>
              <UiBadge variant="brand">Release delivery band</UiBadge>
              <UiSpace size="2">
                <UiButton size="sm" variant="secondary">Preview</UiButton>
                <UiButton size="sm">Ship</UiButton>
              </UiSpace>
            </UiFlex>

            <UiSpace separator="•" size="3" role="group" aria-label="Layout utility markers">
              <UiTag variant="brand">Governed</UiTag>
              <UiTag variant="success" appearance="outline">Token-driven</UiTag>
              <UiTag variant="warning" appearance="outline">Utility-only</UiTag>
            </UiSpace>
          </div>
        </UiCard>

        <UiCard>
          <template #header>Responsive utility grid</template>
            <UiGrid
              :items="layoutItems"
              :columns="12"
              gap="4"
              role="group"
              aria-label="Release summary grid"
              data-ui-proof="layout-utility-grid"
            >
            <template #item="{ item }">
              <UiCard>
                <template #header>{{ item.title }}</template>
                <p style="margin: 0;">{{ item.description }}</p>
              </UiCard>
            </template>
          </UiGrid>
        </UiCard>
      </div>
    `,
  }),
};

export const CompactAndResponsive: StoryObj<typeof UiGrid> = {
  render: () => ({
    components: {
      UiButton,
      UiCard,
      UiFlex,
      UiGrid,
      UiInput,
      UiSpace,
    },
    setup() {
      const railItems = [
        {
          key: 'left',
          title: 'Primary rail',
          description: 'Base span expands first and keeps the summary wider than the support rail.',
          span: 12,
          responsive: { md: 8, lg: 9 },
        },
        {
          key: 'right',
          title: 'Support rail',
          description: 'Secondary card proves the responsive span contract at larger widths.',
          span: 12,
          responsive: { md: 4, lg: 3 },
        },
      ];

      return { railItems };
    },
    template: `
      <div class="ui-stack">
        <UiCard>
          <template #header>Compact action seam</template>
          <UiSpace compact block role="group" aria-label="Search actions">
            <UiInput model-value="Release proof" />
            <UiButton variant="secondary">Search</UiButton>
            <UiButton>Apply</UiButton>
          </UiSpace>
        </UiCard>

        <UiCard>
          <template #header>Stacked and wrapped utility rows</template>
          <UiFlex direction="column" gap="4">
            <UiFlex wrap gap="2">
              <UiButton size="sm" variant="secondary">Audit</UiButton>
              <UiButton size="sm" variant="secondary">Preview</UiButton>
              <UiButton size="sm">Ship</UiButton>
            </UiFlex>
            <UiGrid
              :items="railItems"
              :columns="12"
              gap="4"
              role="group"
              aria-label="Responsive rail grid"
            >
              <template #item="{ item }">
                <UiCard>
                  <template #header>{{ item.title }}</template>
                  <p style="margin: 0;">{{ item.description }}</p>
                </UiCard>
              </template>
            </UiGrid>
          </UiFlex>
        </UiCard>
      </div>
    `,
  }),
};

export const ScrollUtilities: StoryObj<typeof UiGrid> = {
  render: () => ({
    components: {
      UiAffix,
      UiBadge,
      UiButton,
      UiCard,
      UiScrollArea,
      UiScrollTop,
      UiTag,
    },
    setup() {
      const affixState = ref('resting');
      const scrollCards = [
        'Affix keeps the summary rail visible inside the governed scroll region.',
        'Scroll areas expose region semantics and token-driven scrollbar styling.',
        'Scroll-top stays separate from shell ownership and can target the same viewport.',
        'Everything remains reusable without promoting page-level routing or layout concerns.',
        'Storybook continues to prove the public consumer contract for scroll utilities.',
      ];
      const horizontalTags = ['Contracts', 'Governance', 'Storybook', 'Playground', 'Verify'];

      return {
        affixState,
        horizontalTags,
        scrollCards,
      };
    },
    template: `
      <div class="ui-stack">
        <UiCard>
          <template #header>Vertical scroll, affix, and scroll-top</template>
          <div class="ui-stack">
            <UiScrollArea
              id="layout-proof-scroll-area"
              :max-height="260"
              aria-label="Layout proof scroll area"
              data-ui-proof="layout-scroll-area"
            >
              <div class="ui-stack" style="padding-inline-end: var(--ui-space-2);">
                <UiAffix
                  :offset-top="0"
                  target="#layout-proof-scroll-area"
                  @stuck-change="affixState = $event ? 'stuck' : 'resting'"
                >
                  <UiCard>
                    <template #header>Affixed summary rail</template>
                    <p style="margin: 0;">
                      Sticky metadata stays inside the scroll container without turning into a shell.
                    </p>
                  </UiCard>
                </UiAffix>

                <UiCard v-for="(copy, index) in scrollCards" :key="index">
                  <template #header>Scroll proof {{ index + 1 }}</template>
                  <p style="margin: 0;">{{ copy }}</p>
                </UiCard>
              </div>
            </UiScrollArea>

            <p style="margin: 0;">Affix state: {{ affixState }}</p>
            <UiScrollTop
              target="#layout-proof-scroll-area"
              :threshold="80"
              behavior="auto"
              aria-label="Scroll layout proof to top"
            >
              Top
            </UiScrollTop>
          </div>
        </UiCard>

        <UiCard>
          <template #header>Horizontal scroll area</template>
          <UiScrollArea
            id="layout-proof-horizontal-scroll-area"
            orientation="horizontal"
            visibility="always"
            :width="320"
            aria-label="Horizontal layout proof"
            data-ui-proof="layout-horizontal-scroll-area"
          >
            <div
              style="
                display: flex;
                gap: var(--ui-space-3);
                inline-size: max-content;
                padding-block: var(--ui-space-1);
              "
            >
              <UiTag v-for="tag in horizontalTags" :key="tag" variant="brand">{{ tag }}</UiTag>
              <UiButton variant="secondary">Review scroll contract</UiButton>
              <UiButton>Ship utility family</UiButton>
            </div>
          </UiScrollArea>
        </UiCard>
      </div>
    `,
  }),
};
