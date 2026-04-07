import type { Meta, StoryObj } from '@storybook/vue3-vite';

import { UiBadge, UiCard } from '@ww/core';

// @ts-ignore Generated governance manifest is JS-only and has no bundled declarations.
import { PUBLIC_SURFACE_MANIFEST as rawPublicSurfaceManifest } from '../../../../../tools/governance/catalog/public-surface-manifest.mjs';

const KIND_DEFINITIONS = [
  { id: 'primitive', label: 'Primitive' },
  { id: 'core-component', label: 'Core Components' },
  { id: 'overlay-component', label: 'Overlay Components' },
  { id: 'theme-surface', label: 'Theme Surfaces' },
  { id: 'vendor-adapter', label: 'Vendor Adapters' },
  { id: 'feature-package', label: 'Feature Packages' },
  { id: 'widget-shell', label: 'Widget Shells' },
  { id: 'page-template-shell', label: 'Page Template Shells' },
  { id: 'package-surface', label: 'Package Surfaces' },
  { id: 'helper-api', label: 'Helper APIs' },
] as const;

type KindId = (typeof KIND_DEFINITIONS)[number]['id'];

type PublicSurfaceManifestEntry = {
  packageName: string;
  exportName: string;
  kind: KindId;
  tags: string[];
};

type KindRow = {
  packageName: string;
  surfaceName: string;
  entityNames: string[];
  tagsText: string;
};

const PUBLIC_SURFACE_MANIFEST = rawPublicSurfaceManifest as readonly PublicSurfaceManifestEntry[];

const splitEntities = (surfaceName: string) =>
  surfaceName
    .split(' / ')
    .map((name) => name.trim())
    .filter((name) => name.length > 0);

const getRowsByKind = (kind: KindId): KindRow[] =>
  PUBLIC_SURFACE_MANIFEST.filter((entry) => entry.kind === kind)
    .sort((a, b) =>
      `${a.packageName}${a.exportName}`.localeCompare(`${b.packageName}${b.exportName}`)
    )
    .map((entry) => ({
      packageName: entry.packageName,
      surfaceName: entry.exportName,
      entityNames: splitEntities(entry.exportName),
      tagsText: entry.tags.join(', '),
    }));

const kindLabelById = Object.fromEntries(
  KIND_DEFINITIONS.map((definition) => [definition.id, definition.label])
) as Record<KindId, string>;

const meta = {
  title: 'Public Surfaces',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

function createKindStory(kind: KindId): StoryObj {
  return {
    name: kindLabelById[kind],
    render: () => ({
      components: { UiBadge, UiCard },
      setup() {
        const rows = getRowsByKind(kind);
        const entityCount = rows.reduce((count, row) => count + row.entityNames.length, 0);

        return {
          label: kindLabelById[kind],
          rows,
          entityCount,
        };
      },
      template: `
        <div class="ui-stack">
          <UiCard>
            <template #header>{{ label }}</template>
            <p style="margin: 0; color: var(--ui-text-secondary);">
              Surfaces: {{ rows.length }} · Entities: {{ entityCount }}
            </p>
          </UiCard>

          <UiCard v-for="row in rows" :key="row.packageName + row.surfaceName">
            <template #header>
              <div class="ui-cluster">
                <code>{{ row.packageName }}</code>
                <UiBadge variant="brand">{{ row.entityNames.length }} entities</UiBadge>
              </div>
            </template>
            <div class="ui-stack">
              <div
                v-for="entity in row.entityNames"
                :key="row.packageName + entity"
                style="
                  margin: 0;
                  padding: var(--ui-space-2) var(--ui-space-3);
                  border: 1px solid var(--ui-border-subtle);
                  border-radius: var(--ui-radius-md);
                  background: color-mix(in srgb, var(--ui-surface-default) 95%, transparent);
                "
              >
                <code>{{ entity }}</code>
              </div>
              <p v-if="row.tagsText" style="margin: 0; color: var(--ui-text-muted);">
                Tags: {{ row.tagsText }}
              </p>
            </div>
          </UiCard>
        </div>
      `,
    }),
  };
}

export const Primitive = createKindStory('primitive');
export const CoreComponents = createKindStory('core-component');
export const OverlayComponents = createKindStory('overlay-component');
export const ThemeSurfaces = createKindStory('theme-surface');
export const VendorAdapters = createKindStory('vendor-adapter');
export const FeaturePackages = createKindStory('feature-package');
export const WidgetShells = createKindStory('widget-shell');
export const PageTemplateShells = createKindStory('page-template-shell');
export const PackageSurfaces = createKindStory('package-surface');
export const HelperApis = createKindStory('helper-api');
