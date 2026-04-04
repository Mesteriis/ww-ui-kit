import { computed, defineComponent, ref, toRef } from 'vue';

import { UiButton, UiCard, UiField, UiInput, UiTag } from '@ww/core';
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
  UiVirtualList,
  UiVirtualScroll,
} from '@ww/interaction';

export default defineComponent({
  name: 'InteractionStoryHarness',
  components: {
    UiButton,
    UiCard,
    UiField,
    UiInput,
    UiTag,
    UiCascader,
    UiForm,
    UiFormItem,
    UiInfiniteScroll,
    UiTour,
    UiTransfer,
    UiTree,
    UiTreeSelect,
    UiUpload,
    UiVirtualList,
    UiVirtualScroll,
  },
  props: {
    mode: {
      type: String,
      default: 'overview',
    },
  },
  setup(props) {
    const mode = toRef(props, 'mode');
    const formModel = ref({
      title: '',
      owner: '',
    });
    const formSubmitState = ref('idle');
    const treeSelected = ref(['foundations']);
    const treeChecked = ref([]);
    const treeSelectValue = ref(null);
    const cascaderValue = ref(null);
    const transferValue = ref(['interaction']);
    const uploadItems = ref([]);
    const tourOpen = ref(false);
    const virtualItems = ref(
      Array.from({ length: 18 }, (_, index) => ({
        id: index + 1,
        label: `Governed row ${index + 1}`,
      }))
    );
    const infiniteItems = ref(
      Array.from({ length: 8 }, (_, index) => ({
        id: index + 1,
        label: `Infinite row ${index + 1}`,
      }))
    );

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

    const tourSteps = computed(() => [
      {
        target: '#interaction-tour-target-a',
        title: 'Tour spotlight',
        description: 'The guided runtime scrolls and highlights governed targets.',
      },
      {
        target: '#interaction-tour-target-b',
        title: 'Tour follow-up',
        description: 'Next and previous flow stays keyboard reachable.',
        placement: mode.value === 'interactions' ? 'right' : 'bottom',
      },
    ]);

    const uploadTransport = ({ onProgress }) => {
      onProgress(35);
      onProgress(85);
      onProgress(100);
      return Promise.resolve({ uploaded: true });
    };

    const loadMore = () => {
      const nextStart = infiniteItems.value.length + 1;
      infiniteItems.value = [
        ...infiniteItems.value,
        ...Array.from({ length: 4 }, (_, index) => ({
          id: nextStart + index,
          label: `Infinite row ${nextStart + index}`,
        })),
      ];
    };

    const resolveInputProps = (controlProps) => ({
      disabled: controlProps.disabled,
      id: controlProps.id,
      invalid: controlProps.invalid,
      ...(controlProps.ariaDescribedby ? { ariaDescribedby: controlProps.ariaDescribedby } : {}),
    });

    return {
      cascaderValue,
      formModel,
      formSubmitState,
      infiniteItems,
      loadMore,
      mode,
      resolveInputProps,
      tourOpen,
      tourSteps,
      transferValue,
      treeChecked,
      treeNodes,
      treeSelectValue,
      treeSelected,
      uploadItems,
      uploadTransport,
      virtualItems,
    };
  },
  template: `
    <div class="ui-stack" style="display: grid; gap: var(--ui-space-5);">
      <UiCard>
        <template #header>Virtualization</template>
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
              <div class="ui-virtual-list__item" :style="style" role="listitem">
                {{ index + 1 }}. {{ item.label }}
              </div>
            </template>
          </UiVirtualScroll>

          <UiVirtualList :items="virtualItems" :height="220" :item-size="36">
            <template #default="{ item }">
              <span>{{ item.label }}</span>
            </template>
          </UiVirtualList>

          <UiInfiniteScroll
            :items="infiniteItems"
            :height="220"
            :item-size="36"
            :has-more="infiniteItems.length < 20"
            @load-more="loadMore"
          >
            <template #default="{ item }">
              <span>{{ item.label }}</span>
            </template>
          </UiInfiniteScroll>
        </div>
      </UiCard>

      <UiCard>
        <template #header>Form runtime</template>
        <UiForm
          v-model="formModel"
          :rules="{
            title: [(value) => (String(value || '').trim() ? undefined : 'Title is required')],
            owner: [(value) => (String(value || '').trim() ? undefined : 'Owner is required')],
          }"
          @submit="formSubmitState = 'submitted'"
        >
          <div
            style="
              display: grid;
              gap: var(--ui-space-4);
              grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
            "
          >
            <UiFormItem name="title" label="Title" help="Form items stay thin over UiField">
              <template #default="{ value, setValue, handleBlur, controlProps }">
                <UiInput
                  v-bind="resolveInputProps(controlProps)"
                  :model-value="String(value ?? '')"
                  @update:model-value="setValue"
                  @blur="handleBlur"
                />
              </template>
            </UiFormItem>

            <UiFormItem name="owner" label="Owner">
              <template #default="{ value, setValue, handleBlur, controlProps }">
                <UiInput
                  v-bind="resolveInputProps(controlProps)"
                  :model-value="String(value ?? '')"
                  @update:model-value="setValue"
                  @blur="handleBlur"
                />
              </template>
            </UiFormItem>
          </div>

          <div style="display: flex; gap: var(--ui-space-3); align-items: center; flex-wrap: wrap;">
            <UiButton type="submit">Submit form</UiButton>
            <span style="color: var(--ui-text-secondary);">Form state: {{ formSubmitState }}</span>
          </div>
        </UiForm>
      </UiCard>

      <div
        style="
          display: grid;
          gap: var(--ui-space-4);
          grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
        "
      >
        <UiCard>
          <template #header>Tree and tree-select</template>
          <div style="display: grid; gap: var(--ui-space-3);">
            <UiTree
              v-model="treeSelected"
              :checked-keys="treeChecked"
              checkable
              :nodes="treeNodes"
              @update:checked-keys="treeChecked = $event"
            />
            <UiTreeSelect
              v-model="treeSelectValue"
              :nodes="treeNodes"
              :multiple="mode === 'states'"
              :checkable="mode === 'interactions'"
            />
          </div>
        </UiCard>

        <UiCard>
          <template #header>Cascader and transfer</template>
          <div style="display: grid; gap: var(--ui-space-3);">
            <UiField label="Cascader path">
              <UiCascader v-model="cascaderValue" :nodes="treeNodes" />
            </UiField>
            <UiTransfer v-model="transferValue" :items="treeNodes" :virtual="mode !== 'overview'" />
          </div>
        </UiCard>
      </div>

      <UiCard>
        <template #header>Upload orchestration</template>
        <UiUpload v-model="uploadItems" :transport="uploadTransport" />
      </UiCard>

      <UiCard>
        <template #header>Guided tour</template>
        <div style="display: grid; gap: var(--ui-space-3);">
          <div style="display: flex; gap: var(--ui-space-3); flex-wrap: wrap;">
            <UiButton @click="tourOpen = true">Start tour</UiButton>
            <UiTag variant="info">Selected tree: {{ treeSelected.join(', ') }}</UiTag>
          </div>
          <div
            style="
              display: grid;
              gap: var(--ui-space-3);
              grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
            "
          >
            <UiCard id="interaction-tour-target-a">Tour anchor A</UiCard>
            <UiCard id="interaction-tour-target-b">Tour anchor B</UiCard>
          </div>
        </div>
      </UiCard>

      <UiTour v-model:open="tourOpen" :steps="tourSteps" />
    </div>
  `,
});
