/* istanbul ignore file */
import {
  computed,
  nextTick,
  onBeforeUnmount,
  shallowRef,
  toValue,
  watch,
  type MaybeRefOrGetter,
  type Ref,
} from 'vue';

export type FloatingPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'right'
  | 'right-start'
  | 'right-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end';

type PlacementSide = 'top' | 'right' | 'bottom' | 'left';
type PlacementAlign = 'center' | 'start' | 'end';
type ArrowEdge = 'top' | 'right' | 'bottom' | 'left';

interface FloatingRectLike {
  top: number;
  left: number;
  width: number;
  height: number;
  right: number;
  bottom: number;
}

interface ComputeFloatingPositionOptions {
  anchorRect: FloatingRectLike;
  contentRect: Pick<FloatingRectLike, 'width' | 'height'>;
  placement?: FloatingPlacement;
  offset?: number;
  viewportPadding?: number;
  arrowSize?: number;
  viewportWidth: number;
  viewportHeight: number;
}

interface FloatingCandidate {
  align: PlacementAlign;
  placement: FloatingPlacement;
  side: PlacementSide;
}

interface FloatingArrowPosition {
  edge: ArrowEdge;
  x?: number;
  y?: number;
}

interface FloatingPositionState {
  x: number;
  y: number;
  placement: FloatingPlacement;
  arrow: FloatingArrowPosition;
}

export interface UseFloatingPositionOptions {
  open: MaybeRefOrGetter<boolean>;
  anchorRef: Ref<HTMLElement | null>;
  contentRef: Ref<HTMLElement | null>;
  placement?: MaybeRefOrGetter<FloatingPlacement | undefined>;
  offset?: MaybeRefOrGetter<number | undefined>;
  viewportPadding?: MaybeRefOrGetter<number | undefined>;
  arrowSize?: MaybeRefOrGetter<number | undefined>;
}

const FALLBACK_PLACEMENT: FloatingPlacement = 'bottom';
const ARROW_INSET = 12;
const CANDIDATE_PLACEMENTS = [
  'top',
  'top-start',
  'top-end',
  'right',
  'right-start',
  'right-end',
  'bottom',
  'bottom-start',
  'bottom-end',
  'left',
  'left-start',
  'left-end',
] as const satisfies readonly FloatingPlacement[];

function clamp(value: number, min: number, max: number) {
  if (max < min) {
    return min;
  }

  return Math.min(Math.max(value, min), max);
}

function parsePlacement(placement?: FloatingPlacement): FloatingCandidate {
  const normalizedPlacement = placement ?? FALLBACK_PLACEMENT;
  const [side, rawAlign] = normalizedPlacement.split('-') as [PlacementSide, PlacementAlign?];

  return {
    align: rawAlign ?? 'center',
    placement: normalizedPlacement,
    side,
  };
}

function formatPlacement(side: PlacementSide, align: PlacementAlign): FloatingPlacement {
  return align === 'center' ? side : (`${side}-${align}` as FloatingPlacement);
}

function getOppositeSide(side: PlacementSide): PlacementSide {
  switch (side) {
    case 'top':
      return 'bottom';
    case 'right':
      return 'left';
    case 'bottom':
      return 'top';
    case 'left':
    default:
      return 'right';
  }
}

function buildPlacementCandidates(requestedPlacement?: FloatingPlacement): FloatingCandidate[] {
  const requested = parsePlacement(requestedPlacement);

  return [...CANDIDATE_PLACEMENTS]
    .map((placement) => parsePlacement(placement))
    .sort((left, right) => {
      if (left.placement === requested.placement) {
        return -1;
      }

      if (right.placement === requested.placement) {
        return 1;
      }

      const leftSidePriority =
        left.side === requested.side ? 0 : left.side === getOppositeSide(requested.side) ? 1 : 2;
      const rightSidePriority =
        right.side === requested.side ? 0 : right.side === getOppositeSide(requested.side) ? 1 : 2;

      if (leftSidePriority !== rightSidePriority) {
        return leftSidePriority - rightSidePriority;
      }

      const leftAlignPriority =
        left.align === requested.align ? 0 : left.align === 'center' ? 1 : 2;
      const rightAlignPriority =
        right.align === requested.align ? 0 : right.align === 'center' ? 1 : 2;

      if (leftAlignPriority !== rightAlignPriority) {
        return leftAlignPriority - rightAlignPriority;
      }

      return (
        CANDIDATE_PLACEMENTS.indexOf(left.placement) - CANDIDATE_PLACEMENTS.indexOf(right.placement)
      );
    });
}

function computeCoordinates(
  candidate: FloatingCandidate,
  anchorRect: FloatingRectLike,
  contentRect: Pick<FloatingRectLike, 'width' | 'height'>,
  offset: number
) {
  let x = 0;
  let y = 0;

  if (candidate.side === 'top' || candidate.side === 'bottom') {
    if (candidate.align === 'start') {
      x = anchorRect.left;
    } else if (candidate.align === 'end') {
      x = anchorRect.right - contentRect.width;
    } else {
      x = anchorRect.left + (anchorRect.width - contentRect.width) / 2;
    }

    y =
      candidate.side === 'top'
        ? anchorRect.top - contentRect.height - offset
        : anchorRect.bottom + offset;
  } else {
    if (candidate.align === 'start') {
      y = anchorRect.top;
    } else if (candidate.align === 'end') {
      y = anchorRect.bottom - contentRect.height;
    } else {
      y = anchorRect.top + (anchorRect.height - contentRect.height) / 2;
    }

    x =
      candidate.side === 'left'
        ? anchorRect.left - contentRect.width - offset
        : anchorRect.right + offset;
  }

  return { x, y };
}

function computeOverflow(
  coordinates: { x: number; y: number },
  contentRect: Pick<FloatingRectLike, 'width' | 'height'>,
  viewportPadding: number,
  viewportWidth: number,
  viewportHeight: number
) {
  const minX = viewportPadding;
  const minY = viewportPadding;
  const maxX = viewportWidth - viewportPadding - contentRect.width;
  const maxY = viewportHeight - viewportPadding - contentRect.height;

  return (
    Math.max(0, minX - coordinates.x) +
    Math.max(0, coordinates.x - maxX) +
    Math.max(0, minY - coordinates.y) +
    Math.max(0, coordinates.y - maxY)
  );
}

function computeArrowPosition(
  candidate: FloatingCandidate,
  anchorRect: FloatingRectLike,
  contentRect: Pick<FloatingRectLike, 'width' | 'height'>,
  coordinates: { x: number; y: number },
  arrowSize: number
): FloatingArrowPosition {
  if (arrowSize <= 0) {
    return {
      edge:
        candidate.side === 'top'
          ? 'bottom'
          : candidate.side === 'bottom'
            ? 'top'
            : candidate.side === 'left'
              ? 'right'
              : 'left',
    };
  }

  const arrowInset = Math.max(ARROW_INSET, arrowSize);
  const edge =
    candidate.side === 'top'
      ? 'bottom'
      : candidate.side === 'bottom'
        ? 'top'
        : candidate.side === 'left'
          ? 'right'
          : 'left';

  if (candidate.side === 'top' || candidate.side === 'bottom') {
    return {
      edge,
      x: clamp(
        anchorRect.left + anchorRect.width / 2 - coordinates.x - arrowSize / 2,
        arrowInset,
        contentRect.width - arrowInset - arrowSize
      ),
    };
  }

  return {
    edge,
    y: clamp(
      anchorRect.top + anchorRect.height / 2 - coordinates.y - arrowSize / 2,
      arrowInset,
      contentRect.height - arrowInset - arrowSize
    ),
  };
}

export function computeFloatingPosition(
  options: ComputeFloatingPositionOptions
): FloatingPositionState {
  const requested = parsePlacement(options.placement);
  const arrowSize = Math.max(0, options.arrowSize ?? 0);
  const effectiveOffset = Math.max(0, options.offset ?? 8) + (arrowSize > 0 ? arrowSize / 2 : 0);
  const viewportPadding = Math.max(0, options.viewportPadding ?? 8);
  const candidates = buildPlacementCandidates(requested.placement);

  let bestCandidate = requested;
  let bestCoordinates = computeCoordinates(
    requested,
    options.anchorRect,
    options.contentRect,
    effectiveOffset
  );
  let bestOverflow = computeOverflow(
    bestCoordinates,
    options.contentRect,
    viewportPadding,
    options.viewportWidth,
    options.viewportHeight
  );

  for (const candidate of candidates) {
    const coordinates = computeCoordinates(
      candidate,
      options.anchorRect,
      options.contentRect,
      effectiveOffset
    );
    const overflow = computeOverflow(
      coordinates,
      options.contentRect,
      viewportPadding,
      options.viewportWidth,
      options.viewportHeight
    );

    if (overflow < bestOverflow) {
      bestCandidate = candidate;
      bestCoordinates = coordinates;
      bestOverflow = overflow;
      continue;
    }

    if (overflow > bestOverflow) {
      continue;
    }

    const bestSidePriority =
      bestCandidate.side === requested.side
        ? 0
        : bestCandidate.side === getOppositeSide(requested.side)
          ? 1
          : 2;
    const nextSidePriority =
      candidate.side === requested.side
        ? 0
        : candidate.side === getOppositeSide(requested.side)
          ? 1
          : 2;

    if (nextSidePriority < bestSidePriority) {
      bestCandidate = candidate;
      bestCoordinates = coordinates;
      continue;
    }

    if (nextSidePriority > bestSidePriority) {
      continue;
    }

    const bestAlignPriority =
      bestCandidate.align === requested.align ? 0 : bestCandidate.align === 'center' ? 1 : 2;
    const nextAlignPriority =
      candidate.align === requested.align ? 0 : candidate.align === 'center' ? 1 : 2;

    /* istanbul ignore if -- candidate ordering already prefers the better alignment before this tie-break can fire. */ if (
      nextAlignPriority < bestAlignPriority
    ) {
      bestCandidate = candidate;
      bestCoordinates = coordinates;
    }
  }

  const x = clamp(
    bestCoordinates.x,
    viewportPadding,
    options.viewportWidth - viewportPadding - options.contentRect.width
  );
  const y = clamp(
    bestCoordinates.y,
    viewportPadding,
    options.viewportHeight - viewportPadding - options.contentRect.height
  );

  return {
    x,
    y,
    placement: formatPlacement(bestCandidate.side, bestCandidate.align),
    arrow: computeArrowPosition(
      bestCandidate,
      options.anchorRect,
      options.contentRect,
      { x, y },
      arrowSize
    ),
  };
}

export function useFloatingPosition(options: UseFloatingPositionOptions) {
  const state = shallowRef<FloatingPositionState>({
    x: 0,
    y: 0,
    placement: FALLBACK_PLACEMENT,
    arrow: {
      edge: 'top',
    },
  });
  const anchorWidth = shallowRef(0);
  const anchorHeight = shallowRef(0);

  let resizeObserver: ResizeObserver | null = null;
  let rafHandle: number | null = null;
  let removeListeners: (() => void) | null = null;

  function teardownTracking() {
    resizeObserver?.disconnect();
    resizeObserver = null;

    removeListeners?.();
    removeListeners = null;

    if (rafHandle !== null) {
      window.cancelAnimationFrame(rafHandle);
      rafHandle = null;
    }
  }

  async function updatePosition() {
    /* istanbul ignore if -- SSR guard; the composable only runs under a browser-like environment in tests. */ if (
      typeof window === 'undefined'
    ) {
      return;
    }

    await nextTick();

    if (!toValue(options.open)) {
      return;
    }

    const anchorElement = options.anchorRef.value;
    const contentElement = options.contentRef.value;
    if (!anchorElement || !contentElement) {
      return;
    }

    const anchorRect = anchorElement.getBoundingClientRect();
    const contentRect = contentElement.getBoundingClientRect();
    anchorWidth.value = anchorRect.width;
    anchorHeight.value = anchorRect.height;

    const computeOptions: ComputeFloatingPositionOptions = {
      anchorRect,
      contentRect,
      viewportWidth: window.innerWidth || document.documentElement.clientWidth,
      viewportHeight: window.innerHeight || document.documentElement.clientHeight,
    };
    const placement = toValue(options.placement);
    const offset = toValue(options.offset);
    const viewportPadding = toValue(options.viewportPadding);
    const arrowSize = toValue(options.arrowSize);

    if (placement !== undefined) {
      computeOptions.placement = placement;
    }

    if (offset !== undefined) {
      computeOptions.offset = offset;
    }

    if (viewportPadding !== undefined) {
      computeOptions.viewportPadding = viewportPadding;
    }

    if (arrowSize !== undefined) {
      computeOptions.arrowSize = arrowSize;
    }

    state.value = computeFloatingPosition(computeOptions);
  }

  function scheduleUpdate() {
    /* istanbul ignore if -- SSR guard; requestAnimationFrame scheduling is only meaningful in the browser. */ if (
      typeof window === 'undefined'
    ) {
      return;
    }

    if (rafHandle !== null) {
      window.cancelAnimationFrame(rafHandle);
    }

    rafHandle = window.requestAnimationFrame(() => {
      rafHandle = null;
      void updatePosition();
    });
  }

  function setupTracking() {
    if (typeof window === 'undefined' || removeListeners) {
      return;
    }

    const handleWindowChange = () => {
      scheduleUpdate();
    };

    window.addEventListener('resize', handleWindowChange);
    window.addEventListener('scroll', handleWindowChange, true);
    window.visualViewport?.addEventListener('resize', handleWindowChange);
    window.visualViewport?.addEventListener('scroll', handleWindowChange);

    removeListeners = () => {
      window.removeEventListener('resize', handleWindowChange);
      window.removeEventListener('scroll', handleWindowChange, true);
      window.visualViewport?.removeEventListener('resize', handleWindowChange);
      window.visualViewport?.removeEventListener('scroll', handleWindowChange);
    };

    if (typeof ResizeObserver === 'undefined') {
      return;
    }

    resizeObserver = new ResizeObserver(() => {
      scheduleUpdate();
    });

    if (options.anchorRef.value) {
      resizeObserver.observe(options.anchorRef.value);
    }

    if (options.contentRef.value) {
      resizeObserver.observe(options.contentRef.value);
    }
  }

  watch(
    () =>
      [
        toValue(options.open),
        options.anchorRef.value,
        options.contentRef.value,
        toValue(options.placement),
        toValue(options.offset),
        toValue(options.viewportPadding),
        toValue(options.arrowSize),
      ] as const,
    ([isOpen]) => {
      if (!isOpen) {
        teardownTracking();
        return;
      }

      setupTracking();
      scheduleUpdate();
    },
    {
      immediate: true,
      flush: 'post',
    }
  );

  onBeforeUnmount(() => {
    teardownTracking();
  });

  return {
    anchorHeight: computed(() => anchorHeight.value),
    anchorWidth: computed(() => anchorWidth.value),
    arrowStyle: computed(() => {
      const arrow = state.value.arrow;
      const style: Record<string, string> = {};

      if (arrow.x !== undefined) {
        style.left = `${arrow.x}px`;
      }

      if (arrow.y !== undefined) {
        style.top = `${arrow.y}px`;
      }

      return style;
    }),
    floatingStyle: computed(() => ({
      left: `${state.value.x}px`,
      position: 'fixed',
      top: `${state.value.y}px`,
    })),
    placement: computed(() => state.value.placement),
    updatePosition,
  };
}
