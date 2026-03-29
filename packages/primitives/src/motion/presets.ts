export type MotionPresetTier = "A" | "B" | "C";
export type MotionPresetLayer =
  | "primitive"
  | "component"
  | "layout"
  | "overlay"
  | "page";
export type MotionPresetFamily =
  | "enter"
  | "leave"
  | "interaction"
  | "attention"
  | "validation"
  | "status"
  | "loading"
  | "overlay"
  | "list"
  | "page"
  | "decorative";

export interface MotionTransitionStage {
  clipPath?: string | undefined;
  filter?: string | undefined;
  opacity?: string | undefined;
  transform?: string | undefined;
}

export interface MotionBasePreset {
  antiUseCases: readonly string[];
  distanceToken?: string | undefined;
  durationToken: string;
  easingToken: string;
  family: MotionPresetFamily;
  layer: MotionPresetLayer;
  opacityToken?: string | undefined;
  reducedMotion: string;
  scaleToken?: string | undefined;
  staggerToken?: string | undefined;
  tier: MotionPresetTier;
  useCases: readonly string[];
}

export interface MotionTransitionPreset extends MotionBasePreset {
  enter: MotionTransitionStage;
  kind: "transition";
  leave: MotionTransitionStage;
  moveDurationToken?: string | undefined;
  moveEasingToken?: string | undefined;
  properties: string;
  reducedPreset?: string | undefined;
}

export interface MotionCollapsePreset extends MotionBasePreset {
  axis: "block" | "inline";
  kind: "collapse";
  reducedPreset?: string | undefined;
}

export interface MotionUtilityPreset extends MotionBasePreset {
  kind: "utility";
  utilityName: string;
}

export type MotionPresetDefinition =
  | MotionTransitionPreset
  | MotionCollapsePreset
  | MotionUtilityPreset;

const DURATION = {
  "2xs": "--ui-motion-duration-2xs",
  xs: "--ui-motion-duration-xs",
  sm: "--ui-motion-duration-sm",
  md: "--ui-motion-duration-md",
  lg: "--ui-motion-duration-lg",
  xl: "--ui-motion-duration-xl",
} as const;

const EASING = {
  accelerate: "--ui-motion-easing-accelerate",
  decelerate: "--ui-motion-easing-decelerate",
  emphasized: "--ui-motion-easing-emphasized",
  exit: "--ui-motion-easing-exit",
  linear: "--ui-motion-easing-linear",
  standard: "--ui-motion-easing-standard",
  springSoft: "--ui-motion-easing-spring-soft",
} as const;

const DISTANCE = {
  "2xs": "--ui-motion-distance-2xs",
  xs: "--ui-motion-distance-xs",
  sm: "--ui-motion-distance-sm",
  md: "--ui-motion-distance-md",
  lg: "--ui-motion-distance-lg",
  xl: "--ui-motion-distance-xl",
  "2xl": "--ui-motion-distance-2xl",
} as const;

const SCALE = {
  "96": "--ui-motion-scale-96",
  "98": "--ui-motion-scale-98",
  "100": "--ui-motion-scale-100",
  "102": "--ui-motion-scale-102",
  "104": "--ui-motion-scale-104",
} as const;

const OPACITY = {
  "0": "--ui-motion-opacity-0",
  "40": "--ui-motion-opacity-40",
  "56": "--ui-motion-opacity-56",
  "72": "--ui-motion-opacity-72",
  "88": "--ui-motion-opacity-88",
} as const;

const STAGGER = {
  "2xs": "--ui-motion-stagger-2xs",
  xs: "--ui-motion-stagger-xs",
  sm: "--ui-motion-stagger-sm",
  md: "--ui-motion-stagger-md",
  lg: "--ui-motion-stagger-lg",
} as const;

function cssVar(token: string): string {
  return `var(${token})`;
}

function negative(value: string): string {
  return `calc(${value} * -1)`;
}

function translateX(value: string): string {
  return `translate3d(${value}, 0, 0)`;
}

function translateY(value: string): string {
  return `translate3d(0, ${value}, 0)`;
}

function scale(value: string): string {
  return `scale(${value})`;
}

function combineTransforms(...parts: Array<string | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

function enterPreset(config: {
  antiUseCases?: readonly string[];
  clipPathFrom?: string;
  distanceToken?: keyof typeof DISTANCE;
  durationToken?: keyof typeof DURATION;
  easingToken?: keyof typeof EASING;
  filterFrom?: string;
  layer?: MotionPresetLayer;
  opacityToken?: keyof typeof OPACITY;
  properties?: string;
  reducedPreset?: string;
  scaleToken?: keyof typeof SCALE;
  tier?: MotionPresetTier;
  transformFrom?: string;
  useCase: string;
}) {
  return {
    antiUseCases:
      config.antiUseCases ??
      ["Do not use for ambient decoration or repeated list churn."],
    distanceToken: config.distanceToken,
    durationToken: DURATION[config.durationToken ?? "sm"],
    easingToken: EASING[config.easingToken ?? "decelerate"],
    enter: {
      clipPath: config.clipPathFrom,
      filter: config.filterFrom,
      opacity: cssVar(OPACITY[config.opacityToken ?? "0"]),
      transform: config.transformFrom,
    },
    family: "enter" as const,
    kind: "transition" as const,
    layer: config.layer ?? "component",
    leave: {
      opacity: cssVar(OPACITY["0"]),
      transform: "none",
    },
    opacityToken: config.opacityToken ? OPACITY[config.opacityToken] : undefined,
    properties: config.properties ?? "opacity, transform",
    reducedMotion: "fade-only or instant",
    reducedPreset: config.reducedPreset ?? "fade-in",
    scaleToken: config.scaleToken ? SCALE[config.scaleToken] : undefined,
    tier: config.tier ?? "A",
    useCases: [config.useCase] as const,
  } satisfies MotionTransitionPreset;
}

function leavePreset(config: {
  antiUseCases?: readonly string[];
  clipPathTo?: string;
  distanceToken?: keyof typeof DISTANCE;
  durationToken?: keyof typeof DURATION;
  easingToken?: keyof typeof EASING;
  filterTo?: string;
  layer?: MotionPresetLayer;
  opacityToken?: keyof typeof OPACITY;
  properties?: string;
  reducedPreset?: string;
  scaleToken?: keyof typeof SCALE;
  tier?: MotionPresetTier;
  transformTo?: string;
  useCase: string;
}) {
  return {
    antiUseCases:
      config.antiUseCases ??
      ["Do not use when dismissal timing must be fully instantaneous."],
    distanceToken: config.distanceToken,
    durationToken: DURATION[config.durationToken ?? "sm"],
    easingToken: EASING[config.easingToken ?? "exit"],
    enter: {
      opacity: cssVar(OPACITY["0"]),
      transform: "none",
    },
    family: "leave" as const,
    kind: "transition" as const,
    layer: config.layer ?? "component",
    leave: {
      clipPath: config.clipPathTo,
      filter: config.filterTo,
      opacity: cssVar(OPACITY[config.opacityToken ?? "0"]),
      transform: config.transformTo,
    },
    opacityToken: config.opacityToken ? OPACITY[config.opacityToken] : undefined,
    properties: config.properties ?? "opacity, transform",
    reducedMotion: "fade-only or instant",
    reducedPreset: config.reducedPreset ?? "fade-out",
    scaleToken: config.scaleToken ? SCALE[config.scaleToken] : undefined,
    tier: config.tier ?? "A",
    useCases: [config.useCase] as const,
  } satisfies MotionTransitionPreset;
}

function utilityPreset(
  family: MotionPresetFamily,
  utilityName: string,
  config: {
    antiUseCases?: readonly string[];
    distanceToken?: keyof typeof DISTANCE;
    durationToken: keyof typeof DURATION;
    easingToken?: keyof typeof EASING;
    layer?: MotionPresetLayer;
    reducedMotion: string;
    tier?: MotionPresetTier;
    useCase: string;
  },
) {
  return {
    antiUseCases:
      config.antiUseCases ??
      ["Do not apply to dense repeated surfaces or always-on ambient chrome."],
    distanceToken: config.distanceToken ? DISTANCE[config.distanceToken] : undefined,
    durationToken: DURATION[config.durationToken],
    easingToken: EASING[config.easingToken ?? "standard"],
    family,
    kind: "utility" as const,
    layer: config.layer ?? "component",
    reducedMotion: config.reducedMotion,
    tier: config.tier ?? "A",
    useCases: [config.useCase] as const,
    utilityName,
  } satisfies MotionUtilityPreset;
}

function collapsePreset(config: {
  antiUseCases?: readonly string[];
  axis: "block" | "inline";
  durationToken?: keyof typeof DURATION;
  easingToken?: keyof typeof EASING;
  layer: MotionPresetLayer;
  reducedPreset?: string;
  tier?: MotionPresetTier;
  useCase: string;
}) {
  return {
    antiUseCases:
      config.antiUseCases ??
      ["Do not use for high-frequency sortable data or large virtualized views."],
    axis: config.axis,
    durationToken: DURATION[config.durationToken ?? "sm"],
    easingToken: EASING[config.easingToken ?? "emphasized"],
    family: config.axis === "block" ? "overlay" : "list",
    kind: "collapse" as const,
    layer: config.layer,
    reducedMotion: "instant or no motion",
    reducedPreset: config.reducedPreset ?? "none",
    tier: config.tier ?? "B",
    useCases: [config.useCase] as const,
  } satisfies MotionCollapsePreset;
}

const enterPresets = {
  "fade-in": enterPreset({
    durationToken: "xs",
    opacityToken: "0",
    reducedPreset: "none",
    useCase: "Default enter for low-drama surface reveals.",
  }),
  "fade-in-soft": enterPreset({
    durationToken: "sm",
    opacityToken: "40",
    reducedPreset: "none",
    useCase: "Gentler enter for secondary metadata and helper copy.",
  }),
  "fade-up-xs": enterPreset({
    distanceToken: "xs",
    transformFrom: translateY(cssVar(DISTANCE.xs)),
    useCase: "Compact enter for menus, field help, and inline affordances.",
  }),
  "fade-up-sm": enterPreset({
    distanceToken: "sm",
    transformFrom: translateY(cssVar(DISTANCE.sm)),
    useCase: "Default vertical enter for floating UI.",
  }),
  "fade-up-md": enterPreset({
    distanceToken: "md",
    durationToken: "md",
    transformFrom: translateY(cssVar(DISTANCE.md)),
    useCase: "Prominent vertical enter for larger cards and panes.",
  }),
  "fade-down-sm": enterPreset({
    distanceToken: "sm",
    transformFrom: translateY(negative(cssVar(DISTANCE.sm))),
    useCase: "Downward enter for anchored tooltips and banners.",
  }),
  "fade-left-sm": enterPreset({
    distanceToken: "sm",
    transformFrom: translateX(cssVar(DISTANCE.sm)),
    useCase: "Horizontal enter from the right edge.",
  }),
  "fade-right-sm": enterPreset({
    distanceToken: "sm",
    transformFrom: translateX(negative(cssVar(DISTANCE.sm))),
    useCase: "Horizontal enter from the left edge.",
  }),
  "scale-in-96": enterPreset({
    scaleToken: "96",
    transformFrom: scale(cssVar(SCALE["96"])),
    useCase: "Compact scale enter for selection and contextual surfaces.",
  }),
  "scale-in-98": enterPreset({
    scaleToken: "98",
    transformFrom: scale(cssVar(SCALE["98"])),
    useCase: "Subtle scale enter for controls and chips.",
  }),
  "zoom-in-soft": enterPreset({
    durationToken: "md",
    scaleToken: "96",
    transformFrom: combineTransforms(
      scale(cssVar(SCALE["96"])),
      translateY(cssVar(DISTANCE.xs)),
    ),
    useCase: "Soft zoom for overlays that should feel cushioned.",
  }),
  "zoom-in-center": enterPreset({
    durationToken: "md",
    scaleToken: "98",
    transformFrom: scale(cssVar(SCALE["98"])),
    useCase: "Centered zoom for dialogs and command surfaces.",
  }),
  "pop-in-soft": enterPreset({
    easingToken: "springSoft",
    scaleToken: "96",
    transformFrom: scale(cssVar(SCALE["96"])),
    useCase: "Friendly pop for compact badges and menus.",
  }),
  "pop-in-crisp": enterPreset({
    easingToken: "springSoft",
    scaleToken: "98",
    transformFrom: combineTransforms(
      scale(cssVar(SCALE["98"])),
      translateY(cssVar(DISTANCE["2xs"])),
    ),
    useCase: "Crisp pop for focused callouts and affirmative feedback.",
  }),
  "slide-up-soft": enterPreset({
    distanceToken: "md",
    durationToken: "md",
    transformFrom: translateY(cssVar(DISTANCE.md)),
    useCase: "Soft panel rise for bottom-origin content.",
  }),
  "slide-down-soft": enterPreset({
    distanceToken: "md",
    durationToken: "md",
    transformFrom: translateY(negative(cssVar(DISTANCE.md))),
    useCase: "Soft panel drop for top-origin content.",
  }),
  "slide-left-soft": enterPreset({
    distanceToken: "lg",
    durationToken: "md",
    transformFrom: translateX(cssVar(DISTANCE.lg)),
    useCase: "Lateral enter for drawers and contextual sheets.",
  }),
  "slide-right-soft": enterPreset({
    distanceToken: "lg",
    durationToken: "md",
    transformFrom: translateX(negative(cssVar(DISTANCE.lg))),
    useCase: "Reverse lateral enter for mirrored drawers and pages.",
  }),
  "blur-in-soft": enterPreset({
    durationToken: "md",
    filterFrom: "blur(8px)",
    properties: "opacity, transform, filter",
    tier: "C",
    transformFrom: scale(cssVar(SCALE["98"])),
    useCase: "Demo-only soft blur reveal for showcase accents.",
  }),
  "depth-in-soft": enterPreset({
    durationToken: "md",
    filterFrom: "blur(10px)",
    properties: "opacity, transform, filter",
    tier: "C",
    transformFrom: combineTransforms(
      "translateZ(-24px)",
      scale(cssVar(SCALE["96"])),
    ),
    useCase: "Demo-only depth reveal for isolated showcase scenes.",
  }),
} as const satisfies Record<string, MotionTransitionPreset>;

const leavePresets = {
  "fade-out": leavePreset({
    durationToken: "xs",
    reducedPreset: "none",
    useCase: "Default leave for low-drama surface exits.",
  }),
  "fade-out-soft": leavePreset({
    durationToken: "sm",
    opacityToken: "40",
    reducedPreset: "none",
    useCase: "Gentler leave for secondary details and helper copy.",
  }),
  "fade-down-out": leavePreset({
    distanceToken: "sm",
    transformTo: translateY(cssVar(DISTANCE.sm)),
    useCase: "Default downward leave for anchored menus and popovers.",
  }),
  "fade-up-out": leavePreset({
    distanceToken: "sm",
    transformTo: translateY(negative(cssVar(DISTANCE.sm))),
    useCase: "Upward leave for bottom-origin content.",
  }),
  "fade-left-out": leavePreset({
    distanceToken: "sm",
    transformTo: translateX(negative(cssVar(DISTANCE.sm))),
    useCase: "Leftward leave for right-edge surfaces.",
  }),
  "fade-right-out": leavePreset({
    distanceToken: "sm",
    transformTo: translateX(cssVar(DISTANCE.sm)),
    useCase: "Rightward leave for left-edge surfaces.",
  }),
  "scale-out-98": leavePreset({
    scaleToken: "98",
    transformTo: scale(cssVar(SCALE["98"])),
    useCase: "Subtle shrink for compact dismissals.",
  }),
  "scale-out-96": leavePreset({
    scaleToken: "96",
    transformTo: scale(cssVar(SCALE["96"])),
    useCase: "Pronounced shrink for low-frequency surfaces.",
  }),
  "zoom-out-soft": leavePreset({
    durationToken: "md",
    scaleToken: "96",
    transformTo: combineTransforms(
      scale(cssVar(SCALE["96"])),
      translateY(cssVar(DISTANCE.xs)),
    ),
    useCase: "Soft zoom-out for dialog and sheet dismissals.",
  }),
  "pop-out-soft": leavePreset({
    easingToken: "standard",
    scaleToken: "98",
    transformTo: scale(cssVar(SCALE["98"])),
    useCase: "Compact pop-out for chips, badges, and small overlays.",
  }),
  "slide-up-out": leavePreset({
    distanceToken: "md",
    durationToken: "md",
    transformTo: translateY(negative(cssVar(DISTANCE.md))),
    useCase: "Upward leave for drawers and sheets.",
  }),
  "slide-down-out": leavePreset({
    distanceToken: "md",
    durationToken: "md",
    transformTo: translateY(cssVar(DISTANCE.md)),
    useCase: "Downward leave for banners and top-origin surfaces.",
  }),
  "slide-left-out": leavePreset({
    distanceToken: "lg",
    durationToken: "md",
    transformTo: translateX(negative(cssVar(DISTANCE.lg))),
    useCase: "Horizontal leave toward the left edge.",
  }),
  "slide-right-out": leavePreset({
    distanceToken: "lg",
    durationToken: "md",
    transformTo: translateX(cssVar(DISTANCE.lg)),
    useCase: "Horizontal leave toward the right edge.",
  }),
  "blur-out-soft": leavePreset({
    durationToken: "md",
    filterTo: "blur(8px)",
    properties: "opacity, transform, filter",
    tier: "C",
    transformTo: scale(cssVar(SCALE["98"])),
    useCase: "Demo-only blurred exit for showcase-only scenes.",
  }),
  "depth-out-soft": leavePreset({
    durationToken: "md",
    filterTo: "blur(10px)",
    properties: "opacity, transform, filter",
    tier: "C",
    transformTo: combineTransforms(
      "translateZ(-24px)",
      scale(cssVar(SCALE["96"])),
    ),
    useCase: "Demo-only depth exit for isolated showcase scenes.",
  }),
  "clip-out-up": leavePreset({
    clipPathTo: "inset(0 0 100% 0)",
    properties: "opacity, clip-path",
    tier: "B",
    useCase: "Directional leave for clipped banners and trays.",
  }),
  "clip-out-down": leavePreset({
    clipPathTo: "inset(100% 0 0 0)",
    properties: "opacity, clip-path",
    tier: "B",
    useCase: "Reverse directional leave for clipped trays.",
  }),
  "fade-out-quick": leavePreset({
    durationToken: "2xs",
    reducedPreset: "none",
    useCase: "Ultra-short leave for transient helper UI.",
  }),
  "fade-out-shift": leavePreset({
    distanceToken: "xs",
    opacityToken: "0",
    transformTo: translateY(cssVar(DISTANCE.xs)),
    useCase: "Compact fade-and-shift leave for inline affordances.",
  }),
} as const satisfies Record<string, MotionTransitionPreset>;

const interactionPresets = {
  "pulse-soft": utilityPreset("attention", "pulse-soft", {
    durationToken: "xl",
    reducedMotion: "no animation",
    tier: "B",
    useCase: "Low-key attention on rare transient states.",
  }),
  "pulse-strong": utilityPreset("attention", "pulse-strong", {
    durationToken: "lg",
    reducedMotion: "no animation",
    tier: "B",
    useCase: "Strong one-off attention for urgent callouts.",
  }),
  "breathe-soft": utilityPreset("attention", "breathe-soft", {
    durationToken: "xl",
    reducedMotion: "static state",
    tier: "C",
    useCase: "Decorative ambient breathing for showcase-only accents.",
  }),
  "glow-soft": utilityPreset("attention", "glow-soft", {
    durationToken: "lg",
    reducedMotion: "no animation",
    tier: "B",
    useCase: "Soft focus-friendly glow on deliberate affordances.",
  }),
  "glow-accent": utilityPreset("attention", "glow-accent", {
    durationToken: "lg",
    reducedMotion: "static highlight",
    tier: "B",
    useCase: "Accent glow for active hero controls.",
  }),
  "lift-xs": utilityPreset("interaction", "lift-xs", {
    distanceToken: "2xs",
    durationToken: "xs",
    reducedMotion: "static hover styling only",
    useCase: "Compact hover lift for buttons and chips.",
  }),
  "lift-sm": utilityPreset("interaction", "lift-sm", {
    distanceToken: "xs",
    durationToken: "sm",
    reducedMotion: "static hover styling only",
    useCase: "Default hover lift for primary controls.",
  }),
  "settle-down": utilityPreset("interaction", "settle-down", {
    distanceToken: "2xs",
    durationToken: "xs",
    reducedMotion: "no transform",
    useCase: "Pressed-state settle after release.",
  }),
  "ring-focus-soft": utilityPreset("interaction", "ring-focus-soft", {
    durationToken: "xs",
    reducedMotion: "keep static focus ring",
    useCase: "Default focus ring transition for fields and buttons.",
  }),
  "ring-focus-strong": utilityPreset("interaction", "ring-focus-strong", {
    durationToken: "xs",
    reducedMotion: "keep static focus ring",
    useCase: "Stronger focus ring for destructive or elevated controls.",
  }),
  "nudge-up": utilityPreset("attention", "nudge-up", {
    distanceToken: "xs",
    durationToken: "xs",
    reducedMotion: "no motion",
    tier: "B",
    useCase: "Single-step nudge upward for compact confirmations.",
  }),
  "nudge-down": utilityPreset("attention", "nudge-down", {
    distanceToken: "xs",
    durationToken: "xs",
    reducedMotion: "no motion",
    tier: "B",
    useCase: "Single-step nudge downward for contextual hints.",
  }),
  "nudge-left": utilityPreset("attention", "nudge-left", {
    distanceToken: "xs",
    durationToken: "xs",
    reducedMotion: "no motion",
    tier: "B",
    useCase: "Side nudge for small directional affordances.",
  }),
  "nudge-right": utilityPreset("attention", "nudge-right", {
    distanceToken: "xs",
    durationToken: "xs",
    reducedMotion: "no motion",
    tier: "B",
    useCase: "Reverse side nudge for mirrored affordances.",
  }),
  "wiggle-soft": utilityPreset("attention", "wiggle-soft", {
    durationToken: "sm",
    reducedMotion: "no motion",
    tier: "B",
    useCase: "Rare playful attention on isolated controls.",
  }),
  "bob-soft": utilityPreset("attention", "bob-soft", {
    durationToken: "lg",
    reducedMotion: "no motion",
    tier: "C",
    useCase: "Decorative vertical bob for demo-only accents.",
  }),
  "shimmer-soft": utilityPreset("attention", "shimmer-soft", {
    durationToken: "lg",
    reducedMotion: "static surface",
    tier: "B",
    useCase: "Subtle sheen for premium but infrequent emphasis.",
  }),
  "highlight-sweep": utilityPreset("attention", "highlight-sweep", {
    durationToken: "lg",
    reducedMotion: "static highlight",
    tier: "B",
    useCase: "Transient highlight pass across a surface or row.",
  }),
  "underline-slide": utilityPreset("interaction", "underline-slide", {
    distanceToken: "sm",
    durationToken: "xs",
    reducedMotion: "static underline",
    useCase: "Link and tab underline reveal.",
  }),
  "caret-blink-soft": utilityPreset("attention", "caret-blink-soft", {
    durationToken: "md",
    reducedMotion: "static caret",
    tier: "B",
    useCase: "Low-intensity caret blink for typing affordances.",
  }),
} as const satisfies Record<string, MotionUtilityPreset>;

const statusPresets = {
  "shake-error-xs": utilityPreset("validation", "shake-error-xs", {
    durationToken: "xs",
    reducedMotion: "no motion",
    tier: "B",
    useCase: "Short validation shake for compact fields.",
  }),
  "shake-error-sm": utilityPreset("validation", "shake-error-sm", {
    durationToken: "sm",
    reducedMotion: "no motion",
    tier: "B",
    useCase: "Default validation shake for forms and cards.",
  }),
  "shake-error-md": utilityPreset("validation", "shake-error-md", {
    durationToken: "md",
    reducedMotion: "no motion",
    tier: "B",
    useCase: "Stronger validation shake for blocking errors.",
  }),
  "invalid-ring": utilityPreset("validation", "invalid-ring", {
    durationToken: "xs",
    reducedMotion: "keep static invalid ring",
    useCase: "Animated invalid focus ring handoff.",
  }),
  "invalid-flash": utilityPreset("validation", "invalid-flash", {
    durationToken: "xs",
    reducedMotion: "static invalid surface",
    tier: "B",
    useCase: "Short invalid flash on high-signal controls.",
  }),
  "success-pop": utilityPreset("status", "success-pop", {
    durationToken: "sm",
    easingToken: "springSoft",
    reducedMotion: "fade-only",
    useCase: "Positive confirmation on inline success surfaces.",
  }),
  "success-glow": utilityPreset("status", "success-glow", {
    durationToken: "md",
    reducedMotion: "static success styling",
    tier: "B",
    useCase: "Soft success emphasis on badges and callouts.",
  }),
  "success-check-bounce": utilityPreset("status", "success-check-bounce", {
    durationToken: "sm",
    easingToken: "springSoft",
    reducedMotion: "fade-only",
    tier: "B",
    useCase: "Checkmark bounce after successful completion.",
  }),
  "warning-bump": utilityPreset("status", "warning-bump", {
    durationToken: "xs",
    reducedMotion: "static warning styling",
    useCase: "Short warning bump for non-blocking issues.",
  }),
  "warning-pulse": utilityPreset("status", "warning-pulse", {
    durationToken: "lg",
    reducedMotion: "static warning styling",
    tier: "B",
    useCase: "Slower warning pulse for limited-at-once notices.",
  }),
  "info-fade": utilityPreset("status", "info-fade", {
    durationToken: "sm",
    reducedMotion: "instant",
    useCase: "Informational emphasis without directional motion.",
  }),
  "info-sweep": utilityPreset("status", "info-sweep", {
    durationToken: "md",
    reducedMotion: "static info surface",
    tier: "B",
    useCase: "Informational sweep on banners or inline notes.",
  }),
  "pending-pulse": utilityPreset("loading", "pending-pulse", {
    durationToken: "lg",
    reducedMotion: "static pending state",
    useCase: "Quiet pending pulse for small busy indicators.",
  }),
  "pending-breathe": utilityPreset("loading", "pending-breathe", {
    durationToken: "xl",
    reducedMotion: "static pending state",
    tier: "B",
    useCase: "Longer pending motion for low-frequency surfaces.",
  }),
  "loading-shimmer": utilityPreset("loading", "loading-shimmer", {
    durationToken: "xl",
    reducedMotion: "static skeleton",
    tier: "B",
    useCase: "Skeleton shimmer for loading placeholders.",
  }),
  "loading-sweep": utilityPreset("loading", "loading-sweep", {
    durationToken: "lg",
    reducedMotion: "static skeleton",
    tier: "B",
    useCase: "Directional loading sheen for wide placeholders.",
  }),
  "loading-ellipsis": utilityPreset("loading", "loading-ellipsis", {
    durationToken: "md",
    reducedMotion: "static label",
    tier: "B",
    useCase: "Textual loading indicator with dot cadence.",
  }),
  "progress-indeterminate": utilityPreset("loading", "progress-indeterminate", {
    durationToken: "lg",
    reducedMotion: "static progress bar",
    tier: "B",
    useCase: "Indeterminate bar when exact progress is unknown.",
  }),
  "saved-badge-pop": utilityPreset("status", "saved-badge-pop", {
    durationToken: "sm",
    easingToken: "springSoft",
    reducedMotion: "fade-only",
    useCase: "Transient saved badge confirmation.",
  }),
  "retry-nudge": utilityPreset("status", "retry-nudge", {
    durationToken: "xs",
    reducedMotion: "static retry styling",
    tier: "B",
    useCase: "Prompt a retry affordance without a full shake.",
  }),
} as const satisfies Record<string, MotionUtilityPreset>;

const overlayPresets = {
  "overlay-fade": enterPreset({
    durationToken: "xs",
    layer: "overlay",
    reducedPreset: "none",
    useCase: "Default overlay backdrop/surface fade.",
  }),
  "overlay-fade-soft": enterPreset({
    durationToken: "sm",
    layer: "overlay",
    opacityToken: "40",
    reducedPreset: "none",
    useCase: "Gentler overlay reveal for low-elevation floating UI.",
  }),
  "backdrop-soften": enterPreset({
    durationToken: "sm",
    layer: "overlay",
    properties: "opacity",
    reducedPreset: "none",
    useCase: "Backdrop-only fade for modal stacks.",
  }),
  "modal-fade-scale": enterPreset({
    durationToken: "md",
    layer: "overlay",
    scaleToken: "98",
    transformFrom: scale(cssVar(SCALE["98"])),
    useCase: "Primary dialog reveal preset.",
  }),
  "modal-fade-up": enterPreset({
    distanceToken: "sm",
    durationToken: "md",
    layer: "overlay",
    transformFrom: translateY(cssVar(DISTANCE.sm)),
    useCase: "Dialog reveal with a short upward rise.",
  }),
  "drawer-slide-left": enterPreset({
    distanceToken: "xl",
    durationToken: "md",
    layer: "overlay",
    transformFrom: translateX(cssVar(DISTANCE.xl)),
    useCase: "Right-anchored drawer reveal toward the left.",
  }),
  "drawer-slide-right": enterPreset({
    distanceToken: "xl",
    durationToken: "md",
    layer: "overlay",
    transformFrom: translateX(negative(cssVar(DISTANCE.xl))),
    useCase: "Left-anchored drawer reveal toward the right.",
  }),
  "drawer-slide-up": enterPreset({
    distanceToken: "xl",
    durationToken: "md",
    layer: "overlay",
    transformFrom: translateY(cssVar(DISTANCE.xl)),
    useCase: "Bottom sheet reveal upward into view.",
  }),
  "menu-pop": enterPreset({
    durationToken: "xs",
    layer: "overlay",
    scaleToken: "98",
    transformFrom: combineTransforms(
      scale(cssVar(SCALE["98"])),
      translateY(cssVar(DISTANCE["2xs"])),
    ),
    useCase: "Compact context menu reveal.",
  }),
  "menu-scale-fade": enterPreset({
    durationToken: "xs",
    layer: "overlay",
    scaleToken: "98",
    transformFrom: scale(cssVar(SCALE["98"])),
    useCase: "Default menu/popup reveal with restrained scale.",
  }),
  "tooltip-fade": enterPreset({
    durationToken: "2xs",
    layer: "overlay",
    properties: "opacity",
    reducedPreset: "none",
    useCase: "Tooltip reveal when position is already established.",
  }),
  "tooltip-rise": enterPreset({
    distanceToken: "xs",
    durationToken: "2xs",
    layer: "overlay",
    transformFrom: translateY(cssVar(DISTANCE.xs)),
    useCase: "Tooltip rise from anchor origin.",
  }),
  "accordion-expand": collapsePreset({
    axis: "block",
    layer: "component",
    useCase: "Accordion and disclosure expansion along the block axis.",
  }),
  "accordion-collapse": collapsePreset({
    axis: "block",
    layer: "component",
    useCase: "Accordion and disclosure collapse along the block axis.",
  }),
  "list-stagger-in": {
    ...enterPreset({
      distanceToken: "xs",
      durationToken: "xs",
      layer: "component",
      transformFrom: translateY(cssVar(DISTANCE.xs)),
      useCase: "List item enter with short stagger.",
    }),
    family: "list" as const,
    moveDurationToken: DURATION.sm,
    moveEasingToken: EASING.standard,
    staggerToken: STAGGER.xs,
  } satisfies MotionTransitionPreset,
  "list-stagger-out": {
    ...leavePreset({
      distanceToken: "xs",
      durationToken: "xs",
      layer: "component",
      transformTo: translateY(cssVar(DISTANCE.xs)),
      useCase: "List item leave with short stagger.",
    }),
    family: "list" as const,
    moveDurationToken: DURATION.sm,
    moveEasingToken: EASING.standard,
    staggerToken: STAGGER.xs,
  } satisfies MotionTransitionPreset,
  "reorder-shift": {
    ...enterPreset({
      durationToken: "sm",
      layer: "component",
      opacityToken: "0",
      transformFrom: "none",
      useCase: "Pure move transition for reordered lists and chips.",
    }),
    family: "list" as const,
    moveDurationToken: DURATION.sm,
    moveEasingToken: EASING.standard,
    properties: "opacity, transform",
    reducedMotion: "instant move",
    staggerToken: STAGGER["2xs"],
  } satisfies MotionTransitionPreset,
  "page-fade": enterPreset({
    durationToken: "sm",
    layer: "page",
    properties: "opacity",
    reducedPreset: "none",
    useCase: "Page-level fade between equivalent layouts.",
  }),
  "page-fade-up": enterPreset({
    distanceToken: "sm",
    durationToken: "md",
    layer: "page",
    transformFrom: translateY(cssVar(DISTANCE.sm)),
    useCase: "Page-level fade with a restrained vertical rise.",
  }),
  crossfade: {
    ...enterPreset({
      durationToken: "sm",
      layer: "page",
      opacityToken: "0",
      transformFrom: "none",
      useCase: "Identity-preserving crossfade between like-for-like surfaces.",
    }),
    family: "page" as const,
    properties: "opacity",
    reducedMotion: "instant swap or fade-only",
  } satisfies MotionTransitionPreset,
} as const satisfies Record<string, MotionPresetDefinition>;

const collapsePresets = {
  "collapse-y-soft": collapsePreset({
    axis: "block",
    layer: "component",
    useCase: "Measured collapse along the vertical axis.",
  }),
  "collapse-x-soft": collapsePreset({
    axis: "inline",
    layer: "component",
    useCase: "Measured collapse along the horizontal axis.",
  }),
} as const satisfies Record<string, MotionCollapsePreset>;

export const MOTION_PRESETS = {
  ...enterPresets,
  ...leavePresets,
  ...interactionPresets,
  ...statusPresets,
  ...overlayPresets,
  ...collapsePresets,
} as const satisfies Record<string, MotionPresetDefinition>;

export type MotionPresetName = keyof typeof MOTION_PRESETS;

export const MOTION_PRESET_NAMES = Object.keys(MOTION_PRESETS) as MotionPresetName[];

export const MOTION_TAXONOMY = {
  attention: [
    "pulse-soft",
    "pulse-strong",
    "breathe-soft",
    "glow-soft",
    "glow-accent",
    "nudge-up",
    "nudge-down",
    "nudge-left",
    "nudge-right",
    "wiggle-soft",
    "bob-soft",
    "shimmer-soft",
    "highlight-sweep",
    "caret-blink-soft",
  ],
  decorative: ["blur-in-soft", "depth-in-soft", "blur-out-soft", "depth-out-soft"],
  enter: Object.keys(enterPresets),
  interaction: ["lift-xs", "lift-sm", "settle-down", "ring-focus-soft", "ring-focus-strong", "underline-slide"],
  leave: Object.keys(leavePresets),
  list: ["list-stagger-in", "list-stagger-out", "reorder-shift", "collapse-x-soft"],
  loading: [
    "pending-pulse",
    "pending-breathe",
    "loading-shimmer",
    "loading-sweep",
    "loading-ellipsis",
    "progress-indeterminate",
  ],
  overlay: [
    "overlay-fade",
    "overlay-fade-soft",
    "backdrop-soften",
    "modal-fade-scale",
    "modal-fade-up",
    "drawer-slide-left",
    "drawer-slide-right",
    "drawer-slide-up",
    "menu-pop",
    "menu-scale-fade",
    "tooltip-fade",
    "tooltip-rise",
    "accordion-expand",
    "accordion-collapse",
  ],
  page: ["page-fade", "page-fade-up", "crossfade"],
  status: [
    "success-pop",
    "success-glow",
    "success-check-bounce",
    "warning-bump",
    "warning-pulse",
    "info-fade",
    "info-sweep",
    "saved-badge-pop",
    "retry-nudge",
  ],
  validation: [
    "shake-error-xs",
    "shake-error-sm",
    "shake-error-md",
    "invalid-ring",
    "invalid-flash",
  ],
} as const;
