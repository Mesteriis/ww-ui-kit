import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

import {
  UiAvatar,
  UiAvatarGroup,
  UiBadge,
  UiButton,
  UiCard,
  UiDescriptions,
  UiDivider,
  UiImage,
  UiList,
  UiProgress,
  UiSkeleton,
  UiSpinner,
  UiStatistic,
  UiTable,
  UiTag,
  UiTimeline,
} from '@ww/core';

const displayImageSrc = new URL('../../../assets/img/banner.svg', import.meta.url).href;

const meta = {
  title: 'Core/Display',
  component: UiCard,
} satisfies Meta<typeof UiCard>;

export default meta;

export const SurfacesAndStatus: StoryObj<typeof UiCard> = {
  render: () => ({
    components: {
      UiAvatar,
      UiAvatarGroup,
      UiBadge,
      UiButton,
      UiCard,
      UiDescriptions,
      UiDivider,
      UiImage,
      UiList,
      UiProgress,
      UiSkeleton,
      UiSpinner,
      UiStatistic,
      UiTable,
      UiTag,
      UiTimeline,
    },
    setup() {
      const listPage = ref(1);
      const avatarItems = [
        { initials: 'BV', alt: 'Belovodye' },
        { initials: 'CR', alt: 'Core review', tone: 'brand' as const },
        { initials: 'QA', alt: 'Quality gate', tone: 'success' as const },
        { initials: 'DX', alt: 'Developer experience', tone: 'warning' as const },
      ];

      const columns = [
        { key: 'name', header: 'Surface' },
        { key: 'status', header: 'Status', align: 'center' as const },
        { key: 'coverage', header: 'Coverage' },
      ];

      const data = [
        { name: 'UiAvatar', status: 'Shipped', coverage: 'Stories + unit + playground' },
        { name: 'UiImage', status: 'Shipped', coverage: 'Fit + fallback + caption' },
        { name: 'UiProgress', status: 'Shipped', coverage: 'ARIA + browser proof' },
        { name: 'UiTable', status: 'Shipped', coverage: 'Semantic markup + slots' },
      ];

      const descriptionItems = [
        { label: 'Layer', value: '@ww/core' },
        { label: 'Contract', value: 'docs-as-contract' },
        { label: 'Owner', value: 'governance' },
        { label: 'Coverage', value: 'Storybook + unit + playground', span: 2 },
      ];

      const timelineItems = [
        {
          title: 'Surface contract fixed',
          description: 'Public API shape, tokens, and states are explicit before export.',
          opposite: 'ADR',
          tone: 'brand' as const,
        },
        {
          title: 'Stories and tests aligned',
          description: 'Display proofs cover semantic, loading, and empty states.',
          opposite: 'Proof',
          tone: 'success' as const,
        },
        {
          title: 'Playground harness updated',
          description: 'Consumer usage stays synchronized with the public contract.',
          opposite: 'Harness',
          tone: 'warning' as const,
        },
      ];

      const listItems = [
        {
          title: 'UiTimeline',
          description: 'Milestone history and pending state without dashboard ownership.',
          meta: 'Display',
        },
        {
          title: 'UiDescriptions',
          description: 'Token-aware metadata grids with spans and bordered layout.',
          meta: 'Display',
        },
        {
          title: 'UiStatistic',
          description: 'Value and countdown presentations without analytics orchestration.',
          meta: 'Display',
        },
        {
          title: 'UiList',
          description: 'Composable item flows with pagination and load-more slot.',
          meta: 'Display',
        },
      ];

      return {
        avatarItems,
        columns,
        data,
        descriptionItems,
        displayImageSrc,
        listItems,
        listPage,
        timelineItems,
      };
    },
    template: `
      <div class="ui-stack">
        <UiCard>
          <template #header>Surface baseline</template>
          <div style="display: grid; gap: var(--ui-space-4);">
            <div class="ui-cluster">
              <UiBadge>Neutral</UiBadge>
              <UiBadge variant="brand">Brand</UiBadge>
              <UiBadge variant="success">Success</UiBadge>
              <UiBadge variant="warning">Warning</UiBadge>
              <UiBadge variant="danger">Danger</UiBadge>
            </div>

            <div class="ui-cluster">
              <UiAvatar initials="BV" alt="Belovodye avatar" tone="brand" />
              <UiAvatar initials="DX" shape="square" tone="info" />
              <UiAvatar icon="⚙" alt="Settings avatar" tone="warning" />
              <UiAvatarGroup :items="avatarItems" :max="3" />
            </div>

            <div
              style="
                display: grid;
                gap: var(--ui-space-4);
                grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
              "
            >
              <UiImage
                :src="displayImageSrc"
                alt="Architecture snapshot"
                caption="Architecture snapshot"
                aspect="landscape"
                bordered
              />
              <UiImage alt="Fallback-only preview" caption="Fallback proof" aspect="square" bordered>
                <template #fallback>◇</template>
              </UiImage>
            </div>

            <div class="ui-cluster">
              <UiTag variant="brand">Pinned</UiTag>
              <UiTag variant="success" appearance="outline">Healthy</UiTag>
              <UiTag variant="warning" closable>Needs review</UiTag>
              <UiTag variant="info" clickable>
                <template #icon>⌘</template>
                Clickable tag
              </UiTag>
            </div>

            <UiDivider />

            <div
              style="
                display: grid;
                gap: var(--ui-space-4);
                grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
                align-items: center;
              "
            >
              <div class="ui-stack">
                <strong>Current rollout: 64%</strong>
                <UiProgress :value="64" show-value aria-label="Current rollout" />
              </div>
              <div class="ui-stack">
                <strong>Background verify</strong>
                <UiProgress
                  variant="circular"
                  :value="82"
                  show-value
                  status="success"
                  aria-label="Background verify"
                />
              </div>
              <div class="ui-stack">
                <strong>Indeterminate deploy</strong>
                <UiProgress indeterminate status="warning" aria-label="Indeterminate deploy" />
              </div>
            </div>

            <div
              style="
                display: grid;
                gap: var(--ui-space-4);
                grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
              "
            >
              <UiStatistic title="Deploy score" :value="98.4" suffix="/100" :precision="1" />
              <UiStatistic title="Queued reviews" :value="12" prefix="≈" />
              <UiStatistic title="Countdown" :countdown-to="Date.now() + 90_000" />
            </div>

            <UiDescriptions
              title="Metadata surface"
              bordered
              :items="descriptionItems"
            >
              <template #extra>
                <UiBadge variant="brand">Stable</UiBadge>
              </template>
            </UiDescriptions>

            <UiTimeline :items="timelineItems" pending pending-label="Awaiting release notes" />

            <div class="ui-cluster">
              <UiSpinner size="sm" />
              <UiSpinner />
              <UiSpinner size="lg" />
            </div>

            <UiSkeleton width="100%" height="1rem" />
            <UiSkeleton width="4rem" height="4rem" shape="circle" />
          </div>
        </UiCard>

        <UiCard>
          <template #header>Simple data surface</template>
          <UiTable
            caption="Core second-wave coverage"
            :columns="columns"
            :data="data"
            bordered
            striped
            sticky-header
            :max-height="240"
          >
            <template #cell="{ column, row, value }">
              <span
                v-if="column.key === 'name'"
                style="display: inline-flex; align-items: center; gap: var(--ui-space-2);"
              >
                <UiAvatar :initials="String(row.name).slice(2, 4)" size="sm" tone="brand" />
                <strong>{{ value }}</strong>
              </span>
              <UiBadge v-else-if="column.key === 'status'" variant="success">{{ value }}</UiBadge>
              <span v-else>{{ value }}</span>
            </template>
          </UiTable>

          <UiList
            v-model:page="listPage"
            title="Information surfaces"
            :data-source="listItems"
            :page-size="2"
            pagination
            bordered
          >
            <template #item="{ item }">
              <strong>{{ item.title }}</strong>
              <p style="margin: 0; color: var(--ui-text-secondary);">{{ item.description }}</p>
            </template>
            <template #meta="{ item }">
              <UiBadge>{{ item.meta }}</UiBadge>
            </template>
            <template #loadMore>
              <UiButton variant="secondary" size="sm">Load more surface notes</UiButton>
            </template>
          </UiList>

          <p style="margin: 0">List page: {{ listPage }}</p>
        </UiCard>
      </div>
    `,
  }),
};

export const ImagesAndFallbacks: StoryObj<typeof UiCard> = {
  render: () => ({
    components: { UiCard, UiImage },
    setup() {
      return { displayImageSrc };
    },
    template: `
      <UiCard>
        <template #header>UiImage states</template>
        <div
          style="
            display: grid;
            gap: var(--ui-space-4);
            grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
          "
        >
          <UiImage
            :src="displayImageSrc"
            alt="Banner snapshot"
            caption="Base"
            aspect="landscape"
            bordered
          />
          <UiImage
            :src="displayImageSrc"
            alt="Contained banner"
            caption="Contain fit"
            aspect="video"
            fit="contain"
            bordered
          />
          <UiImage alt="Fallback contract" caption="Edge case: no source" aspect="square">
            <template #fallback>◇</template>
          </UiImage>
        </div>
      </UiCard>
    `,
  }),
};

export const InformationEdgeCases: StoryObj<typeof UiCard> = {
  render: () => ({
    components: {
      UiCard,
      UiDescriptions,
      UiList,
      UiStatistic,
      UiTimeline,
    },
    setup() {
      const edgeItems = [
        { label: 'Fallback', value: 'Client-side pagination only' },
        { label: 'Owner', value: 'Core display layer' },
      ];
      const reverseTimeline = [
        {
          title: 'Release shipped',
          description: 'Browser proof and docs are already green.',
          opposite: 'Now',
          tone: 'success' as const,
        },
        {
          title: 'Backfill docs',
          description: 'Edge states stay visible as part of the contract.',
          opposite: 'Before',
          tone: 'warning' as const,
        },
      ];

      return {
        edgeItems,
        reverseTimeline,
      };
    },
    template: `
      <UiCard>
        <template #header>Information edge cases</template>
        <div class="ui-stack">
          <UiDescriptions :items="edgeItems" layout="vertical" bordered />
          <UiStatistic title="Loading metric" loading />
          <UiTimeline :items="reverseTimeline" reverse mode="alternate" pending />
          <UiList title="Empty list" :data-source="[]" bordered />
        </div>
      </UiCard>
    `,
  }),
};
