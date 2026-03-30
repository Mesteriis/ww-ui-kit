import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

import { UiBreadcrumb, UiPagination } from '@ww/core';

const meta = {
  title: 'Core/Navigation',
  component: UiPagination,
} satisfies Meta<typeof UiPagination>;

export default meta;

export const BreadcrumbAndPagination: StoryObj<typeof UiPagination> = {
  render: () => ({
    components: { UiBreadcrumb, UiPagination },
    setup() {
      const currentPage = ref(3);
      const items = [
        { label: 'Workspace', href: '#workspace' },
        { label: 'Releases', href: '#releases' },
        { label: 'Wave one', href: '#wave-one' },
        { label: 'Review', current: true },
      ];

      return { currentPage, items };
    },
    template: `
      <div class="ui-stack">
        <UiBreadcrumb :items="items" :max-items="4" />

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

        <p style="margin: 0;">Current page: {{ currentPage }}</p>
      </div>
    `,
  }),
};
