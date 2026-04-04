import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import UiCalendar from './UiCalendar.vue';
import UiDatePicker from './UiDatePicker.vue';
import UiDateRangePicker from './UiDateRangePicker.vue';
import UiTimePicker from './UiTimePicker.vue';

describe('date and time field surfaces', () => {
  it('selects calendar dates and navigates month boundaries from the governed grid', async () => {
    const wrapper = mount(UiCalendar, {
      props: {
        month: '2026-04',
        modelValue: null,
      },
    });

    const currentMonthCells = wrapper.findAll('.ui-calendar__cell').filter((cell) =>
      !cell.classes('is-outside')
    );

    await currentMonthCells[10]?.trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toMatch(/^2026-04-/);

    await currentMonthCells[10]?.trigger('keydown', { key: 'Enter' });
    expect(wrapper.emitted('update:modelValue')).toHaveLength(2);
  });

  it('opens date pickers, emits canonical values, and applies time selections', async () => {
    const picker = mount(UiDatePicker, {
      attachTo: document.body,
      props: {
        modelValue: null,
      },
      global: {
        stubs: {
          transition: false,
        },
      },
    });

    await picker.get('.ui-date-field__trigger').trigger('click');
    const pickerCells = [...document.querySelectorAll('.ui-calendar__cell')].filter(
      (cell) => !cell.classList.contains('is-outside')
    );
    (pickerCells[4] as HTMLButtonElement)?.click();
    expect(picker.emitted('update:modelValue')?.[0]?.[0]).toMatch(/^20\d{2}-\d{2}-\d{2}$/);

    const range = mount(UiDateRangePicker, {
      attachTo: document.body,
      props: {
        modelValue: [null, null],
      },
      global: {
        stubs: {
          transition: false,
        },
      },
    });

    await range.get('.ui-date-field__trigger').trigger('click');
    expect(document.querySelector('.ui-date-surface')).toBeTruthy();

    const time = mount(UiTimePicker, {
      attachTo: document.body,
      props: {
        modelValue: '09:00',
      },
      global: {
        stubs: {
          transition: false,
        },
      },
    });

    await time.get('.ui-date-field__trigger').trigger('click');
    const selects = document.querySelectorAll('.ui-time-picker select');
    (selects[0] as HTMLSelectElement).value = '13';
    selects[0]?.dispatchEvent(new Event('change', { bubbles: true }));
    (selects[1] as HTMLSelectElement).value = '30';
    selects[1]?.dispatchEvent(new Event('change', { bubbles: true }));
    (document.querySelector('.ui-time-picker__actions .ui-button:last-child') as HTMLButtonElement)?.click();
    expect(time.emitted('update:modelValue')?.pop()?.[0]).toBe('13:30');

    picker.unmount();
    range.unmount();
    time.unmount();
  });
});
