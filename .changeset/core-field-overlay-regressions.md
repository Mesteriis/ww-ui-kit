---
'@ww/core': patch
---

Fix rich field, menu, and floating overlay regressions in `@ww/core`.

Restore `UiAutocomplete` typeahead navigation, add timer cleanup on unmount for interactive field/menu/overlay surfaces, and expose proper `ariaLabel` / `aria-labelledby` wiring for `UiNumberInput`.
