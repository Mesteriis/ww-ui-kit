import { findTypeaheadMatch, type TypeaheadRecord } from '../shared/typeahead';

export type UiMenuValue = string | number;

export type UiMenuItem =
  | {
      type?: 'item';
      key?: string;
      label: string;
      value?: UiMenuValue;
      icon?: string;
      href?: string;
      to?: string;
      disabled?: boolean;
    }
  | {
      type: 'divider';
      key?: string;
    }
  | {
      type: 'group';
      key?: string;
      label: string;
      items: UiMenuItem[];
    };

export type NormalizedUiMenuEntry =
  | {
      kind: 'divider';
      id: string;
      key: string;
    }
  | {
      kind: 'group';
      id: string;
      key: string;
      label: string;
      items: NormalizedUiMenuEntry[];
    }
  | {
      kind: 'item';
      id: string;
      key: string;
      label: string;
      value: UiMenuValue | string;
      disabled: boolean;
      icon?: string;
      href?: string;
    };

export function normalizeMenuItems(
  items: readonly UiMenuItem[],
  path = 'item'
): NormalizedUiMenuEntry[] {
  return items.map((item, index) => {
    const id = `${path}-${index}`;
    const key = item.key ?? id;

    if (item.type === 'divider') {
      return {
        kind: 'divider',
        id,
        key,
      };
    }

    if (item.type === 'group') {
      return {
        kind: 'group',
        id,
        key,
        label: item.label,
        items: normalizeMenuItems(item.items, `${id}-group`),
      };
    }

    return {
      kind: 'item',
      id,
      key,
      label: item.label,
      value: item.value ?? item.key ?? item.label,
      disabled: Boolean(item.disabled),
      ...(item.icon ? { icon: item.icon } : {}),
      ...(item.href ? { href: item.href } : {}),
      ...(item.to ? { href: item.to } : {}),
    };
  });
}

export function flattenMenuItems(
  items: readonly NormalizedUiMenuEntry[],
  _options?: {
    includeChildren?: boolean;
    openKeys?: ReadonlySet<string>;
  }
): Array<Extract<NormalizedUiMenuEntry, { kind: 'item' }>> {
  return items.flatMap((item) => {
    if (item.kind === 'divider') {
      return [];
    }

    if (item.kind === 'group') {
      return flattenMenuItems(item.items);
    }

    return [item];
  });
}

export function findMenuItemByKey(
  items: readonly NormalizedUiMenuEntry[],
  key: string
): Extract<NormalizedUiMenuEntry, { kind: 'item' }> | null {
  for (const item of items) {
    if (item.kind === 'group') {
      const match = findMenuItemByKey(item.items, key);
      if (match) {
        return match;
      }
      continue;
    }

    if (item.kind === 'item') {
      if (item.key === key) {
        return item;
      }
    }
  }

  return null;
}

export function findMenuTypeaheadMatch(
  items: readonly Extract<NormalizedUiMenuEntry, { kind: 'item' }>[],
  query: string,
  currentKey?: string | null
) {
  return findTypeaheadMatch(
    items.map<TypeaheadRecord>((item) => ({
      id: item.key,
      label: item.label,
      disabled: item.disabled,
    })),
    query,
    currentKey
  );
}
