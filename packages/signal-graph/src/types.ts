import { markRaw, type Component } from 'vue';
import type { ThemeName, ThemeType } from '@ww/themes';
import type { PanelPositionType } from '@vue-flow/core';

export type SignalGraphInteractionMode = 'readonly' | 'interactive';
export type SignalGraphDepthMode = 'off' | 'lite' | 'full';
export type SignalGraphDepthState = 'active' | 'related' | 'background';
export type SignalGraphFocusSource = 'none' | 'hover' | 'selection' | 'programmatic' | 'controlled';
export type SignalGraphSignalVariant = 'neutral' | 'info' | 'success' | 'warning' | 'danger' | 'accent';
export type SignalGraphSignalDirection = 'forward' | 'reverse';
export type SignalGraphSignalIntensity = 'sm' | 'md' | 'lg';
export type SignalGraphEdgeDirection = 'forward' | 'reverse' | 'bidirectional';
export type SignalGraphBackgroundVariant = 'dots' | 'lines';
export type SignalGraphMotionMode = 'system' | 'full' | 'reduced';

export interface SignalGraphPoint {
  x: number;
  y: number;
}

export interface SignalGraphNode<
  TData extends Record<string, unknown> = Record<string, unknown>,
  TMeta extends Record<string, unknown> = Record<string, unknown>
> {
  id: string;
  type: string;
  position: SignalGraphPoint;
  data: TData;
  label?: string;
  draggable?: boolean;
  selectable?: boolean;
  focusable?: boolean;
  width?: number;
  height?: number;
  className?: string;
  meta?: TMeta;
  parentNodeId?: string;
  zIndex?: number;
}

export interface SignalGraphEdge<
  TData extends Record<string, unknown> = Record<string, unknown>,
  TMeta extends Record<string, unknown> = Record<string, unknown>
> {
  id: string;
  source: string;
  target: string;
  label?: string;
  type?: string;
  data?: TData;
  className?: string;
  direction?: SignalGraphEdgeDirection;
  meta?: TMeta;
}

export interface SignalGraphSignal<
  TPayload extends Record<string, unknown> = Record<string, unknown>,
  TMeta extends Record<string, unknown> = Record<string, unknown>
> {
  id: string;
  edgeId: string;
  variant: SignalGraphSignalVariant;
  direction: SignalGraphSignalDirection;
  intensity: SignalGraphSignalIntensity;
  durationMs?: number;
  startedAt?: number;
  payload?: TPayload;
  meta?: TMeta;
}

export interface SignalGraphHandle {
  fitView: () => Promise<boolean>;
  centerNode: (nodeId: string) => Promise<boolean>;
  focusNode: (nodeId: string) => void;
  clearFocus: () => void;
  emitSignal: (signal: SignalGraphSignal | SignalGraphSignal[]) => void;
  clearSignals: () => void;
  zoomIn: () => Promise<boolean>;
  zoomOut: () => Promise<boolean>;
  resetViewport: () => Promise<boolean>;
}

export interface SignalGraphThemeState {
  themeName: ThemeName;
  themeType: ThemeType;
  container: HTMLElement | null;
  revision: number;
}

export interface SignalGraphFocusState {
  anchorNodeId: string | null;
  source: SignalGraphFocusSource;
  depthMode: SignalGraphDepthMode;
  relationDepth: number;
  activeNodeIds: string[];
  relatedNodeIds: string[];
  backgroundNodeIds: string[];
}

export interface SignalGraphNodeRendererProps<
  TData extends Record<string, unknown> = Record<string, unknown>,
  TMeta extends Record<string, unknown> = Record<string, unknown>
> {
  node: SignalGraphNode<TData, TMeta>;
  data: TData;
  definition: SignalGraphNodeDefinition;
  depthState: SignalGraphDepthState;
  isActive: boolean;
  isRelated: boolean;
  hasRecentSignal: boolean;
  graph: Pick<SignalGraphHandle, 'centerNode' | 'clearFocus' | 'emitSignal' | 'focusNode'> & {
    interactionMode: SignalGraphInteractionMode;
    reducedMotion: boolean;
    theme: SignalGraphThemeState;
  };
}

export interface SignalGraphNodeDefinition {
  component: Component;
  label?: string;
  minWidth?: number;
  minHeight?: number;
  draggable?: boolean;
  focusable?: boolean;
  glass?: boolean;
  signals?: {
    reactionDurationMs?: number;
  };
}

export interface SignalGraphOptions {
  relationDepth?: number;
  signalDurationMs?: number;
  signalStaggerMs?: number;
  nodeReactionDurationMs?: number;
  backgroundVariant?: SignalGraphBackgroundVariant;
  backgroundGap?: number;
  backgroundSize?: number;
  backgroundLineWidth?: number;
  controlsPosition?: PanelPositionType;
  miniMapPosition?: PanelPositionType;
  motionMode?: SignalGraphMotionMode;
}

export interface UiSignalGraphProps {
  nodes: SignalGraphNode[];
  edges: SignalGraphEdge[];
  nodeDefinitions: Record<string, SignalGraphNodeDefinition>;
  signals?: SignalGraphSignal[] | undefined;
  focusedNodeId?: string | null | undefined;
  interactionMode?: SignalGraphInteractionMode;
  depthMode?: SignalGraphDepthMode;
  showBackground?: boolean;
  showControls?: boolean;
  showMiniMap?: boolean;
  fitViewOnInit?: boolean;
  fitViewPadding?: number | `${number}%`;
  defaultZoom?: number;
  minZoom?: number;
  maxZoom?: number;
  loading?: boolean;
  error?: boolean | string | Error | null | undefined;
  empty?: boolean;
  emptyText?: string;
  errorText?: string;
  ariaLabel?: string;
  options?: SignalGraphOptions | undefined;
}

export function createSignalGraphNodeDefinition(definition: SignalGraphNodeDefinition) {
  return {
    ...definition,
    component: markRaw(definition.component),
  } satisfies SignalGraphNodeDefinition;
}
