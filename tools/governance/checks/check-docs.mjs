import { PUBLIC_SURFACE_MANIFEST } from '../catalog/public-surface-manifest.mjs';
import { getRequiredDocsArtifacts } from '../catalog/docs-requirements.mjs';
import { fileExists, readText } from '../shared/workspace.mjs';

const requiredArchitectureDocs = [
  'docs/architecture/layer-governance.md',
  'docs/architecture/package-topology.md',
  'docs/architecture/public-api-discipline.md',
  'docs/architecture/golden-path.md',
  'docs/architecture/placement-rules.md',
  'docs/architecture/stability-model.md',
  'docs/architecture/testing-architecture.md',
  'docs/architecture/docs-as-contract.md',
  'docs/architecture/ai-agent-governance.md',
  'docs/governance/ai-rules.md',
  'docs/governance/ai-ruleset/README.md',
  'docs/governance/ai-ruleset/index.md',
  'docs/governance/ai-ruleset/_schema.md',
];

for (const relativePath of requiredArchitectureDocs) {
  if (!fileExists(relativePath)) {
    throw new Error(`Required architecture or governance doc "${relativePath}" is missing.`);
  }
}

for (const entry of PUBLIC_SURFACE_MANIFEST.filter((surface) => surface.requiresDocs)) {
  const artifacts = getRequiredDocsArtifacts(entry);
  if (artifacts.length === 0) {
    throw new Error(
      `Public surface "${entry.exportName}" requires docs but declares no artifacts.`
    );
  }

  for (const artifact of artifacts) {
    if (!fileExists(artifact.file)) {
      throw new Error(`Docs artifact "${artifact.file}" for "${entry.exportName}" does not exist.`);
    }

    const text = readText(artifact.file);
    if (!text.trim()) {
      throw new Error(`Docs artifact "${artifact.file}" for "${entry.exportName}" is empty.`);
    }
  }
}

console.log('Docs coverage OK.');
