import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { computed, ref } from 'vue';

import {
  UiAutocomplete,
  UiField,
  UiInput,
  UiInputGroup,
  UiInputOtp,
  UiInputPassword,
  UiInputTag,
  UiNumberInput,
  UiRating,
  UiRangeSlider,
  UiSelect,
  UiSelectSimple,
  UiSlider,
  UiTextarea,
} from '@ww/core';

const meta = {
  title: 'Core/Scenarios/Fields',
  component: UiField,
  tags: ['autodocs', '!dev'],
} satisfies Meta<typeof UiField>;

export default meta;

export const Inputs: StoryObj<typeof UiField> = {
  render: () => ({
    components: {
      UiAutocomplete,
      UiField,
      UiInput,
      UiInputGroup,
      UiInputOtp,
      UiInputPassword,
      UiInputTag,
      UiNumberInput,
      UiRating,
      UiRangeSlider,
      UiSelect,
      UiSelectSimple,
      UiSlider,
      UiTextarea,
    },
    setup() {
      const name = ref('Belovodye UiKit foundation');
      const description = ref('Source of truth lives in stories.');
      const repository = ref('governance/core-wave');
      const simpleSelected = ref('tokens');
      const budget = ref<number | null>(12.5);
      const richSelected = ref<string | null>('bravo');
      const multiSelected = ref<Array<string | number>>(['tokens']);
      const passwordValue = ref('Belovodye-42');
      const passwordVisible = ref(false);
      const tagValues = ref<string[]>(['tokens', 'themes']);
      const otpValue = ref('7314');
      const reviewRating = ref(4.5);
      const autocompleteValue = ref('');
      const rolloutTarget = ref(65);
      const deployWindow = ref<[number, number]>([25, 75]);
      const passwordRules = [
        { label: 'At least 12 characters', met: true },
        { label: 'Contains a number', met: true },
        { label: 'Contains a symbol', met: true },
      ];

      const simpleOptions = [
        { label: 'Tokens', value: 'tokens' },
        { label: 'Themes', value: 'themes' },
        { label: 'Core', value: 'core' },
      ];

      const richOptions = [
        { label: 'Overview queue', value: 'overview', icon: '⌘', keywords: ['queue'] },
        {
          type: 'group' as const,
          label: 'Deploy lanes',
          options: [
            { label: 'Bravo lane', value: 'bravo', icon: 'B', keywords: ['deploy', 'blue'] },
            { label: 'Charlie lane', value: 'charlie', disabled: true, icon: 'C' },
          ],
        },
      ];

      const multiOptions = [
        { label: 'Tokens', value: 'tokens' },
        { label: 'Themes', value: 'themes' },
        { label: 'Core', value: 'core' },
        { label: 'Docs', value: 'docs' },
      ];

      const autocompleteItems = [
        {
          label: 'Belovodye control room',
          value: 'Belovodye control room',
          description: 'Scoped theme release surface',
          keywords: ['belovodye', 'theme'],
        },
        {
          label: 'Core wave verify',
          value: 'Core wave verify',
          description: 'Manifest, stories, playground, and tests',
          keywords: ['verify', 'core'],
        },
        {
          label: 'Bravo deploy lane',
          value: 'Bravo deploy lane',
          description: 'Menu and select collection flows',
          keywords: ['deploy', 'bravo'],
        },
      ];

      const sliderMarks = [
        { value: 0, label: '0%' },
        { value: 50, label: '50%' },
        { value: 100, label: '100%' },
      ];

      const rangeMarks = [
        { value: 0, label: '00:00' },
        { value: 25, label: '06:00' },
        { value: 50, label: '12:00' },
        { value: 75, label: '18:00' },
        { value: 100, label: '24:00' },
      ];

      const multiSummary = computed(() =>
        multiSelected.value.length > 0 ? multiSelected.value.join(', ') : 'none'
      );

      return {
        autocompleteItems,
        autocompleteValue,
        budget,
        deployWindow,
        description,
        multiOptions,
        multiSelected,
        multiSummary,
        name,
        otpValue,
        passwordRules,
        passwordValue,
        passwordVisible,
        rangeMarks,
        repository,
        richOptions,
        richSelected,
        rolloutTarget,
        reviewRating,
        simpleOptions,
        simpleSelected,
        sliderMarks,
        tagValues,
      };
    },
    template: `
      <div class="ui-stack" style="max-width: 72rem;">
        <div
          style="
            display: grid;
            gap: var(--ui-space-4);
            grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
          "
        >
          <UiField label="Name" hint="Associated with the control through context">
            <UiInput v-model="name" />
          </UiField>

          <UiField label="Repository URL" hint="Input groups keep addons inside the field layer">
            <UiInputGroup>
              <template #prepend>https://</template>
              <UiInput v-model="repository" placeholder="team/repository" />
              <template #append>.git</template>
            </UiInputGroup>
          </UiField>

          <UiField label="Description" error="Shows hint and error wiring">
            <UiTextarea v-model="description" />
          </UiField>

          <UiField label="Area">
            <UiSelectSimple v-model="simpleSelected" :options="simpleOptions" />
          </UiField>

          <UiField label="Budget" hint="Arrow keys, PageUp/PageDown, Home/End, clamp, and empty state">
            <UiNumberInput
              v-model="budget"
              :min="0"
              :max="40"
              :step="0.5"
              :precision="1"
              allow-empty
            />
          </UiField>

          <UiField label="Deploy lane" hint="Searchable single select on the shared floating path">
            <UiSelect
              v-model="richSelected"
              searchable
              clearable
              placeholder="Pick a lane"
              :options="richOptions"
            >
              <template #option="{ option, selected }">
                <span style="display: inline-flex; gap: var(--ui-space-2); align-items: center;">
                  <span aria-hidden="true">{{ option.icon ?? '•' }}</span>
                  <span>{{ option.label }}</span>
                  <strong v-if="selected" style="margin-inline-start: auto;">Selected</strong>
                </span>
              </template>
            </UiSelect>
          </UiField>

          <UiField label="Coverage tags" hint="Multiple selection stays beside UiSelectSimple">
            <UiSelect
              v-model="multiSelected"
              multiple
              searchable
              clearable
              placeholder="Choose tags"
              :options="multiOptions"
            />
          </UiField>

          <UiField label="Password" hint="Visibility toggle, strength meter, and rules stay explicit">
            <UiInputPassword
              v-model="passwordValue"
              v-model:revealed="passwordVisible"
              :strength="72"
              strength-text="Strong"
              :rules="passwordRules"
            />
          </UiField>

          <UiField label="Release tags" hint="Tag input splits commas and keeps duplicate policy explicit">
            <UiInputTag
              v-model="tagValues"
              placeholder="Type and press Enter"
              :max-tags="5"
            />
          </UiField>

          <UiField label="Verification code" hint="Segmented OTP input auto-advances and supports paste">
            <UiInputOtp v-model="otpValue" :length="4" />
          </UiField>

          <UiField label="Release confidence" hint="Rating keeps radiogroup semantics and half steps">
            <UiRating v-model="reviewRating" allow-half allow-clear tone="brand" />
          </UiField>

          <UiField label="Suggestion search" hint="Combobox keeps local suggestion control and Enter select">
            <UiAutocomplete v-model="autocompleteValue" :items="autocompleteItems">
              <template #item="{ item }">
                <span style="display: grid; gap: var(--ui-space-1);">
                  <strong>{{ item.label }}</strong>
                  <span style="color: var(--ui-text-secondary);">{{ item.description }}</span>
                </span>
              </template>
            </UiAutocomplete>
          </UiField>

          <UiField label="Rollout target" hint="Slider keeps keyboard semantics and optional numeric proof">
            <UiSlider
              v-model="rolloutTarget"
              :min="0"
              :max="100"
              :step="5"
              :marks="sliderMarks"
              show-input
            />
          </UiField>

          <UiField label="Deploy window" hint="Range slider keeps two-thumb semantics and minRange">
            <UiRangeSlider
              v-model="deployWindow"
              :min="0"
              :max="100"
              :step="5"
              :min-range="10"
              :marks="rangeMarks"
              show-input
            />
          </UiField>
        </div>

        <div class="ui-cluster">
          <span>Budget value: {{ budget ?? 'empty' }}</span>
          <span>Password visible: {{ passwordVisible ? 'yes' : 'no' }}</span>
          <span>Rich select: {{ richSelected ?? 'none' }}</span>
          <span>Selected tags: {{ multiSummary }}</span>
          <span>Tag input: {{ tagValues.join(', ') || 'none' }}</span>
          <span>OTP value: {{ otpValue || 'empty' }}</span>
          <span>Rating value: {{ reviewRating || 'empty' }}</span>
          <span>Autocomplete value: {{ autocompleteValue || 'none' }}</span>
          <span>Rollout target: {{ rolloutTarget }}</span>
          <span>Deploy window: {{ deployWindow[0] }}-{{ deployWindow[1] }}</span>
        </div>
      </div>
    `,
  }),
};

export const SliderStates: StoryObj<typeof UiField> = {
  render: () => ({
    components: {
      UiField,
      UiRangeSlider,
      UiSlider,
    },
    setup() {
      const densityTarget = ref(40);
      const verticalTarget = ref(70);
      const releaseWindow = ref<[number, number]>([20, 80]);
      const compactMarks = [
        { value: 0, label: '0' },
        { value: 50, label: '50' },
        { value: 100, label: '100' },
      ];

      return {
        compactMarks,
        densityTarget,
        releaseWindow,
        verticalTarget,
      };
    },
    template: `
      <div
        style="
          display: grid;
          gap: var(--ui-space-5);
          grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
          align-items: start;
          max-width: 72rem;
        "
      >
        <UiField label="Density target" hint="Default horizontal slider">
          <UiSlider v-model="densityTarget" :min="0" :max="100" :step="10" :marks="compactMarks" />
        </UiField>

        <UiField label="Vertical target" hint="Vertical slider keeps the same contract">
          <UiSlider
            v-model="verticalTarget"
            orientation="vertical"
            :min="0"
            :max="100"
            :step="10"
            :marks="compactMarks"
            tooltip="always"
          />
        </UiField>

        <UiField label="Release window" hint="Range slider keeps both values visible">
          <UiRangeSlider
            v-model="releaseWindow"
            :min="0"
            :max="100"
            :step="10"
            :min-range="20"
            :marks="compactMarks"
            tooltip="always"
          />
        </UiField>
      </div>
    `,
  }),
};

export const RatingStates: StoryObj<typeof UiField> = {
  render: () => ({
    components: {
      UiField,
      UiRating,
    },
    setup() {
      const readiness = ref(3.5);
      const frozen = ref(4);
      const invalid = ref(1);

      return {
        frozen,
        invalid,
        readiness,
      };
    },
    template: `
      <div
        style="
          display: grid;
          gap: var(--ui-space-5);
          grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
          align-items: start;
          max-width: 72rem;
        "
      >
        <UiField label="Base rating" hint="Half-step keyboard and pointer selection stay explicit">
          <UiRating v-model="readiness" allow-half allow-clear tone="brand" />
        </UiField>

        <UiField label="Readonly review" hint="Readonly keeps the current value visible">
          <UiRating v-model="frozen" readonly tone="success" />
        </UiField>

        <UiField label="Invalid confidence" error="Invalid styling stays token-aware">
          <UiRating v-model="invalid" invalid tone="danger" />
        </UiField>
      </div>
    `,
  }),
};

export const SliderEdgeCases: StoryObj<typeof UiField> = {
  render: () => ({
    components: {
      UiField,
      UiRangeSlider,
      UiSlider,
    },
    setup() {
      const invalidValue = ref(30);
      const disabledWindow = ref<[number, number]>([30, 60]);

      return {
        disabledWindow,
        invalidValue,
      };
    },
    template: `
      <div
        style="
          display: grid;
          gap: var(--ui-space-5);
          grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
          align-items: start;
          max-width: 72rem;
        "
      >
        <UiField label="Confidence threshold" error="Invalid styling stays token-aware">
          <UiSlider v-model="invalidValue" invalid :min="0" :max="100" :step="5" />
        </UiField>

        <UiField label="Frozen window" hint="Disabled range slider preserves current values">
          <UiRangeSlider
            v-model="disabledWindow"
            disabled
            :min="0"
            :max="100"
            :step="5"
            :min-range="15"
          />
        </UiField>
      </div>
    `,
  }),
};

export const InputEnrichments: StoryObj<typeof UiField> = {
  render: () => ({
    components: {
      UiField,
      UiInput,
      UiInputGroup,
      UiInputOtp,
      UiInputPassword,
      UiInputTag,
    },
    setup() {
      const host = ref('governance');
      const password = ref('Belovodye-42');
      const tags = ref<string[]>(['docs']);
      const otp = ref('58');

      return {
        host,
        otp,
        password,
        tags,
      };
    },
    template: `
      <div
        style="
          display: grid;
          gap: var(--ui-space-5);
          grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
          align-items: start;
          max-width: 72rem;
        "
      >
        <UiField label="Canonical host">
          <UiInputGroup>
            <template #prepend>https://</template>
            <UiInput v-model="host" />
            <template #append>/release</template>
          </UiInputGroup>
        </UiField>

        <UiField label="Readonly reveal flow" hint="Password state can stay consumer-controlled">
          <UiInputPassword v-model="password" revealed readonly />
        </UiField>

        <UiField label="Tag parsing" hint="Comma and blur both commit values">
          <UiInputTag v-model="tags" />
        </UiField>

        <UiField label="Masked OTP" hint="Masking stays local to the segmented control">
          <UiInputOtp v-model="otp" :length="4" mask />
        </UiField>
      </div>
    `,
  }),
};

export const InputEdgeCases: StoryObj<typeof UiField> = {
  render: () => ({
    components: {
      UiField,
      UiInput,
      UiInputGroup,
      UiInputOtp,
      UiInputPassword,
      UiInputTag,
    },
    setup() {
      const lockedPassword = ref('Locked-value');
      const strictTags = ref<string[]>(['tokens', 'core']);
      const invalidOtp = ref('7');

      return {
        invalidOtp,
        lockedPassword,
        strictTags,
      };
    },
    template: `
      <div
        style="
          display: grid;
          gap: var(--ui-space-5);
          grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
          align-items: start;
          max-width: 72rem;
        "
      >
        <UiField label="Search contract" hint="Disabled addon group keeps its structural framing">
          <UiInputGroup disabled>
            <template #prepend>Scope</template>
            <UiInput model-value="read-only" disabled />
          </UiInputGroup>
        </UiField>

        <UiField label="Invalid password" error="Strength guidance stays outside validation ownership">
          <UiInputPassword v-model="lockedPassword" :strength="22" strength-text="Weak" invalid />
        </UiField>

        <UiField label="Readonly tags" hint="Removal controls respect readonly state">
          <UiInputTag v-model="strictTags" readonly />
        </UiField>

        <UiField label="Invalid code" error="Segment invalid styling stays token-aware">
          <UiInputOtp v-model="invalidOtp" :length="4" invalid />
        </UiField>
      </div>
    `,
  }),
};
