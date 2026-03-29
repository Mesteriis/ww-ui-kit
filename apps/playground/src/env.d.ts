declare module '*.vue' {
  import type { DefineComponent } from 'vue';

  const component: DefineComponent<Record<string, never>, Record<string, never>, unknown>;
  export default component;
}

declare module '*playground-lab-manifest.mjs' {
  export interface PlaygroundVisualSurfaceManifestEntry {
    readonly id: string;
    readonly title: string;
    readonly packageName: string;
    readonly packageLayer: string;
    readonly stability: string;
    readonly exportName: string;
    readonly parentManifestExportName: string;
    readonly family: string;
    readonly labEligible: boolean;
    readonly labExemptionReason?: string;
    readonly previewModes: readonly string[];
    readonly copyFormats: readonly string[];
    readonly usageSource: string;
    readonly runtimeFiles: {
      readonly schema: string;
      readonly preview: string;
    };
  }

  export const PLAYGROUND_VISUAL_SURFACE_MANIFEST: readonly PlaygroundVisualSurfaceManifestEntry[];
  export const PLAYGROUND_LAB_MANIFEST: readonly PlaygroundVisualSurfaceManifestEntry[];
}
