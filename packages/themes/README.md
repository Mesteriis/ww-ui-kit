# @ww/themes

`@ww/themes` maps concrete theme values onto the contracts defined by `@ww/tokens`.

It owns:

- `ThemeName` and `ThemeType`
- theme registry and metadata
- `setTheme(themeName, target?)`
- `patchThemeRuntime(patch, target?)`
- `readThemeRuntime(target?)`
- `observeThemeRuntime(target, listener)`
- theme capability matrix for sanctioned runtime and token overrides
- generated CSS exports such as `theme-light.css`, `theme-dark.css`, and `theme-belovodye.css`

It does not own:

- raw token contract definitions
- component logic
- overlay runtime logic

Use `@ww/themes` for theme metadata, scoped subtree theming, and theme-aware runtime helpers. Theme values must stay here instead of leaking into `@ww/core`, widgets, or apps.

`belovodye` is the sanctioned dark dashboard theme in this registry. Consumers should treat its `ThemeType` as `dark` and let runtime helpers derive that metadata instead of hardcoding a second theme-family source of truth.

`setTheme()` synchronizes `data-ui-theme` and derived `data-ui-theme-type`. Browser `color-scheme` follows the shared CSS contract keyed off `data-ui-theme-type`, so runtime helpers should not duplicate it with inline styles.

## Runtime contract

`@ww/themes` keeps runtime state DOM-backed instead of introducing a second registry.

- writable attributes: `data-ui-theme`, `data-ui-density`, `data-ui-motion-profile`, `data-ui-personality`
- derived attribute: `data-ui-theme-type`
- canonical defaults: `density="default"`, `motionProfile="balanced"`, `personality="neutral"`

```ts
import { observeThemeRuntime, patchThemeRuntime, readThemeRuntime, setTheme } from '@ww/themes';

setTheme('light');

const section = document.querySelector<HTMLElement>('[data-settings-surface]');

patchThemeRuntime(
  {
    themeName: 'belovodye',
    density: 'comfortable',
    motionProfile: 'calm',
    personality: 'accented',
  },
  section
);

const state = readThemeRuntime(section);
const stop = observeThemeRuntime(section, (nextState) => {
  console.log(nextState.themeName, nextState.themeType);
});

stop();
```

Use `patchThemeRuntime()` when the consumer needs to update more than the concrete theme name. It always derives `ThemeType` from `ThemeName`, keeps attribute ownership in one place, and supports scoped subtree theming.

## Capability matrix

Theme sheets can override these sanctioned capability families:

- foundations: text, surface, border, and action semantic tokens
- component styles: button/card/input/dialog/tabs style tokens
- systems: data-grid, charts, and signal-graph surface tokens
- density: spacing, heights, and padding tokens
- typography: letter-spacing, text-transform, font-feature settings, and smoothing
- motion profiles: duration, distance, scale, overlay easing, and collapse opacity ratio
- personality: higher-level style posture such as rounded controls, stronger shadows, and display/label typography polish
- responsive: generated theme-sheet overrides at `48rem` and `72rem`

Responsive overrides stay in the generated theme CSS exports. They do not create a parallel runtime theme source of truth.
