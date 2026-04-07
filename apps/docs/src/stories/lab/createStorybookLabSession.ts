import { computed, ref } from 'vue';

import type {
  LabCopyFormat,
  LabPreset,
  LabPreviewMode,
  LabSurfaceDefinition,
} from '../../../../../apps/playground/src/lab/manifest/component-lab.types';

function getControlById<State extends Record<string, unknown>>(
  definition: LabSurfaceDefinition<State>,
  controlId: string
) {
  for (const section of definition.controlSections) {
    const control = section.controls.find((candidate) => candidate.id === controlId);
    if (control) {
      return control;
    }
  }

  return undefined;
}

function cloneDefaults<State extends Record<string, unknown>>(
  definition: LabSurfaceDefinition<State>
) {
  return structuredClone(definition.defaultState) as State;
}

function asStateValue<
  State extends Record<string, unknown>,
  Key extends Extract<keyof State, string>,
>(value: unknown) {
  return value as State[Key];
}

export function createStorybookLabSession<State extends Record<string, unknown>>(
  definition: LabSurfaceDefinition<State>
) {
  const state = ref(cloneDefaults(definition)) as { value: State };
  const previewMode = ref<LabPreviewMode>(definition.defaultPreviewMode);
  const copyFormat = ref<LabCopyFormat>(definition.defaultCopyFormat);
  const activePresetId = ref<string | null>(null);

  const matrixItems = computed(() => definition.buildMatrixItems(state.value));
  const copyText = computed(() => definition.serializeCopy(copyFormat.value, state.value));

  const update = <Key extends Extract<keyof State, string>>(key: Key, value: State[Key]) => {
    state.value = {
      ...state.value,
      [key]: value,
    };
  };

  const reset = () => {
    state.value = cloneDefaults(definition);
    previewMode.value = definition.defaultPreviewMode;
    copyFormat.value = definition.defaultCopyFormat;
    activePresetId.value = null;
  };

  const applyPreset = (preset: LabPreset<State> | null) => {
    activePresetId.value = preset?.id ?? null;
    if (!preset) {
      state.value = cloneDefaults(definition);
      return;
    }

    state.value = {
      ...cloneDefaults(definition),
      ...structuredClone(preset.patch),
    };
  };

  const setMultiToggleMode = (controlId: string, mode: 'all' | 'none') => {
    const control = getControlById(definition, controlId);
    if (!control || control.kind !== 'multi-toggle') {
      return;
    }

    update(
      control.id,
      asStateValue<State, Extract<keyof State, string>>(
        mode === 'all' ? control.options.map((option) => option.value) : []
      )
    );
  };

  return {
    activePresetId,
    applyPreset,
    copyFormat,
    copyText,
    matrixItems,
    previewMode,
    reset,
    setMultiToggleMode,
    state,
    update,
  };
}
