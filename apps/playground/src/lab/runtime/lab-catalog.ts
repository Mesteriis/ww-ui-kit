import { PLAYGROUND_LAB_MANIFEST } from '../../../../../tools/governance/catalog/playground-lab-manifest.mjs';

import type {
  ComponentLabCatalogEntry,
  ComponentLabEntry,
  GovernanceLabSurfaceEntry,
  LabUsageRecord,
} from '../manifest/component-lab.types';
import { loadComponentLabDefinition } from './component-lab-registry';

const familyOrder = [
  'Actions',
  'Layout',
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
const governanceManifest = PLAYGROUND_LAB_MANIFEST as readonly GovernanceLabSurfaceEntry[];
let usageRecordsPromise: Promise<Record<string, LabUsageRecord>> | null = null;
const definitionCache = new Map<string, Promise<ComponentLabEntry<Record<string, unknown>>['definition']>>();

function compareFamilies(left: string, right: string) {
  return (familyRank.get(left as LabFamily) ?? 999) - (familyRank.get(right as LabFamily) ?? 999);
}

const entries = governanceManifest
  .map((entry) => entry satisfies ComponentLabCatalogEntry)
  .sort(
    (
      left: ComponentLabCatalogEntry,
      right: ComponentLabCatalogEntry
    ) => {
      const familyDiff = compareFamilies(left.family, right.family);
      if (familyDiff !== 0) {
        return familyDiff;
      }

      return left.title.localeCompare(right.title);
    }
  );

export const componentLabEntries: readonly ComponentLabCatalogEntry[] = Object.freeze(entries);

export const componentLabEntryMap: Readonly<Record<string, ComponentLabCatalogEntry>> = Object.freeze(
  Object.fromEntries(componentLabEntries.map((entry) => [entry.id, entry]))
);

export const componentLabFamilies = Object.freeze(
  familyOrder
    .map((family) => ({
      family,
      entries: componentLabEntries.filter(
        (entry: ComponentLabCatalogEntry) => entry.family === family
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

export function resolveLabCatalogEntry(surfaceId: string) {
  return componentLabEntryMap[surfaceId] ?? createInitialLabEntry();
}

async function loadUsageRecords() {
  if (!usageRecordsPromise) {
    usageRecordsPromise = import('../generated/playground-lab-usage.generated').then(
      ({ playgroundLabUsage }) => playgroundLabUsage.surfaces as Record<string, LabUsageRecord>
    );
  }

  return usageRecordsPromise;
}

async function resolveUsage(surfaceId: string) {
  const usageRecords = await loadUsageRecords();
  const usage = usageRecords[surfaceId];
  if (!usage) {
    throw new Error(`Missing generated usage record for "${surfaceId}".`);
  }

  return usage;
}

function resolveDefinition(surfaceId: string) {
  const cachedDefinition = definitionCache.get(surfaceId);
  if (cachedDefinition) {
    return cachedDefinition;
  }

  const nextDefinition = loadComponentLabDefinition(surfaceId);
  definitionCache.set(surfaceId, nextDefinition);
  return nextDefinition;
}

export async function loadLabEntry(surfaceId: string) {
  const entry = resolveLabCatalogEntry(surfaceId);
  const [definition, usage] = await Promise.all([
    resolveDefinition(entry.id),
    resolveUsage(entry.id),
  ]);

  return {
    ...entry,
    definition,
    usage,
  } satisfies ComponentLabEntry<Record<string, unknown>>;
}
