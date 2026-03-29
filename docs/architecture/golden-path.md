# Golden Path

This is the canonical happy path for a new consumer product.

## 1. Install and import the foundation

```ts
import '@ww/themes/theme-light.css';
import '@ww/core/styles.css';
import { setTheme } from '@ww/themes';

setTheme('light');
```

Use:

- `@ww/core` for baseline controls
- `@ww/widgets` for reusable black-box surfaces
- `@ww/page-templates` for reusable page shells
- optional systems only when the product actually needs them

## 2. Theme and ThemeType

- Choose a concrete `ThemeName`.
- `ThemeType` is derived automatically.
- Use subtree theming when only part of a surface needs a different theme:

```html
<section data-ui-theme="belovodye" data-ui-theme-type="light">
  ...
</section>
```

## 3. Overlays

- Use `UiDialog` and `UiDrawer` from `@ww/core`.
- Do not manually manage portal roots.
- Scoped theme containers propagate through the existing theme-aware portal system.

## 4. Composition

- Use `UiWidgetShell` for reusable composed blocks.
- Use `DataTableWidget` when you want reusable table-shell framing above `@ww/data-grid`.
- Use `UiPageTemplate` and related shells for reusable page layout skeletons.
- Keep route pages, backend orchestration, and product-specific state in apps.

## 5. Optional systems

- `@ww/charts-apex` is a vendor-backed adapter and stays optional.
- `@ww/signal-graph` is feature-first and stays optional.
- `@ww/data-grid` is the canonical dense admin/business table system package.

## 6. Proof path

Any new public surface must update:

- the public surface manifest
- Storybook coverage
- docs coverage
- playground coverage
- tests
- ADRs when the change is architecture-sensitive
