<script setup lang="ts">
import { computed, ref, type CSSProperties } from 'vue';

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
  UiImagePreviewGroup,
  UiInput,
  UiMention,
  UiSplitter,
  UiTimePicker,
  UiWatermark,
  confirmAlertDialog,
} from '@ww/core';
import {
  UiCascader,
  UiForm,
  UiFormItem,
  UiInfiniteScroll,
  UiTour,
  UiTransfer,
  UiTree,
  UiTreeSelect,
  UiUpload,
  UiVirtualScroll,
  UiVirtualList,
  type UiTourStep,
  type UiUploadItem,
  type UiUploadTransportContext,
} from '@ww/interaction';

defineOptions({ name: 'InteractionShowcase' });

const imageSrc = new URL('../../../assets/img/banner.svg', import.meta.url).href;
const imageItems = [
  { src: imageSrc, alt: 'Preview banner', caption: 'Preview surface' },
  { src: imageSrc, alt: 'Preview banner duplicate', caption: 'Shared preview group' },
];

const advancedAlertOpen = ref(false);
const advancedAlertState = ref('idle');
const advancedDate = ref('2026-04-04');
const advancedRange = ref<[string | null, string | null]>(['2026-04-04', '2026-04-09']);
const advancedTime = ref('10:15');
const advancedColor = ref('#2f8fdd');
const advancedFiles = ref<File[]>([]);
const advancedMention = ref('@playground document the canonical surfaces');

const mentionItems = [
  { id: 'playground', label: 'playground', description: 'Testing harness' },
  { id: 'docs', label: 'docs', description: 'Storybook contract' },
  { id: 'platform', label: 'platform', description: 'Governance owners' },
];

const formModel = ref<Record<string, unknown>>({
  title: '',
  owner: '',
});
const formState = ref('idle');
const treeSelected = ref<string[]>(['foundations']);
const treeChecked = ref<string[]>([]);
const treeSelectValue = ref<string | string[] | null>(null);
const cascaderValue = ref<string[] | null>(null);
const transferValue = ref<string[]>(['interaction']);
const uploadItems = ref<UiUploadItem[]>([]);
const tourOpen = ref(false);
const virtualItems = ref(Array.from({ length: 16 }, (_, index) => `Virtual ${index + 1}`));
const infiniteItems = ref(Array.from({ length: 8 }, (_, index) => `Infinite ${index + 1}`));

const treeNodes = [
  {
    key: 'foundations',
    label: 'Foundations',
    children: [
      { key: 'tokens', label: 'Tokens', leaf: true },
      { key: 'themes', label: 'Themes', leaf: true },
    ],
  },
  {
    key: 'systems',
    label: 'Systems',
    children: [
      { key: 'interaction', label: 'Interaction', leaf: true },
      { key: 'data-grid', label: 'Data Grid', leaf: true },
    ],
  },
];

const tourSteps = computed<UiTourStep[]>(() => [
  {
    target: '#interaction-tour-target-a',
    title: 'Tour target A',
    description: 'Guided overlays stay in the systems layer.',
  },
  {
    target: '#interaction-tour-target-b',
    title: 'Tour target B',
    description: 'Spotlight and focus restore reuse the governed overlay runtime.',
  },
]);

const uploadTransport = async ({ onProgress }: UiUploadTransportContext) => {
  onProgress(45);
  onProgress(90);
  onProgress(100);
  return { ok: true };
};

const confirmAdvanced = async () => {
  const confirmed = await confirmAlertDialog({
    description: 'Imperative confirm stays on the same canonical alert dialog path.',
    title: 'Ship advanced core surfaces?',
  });
  advancedAlertState.value = confirmed ? 'confirmed' : 'cancelled';
};

const loadMore = () => {
  const nextStart = infiniteItems.value.length + 1;
  infiniteItems.value = [
    ...infiniteItems.value,
    ...Array.from({ length: 4 }, (_, index) => `Infinite ${nextStart + index}`),
  ];
};

const asStyle = (style: Record<string, string>) => style as CSSProperties;

const resolveInputProps = (controlProps: {
  ariaDescribedby: string | undefined;
  disabled: boolean;
  id: string;
  invalid: boolean;
}) => ({
  disabled: controlProps.disabled,
  id: controlProps.id,
  invalid: controlProps.invalid,
  ...(controlProps.ariaDescribedby ? { ariaDescribedby: controlProps.ariaDescribedby } : {}),
});
</script>

<template>
  <div class="ui-stack" style="display: grid; gap: var(--ui-space-5);">
    <section id="testing-core-advanced" class="playground__grid" data-playground-scenario="core-advanced">
      <UiCard>
        <template #header>Core advanced surfaces</template>
        <div style="display: grid; gap: var(--ui-space-4);">
          <div style="display: flex; gap: var(--ui-space-3); flex-wrap: wrap;">
            <UiIcon name="calendar" label="Calendar icon" :decorative="false" />
            <UiIcon name="image" />
            <UiIcon name="upload" />
            <UiIcon name="warning" />
          </div>

          <UiWatermark content="Playground proof">
            <UiCard>
              <template #header>Watermark</template>
              One governed watermark surface.
            </UiCard>
          </UiWatermark>

          <UiSplitter>
            <template #first>
              <div style="padding: var(--ui-space-4);">Splitter pane A</div>
            </template>
            <template #second>
              <div style="padding: var(--ui-space-4);">Splitter pane B</div>
            </template>
          </UiSplitter>

          <div
            style="
              display: grid;
              gap: var(--ui-space-4);
              grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
            "
          >
            <UiImage
              :src="imageSrc"
              alt="Preview proof"
              caption="UiImage preview integration"
              bordered
              previewable
              :preview-items="imageItems"
            />
            <UiImagePreviewGroup :items="imageItems" />
          </div>

          <div
            style="
              display: grid;
              gap: var(--ui-space-4);
              grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
            "
          >
            <UiField label="Date">
              <UiDatePicker v-model="advancedDate" />
            </UiField>
            <UiField label="Range">
              <UiDateRangePicker v-model="advancedRange" />
            </UiField>
            <UiField label="Time">
              <UiTimePicker v-model="advancedTime" />
            </UiField>
            <UiField label="Color">
              <UiColorPicker v-model="advancedColor" alpha />
            </UiField>
            <UiField label="Files">
              <UiFilePicker v-model="advancedFiles" />
            </UiField>
            <UiField label="Mention">
              <UiMention v-model="advancedMention" :items="mentionItems" />
            </UiField>
          </div>

          <UiCalendar v-model="advancedDate" />

          <div style="display: flex; gap: var(--ui-space-3); flex-wrap: wrap; align-items: center;">
            <UiButton @click="advancedAlertOpen = true">Open alert dialog</UiButton>
            <UiButton variant="secondary" @click="confirmAdvanced">Imperative confirm</UiButton>
            <span style="color: var(--ui-text-secondary);">Core advanced state: {{ advancedAlertState }}</span>
          </div>
        </div>
      </UiCard>
    </section>

    <section
      id="testing-interaction-systems"
      class="playground__grid"
      data-playground-scenario="interaction-systems"
    >
      <UiCard>
        <template #header>Interaction systems</template>
        <div style="display: grid; gap: var(--ui-space-4);">
          <div
            style="
              display: grid;
              gap: var(--ui-space-4);
              grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
            "
          >
            <UiVirtualScroll
              :items="virtualItems"
              :height="220"
              :item-size="36"
              aria-label="Virtual scroll viewport"
              role="list"
            >
              <template #default="{ item, index, style }">
                <div class="ui-virtual-list__item" :style="asStyle(style)" role="listitem">
                  {{ index + 1 }}. {{ item }}
                </div>
              </template>
            </UiVirtualScroll>

            <UiVirtualList :items="virtualItems" :height="220" :item-size="36">
              <template #default="{ item }">{{ item }}</template>
            </UiVirtualList>

            <UiInfiniteScroll
              :items="infiniteItems"
              :height="220"
              :item-size="36"
              :has-more="infiniteItems.length < 20"
              @load-more="loadMore"
            >
              <template #default="{ item }">{{ item }}</template>
            </UiInfiniteScroll>
          </div>

          <UiForm
            v-model="formModel"
            :rules="{
              title: [(value) => (String(value || '').trim() ? undefined : 'Title is required')],
              owner: [(value) => (String(value || '').trim() ? undefined : 'Owner is required')],
            }"
            @submit="formState = 'submitted'"
          >
            <div
              style="
                display: grid;
                gap: var(--ui-space-4);
                grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
              "
            >
              <UiFormItem name="title" label="Title">
                <template #default="{ value, setValue, handleBlur, controlProps }">
                  <UiInput
                    v-bind="resolveInputProps(controlProps)"
                    :model-value="String(value ?? '')"
                    @update:modelValue="setValue"
                    @blur="handleBlur"
                  />
                </template>
              </UiFormItem>

              <UiFormItem name="owner" label="Owner">
                <template #default="{ value, setValue, handleBlur, controlProps }">
                  <UiInput
                    v-bind="resolveInputProps(controlProps)"
                    :model-value="String(value ?? '')"
                    @update:modelValue="setValue"
                    @blur="handleBlur"
                  />
                </template>
              </UiFormItem>
            </div>

            <div style="display: flex; gap: var(--ui-space-3); align-items: center; flex-wrap: wrap;">
              <UiButton type="submit">Submit form</UiButton>
              <span style="color: var(--ui-text-secondary);">Form state: {{ formState }}</span>
            </div>
          </UiForm>

          <div
            style="
              display: grid;
              gap: var(--ui-space-4);
              grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
            "
          >
            <UiTree
              v-model="treeSelected"
              :checked-keys="treeChecked"
              checkable
              :nodes="treeNodes"
              @update:checkedKeys="treeChecked = $event"
            />
            <div style="display: grid; gap: var(--ui-space-3);">
              <UiTreeSelect v-model="treeSelectValue" :nodes="treeNodes" />
              <UiCascader v-model="cascaderValue" :nodes="treeNodes" />
              <UiTransfer v-model="transferValue" :items="treeNodes" virtual />
            </div>
          </div>

          <UiUpload v-model="uploadItems" :transport="uploadTransport" />

          <div style="display: grid; gap: var(--ui-space-3);">
            <UiButton @click="tourOpen = true">Start tour</UiButton>
            <div
              style="
                display: grid;
                gap: var(--ui-space-3);
                grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
              "
            >
              <UiCard id="interaction-tour-target-a">Tour target A</UiCard>
              <UiCard id="interaction-tour-target-b">Tour target B</UiCard>
            </div>
          </div>
        </div>
      </UiCard>
    </section>

    <UiAlertDialog
      v-model:open="advancedAlertOpen"
      title="Advanced core surfaces"
      description="Alert dialog stays on the governed modal stack."
      confirm-label="Acknowledge"
      cancel-label="Cancel"
      @confirm="
        advancedAlertState = 'acknowledged';
        advancedAlertOpen = false;
      "
      @cancel="advancedAlertState = 'cancelled'"
    />

    <UiTour v-model:open="tourOpen" :steps="tourSteps" />
  </div>
</template>
