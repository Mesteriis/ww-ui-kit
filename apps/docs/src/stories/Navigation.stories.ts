import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { computed, ref } from 'vue';

import {
  UiAnchor,
  UiBreadcrumb,
  UiCard,
  UiMenu,
  UiPagination,
  UiScrollArea,
  UiSteps,
} from '@ww/core';

const meta = {
  title: 'Core/Scenarios/Navigation',
  component: UiPagination,
  tags: ['autodocs', '!dev'],
} satisfies Meta<typeof UiPagination>;

export default meta;

export const BreadcrumbAndPagination: StoryObj<typeof UiPagination> = {
  render: () => ({
    components: { UiBreadcrumb, UiMenu, UiPagination, UiSteps },
    setup() {
      const currentPage = ref(3);
      const selectedKeys = ref(['review']);
      const currentStep = ref(1);
      const breadcrumbItems = [
        { label: 'Workspace', href: '#workspace' },
        { label: 'Releases', href: '#releases' },
        { label: 'Wave two', href: '#wave-two' },
        { label: 'Review', current: true },
      ];

      const menuItems = [
        { label: 'Overview', key: 'overview', value: 'overview' },
        { type: 'divider' as const },
        {
          type: 'group' as const,
          label: 'Deploy',
          items: [
            { label: 'Review', key: 'review', value: 'review', icon: '⌘' },
            { label: 'Ship', key: 'ship', value: 'ship' },
          ],
        },
      ];

      const horizontalItems = [
        { label: 'Overview', key: 'overview' },
        { label: 'Contracts', key: 'contracts' },
        { label: 'Coverage', key: 'coverage' },
      ];

      const steps = [
        { title: 'Design', description: 'Structure the shared contract' },
        { title: 'Review', description: 'Stories, tests, and playground' },
        { title: 'Ship', description: 'Green CI before merge' },
      ];

      const currentStepLabel = computed(() => steps[currentStep.value]?.title ?? 'Unknown');
      const lastMenuAction = computed(() => selectedKeys.value[0] ?? 'none');

      return {
        breadcrumbItems,
        currentPage,
        currentStep,
        currentStepLabel,
        horizontalItems,
        lastMenuAction,
        menuItems,
        selectedKeys,
        steps,
      };
    },
    template: `
      <div class="ui-stack">
        <UiBreadcrumb :items="breadcrumbItems" :max-items="4" />

        <UiPagination
          v-model="currentPage"
          :total-items="144"
          :page-size="12"
          :sibling-count="1"
          :boundary-count="1"
          aria-label="Release pages"
        />

        <UiPagination
          :model-value="currentPage"
          :total-items="144"
          :page-size="12"
          aria-label="Release pages summary"
          simple
        />

        <div
          style="
            display: grid;
            gap: var(--ui-space-4);
            grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
          "
        >
          <div class="ui-stack">
            <strong>Menu flows</strong>
            <UiMenu v-model:selected-keys="selectedKeys" :items="menuItems" aria-label="Release menu" />
            <UiMenu :items="horizontalItems" mode="horizontal" aria-label="Horizontal review menu" />
          </div>

          <div class="ui-stack">
            <strong>Step progress</strong>
            <UiSteps
              v-model="currentStep"
              :items="steps"
              clickable
              linear
              aria-label="Release progress steps"
            />
          </div>
        </div>

        <p style="margin: 0;">Current page: {{ currentPage }}</p>
        <p style="margin: 0;">Last menu action: {{ lastMenuAction }}</p>
        <p style="margin: 0;">Current step: {{ currentStepLabel }}</p>
      </div>
    `,
  }),
};

export const SectionAnchor: StoryObj<typeof UiPagination> = {
  render: () => ({
    components: { UiAnchor, UiCard, UiScrollArea },
    setup() {
      const activeSection = ref<string | null>('overview');
      const anchorItems = [
        { key: 'overview', label: 'Overview', href: '#anchor-overview' },
        { key: 'contracts', label: 'Contracts', href: '#anchor-contracts' },
        { key: 'ship', label: 'Ship', href: '#anchor-ship' },
      ];
      const sections = [
        {
          id: 'anchor-overview',
          title: 'Overview',
          copy: 'Anchor items track the active section inside a sanctioned scroll container.',
        },
        {
          id: 'anchor-contracts',
          title: 'Contracts',
          copy: 'Smooth scrolling and active-link updates stay inside the governed navigation surface.',
        },
        {
          id: 'anchor-ship',
          title: 'Ship',
          copy: 'Consumers get section navigation without re-implementing scroll math or active-state logic.',
        },
      ];

      return {
        activeSection,
        anchorItems,
        sections,
      };
    },
    template: `
      <UiCard>
        <template #header>Section anchor navigation</template>
        <div
          style="
            display: grid;
            gap: var(--ui-space-4);
            grid-template-columns: minmax(0, 12rem) minmax(0, 1fr);
            align-items: start;
          "
        >
          <UiAnchor
            v-model="activeSection"
            :items="anchorItems"
            target="#navigation-anchor-scroll"
            :offset-top="12"
            :smooth="false"
            aria-label="Section anchor navigation"
          />

          <UiScrollArea
            id="navigation-anchor-scroll"
            :max-height="280"
            aria-label="Navigation anchor sections"
            data-ui-proof="navigation-anchor-scroll"
          >
            <div class="ui-stack" style="padding-inline-end: var(--ui-space-2);">
              <section
                v-for="section in sections"
                :id="section.id"
                :key="section.id"
                style="
                  min-block-size: 14rem;
                  padding: var(--ui-space-4);
                  border: 1px solid var(--ui-border-subtle);
                  border-radius: var(--ui-radius-lg);
                  background: var(--ui-surface-subtle);
                "
              >
                <h2 style="margin: 0 0 var(--ui-space-2);">{{ section.title }}</h2>
                <p style="margin: 0;">{{ section.copy }}</p>
              </section>
            </div>
          </UiScrollArea>
        </div>

        <p style="margin: var(--ui-space-4) 0 0;">Active section: {{ activeSection }}</p>
      </UiCard>
    `,
  }),
};
