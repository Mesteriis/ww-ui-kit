import { computed, ref } from 'vue';

import type {
  LabSession,
  LabCopyFormat,
  LabPreset,
  LabPreviewMode,
  LabSurfaceDefinition,
} from '../manifest/component-lab.types';
import { deepClone } from './schema-helpers';

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
  return deepClone(definition.defaultState);
}

function asStateValue<
  State extends Record<string, unknown>,
  Key extends Extract<keyof State, string>,
>(value: unknown) {
  return value as State[Key];
}

export function createLabSession<State extends Record<string, unknown>>(
  definition: LabSurfaceDefinition<State>
): LabSession<State> {
  const state = ref(cloneDefaults(definition)) as LabSession<State>['state'];
  const previewMode = ref<LabPreviewMode>(definition.defaultPreviewMode);
  const copyFormat = ref<LabCopyFormat>(definition.defaultCopyFormat);
  const activePresetId = ref<string | null>(null);

  const matrixItems = computed(() => definition.buildMatrixItems(state.value));

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
      ...deepClone(preset.patch),
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

  const copyText = computed(() => definition.serializeCopy(copyFormat.value, state.value));

  return {
    state,
    previewMode,
    copyFormat,
    activePresetId,
    matrixItems,
    update,
    reset,
    applyPreset,
    setMultiToggleMode,
    copyText,
  };
}
