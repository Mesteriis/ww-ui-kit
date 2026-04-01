import type { UiTsParticlesBackdropColorVar } from '../types';

interface ResolveCssVariableColorParams {
  variableName: UiTsParticlesBackdropColorVar;
  source?: HTMLElement | null;
  fallbackExpression: string;
}

export function resolveCssVariableColor({
  variableName,
  source,
  fallbackExpression,
}: ResolveCssVariableColorParams): string {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return fallbackExpression;
  }

  let scope: HTMLElement | null = source ?? document.documentElement;

  while (scope) {
    const directValue = window.getComputedStyle(scope).getPropertyValue(variableName).trim();
    if (directValue && !directValue.startsWith('var(')) {
      return directValue;
    }

    scope = scope.parentElement ?? null;
  }

  const resolvedScope = source ?? document.documentElement;
  const probeHost =
    resolvedScope === document.documentElement
      ? (document.body ?? document.documentElement)
      : resolvedScope;
  const probe = document.createElement('span');

  probe.setAttribute('aria-hidden', 'true');
  probe.style.position = 'absolute';
  probe.style.inset = '0';
  probe.style.inlineSize = '0';
  probe.style.blockSize = '0';
  probe.style.overflow = 'hidden';
  probe.style.pointerEvents = 'none';
  probe.style.visibility = 'hidden';
  probe.style.color = `var(${variableName}, ${fallbackExpression})`;

  probeHost.append(probe);

  const resolvedColor = window.getComputedStyle(probe).color.trim();
  probe.remove();

  if (!resolvedColor || resolvedColor.startsWith('var(')) {
    const directValue = window
      .getComputedStyle(resolvedScope)
      .getPropertyValue(variableName)
      .trim();
    if (directValue && !directValue.startsWith('var(')) {
      return directValue;
    }

    if (fallbackExpression === 'currentColor') {
      return window.getComputedStyle(probeHost).color.trim() || fallbackExpression;
    }

    if (resolvedColor.startsWith('var(')) {
      return fallbackExpression;
    }
  }

  return resolvedColor || fallbackExpression;
}
