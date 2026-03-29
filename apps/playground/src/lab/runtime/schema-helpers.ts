import { h, markRaw, toRaw, type Component } from 'vue';

import { UiButton } from '@ww/core';
import type {
  LabCopyFormat,
  LabMatrixItem,
  LabOption,
  LabPreviewContext,
  LabSlots,
} from '../manifest/component-lab.types';

export const themeScopeOptions = Object.freeze([
  { label: 'Inherit current theme', value: 'inherit' },
  { label: 'Belovodye subtree', value: 'belovodye' },
  { label: 'Dark subtree', value: 'dark' },
] satisfies readonly LabOption[]);

export function deepClone<State>(value: State): State {
  return structuredClone(toRaw(value));
}

export function compactObject<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined)
  ) as Partial<T>;
}

function toKebabCase(value: string) {
  return value.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
}

function formatPrimitive(value: unknown) {
  if (typeof value === 'string') {
    return JSON.stringify(value);
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  return JSON.stringify(value);
}

function formatTsValue(value: unknown, indent = 0): string {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return '[]';
    }

    const nestedIndent = '  '.repeat(indent + 1);
    return `[\n${value
      .map((entry) => `${nestedIndent}${formatTsValue(entry, indent + 1)}`)
      .join(',\n')}\n${'  '.repeat(indent)}]`;
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) {
      return '{}';
    }

    const nestedIndent = '  '.repeat(indent + 1);
    return `{\n${entries
      .map(
        ([key, entry]) =>
          `${nestedIndent}${/^[a-zA-Z_$][\w$]*$/.test(key) ? key : JSON.stringify(key)}: ${formatTsValue(entry, indent + 1)}`
      )
      .join(',\n')}\n${'  '.repeat(indent)}}`;
  }

  return formatPrimitive(value);
}

export function serializeJson(value: Record<string, unknown>) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

export function serializeTsObject(value: Record<string, unknown>) {
  return `${formatTsValue(value)}\n`;
}

export function createVueAttributes(props: Record<string, unknown>) {
  return Object.entries(props).flatMap(([key, value]) => {
    if (value === undefined || value === null || value === false) {
      return [];
    }

    const attributeName = toKebabCase(key);
    if (value === true) {
      return [attributeName];
    }

    if (typeof value === 'string') {
      return [`${attributeName}=${JSON.stringify(value)}`];
    }

    if (typeof value === 'number') {
      return [`:${attributeName}="${value}"`];
    }

    return [];
  });
}

export function createVueSnippet(options: {
  packageName: string;
  exportName: string;
  tagName?: string;
  attributes?: readonly string[];
  slots?: readonly {
    name?: string;
    content: string;
  }[];
  scriptSetup?: readonly string[];
}) {
  const tagName = options.tagName ?? options.exportName;
  const attributeLines = options.attributes?.length
    ? `\n    ${options.attributes.join('\n    ')}`
    : '';
  const slotLines = options.slots?.length
    ? `\n${options.slots
        .map((slot) => {
          if (!slot.name) {
            return `    ${slot.content}`;
          }

          return `    <template #${slot.name}>${slot.content}</template>`;
        })
        .join('\n')}\n`
    : '';
  const hasScript = Boolean(options.scriptSetup?.length);
  const scriptBlock = hasScript
    ? `<script setup lang="ts">\nimport { ${options.exportName} } from '${options.packageName}';\n${options.scriptSetup!.join('\n')}\n</script>\n\n`
    : `<script setup lang="ts">\nimport { ${options.exportName} } from '${options.packageName}';\n</script>\n\n`;

  return `${scriptBlock}<template>\n  <${tagName}${attributeLines}>${slotLines ? `${slotLines}  ` : ''}</${tagName}>\n</template>\n`;
}

export function createIconSlot(content: string) {
  return () => content;
}

export function createActionSlots(labels: readonly string[]): LabSlots {
  return {
    actions: () =>
      labels.map((label) =>
        h(
          UiButton,
          {
            size: 'sm',
            variant: 'secondary',
          },
          () => label
        )
      ),
  };
}

export function createSimpleMatrix<State extends Record<string, unknown>>(
  variants: readonly string[],
  states: readonly string[],
  factory: (variant: string, state: string) => Partial<State>
): readonly LabMatrixItem<State>[] {
  const items: LabMatrixItem<State>[] = [];

  for (const variant of variants) {
    for (const state of states) {
      items.push({
        id: `${variant}-${state}`,
        title: `${variant} / ${state}`,
        patch: factory(variant, state),
      });
    }
  }

  return items;
}

export function markPreviewComponent<T extends Component>(component: T) {
  return markRaw(component);
}

export function buildThemeScopeAttrs(state: Record<string, unknown>, context: LabPreviewContext) {
  const scopedTheme = state.subtreeTheme;
  if (typeof scopedTheme === 'string' && scopedTheme !== 'inherit') {
    return {
      'data-ui-theme': scopedTheme,
      'data-ui-theme-type': scopedTheme === 'dark' ? 'dark' : 'light',
    };
  }

  return {
    'data-ui-theme': context.themeName,
    'data-ui-theme-type': context.themeMeta.type,
  };
}

export function padSnippetLines(lines: readonly string[]) {
  return lines.map((line) => `    ${line}`);
}

export function serializeByFormat(
  format: LabCopyFormat,
  payload: Record<string, unknown>,
  vueSnippetFactory: () => string
) {
  if (format === 'json') {
    return serializeJson(payload);
  }

  if (format === 'ts-object') {
    return serializeTsObject(payload);
  }

  return vueSnippetFactory();
}
