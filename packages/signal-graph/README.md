# @ww/signal-graph

Optional interactive graph UI package for Belovodye UiKit.

## Why this package is separate

`@ww/signal-graph` is not a baseline core component.

- it builds a richer runtime surface on top of the existing foundation
- it uses Vue Flow internally as a graph engine
- it keeps vendor internals out of product code and out of `@ww/core`

The public contract stays on the signal-graph domain:

- nodes
- edges
- node definitions
- signals
- focus/depth
- viewport handle

## Installation

The package lives in the workspace and depends on the normal theme/primitives foundation.

Import the package styles explicitly:

```ts
import '@ww/signal-graph/styles.css';
```

## Basic usage

```ts
import {
  UiSignalGraph,
  createSignalGraphNodeDefinition,
  type SignalGraphEdge,
  type SignalGraphNode,
} from '@ww/signal-graph';
```

```ts
const nodeDefinitions = {
  service: createSignalGraphNodeDefinition({
    component: ServiceNode,
    label: 'Service',
    glass: true,
  }),
};

const nodes: SignalGraphNode[] = [
  {
    id: 'gateway',
    type: 'service',
    position: { x: 24, y: 80 },
    data: { title: 'Gateway' },
  },
];

const edges: SignalGraphEdge[] = [];
```

```vue
<UiSignalGraph
  :nodes="nodes"
  :edges="edges"
  :node-definitions="nodeDefinitions"
  show-background
  show-controls
/>
```

## Model contract

### Nodes

Each `SignalGraphNode` owns:

- `id`
- `type`
- `position`
- `data`
- optional interaction metadata like `draggable`, `focusable`, `className`, `zIndex`

### Edges

Each `SignalGraphEdge` owns:

- `id`
- `source`
- `target`
- optional `label`, `direction`, `className`, `meta`

### Node definitions

`nodeDefinitions` map `node.type` to a renderer component.

Node renderers receive package-level props:

- `node`
- `data`
- `definition`
- `depthState`
- `isActive`
- `isRelated`
- `hasRecentSignal`
- `graph`

The renderer does not need to know anything about Vue Flow.

## Signals

Signals are transient visual impulses that move across edges and trigger a short node reaction on completion.

You can provide them as a controlled prop:

```vue
<UiSignalGraph
  :nodes="nodes"
  :edges="edges"
  :node-definitions="nodeDefinitions"
  :signals="signals"
/>
```

Or emit them imperatively:

```ts
graphRef.value?.emitSignal({
  id: 'sig-1',
  edgeId: 'gateway-worker',
  variant: 'info',
  direction: 'forward',
  intensity: 'md',
});
```

Available variants:

- `neutral`
- `info`
- `success`
- `warning`
- `danger`
- `accent`

## Focus and depth

Depth states are centralized:

- `active`
- `related`
- `background`

Use the built-in modes:

- `off`
- `lite`
- `full`

Focus can come from:

- click/select
- hover
- controlled `focusedNodeId`
- imperative `focusNode(nodeId)`

## Theming and ThemeType

The package uses the existing theme system.

- it reads the nearest themed container
- it respects both `data-ui-theme` and `data-ui-theme-type`
- it stays compatible with root theming and subtree theming

Scoped themes work directly:

```html
<section data-ui-theme="belovodye" data-ui-theme-type="light">
  <UiSignalGraph ... />
</section>
```

Node overlays such as `UiDialog` and `UiDrawer` keep the same theme scope because the existing theme-aware portal system resolves the portal root inside the nearest themed container.

## Reduced motion

`@ww/signal-graph` integrates with the existing motion foundation.

- default mode follows system preference
- `options.motionMode = 'reduced'` forces the calmer path
- travel-heavy pulse motion is softened instead of disappearing entirely

## Loading, empty, and error states

The wrapper handles graph states directly:

- `loading`
- `empty`
- `error`
- `emptyText`
- `errorText`

If the graph has no nodes, the package renders a readable empty shell instead of a broken canvas.

## First version boundaries

The first version is intentionally a runtime graph surface, not an editor.

Included:

- node rendering
- custom edge rendering
- signal pulses
- focus/depth engine
- controls, minimap, background
- subtree theming
- overlay interop

Not included:

- graph editing
- connection authoring
- user-created nodes and edges
- low-code builder UI
- auto-layout framework
- collaborative editing
