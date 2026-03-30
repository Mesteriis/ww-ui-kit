# Golden Path

This is the canonical happy path for a new consumer product.

## 1. Install and import the foundation

```ts
import '@ww/themes/theme-light.css';
import '@ww/core/styles.css';
import { patchThemeRuntime, setTheme } from '@ww/themes';

setTheme('light');
patchThemeRuntime({ density: 'default', motionProfile: 'balanced', personality: 'neutral' });
```

Use:

- `@ww/core` for baseline controls
- `@ww/widgets` for reusable black-box surfaces
- `@ww/page-templates` for reusable page shells
- optional systems only when the product actually needs them

## 2. Theme and ThemeType

- Choose a concrete `ThemeName`.
- `ThemeType` is derived automatically.
- Core styles own `color-scheme` through `data-ui-theme-type`; `setTheme()` only needs to keep the theme attributes in sync.
- Runtime theme capabilities stay on the same DOM-backed contract. Use `patchThemeRuntime()` for sanctioned density, motion-profile, and personality changes instead of inventing a second registry.
- Use subtree theming when only part of a surface needs a different theme:

```html
<section data-ui-theme="belovodye" data-ui-theme-type="light">...</section>
```

Or apply the full scoped runtime contract from code:

```ts
patchThemeRuntime(
  {
    themeName: 'belovodye',
    density: 'comfortable',
    motionProfile: 'calm',
    personality: 'accented',
  },
  scopedElement
);
```

- Responsive theme overrides stay in generated theme CSS at the sanctioned breakpoints.
- `ThemeType` remains derived from `ThemeName` even when runtime capabilities change.

## 3. Overlays

- Use `UiDialog` and `UiDrawer` from `@ww/core`.
- Do not manually manage portal roots.
- Scoped theme containers propagate through the existing theme-aware portal system.

## 4. Composition

- Use `UiWidgetShell` for reusable composed blocks.
- Use `DataTableWidget` when you want reusable table-shell framing above `@ww/data-grid`.
- Use `UiLayout` and related layout primitives for reusable page-shell skeletons; named dashboard or marketing templates compose above them.
- Keep route pages, backend orchestration, and product-specific state in apps.

## 5. Optional systems

- `@ww/charts-apex` is a vendor-backed adapter and stays optional.
- `@ww/signal-graph` is feature-first and stays optional.
- `@ww/data-grid` is the canonical dense admin/business table system package.

## 6. Proof path

Any new public surface must update:

- the public surface manifest
- the playground lab manifest when the surface is visual and lab-eligible
- Storybook coverage
- docs coverage
- playground coverage
- tests
- ADRs when the change is architecture-sensitive
