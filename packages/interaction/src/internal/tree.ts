export interface UiTreeNode {
  key: string;
  label: string;
  disabled?: boolean;
  leaf?: boolean;
  children?: UiTreeNode[];
  meta?: Record<string, unknown>;
}

export interface UiNormalizedTreeNode extends UiTreeNode {
  children: UiNormalizedTreeNode[];
  level: number;
  parentKey?: string;
  pathKeys: string[];
  pathLabels: string[];
}

export interface UiVisibleTreeNode {
  node: UiNormalizedTreeNode;
  isChecked: boolean;
  isExpanded: boolean;
  isHalfChecked: boolean;
  isLeaf: boolean;
  isSelected: boolean;
}

export interface UiTreeRegistry {
  leafNodes: UiNormalizedTreeNode[];
  map: ReadonlyMap<string, UiNormalizedTreeNode>;
  roots: UiNormalizedTreeNode[];
}

function normalizeNode(
  node: UiTreeNode,
  level: number,
  parent: UiNormalizedTreeNode | null,
  loadedChildren: ReadonlyMap<string, UiTreeNode[]>,
  map: Map<string, UiNormalizedTreeNode>
): UiNormalizedTreeNode {
  const resolvedChildren = loadedChildren.get(node.key) ?? node.children ?? [];
  const normalizedNode: UiNormalizedTreeNode = {
    ...node,
    children: [],
    level,
    ...(parent ? { parentKey: parent.key } : {}),
    pathKeys: [...(parent?.pathKeys ?? []), node.key],
    pathLabels: [...(parent?.pathLabels ?? []), node.label],
  };

  map.set(normalizedNode.key, normalizedNode);
  normalizedNode.children = resolvedChildren.map((child) =>
    normalizeNode(child, level + 1, normalizedNode, loadedChildren, map)
  );
  return normalizedNode;
}

export function normalizeTree(
  nodes: UiTreeNode[],
  loadedChildren: ReadonlyMap<string, UiTreeNode[]> = new Map()
): UiTreeRegistry {
  const map = new Map<string, UiNormalizedTreeNode>();
  const roots = nodes.map((node) => normalizeNode(node, 1, null, loadedChildren, map));
  const leafNodes = [...map.values()].filter((node) => node.children.length === 0);

  return {
    leafNodes,
    map,
    roots,
  };
}

function matchesSearch(node: UiNormalizedTreeNode, search: string) {
  const query = search.trim().toLowerCase();
  if (!query) {
    return true;
  }

  const haystacks = [
    node.label,
    ...node.pathLabels,
    ...Object.values(node.meta ?? {}).map((value) => String(value)),
  ];

  return haystacks.some((value) => value.toLowerCase().includes(query));
}

function shouldRenderNode(
  node: UiNormalizedTreeNode,
  searchValue: string,
  expandedKeys: ReadonlySet<string>
): boolean {
  if (!searchValue.trim()) {
    return true;
  }

  if (matchesSearch(node, searchValue)) {
    return true;
  }

  return node.children.some((child) => shouldRenderNode(child, searchValue, expandedKeys));
}

function buildVisibleNodesInternal(
  nodes: UiNormalizedTreeNode[],
  expandedKeys: ReadonlySet<string>,
  selectedKeys: ReadonlySet<string>,
  checkedKeys: ReadonlySet<string>,
  halfCheckedKeys: ReadonlySet<string>,
  searchValue: string,
  target: UiVisibleTreeNode[]
) {
  for (const node of nodes) {
    if (!shouldRenderNode(node, searchValue, expandedKeys)) {
      continue;
    }

    const isExpanded = searchValue.trim()
      ? node.children.length > 0
      : expandedKeys.has(node.key) || node.children.some((child) => shouldRenderNode(child, searchValue, expandedKeys));
    const isLeaf = node.children.length === 0 && node.leaf !== false;

    target.push({
      node,
      isChecked: checkedKeys.has(node.key),
      isExpanded,
      isHalfChecked: halfCheckedKeys.has(node.key),
      isLeaf,
      isSelected: selectedKeys.has(node.key),
    });

    if (node.children.length > 0 && isExpanded) {
      buildVisibleNodesInternal(
        node.children,
        expandedKeys,
        selectedKeys,
        checkedKeys,
        halfCheckedKeys,
        searchValue,
        target
      );
    }
  }
}

export function buildVisibleTreeNodes(
  registry: UiTreeRegistry,
  expandedKeys: readonly string[],
  selectedKeys: readonly string[],
  checkedKeys: readonly string[],
  searchValue = ''
) {
  const halfCheckedKeys = computeHalfCheckedKeys(registry.roots, new Set(checkedKeys));
  const visible: UiVisibleTreeNode[] = [];

  buildVisibleNodesInternal(
    registry.roots,
    new Set(expandedKeys),
    new Set(selectedKeys),
    new Set(checkedKeys),
    halfCheckedKeys,
    searchValue,
    visible
  );

  return visible;
}

export function collectDescendantKeys(node: UiNormalizedTreeNode) {
  const keys = [node.key];
  for (const child of node.children) {
    keys.push(...collectDescendantKeys(child));
  }
  return keys;
}

export function computeHalfCheckedKeys(
  nodes: UiNormalizedTreeNode[],
  checkedKeys: ReadonlySet<string>
) {
  const halfChecked = new Set<string>();

  const visit = (node: UiNormalizedTreeNode): boolean => {
    if (node.children.length === 0) {
      return checkedKeys.has(node.key);
    }

    const childStates = node.children.map((child) => visit(child));
    const allChecked = childStates.every(Boolean);
    const anyChecked = childStates.some(Boolean);
    const selfChecked = checkedKeys.has(node.key);

    if ((anyChecked && !allChecked) || (selfChecked && !allChecked)) {
      halfChecked.add(node.key);
    }

    return selfChecked || allChecked;
  };

  for (const node of nodes) {
    visit(node);
  }

  return halfChecked;
}

export function toggleCheckedKey(
  registry: UiTreeRegistry,
  currentKeys: readonly string[],
  key: string,
  nextChecked: boolean
) {
  const next = new Set(currentKeys);
  const node = registry.map.get(key);
  if (!node) {
    return [...next];
  }

  for (const descendantKey of collectDescendantKeys(node)) {
    if (nextChecked) {
      next.add(descendantKey);
    } else {
      next.delete(descendantKey);
    }
  }

  let current: UiNormalizedTreeNode | undefined = node.parentKey
    ? registry.map.get(node.parentKey)
    : undefined;

  while (current) {
    const allChecked = current.children.every((child) => next.has(child.key));
    if (allChecked) {
      next.add(current.key);
    } else {
      next.delete(current.key);
    }

    current = current.parentKey ? registry.map.get(current.parentKey) : undefined;
  }

  return [...next];
}

export function collectAncestorKeys(registry: UiTreeRegistry, key: string) {
  const result: string[] = [];
  let current = registry.map.get(key);

  while (current?.parentKey) {
    result.unshift(current.parentKey);
    current = registry.map.get(current.parentKey);
  }

  return result;
}

export function findPathByLeafKey(registry: UiTreeRegistry, key: string) {
  return registry.map.get(key)?.pathKeys ?? [];
}

export function flattenTransferItems(
  nodes: UiTreeNode[],
  loadedChildren?: ReadonlyMap<string, UiTreeNode[]>
) {
  return normalizeTree(nodes, loadedChildren).leafNodes.map((node) => ({
    key: node.key,
    label: node.label,
    disabled: node.disabled,
    pathKeys: node.pathKeys,
    pathLabels: node.pathLabels,
  }));
}
