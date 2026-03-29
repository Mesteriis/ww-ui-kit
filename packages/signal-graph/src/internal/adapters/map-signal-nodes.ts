import type { Node } from '@vue-flow/core';

import type {
  SignalGraphInteractionMode,
  SignalGraphNode,
  SignalGraphNodeDefinition,
} from '../../types';

export interface SignalGraphVendorNodeData {
  signalNodeId: string;
}

function resolveNodeDraggable(
  node: SignalGraphNode,
  definition: SignalGraphNodeDefinition | undefined,
  interactionMode: SignalGraphInteractionMode
): boolean {
  if (interactionMode === 'readonly') {
    return false;
  }

  return node.draggable ?? definition?.draggable ?? true;
}

function resolveNodeFocusable(
  node: SignalGraphNode,
  definition: SignalGraphNodeDefinition | undefined
): boolean {
  return node.focusable ?? definition?.focusable ?? true;
}

export function mapSignalNodes(
  nodes: readonly SignalGraphNode[],
  nodeDefinitions: Record<string, SignalGraphNodeDefinition>,
  interactionMode: SignalGraphInteractionMode
): Node<SignalGraphVendorNodeData>[] {
  return nodes.map((node) => {
    const definition = nodeDefinitions[node.type];
    const mappedNode: Node<SignalGraphVendorNodeData> = {
      id: node.id,
      type: node.type,
      position: {
        x: node.position.x,
        y: node.position.y,
      },
      data: {
        signalNodeId: node.id,
      },
      selectable: node.selectable ?? interactionMode === 'interactive',
      draggable: resolveNodeDraggable(node, definition, interactionMode),
      focusable: resolveNodeFocusable(node, definition),
      connectable: false,
      dragHandle: '.ui-signal-graph__node-shell-header',
      ariaLabel: node.label ?? definition?.label ?? node.id,
    };

    if (node.label !== undefined) {
      mappedNode.label = node.label;
    }

    const resolvedWidth = node.width ?? definition?.minWidth;
    if (resolvedWidth !== undefined) {
      mappedNode.width = resolvedWidth;
    }

    const resolvedHeight = node.height ?? definition?.minHeight;
    if (resolvedHeight !== undefined) {
      mappedNode.height = resolvedHeight;
    }

    if (node.zIndex !== undefined) {
      mappedNode.zIndex = node.zIndex;
    }

    if (node.parentNodeId) {
      mappedNode.parentNode = node.parentNodeId;
    }

    if (node.className) {
      mappedNode.class = node.className;
    }

    return mappedNode;
  });
}
