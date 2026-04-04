import { defineComponent, nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import UiField from './UiField.vue';
import UiRangeSlider from './UiRangeSlider.vue';
import UiSlider from './UiSlider.vue';

function mockRect(element: Element, width: number, height = 40) {
  Object.defineProperty(element, 'getBoundingClientRect', {
    configurable: true,
    value: () => ({
      width,
      height,
      top: 0,
      left: 0,
      right: width,
      bottom: height,
      x: 0,
      y: 0,
      toJSON() {
        return this;
      },
    }),
  });
}

describe('slider field controls', () => {
  it('covers slider field wiring, pointer updates, keyboard flow, and optional input sync', async () => {
    const host = mount(
      defineComponent({
        components: { UiField, UiSlider },
        setup() {
          const value = ref(4);
          return { value };
        },
        template: `
          <UiField label="Budget" hint="Arrow keys and pointer stay clamped">
            <UiSlider
              v-model="value"
              name="budget"
              :min="0"
              :max="10"
              :step="2"
              show-input
            />
          </UiField>
        `,
      }),
      { attachTo: document.body }
    );

    const slider = host.get('[role="slider"]');
    expect(slider.attributes('aria-labelledby')).toContain('-label');
    expect(slider.attributes('aria-describedby')).toContain('-hint');

    const hiddenInput = host.get('input[type="hidden"]');
    expect(hiddenInput.attributes('name')).toBe('budget');
    expect((hiddenInput.element as HTMLInputElement).value).toBe('4');

    await slider.trigger('focus');
    await slider.trigger('keydown', { key: 'ArrowRight' });
    expect((host.vm as { value: number }).value).toBe(6);

    await slider.trigger('keydown', { key: 'PageUp' });
    expect((host.vm as { value: number }).value).toBe(10);

    await slider.trigger('keydown', { key: 'Home' });
    expect((host.vm as { value: number }).value).toBe(0);

    const track = host.get('.ui-slider');
    mockRect(track.element, 200);
    track.element.dispatchEvent(
      new PointerEvent('pointerdown', { bubbles: true, button: 0, clientX: 150, clientY: 10 })
    );
    window.dispatchEvent(new PointerEvent('pointermove', { clientX: 150, clientY: 10 }));
    window.dispatchEvent(new PointerEvent('pointerup'));
    await nextTick();
    expect((host.vm as { value: number }).value).toBe(8);

    const numberInput = host.get('.ui-number-input input');
    await numberInput.setValue('2');
    await numberInput.trigger('blur');
    expect((host.vm as { value: number }).value).toBe(2);

    const standalone = mount(UiSlider, {
      props: {
        modelValue: 20,
        min: 0,
        max: 100,
        step: 10,
        ariaLabel: 'Standalone slider',
        ariaDescribedby: 'external-hint',
      },
    });

    expect(standalone.get('[role="slider"]').attributes('aria-label')).toBe('Standalone slider');
    expect(standalone.get('[role="slider"]').attributes('aria-describedby')).toBe('external-hint');
  });

  it('covers range slider keyboard bounds, minRange enforcement, and named inputs', async () => {
    const host = mount(
      defineComponent({
        components: { UiField, UiRangeSlider },
        setup() {
          const value = ref<[number, number]>([20, 80]);
          return { value };
        },
        template: `
          <UiField label="Deploy window" hint="Minimum gap stays enforced">
            <UiRangeSlider
              v-model="value"
              name-start="windowStart"
              name-end="windowEnd"
              :min="0"
              :max="100"
              :step="10"
              :min-range="20"
              show-input
            />
          </UiField>
        `,
      }),
      { attachTo: document.body }
    );

    const [startThumb, endThumb] = host.findAll('[role="slider"]');
    expect(startThumb?.attributes('aria-labelledby')).toContain('-label');
    expect(endThumb?.attributes('aria-labelledby')).toContain('-label');

    const hiddenInputs = host.findAll('input[type="hidden"]');
    expect(hiddenInputs).toHaveLength(2);
    expect(hiddenInputs[0]?.attributes('name')).toBe('windowStart');
    expect(hiddenInputs[1]?.attributes('name')).toBe('windowEnd');

    await startThumb?.trigger('focus');
    await startThumb?.trigger('keydown', { key: 'ArrowRight' });
    expect((host.vm as { value: [number, number] }).value).toEqual([30, 80]);

    await endThumb?.trigger('focus');
    await endThumb?.trigger('keydown', { key: 'Home' });
    expect((host.vm as { value: [number, number] }).value).toEqual([30, 50]);

    await endThumb?.trigger('keydown', { key: 'End' });
    expect((host.vm as { value: [number, number] }).value).toEqual([30, 100]);

    await startThumb?.trigger('keydown', { key: 'End' });
    expect((host.vm as { value: [number, number] }).value).toEqual([80, 100]);

    const track = host.get('.ui-slider');
    mockRect(track.element, 200);
    track.element.dispatchEvent(
      new PointerEvent('pointerdown', { bubbles: true, button: 0, clientX: 20, clientY: 10 })
    );
    window.dispatchEvent(new PointerEvent('pointerup'));
    await nextTick();
    expect((host.vm as { value: [number, number] }).value).toEqual([10, 100]);

    const rangeInputs = host.findAll('.ui-number-input input');
    expect(rangeInputs).toHaveLength(2);
    await rangeInputs[1]?.setValue('50');
    await rangeInputs[1]?.trigger('blur');
    expect((host.vm as { value: [number, number] }).value).toEqual([10, 50]);
  });
});
