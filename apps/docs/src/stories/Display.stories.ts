import type { Meta, StoryObj } from '@storybook/vue3';

import {
  UiAvatar,
  UiAvatarGroup,
  UiBadge,
  UiCard,
  UiDivider,
  UiProgress,
  UiSkeleton,
  UiSpinner,
  UiTable,
  UiTag,
} from '@ww/core';

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
      UiCard,
      UiDivider,
      UiProgress,
      UiSkeleton,
      UiSpinner,
      UiTable,
      UiTag,
    },
    setup() {
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
        { name: 'UiProgress', status: 'Shipped', coverage: 'ARIA + browser proof' },
        { name: 'UiTable', status: 'Shipped', coverage: 'Semantic markup + slots' },
      ];

      return { avatarItems, columns, data };
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
        </UiCard>
      </div>
    `,
  }),
};
