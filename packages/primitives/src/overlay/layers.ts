const DEFAULT_LAYER_SCALE = {
  base: 4000,
  step: 20,
  backdrop: 0,
  surface: 2,
  floating: 4,
  tooltip: 6,
  toast: 8,
} as const;

const OVERLAY_LAYER_VARIABLES = {
  base: "--ui-z-overlay-base",
  step: "--ui-z-overlay-step",
  backdrop: "--ui-z-overlay-slot-backdrop",
  surface: "--ui-z-overlay-slot-surface",
  floating: "--ui-z-overlay-slot-floating",
  tooltip: "--ui-z-overlay-slot-tooltip",
  toast: "--ui-z-overlay-slot-toast",
} as const;

export const OVERLAY_PORTAL_ID = "ui-overlay-root";
export const OVERLAY_PORTAL_SELECTOR = `#${OVERLAY_PORTAL_ID}`;

export type OverlayLayerKind = "modal" | "floating" | "tooltip" | "toast";

export interface OverlayLayerScale {
  base: number;
  step: number;
  backdrop: number;
  surface: number;
  floating: number;
  tooltip: number;
  toast: number;
}

export interface OverlayLayerSlots {
  backdrop: number;
  content: number;
}

function readNumberVariable(
  root: HTMLElement,
  variableName: string,
  fallback: number,
): number {
  const value = Number.parseInt(
    window.getComputedStyle(root).getPropertyValue(variableName).trim(),
    10,
  );

  return Number.isFinite(value) ? value : fallback;
}

export function readOverlayLayerScale(root?: HTMLElement | null): OverlayLayerScale {
  if (typeof document === "undefined") {
    return { ...DEFAULT_LAYER_SCALE };
  }

  const resolvedRoot = root ?? document.documentElement;

  return {
    base: readNumberVariable(
      resolvedRoot,
      OVERLAY_LAYER_VARIABLES.base,
      DEFAULT_LAYER_SCALE.base,
    ),
    step: readNumberVariable(
      resolvedRoot,
      OVERLAY_LAYER_VARIABLES.step,
      DEFAULT_LAYER_SCALE.step,
    ),
    backdrop: readNumberVariable(
      resolvedRoot,
      OVERLAY_LAYER_VARIABLES.backdrop,
      DEFAULT_LAYER_SCALE.backdrop,
    ),
    surface: readNumberVariable(
      resolvedRoot,
      OVERLAY_LAYER_VARIABLES.surface,
      DEFAULT_LAYER_SCALE.surface,
    ),
    floating: readNumberVariable(
      resolvedRoot,
      OVERLAY_LAYER_VARIABLES.floating,
      DEFAULT_LAYER_SCALE.floating,
    ),
    tooltip: readNumberVariable(
      resolvedRoot,
      OVERLAY_LAYER_VARIABLES.tooltip,
      DEFAULT_LAYER_SCALE.tooltip,
    ),
    toast: readNumberVariable(
      resolvedRoot,
      OVERLAY_LAYER_VARIABLES.toast,
      DEFAULT_LAYER_SCALE.toast,
    ),
  };
}

export function resolveOverlayLayerSlots(
  stackIndex: number,
  kind: OverlayLayerKind,
  root?: HTMLElement | null,
): OverlayLayerSlots {
  const scale = readOverlayLayerScale(root);
  const layerBase = scale.base + Math.max(0, stackIndex) * scale.step;

  switch (kind) {
    case "modal":
      return {
        backdrop: layerBase + scale.backdrop,
        content: layerBase + scale.surface,
      };
    case "tooltip":
      return {
        backdrop: layerBase + scale.tooltip,
        content: layerBase + scale.tooltip,
      };
    case "toast":
      return {
        backdrop: layerBase + scale.toast,
        content: layerBase + scale.toast,
      };
    case "floating":
    default:
      return {
        backdrop: layerBase + scale.floating,
        content: layerBase + scale.floating,
      };
  }
}
