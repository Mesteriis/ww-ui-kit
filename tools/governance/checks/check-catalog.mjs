import { PACKAGE_LAYERS } from '../catalog/layer-rules.mjs';
import {
  PACKAGE_CLASSIFICATION,
  PACKAGE_CLASSIFICATION_MAP,
} from '../catalog/package-classification.mjs';
import { PUBLIC_SURFACE_MANIFEST } from '../catalog/public-surface-manifest.mjs';
import { STABILITY_LEVELS } from '../catalog/stability-rules.mjs';
import { auditRuntimeExportCoverage } from '../shared/public-exports.mjs';
import { fileExists, listWorkspacePackages } from '../shared/workspace.mjs';

const workspacePackages = listWorkspacePackages();
const workspacePackageMap = new Map(workspacePackages.map((entry) => [entry.packageName, entry]));

for (const workspacePackage of workspacePackages) {
  if (!PACKAGE_CLASSIFICATION_MAP[workspacePackage.packageName]) {
    throw new Error(
      `Workspace package "${workspacePackage.packageName}" is missing from package classification.`
    );
  }
}

for (const packageEntry of PACKAGE_CLASSIFICATION) {
  if (!PACKAGE_LAYERS.includes(packageEntry.packageLayer)) {
    throw new Error(
      `Package "${packageEntry.packageName}" has invalid layer "${packageEntry.packageLayer}".`
    );
  }

  if (!STABILITY_LEVELS.includes(packageEntry.stability)) {
    throw new Error(
      `Package "${packageEntry.packageName}" has invalid stability "${packageEntry.stability}".`
    );
  }

  const workspacePackage = workspacePackageMap.get(packageEntry.packageName);
  if (!workspacePackage) {
    throw new Error(
      `Classified package "${packageEntry.packageName}" does not exist in the workspace.`
    );
  }

  if (workspacePackage.physicalPath !== packageEntry.physicalPath) {
    throw new Error(
      `Package "${packageEntry.packageName}" is classified at "${packageEntry.physicalPath}" but exists at "${workspacePackage.physicalPath}".`
    );
  }

  if (packageEntry.public && (!packageEntry.readmePath || !fileExists(packageEntry.readmePath))) {
    throw new Error(
      `Public package "${packageEntry.packageName}" must have a README at "${packageEntry.readmePath}".`
    );
  }
}

const publicPackages = PACKAGE_CLASSIFICATION.filter((entry) => entry.public).map(
  (entry) => entry.packageName
);

for (const packageName of publicPackages) {
  const surfaces = PUBLIC_SURFACE_MANIFEST.filter((entry) => entry.packageName === packageName);
  if (surfaces.length === 0) {
    throw new Error(
      `Public package "${packageName}" has no public surface entries in the manifest.`
    );
  }
}

for (const surface of PUBLIC_SURFACE_MANIFEST) {
  const packageMeta = PACKAGE_CLASSIFICATION_MAP[surface.packageName];
  if (!packageMeta) {
    throw new Error(
      `Manifest entry "${surface.exportName}" references unknown package "${surface.packageName}".`
    );
  }

  if (surface.packageLayer !== packageMeta.packageLayer) {
    throw new Error(
      `Manifest entry "${surface.exportName}" has layer "${surface.packageLayer}" but package "${surface.packageName}" is classified as "${packageMeta.packageLayer}".`
    );
  }

  if (surface.stability !== packageMeta.stability) {
    throw new Error(
      `Manifest entry "${surface.exportName}" has stability "${surface.stability}" but package "${surface.packageName}" is classified as "${packageMeta.stability}".`
    );
  }
}

for (const packageEntry of PACKAGE_CLASSIFICATION.filter((entry) => entry.public)) {
  const surfaces = PUBLIC_SURFACE_MANIFEST.filter(
    (surface) => surface.packageName === packageEntry.packageName
  );
  const { indexPath, missingExports, orphanedCoveredExports } = auditRuntimeExportCoverage(
    packageEntry,
    surfaces
  );

  if (missingExports.length > 0) {
    throw new Error(
      `Public package "${packageEntry.packageName}" has named runtime exports in "${indexPath}" that are not covered by the public surface manifest: ${missingExports.join(
        ', '
      )}.`
    );
  }

  if (orphanedCoveredExports.length > 0) {
    throw new Error(
      `Public package "${packageEntry.packageName}" declares covered exports that are not named runtime exports in "${indexPath}": ${orphanedCoveredExports.join(
        ', '
      )}.`
    );
  }
}

console.log(
  `Catalog OK: ${PACKAGE_CLASSIFICATION.length} classified packages, ${PUBLIC_SURFACE_MANIFEST.length} public surface entries.`
);
