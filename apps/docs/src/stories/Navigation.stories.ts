import type { Meta, StoryObj } from '@storybook/vue3';
import { computed, ref } from 'vue';

import { UiBreadcrumb, UiMenu, UiPagination, UiSteps } from '@ww/core';

const meta = {
  title: 'Core/Navigation',
  component: UiPagination,
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
