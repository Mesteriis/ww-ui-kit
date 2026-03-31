import { describe, expect, it } from 'vitest';

import {
  PACKAGE_CLASSIFICATION,
  PACKAGE_CLASSIFICATION_MAP,
} from '../../tools/governance/catalog/package-classification.mjs';
import {
  PLAYGROUND_LAB_MANIFEST,
  PLAYGROUND_VISUAL_SURFACE_MANIFEST,
} from '../../tools/governance/catalog/playground-lab-manifest.mjs';
import {
  getRequiredStorybookInvariants,
  getStoryArtifactInvariantCoverage,
  kindRequiresStorybook,
  STORYBOOK_INVARIANT_IDS,
} from '../../tools/governance/catalog/storybook-requirements.mjs';
import { generatePlaygroundLabUsage } from '../../tools/governance/playground-lab/shared.mjs';
import { PUBLIC_SURFACE_MANIFEST } from '../../tools/governance/catalog/public-surface-manifest.mjs';
import { PLAYGROUND_SCENARIO_IDS } from '../../tools/governance/catalog/playground-requirements.mjs';
import { STABILITY_LEVELS } from '../../tools/governance/catalog/stability-rules.mjs';
import {
  auditRuntimeExportCoverage,
  collectNamedRuntimeExports,
  isLikelyVisualRuntimeExport,
  splitManifestExportName,
} from '../../tools/governance/shared/public-exports.mjs';
import { PLAYGROUND_SCENARIOS } from '../../apps/playground/src/testing/scenarios.mjs';

describe('governance catalog', () => {
  it('classifies every package with a valid stability', () => {
    expect(PACKAGE_CLASSIFICATION.length).toBeGreaterThan(0);

    for (const entry of PACKAGE_CLASSIFICATION) {
      expect(STABILITY_LEVELS).toContain(entry.stability);
      expect(entry.packageLayer.length).toBeGreaterThan(0);
    }
  });

  it('keeps public surface entries aligned with package classification', () => {
    expect(PUBLIC_SURFACE_MANIFEST.length).toBeGreaterThan(0);

    for (const surface of PUBLIC_SURFACE_MANIFEST) {
      const packageMeta = PACKAGE_CLASSIFICATION_MAP[surface.packageName];
      expect(packageMeta).toBeDefined();
      expect(surface.packageLayer).toBe(packageMeta.packageLayer);
      expect(surface.stability).toBe(packageMeta.stability);
    }
  });

  it('covers named root runtime exports with the public surface manifest', () => {
    for (const packageEntry of PACKAGE_CLASSIFICATION.filter((entry) => entry.public)) {
      const surfaces = PUBLIC_SURFACE_MANIFEST.filter(
        (surface) => surface.packageName === packageEntry.packageName
      );
      const { missingExports, orphanedCoveredExports } = auditRuntimeExportCoverage(
        packageEntry,
        surfaces
      );

      expect(missingExports).toEqual([]);
      expect(orphanedCoveredExports).toEqual([]);
    }
  });

  it('keeps public visual surfaces on an explicit Storybook contract', () => {
    for (const surface of PUBLIC_SURFACE_MANIFEST) {
      if (!kindRequiresStorybook(surface.kind)) {
        continue;
      }

      expect(surface.requiresStorybook).toBe(true);
      expect(surface.storyArtifacts.length).toBeGreaterThan(0);
    }
  });

  it('keeps likely visual root runtime exports on a Storybook-backed surface', () => {
    const surfaceByExport = new Map();
    for (const surface of PUBLIC_SURFACE_MANIFEST) {
      for (const exportName of splitManifestExportName(surface.exportName)) {
        surfaceByExport.set(exportName, surface);
      }

      for (const exportName of surface.coveredExports ?? []) {
        surfaceByExport.set(exportName, surface);
      }
    }

    for (const packageEntry of PACKAGE_CLASSIFICATION.filter((entry) => entry.public)) {
      const runtimeExports = collectNamedRuntimeExports(
        `${packageEntry.physicalPath}/src/index.ts`
      ).filter(isLikelyVisualRuntimeExport);

      for (const exportName of runtimeExports) {
        expect(surfaceByExport.get(exportName)?.requiresStorybook).toBe(true);
      }
    }
  });

  it('keeps Storybook invariant coverage aligned with the manifest contract', () => {
    for (const surface of PUBLIC_SURFACE_MANIFEST.filter((entry) => entry.requiresStorybook)) {
      const actualInvariantCoverage = new Set(
        surface.storyArtifacts.flatMap((artifact) => getStoryArtifactInvariantCoverage(artifact))
      );

      for (const invariantId of getRequiredStorybookInvariants(surface)) {
        expect(STORYBOOK_INVARIANT_IDS).toContain(invariantId);
        expect(actualInvariantCoverage.has(invariantId)).toBe(true);
      }

      for (const artifact of surface.storyArtifacts) {
        for (const invariantId of getStoryArtifactInvariantCoverage(artifact)) {
          expect(STORYBOOK_INVARIANT_IDS).toContain(invariantId);
        }
      }
    }
  });

  it('keeps declared playground scenarios in sync with the runtime scenario registry', () => {
    const runtimeScenarioIds = PLAYGROUND_SCENARIOS.map((scenario) => scenario.id);
    expect(runtimeScenarioIds).toEqual(PLAYGROUND_SCENARIO_IDS);
  });

  it('keeps lab-eligible visual surfaces aligned with the lab manifest and generated usage map', () => {
    const eligibleIds = PLAYGROUND_VISUAL_SURFACE_MANIFEST.filter((entry) => entry.labEligible).map(
      (entry) => entry.id
    );
    const usage = generatePlaygroundLabUsage();

    expect(PLAYGROUND_LAB_MANIFEST.map((entry) => entry.id)).toEqual(eligibleIds);

    for (const entry of PLAYGROUND_LAB_MANIFEST) {
      expect(entry.previewModes).toEqual(expect.arrayContaining(['single', 'matrix']));
      expect(entry.copyFormats.length).toBeGreaterThan(0);
      expect(usage.surfaces[entry.id]).toBeDefined();
    }
  });
});
