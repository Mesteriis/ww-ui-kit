import { describe, expect, it } from 'vitest';

import {
  DEFAULT_PLAYGROUND_THEME_PREFERENCES,
  PLAYGROUND_THEME_PREFERENCES_STORAGE_KEY,
  readPlaygroundThemePreferences,
  writePlaygroundThemePreferences,
} from './theme-preferences';

describe('theme preferences', () => {
  it('writes and restores the persisted playground theme runtime', () => {
    const storage = window.localStorage;
    storage.clear();

    writePlaygroundThemePreferences(
      {
        themeName: 'dark',
        themeFilter: 'dark',
        density: 'compact',
        motionProfile: 'expressive',
        personality: 'accented',
      },
      storage
    );

    expect(readPlaygroundThemePreferences(storage)).toEqual({
      themeName: 'dark',
      themeFilter: 'dark',
      density: 'compact',
      motionProfile: 'expressive',
      personality: 'accented',
    });
  });

  it('falls back to defaults when persisted data is malformed', () => {
    const storage = window.localStorage;
    storage.clear();
    storage.setItem(PLAYGROUND_THEME_PREFERENCES_STORAGE_KEY, '{invalid json');

    expect(readPlaygroundThemePreferences(storage)).toEqual(DEFAULT_PLAYGROUND_THEME_PREFERENCES);
  });

  it('normalizes a mismatched theme family back to the selected theme type', () => {
    const storage = window.localStorage;
    storage.clear();
    storage.setItem(
      PLAYGROUND_THEME_PREFERENCES_STORAGE_KEY,
      JSON.stringify({
        themeName: 'belovodye',
        themeFilter: 'dark',
        density: 'default',
        motionProfile: 'balanced',
        personality: 'neutral',
      })
    );

    expect(readPlaygroundThemePreferences(storage)).toEqual({
      themeName: 'belovodye',
      themeFilter: 'light',
      density: 'default',
      motionProfile: 'balanced',
      personality: 'neutral',
    });
  });
});
