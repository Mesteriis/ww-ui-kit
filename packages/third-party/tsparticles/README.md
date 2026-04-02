# @ww/tsparticles

Vendor-backed `tsParticles` adapter package for Belovodye UiKit.

## Why this package exists

`@ww/tsparticles` keeps vendor particle effects out of `@ww/core`, `@ww/page-templates`, and app code.

- `@ww/core` stays free of particle-engine dependencies
- consumers get a neutral backdrop wrapper instead of direct vendor setup
- theme, subtree theming, and reduced-motion behavior stay aligned with the existing design-system contracts

## Installation

```bash
pnpm add @ww/tsparticles
```

Import styles explicitly:

```ts
import '@ww/tsparticles/styles.css';
```

## Public surface

- `UiTsParticlesBackdrop`
- `UiTsParticlesBackdropOptions`
- `UiTsParticlesBackdropColorVar`
- `UiTsParticlesBackdropSize`
- `UiTsParticlesBackdropProps`

## Usage

```vue
<script setup lang="ts">
import { UiCard } from '@ww/core';
import { UiTsParticlesBackdrop, type UiTsParticlesBackdropOptions } from '@ww/tsparticles';

const options: UiTsParticlesBackdropOptions = {
  particles: {
    move: {
      enable: true,
      speed: 0.6,
    },
    number: {
      value: 22,
    },
  },
};
</script>

<template>
  <UiTsParticlesBackdrop
    size="fill"
    :options="options"
    particle-color-var="--ui-brand-300"
    link-color-var="--ui-border-focus"
  >
    <UiCard>
      <template #header>Particle-backed shell</template>
      Backdrop stays decorative and pointer-neutral.
    </UiCard>
  </UiTsParticlesBackdrop>
</template>
```

## Neutral wrapper contract

- the backdrop is decorative only
- particle canvas stays behind slotted content
- the backdrop never captures pointer events
- the wrapper does not inject padding or route-level behavior
- use `size="auto"` for shrink-wrapped content and `size="fill"` for full-area shells
- `fullScreen`, background takeover, and hover/click interactivity are normalized away to keep the wrapper neutral
- `disabled` keeps the wrapper footprint while suppressing the vendor canvas

## Theme and color contract

- colors are resolved from CSS custom properties against the nearest themed container
- subtree theming works through `data-ui-theme` and `data-ui-theme-type`
- color props accept sanctioned `--ui-*` token variables only
- motion-sensitive consumers can rely on the shared reduced-motion contract

## License note

This package is a vendor-backed adapter around `tsParticles`. Consumers are responsible for checking whether the upstream license fits their usage scenario.
