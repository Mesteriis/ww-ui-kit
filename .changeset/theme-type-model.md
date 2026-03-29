---
'@ww/themes': minor
'@ww/primitives': patch
'@ww/core': patch
---

Add canonical `ThemeType` metadata to the theme system and keep scoped overlays synchronized with both theme name and type.

- add `ThemeType`, `ThemeMeta`, and registry helpers to `@ww/themes`
- make `setTheme()` apply `data-ui-theme`, `data-ui-theme-type`, and `color-scheme`
- preserve theme name and type through theme-aware portal roots and scoped overlays
