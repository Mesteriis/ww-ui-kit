import { nextTick } from 'vue';
import { describe, expect, it } from 'vitest';

import { useRovingFocus } from './useRovingFocus';

const createButton = (id: string) => {
  const button = document.createElement('button');
  button.id = id;
  button.type = 'button';
  document.body.append(button);
  return button;
};

describe('useRovingFocus', () => {
  it('registers items, skips disabled entries, loops, and reassigns current id on unregister', async () => {
    const roving = useRovingFocus();
    const first = createButton('first');
    const second = createButton('second');
    const third = createButton('third');

    const unregisterDisabled = roving.registerItem({
      disabled: () => true,
      element: () => third,
      id: 'third',
    });
    const unregisterFirst = roving.registerItem({
      element: () => first,
      id: 'first',
    });
    const unregisterSecond = roving.registerItem({
      disabled: () => false,
      element: () => second,
      id: 'second',
    });

    expect(roving.currentId.value).toBe('first');

    await roving.move('next');
    expect(roving.currentId.value).toBe('second');
    expect(document.activeElement).toBe(second);

    await roving.move('next');
    expect(roving.currentId.value).toBe('first');
    expect(document.activeElement).toBe(first);

    await roving.move('last');
    expect(roving.currentId.value).toBe('second');

    roving.setCurrentId('first');
    unregisterFirst();
    await nextTick();

    expect(roving.currentId.value).toBe('second');

    unregisterDisabled();
    unregisterSecond();
    await nextTick();

    expect(roving.currentId.value).toBeNull();

    first.remove();
    second.remove();
    third.remove();
  });

  it('supports non-looping moves and keyboard handling for horizontal and vertical orientations', async () => {
    const vertical = useRovingFocus({
      loop: false,
      orientation: 'vertical',
    });
    const alpha = createButton('alpha');
    const beta = createButton('beta');

    vertical.registerItem({
      element: () => alpha,
      id: 'alpha',
    });
    vertical.registerItem({
      element: () => beta,
      id: 'beta',
    });

    await vertical.move('prev');
    expect(vertical.currentId.value).toBe('alpha');

    const downEvent = new KeyboardEvent('keydown', { key: 'ArrowDown', cancelable: true });
    expect(await vertical.onKeydown(downEvent)).toBe(true);
    expect(downEvent.defaultPrevented).toBe(true);
    expect(vertical.currentId.value).toBe('beta');

    const homeEvent = new KeyboardEvent('keydown', { key: 'Home', cancelable: true });
    expect(await vertical.onKeydown(homeEvent)).toBe(true);
    expect(vertical.currentId.value).toBe('alpha');

    const ignoredEvent = new KeyboardEvent('keydown', { key: 'ArrowRight', cancelable: true });
    expect(await vertical.onKeydown(ignoredEvent)).toBe(false);
    expect(ignoredEvent.defaultPrevented).toBe(false);

    const upEvent = new KeyboardEvent('keydown', { key: 'ArrowUp', cancelable: true });
    expect(await vertical.onKeydown(upEvent)).toBe(true);
    expect(vertical.currentId.value).toBe('alpha');

    await vertical.move('next');
    await vertical.move('next');
    expect(vertical.currentId.value).toBe('beta');

    const horizontal = useRovingFocus({
      loop: true,
      orientation: 'horizontal',
    });
    horizontal.registerItem({
      element: () => alpha,
      id: 'alpha',
    });
    horizontal.registerItem({
      element: () => beta,
      id: 'beta',
    });

    const leftEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft', cancelable: true });
    expect(await horizontal.onKeydown(leftEvent)).toBe(true);
    expect(horizontal.currentId.value).toBe('beta');

    const endEvent = new KeyboardEvent('keydown', { key: 'End', cancelable: true });
    expect(await horizontal.onKeydown(endEvent)).toBe(true);
    expect(horizontal.currentId.value).toBe('beta');

    const empty = useRovingFocus({
      loop: false,
      orientation: 'horizontal',
    });
    expect(await empty.move('first')).toBeNull();

    const defaultOrientation = useRovingFocus();
    defaultOrientation.registerItem({
      element: () => alpha,
      id: 'alpha',
    });
    defaultOrientation.registerItem({
      element: () => beta,
      id: 'beta',
    });
    const rightEvent = new KeyboardEvent('keydown', { key: 'ArrowRight', cancelable: true });
    expect(await defaultOrientation.onKeydown(rightEvent)).toBe(true);
    expect(defaultOrientation.currentId.value).toBe('beta');

    alpha.remove();
    beta.remove();
  });
});
