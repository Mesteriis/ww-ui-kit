import { describe, expect, it } from 'vitest';

import uiButton from '../schemas/ui-button.lab';
import { createLabSession } from './session';

describe('component lab session', () => {
  it('updates state, toggles matrix groups, and resets defaults', () => {
    const session = createLabSession(uiButton);

    session.update('label', 'Ship release');
    session.previewMode.value = 'matrix';
    session.copyFormat.value = 'vue';

    expect(session.state.value.label).toBe('Ship release');
    expect(session.previewMode.value).toBe('matrix');
    expect(session.copyFormat.value).toBe('vue');

    session.setMultiToggleMode('matrixStates', 'none');
    expect(session.state.value.matrixStates).toEqual([]);

    session.setMultiToggleMode('matrixStates', 'all');
    expect(session.state.value.matrixStates).toEqual(['default', 'disabled', 'loading']);

    session.reset();

    expect(session.state.value).toEqual(uiButton.defaultState);
    expect(session.previewMode.value).toBe('single');
    expect(session.copyFormat.value).toBe('json');
  });

  it('serializes copy formats without mutating defaults', () => {
    const originalDefaults = structuredClone(uiButton.defaultState);

    const vueSnippet = uiButton.serializeCopy('vue', {
      ...structuredClone(uiButton.defaultState),
      label: 'Deploy now',
      leftIcon: true,
    });
    const jsonConfig = uiButton.serializeCopy('json', {
      ...structuredClone(uiButton.defaultState),
      loading: true,
    });

    expect(vueSnippet).toContain('<UiButton');
    expect(vueSnippet).toContain('Deploy now');
    expect(jsonConfig).toContain('"loading": true');
    expect(uiButton.defaultState).toEqual(originalDefaults);
  });
});
