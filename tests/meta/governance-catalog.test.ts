import { describe, expect, it } from 'vitest';

import {
  PACKAGE_CLASSIFICATION,
  PACKAGE_CLASSIFICATION_MAP,
} from '../../tools/governance/catalog/package-classification.mjs';
import {
  PLAYGROUND_LAB_MANIFEST,
  PLAYGROUND_VISUAL_SURFACE_MANIFEST,
} from '../../tools/governance/catalog/playground-lab-manifest.mjs';
import { generatePlaygroundLabUsage } from '../../tools/governance/playground-lab/shared.mjs';
import { PUBLIC_SURFACE_MANIFEST } from '../../tools/governance/catalog/public-surface-manifest.mjs';
import { PLAYGROUND_SCENARIO_IDS } from '../../tools/governance/catalog/playground-requirements.mjs';
import { STABILITY_LEVELS } from '../../tools/governance/catalog/stability-rules.mjs';
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
