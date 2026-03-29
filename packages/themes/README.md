# @ww/themes

`@ww/themes` maps concrete theme values onto the contracts defined by `@ww/tokens`.

It owns:

- `ThemeName` and `ThemeType`
- theme registry and metadata
- `setTheme(themeName, target?)`
- generated CSS exports such as `theme-light.css`, `theme-dark.css`, and `theme-belovodye.css`

It does not own:

- raw token contract definitions
- component logic
- overlay runtime logic

Use `@ww/themes` for theme metadata, scoped subtree theming, and theme-aware runtime helpers. Theme values must stay here instead of leaking into `@ww/core`, widgets, or apps.

`setTheme()` synchronizes `data-ui-theme` and derived `data-ui-theme-type`. Browser `color-scheme` follows the shared CSS contract keyed off `data-ui-theme-type`, so runtime helpers should not duplicate it with inline styles.
