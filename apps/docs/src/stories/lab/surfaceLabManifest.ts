import { PLAYGROUND_LAB_MANIFEST } from '../../../../../tools/governance/catalog/playground-lab-manifest.mjs';

type ManifestRuntimeFiles = {
  schema: string;
  preview: string;
};

type StorybookLabSurfaceMeta = {
  copyFormats: readonly string[];
  exportName: string;
  family: string;
  id: string;
  packageName: string;
  previewModes: readonly string[];
  runtimeFiles: ManifestRuntimeFiles;
  title: string;
};

type ManifestSurfaceEntry = StorybookLabSurfaceMeta & {
  labEligible: boolean;
};

const manifestEntries = PLAYGROUND_LAB_MANIFEST as readonly ManifestSurfaceEntry[];

const surfaceMetaMap = new Map(
  manifestEntries
    .filter((entry) => entry.labEligible)
    .map((entry) => [
      entry.id,
      {
        copyFormats: entry.copyFormats,
        exportName: entry.exportName,
        family: entry.family,
        id: entry.id,
        packageName: entry.packageName,
        previewModes: entry.previewModes,
        runtimeFiles: entry.runtimeFiles,
        title: entry.title,
      } satisfies StorybookLabSurfaceMeta,
    ])
);

function getSurfaceLabMeta(surfaceId: string) {
  const entry = surfaceMetaMap.get(surfaceId);
  if (!entry) {
    throw new Error(`Missing governed lab metadata for "${surfaceId}".`);
  }

  return entry;
}

function getMaintainerLabPath(surfaceId: string) {
  return `/playground/lab/${surfaceId}`;
}

export { getMaintainerLabPath, getSurfaceLabMeta };
export type { StorybookLabSurfaceMeta };
