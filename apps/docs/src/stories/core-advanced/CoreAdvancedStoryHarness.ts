import { defineComponent, ref, toRef, type Component } from 'vue';
import bannerSvg from '../../../../assets/img/banner.svg';

import {
  UiAlertDialog,
  UiButton,
  UiCalendar,
  UiCard,
  UiColorPicker,
  UiDatePicker,
  UiDateRangePicker,
  UiField,
  UiFilePicker,
  UiIcon,
  UiImage,
  UiImagePreview,
  UiImagePreviewGroup,
  UiMention,
  UiSplitter,
  UiTimePicker,
  UiWatermark,
  confirmAlertDialog,
} from '@ww/core';

const harnessComponents: Record<string, Component> = {
  UiAlertDialog: UiAlertDialog as Component,
  UiButton: UiButton as Component,
  UiCalendar: UiCalendar as Component,
  UiCard: UiCard as Component,
  UiColorPicker: UiColorPicker as Component,
  UiDatePicker: UiDatePicker as Component,
  UiDateRangePicker: UiDateRangePicker as Component,
  UiField: UiField as Component,
  UiFilePicker: UiFilePicker as Component,
  UiIcon: UiIcon as Component,
  UiImage: UiImage as Component,
  UiImagePreview: UiImagePreview as Component,
  UiImagePreviewGroup: UiImagePreviewGroup as Component,
  UiMention: UiMention as Component,
  UiSplitter: UiSplitter as Component,
  UiTimePicker: UiTimePicker as Component,
  UiWatermark: UiWatermark as Component,
};

export default defineComponent({
  name: 'CoreAdvancedStoryHarness',
  components: harnessComponents,
  props: {
    mode: {
      type: String,
      default: 'overview',
  },
  },
  setup(props) {
    const storyMode = toRef(props, 'mode');
    const imageSrc = bannerSvg;
    const imageItems = [
      { src: imageSrc, alt: 'Banner preview', caption: 'Previewable image' },
      { src: imageSrc, alt: 'Banner preview duplicate', caption: 'Shared preview group' },
      { src: imageSrc, alt: 'Banner preview detail', caption: 'Gallery navigation' },
    ];
    const previewOpen = ref(false);
    const previewIndex = ref(1);

    const dateValue = ref('2026-04-04');
    const rangeValue = ref(['2026-04-04', '2026-04-08']);
    const calendarValue = ref('2026-04-04');
    const timeValue = ref('14:45');
    const colorValue = ref('#2f8fdd');
    const fileValue = ref([]);
    const mentionValue = ref('@platform verify the governed surfaces');
    const alertOpen = ref(false);
    const alertResult = ref('idle');

    const mentionItems = [
      { id: 'platform', label: 'platform', description: 'Governance maintainers' },
      { id: 'docs', label: 'docs', description: 'Storybook and docs sync' },
      { id: 'playground', label: 'playground', description: 'Consumer proof harness' },
    ];

    const openConfirm = async () => {
      const confirmed = await confirmAlertDialog({
        confirmText: 'Ship',
        description: 'Imperative confirm reuses the governed alert dialog contract.',
        title: 'Ship core advanced surfaces?',
      });
      alertResult.value = confirmed ? 'confirmed' : 'cancelled';
    };

    return {
      alertOpen,
      alertResult,
      calendarValue,
      colorValue,
      dateValue,
      fileValue,
      imageItems,
      imageSrc,
      mentionItems,
      mentionValue,
      previewIndex,
      previewOpen,
      storyMode,
      openConfirm,
      rangeValue,
      timeValue,
    };
  },
  template: `
    <div class="ui-stack" style="display: grid; gap: var(--ui-space-5);">
      <UiCard>
        <template #header>Icon and watermark surfaces</template>
        <div style="display: grid; gap: var(--ui-space-4);">
          <div style="display: flex; gap: var(--ui-space-3); flex-wrap: wrap;">
            <UiIcon name="calendar" label="Calendar icon" :decorative="false" />
            <UiIcon name="upload" />
            <UiIcon name="warning" />
            <UiIcon name="image" />
            <UiIcon name="info" />
          </div>

          <UiWatermark content="Belovodye contract" :rotate="storyMode === 'theming' ? -18 : -26">
            <UiCard>
              <template #header>Watermark proof</template>
              Watermark stays token-driven and purely visual.
            </UiCard>
          </UiWatermark>
        </div>
      </UiCard>

      <div
        style="
          display: grid;
          gap: var(--ui-space-4);
          grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
        "
      >
        <UiCard>
          <template #header>Image preview</template>
          <UiImage
            :src="imageSrc"
            alt="Governed preview image"
            caption="UiImage now composes with UiImagePreview."
            bordered
            previewable
            :preview-items="imageItems"
          />
        </UiCard>

        <UiCard>
          <template #header>Preview group</template>
          <div style="display: grid; gap: var(--ui-space-3);">
            <UiImagePreviewGroup :items="imageItems" :columns="storyMode === 'states' ? 2 : 3" />
            <UiButton variant="secondary" @click="previewIndex = 1; previewOpen = true">
              Open UiImagePreview directly
            </UiButton>
            <UiImagePreview v-model:open="previewOpen" v-model="previewIndex" :items="imageItems" />
          </div>
        </UiCard>
      </div>

      <UiCard>
        <template #header>Splitter</template>
        <UiSplitter :initial-ratio="storyMode === 'states' ? 65 : 50">
          <template #first>
            <div style="padding: var(--ui-space-4);">Primary evidence panel</div>
          </template>
          <template #second>
            <div style="padding: var(--ui-space-4);">Secondary notes panel</div>
          </template>
        </UiSplitter>
      </UiCard>

      <div
        style="
          display: grid;
          gap: var(--ui-space-4);
          grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
        "
      >
        <UiCard>
          <template #header>Calendar and pickers</template>
          <div style="display: grid; gap: var(--ui-space-3);">
            <UiField label="Date picker">
              <UiDatePicker v-model="dateValue" />
            </UiField>
            <UiField label="Range picker">
              <UiDateRangePicker v-model="rangeValue" />
            </UiField>
            <UiField label="Time picker">
              <UiTimePicker v-model="timeValue" />
            </UiField>
            <UiCalendar v-model="calendarValue" :mode="storyMode === 'states' ? 'range' : 'single'" />
          </div>
        </UiCard>

        <UiCard>
          <template #header>Color, file, and mention fields</template>
          <div style="display: grid; gap: var(--ui-space-3);">
            <UiField label="Color">
              <UiColorPicker v-model="colorValue" alpha />
            </UiField>
            <UiField label="Files">
              <UiFilePicker v-model="fileValue" />
            </UiField>
            <UiField label="Mention">
              <UiMention v-model="mentionValue" :items="mentionItems" />
            </UiField>
          </div>
        </UiCard>
      </div>

      <UiCard>
        <template #header>Alert dialog and imperative confirm</template>
        <div style="display: flex; gap: var(--ui-space-3); flex-wrap: wrap;">
          <UiButton @click="alertOpen = true">Open alert dialog</UiButton>
          <UiButton variant="secondary" @click="openConfirm">Run imperative confirm</UiButton>
          <span style="color: var(--ui-text-secondary);">Last confirm: {{ alertResult }}</span>
        </div>
      </UiCard>

      <UiAlertDialog
        v-model:open="alertOpen"
        title="Advanced core surfaces"
        description="Alert dialogs share the governed modal runtime and keyboard behavior."
        tone="info"
        confirm-text="Acknowledge"
        cancel-text="Cancel"
        @confirm="alertResult = 'acknowledged'; alertOpen = false;"
        @cancel="alertResult = 'cancelled'"
      />
    </div>
  `,
});
