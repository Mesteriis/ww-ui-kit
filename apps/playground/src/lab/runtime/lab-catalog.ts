import { PLAYGROUND_LAB_MANIFEST } from '../../../../../tools/governance/catalog/playground-lab-manifest.mjs';

import type {
  ComponentLabEntry,
  GovernanceLabSurfaceEntry,
  LabUsageRecord,
} from '../manifest/component-lab.types';
import { playgroundLabUsage } from '../generated/playground-lab-usage.generated';
import { componentLabRegistry } from './component-lab-registry';

const familyOrder = [
  'Actions',
  'Fields',
  'Selection',
  'Display',
  'Feedback',
  'Overlays',
  'Navigation',
  'Systems',
  'Widgets',
  'Page Templates',
  'Third-party adapters',
] as const;

type LabFamily = (typeof familyOrder)[number];

const familyRank = new Map<LabFamily, number>(familyOrder.map((family, index) => [family, index]));
const usageRecords = playgroundLabUsage.surfaces as Record<string, LabUsageRecord>;
const governanceManifest = PLAYGROUND_LAB_MANIFEST as readonly GovernanceLabSurfaceEntry[];

function resolveDefinition(id: string) {
  const definition = componentLabRegistry[id];
  if (!definition) {
    throw new Error(`Missing runtime component lab definition for "${id}".`);
  }

  return definition;
}

function resolveUsage(id: string) {
  const usage = usageRecords[id];
  if (!usage) {
    throw new Error(`Missing generated usage record for "${id}".`);
  }

  return usage;
}

function compareFamilies(left: string, right: string) {
  return (familyRank.get(left as LabFamily) ?? 999) - (familyRank.get(right as LabFamily) ?? 999);
}

const entries = governanceManifest
  .map((entry) => {
    const definition = resolveDefinition(entry.id);
    const usage = resolveUsage(entry.id);

    return {
      ...entry,
      definition,
      usage,
    } satisfies ComponentLabEntry<Record<string, unknown>>;
  })
  .sort(
    (
      left: ComponentLabEntry<Record<string, unknown>>,
      right: ComponentLabEntry<Record<string, unknown>>
    ) => {
      const familyDiff = compareFamilies(left.family, right.family);
      if (familyDiff !== 0) {
        return familyDiff;
      }

      return left.title.localeCompare(right.title);
    }
  );

export const componentLabEntries = Object.freeze(entries) as readonly ComponentLabEntry<
  Record<string, unknown>
>[];

export const componentLabEntryMap = Object.freeze(
  Object.fromEntries(componentLabEntries.map((entry) => [entry.id, entry]))
) as Readonly<Record<string, ComponentLabEntry<Record<string, unknown>>>>;

export const componentLabFamilies = Object.freeze(
  familyOrder
    .map((family) => ({
      family,
      entries: componentLabEntries.filter(
        (entry: ComponentLabEntry<Record<string, unknown>>) => entry.family === family
      ),
    }))
    .filter((group) => group.entries.length > 0)
);

export function createInitialLabEntry(fallbackId = 'ui-button') {
  const entry = componentLabEntryMap[fallbackId] ?? componentLabEntries[0];
  if (!entry) {
    throw new Error('Playground lab manifest is empty.');
  }

  return entry;
}

export function resolveLabEntry(surfaceId: string) {
  return componentLabEntryMap[surfaceId] ?? createInitialLabEntry();
}
