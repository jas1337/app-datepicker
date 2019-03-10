import { AppDatepickerDialog } from '../../app-datepicker-dialog';
import {
  date13,
  date15,
  date17,
  defaultLocale,
} from '../test-config';
import {
  forceUpdate,
  getComputedStylePropertyValue,
  getShadowInnerHTML,
  getTestName,
  queryInit,
  triggerEvent,
} from '../test-helpers';

import { START_VIEW } from '../../app-datepicker';
import { KEYCODES_MAP } from '../../datepicker-helpers';
import { KeyboardEventOptions } from '../test-helpers';

const {
  isTrue,
  strictEqual,
  isNotNull,
} = chai.assert;
const name = AppDatepickerDialog.is;

describe(getTestName(name), () => {
  describe('keyboards', () => {
    interface RunTestCustomEvent {
      opened: boolean;
      value: string;
    }
    const runTestOnDialogClosed = (cb: (ev: CustomEvent<RunTestCustomEvent>) => void) =>
      new Promise((yay, nah) => {
        el.addEventListener('datepicker-dialog-closed', async (ev) => {
          try {
            await forceUpdate(el);
            cb(ev as CustomEvent);
            yay();
          } catch (e) {
            nah(e);
          }
        }, { once: true });
      });

    let el: AppDatepickerDialog;
    let t: ReturnType<typeof queryInit>;

    beforeEach(async () => {
      el = document.createElement(name) as AppDatepickerDialog;
      document.body.appendChild(el);

      el.locale = defaultLocale;
      el.startView = START_VIEW.CALENDAR;
      el.min = date13;
      el.value = date15;
      await forceUpdate(el);

      el.open();
      await forceUpdate(el);

      t = queryInit(el);
    });

    afterEach(() => {
      document.body.removeChild(el);
    });

    it(`focuses date by keyboard (Left)`, async () => {
      const datepickerBodyCalendarViewEl = t.getDatepickerBodyCalendarView();
      isNotNull(datepickerBodyCalendarViewEl, `Calendar view not found`);

      const keyboardEventOptions: KeyboardEventOptions = { keyCode: KEYCODES_MAP.ARROW_LEFT };
      triggerEvent(datepickerBodyCalendarViewEl, 'keyup', keyboardEventOptions);
      await forceUpdate(el);

      strictEqual(t.elem.value, '2020-01-14', `New focused date not matched (${t.elem.value})`);

      const btnCalendarSelectorEl = t.getBtnCalendarSelector();
      isNotNull(btnCalendarSelectorEl, `Calendar selector not found`);

      const btnCalendarSelectorLabel = getShadowInnerHTML(btnCalendarSelectorEl);
      strictEqual(
        btnCalendarSelectorLabel,
        `Tue, Jan 14`,
        `Updated calendar selector label not matched (${btnCalendarSelectorLabel})`);

      const newFocusedDateLabelEl = t.getDatepickerBodyCalendarViewDayFocusedDiv();
      isNotNull(newFocusedDateLabelEl, `New focused date not found`);

      const newFocusedDateLabel = getShadowInnerHTML(newFocusedDateLabelEl!);
      strictEqual(
        newFocusedDateLabel,
        '14',
        `New focused label not matched (${newFocusedDateLabel})`);
    });

    it(`focuses date by keyboard (Left + first focusable date/ disabled date)`, async () => {
      const tasks = [
        async () => { el.value = date13; await forceUpdate(el); return 0; },
        async () => {
          el.value = date15;
          el.disabledDates = '2020-01-14';
          await forceUpdate(el); return 1;
        },
      ];

      for (const fn of tasks) {
        const val = await fn();
        if (!val) {
          strictEqual(el.value, '2020-01-13', `'value' not updated (${el.value})`);
          strictEqual(t.elem.value, '2020-01-13', `'value' not updated (${t.elem.value})`);
        }

        if (val === 1) {
          strictEqual(el.disabledDates, '2020-01-14', `'disabledDates' not updated`);
        }

        const datepickerBodyCalendarViewEl = t.getDatepickerBodyCalendarView();
        isNotNull(datepickerBodyCalendarViewEl, `Calendar view not found`);

        const keyboardEventOptions: KeyboardEventOptions = { keyCode: KEYCODES_MAP.ARROW_LEFT };
        triggerEvent(datepickerBodyCalendarViewEl, 'keyup', keyboardEventOptions);
        await forceUpdate(el);

        strictEqual(
          t.elem.value, '2020-01-13', `New focused date not matched (${t.elem.value})`);

        const btnCalendarSelectorEl = t.getBtnCalendarSelector();
        isNotNull(btnCalendarSelectorEl, `Calendar selector not found`);

        const btnCalendarSelectorLabel = getShadowInnerHTML(btnCalendarSelectorEl);
        strictEqual(
          btnCalendarSelectorLabel,
          `Mon, Jan 13`,
          `Updated calendar selector label not matched (${btnCalendarSelectorLabel})`);

        const newFocusedDateLabelEl = t.getDatepickerBodyCalendarViewDayFocusedDiv();
        isNotNull(newFocusedDateLabelEl, `New focused date not found`);

        const newFocusedDateLabel = getShadowInnerHTML(newFocusedDateLabelEl!);
        strictEqual(
          newFocusedDateLabel,
          '13',
          `New focused label not matched (${newFocusedDateLabel})`);
      }
    });

    it(`focuses date by keyboard (Right)`, async () => {
      const datepickerBodyCalendarViewEl = t.getDatepickerBodyCalendarView();
      isNotNull(datepickerBodyCalendarViewEl, `Calendar view not found`);

      const keyboardEventOptions: KeyboardEventOptions = {
        keyCode: KEYCODES_MAP.ARROW_RIGHT,
      };
      triggerEvent(datepickerBodyCalendarViewEl, 'keyup', keyboardEventOptions);
      await forceUpdate(el);

      strictEqual(
        t.elem.value, '2020-01-16', `New focused date not matched (${t.elem.value})`);

      const btnCalendarSelectorEl = t.getBtnCalendarSelector();
      isNotNull(btnCalendarSelectorEl, `Calendar selector not found`);

      const btnCalendarSelectorLabel = getShadowInnerHTML(btnCalendarSelectorEl);
      strictEqual(
        btnCalendarSelectorLabel,
        `Thu, Jan 16`,
        `Updated calendar selector label not matched (${btnCalendarSelectorLabel})`);

      const newFocusedDateLabelEl = t.getDatepickerBodyCalendarViewDayFocusedDiv();
      isNotNull(newFocusedDateLabelEl, `New focused date not found`);

      const newFocusedDateLabel = getShadowInnerHTML(newFocusedDateLabelEl!);
      strictEqual(
        newFocusedDateLabel,
        '16',
        `New focused label not matched (${newFocusedDateLabel})`);
    });

    it(`focuses date by keyboard (Right + last focusable date/ disabled date)`, async () => {
      el.min = '';
      el.max = date15;
      await forceUpdate(el);

      const tasks = [
        async () => { el.value = '2020-01-15'; await forceUpdate(el); return 0; },
        async () => {
          el.value = date13;
          el.disabledDates = '2020-01-14';
          await forceUpdate(el);
          return 1;
        },
      ];

      for (const fn of tasks) {
        const val = await fn();
        if (!val) {
          strictEqual(el.value, '2020-01-15', `'value' not updated (${el.value})`);
          strictEqual(t.elem.value, '2020-01-15', `'value' not updated (${t.elem.value})`);
        }

        if (val === 1) {
          strictEqual(el.disabledDates, '2020-01-14', `'disabledDates' not updated`);
        }

        const datepickerBodyCalendarViewEl = t.getDatepickerBodyCalendarView();
        isNotNull(datepickerBodyCalendarViewEl, `Calendar view not found`);

        const keyboardEventOptions: KeyboardEventOptions = {
          keyCode: KEYCODES_MAP.ARROW_RIGHT,
        };
        triggerEvent(datepickerBodyCalendarViewEl, 'keyup', keyboardEventOptions);
        await forceUpdate(el);

        strictEqual(
          t.elem.value, '2020-01-15', `New focused date not matched (${t.elem.value})`);

        const btnCalendarSelectorEl = t.getBtnCalendarSelector();
        isNotNull(btnCalendarSelectorEl, `Calendar selector not found`);

        const btnCalendarSelectorLabel = getShadowInnerHTML(btnCalendarSelectorEl);
        strictEqual(
          btnCalendarSelectorLabel,
          `Wed, Jan 15`,
          `Updated calendar selector label not matched (${btnCalendarSelectorLabel})`);

        const newFocusedDateLabelEl = t.getDatepickerBodyCalendarViewDayFocusedDiv();
        isNotNull(newFocusedDateLabelEl, `New focused date not found`);

        const newFocusedDateLabel = getShadowInnerHTML(newFocusedDateLabelEl!);
        strictEqual(
          newFocusedDateLabel,
          '15',
          `New focused label not matched (${newFocusedDateLabel})`);
      }
    });

    it(`focuses date by keyboard (Up)`, async () => {
      el.min = date13;
      el.value = '2020-01-22';
      await forceUpdate(el);

      const datepickerBodyCalendarViewEl = t.getDatepickerBodyCalendarView();
      isNotNull(datepickerBodyCalendarViewEl, `Calendar view not found`);

      const keyboardEventOptions: KeyboardEventOptions = {
        keyCode: KEYCODES_MAP.ARROW_UP,
      };
      triggerEvent(datepickerBodyCalendarViewEl, 'keyup', keyboardEventOptions);
      await forceUpdate(el);

      strictEqual(
        t.elem.value, '2020-01-15', `New focused date not matched (${t.elem.value})`);

      const btnCalendarSelectorEl = t.getBtnCalendarSelector();
      isNotNull(btnCalendarSelectorEl, `Calendar selector not found`);

      const btnCalendarSelectorLabel = getShadowInnerHTML(btnCalendarSelectorEl);
      strictEqual(
        btnCalendarSelectorLabel,
        `Wed, Jan 15`,
        `Updated calendar selector label not matched (${btnCalendarSelectorLabel})`);

      const newFocusedDateLabelEl = t.getDatepickerBodyCalendarViewDayFocusedDiv();
      isNotNull(newFocusedDateLabelEl, `New focused date not found`);

      const newFocusedDateLabel = getShadowInnerHTML(newFocusedDateLabelEl!);
      strictEqual(
        newFocusedDateLabel,
        '15',
        `New focused label not matched (${newFocusedDateLabel})`);
    });

    it(`focuses date by keyboard (Up + first focusable date/ disabled date)`, async () => {
      el.min = date13;
      await forceUpdate(el);

      const tasks = [
        async () => {
          el.value = date15;
          await forceUpdate(el);
          return {
            id: 0,
            e: '2020-01-15',
            e1: '2020-01-13',
            e2: 'Mon, Jan 13',
            e3: '13',
          };
        },
        async () => {
          el.value = '2020-01-22';
          el.disabledDates = '2020-01-15';
          await forceUpdate(el);
          return {
            id: 1,
            e: '2020-01-15',
            e1: '2020-01-16',
            e2: 'Thu, Jan 16',
            e3: '16',
          };
        },
      ];

      for (const fn of tasks) {
        const { id, e, e1, e2, e3 } = await fn();
        if (!id) {
          strictEqual(el.value, e, `'value' not updated (${el.value})`);
          strictEqual(t.elem.value, e, `'value' not updated (${t.elem.value})`);
        }
        if (id === 1) {
          strictEqual(el.disabledDates, e, `'disabledDates' not updated`);
        }

        const datepickerBodyCalendarViewEl = t.getDatepickerBodyCalendarView();
        isNotNull(datepickerBodyCalendarViewEl, `Calendar view not found`);

        const keyboardEventOptions: KeyboardEventOptions = {
          keyCode: KEYCODES_MAP.ARROW_UP,
        };
        triggerEvent(datepickerBodyCalendarViewEl, 'keyup', keyboardEventOptions);
        await forceUpdate(el);

        strictEqual(t.elem.value, e1, `New focused date not matched (${t.elem.value})`);

        const btnCalendarSelectorEl = t.getBtnCalendarSelector();
        isNotNull(btnCalendarSelectorEl, `Calendar selector not found`);

        const btnCalendarSelectorLabel = getShadowInnerHTML(btnCalendarSelectorEl);
        strictEqual(
          btnCalendarSelectorLabel,
          e2,
          `Updated calendar selector label not matched (${btnCalendarSelectorLabel})`);

        const newFocusedDateLabelEl = t.getDatepickerBodyCalendarViewDayFocusedDiv();
        isNotNull(newFocusedDateLabelEl, `New focused date not found`);

        const newFocusedDateLabel = getShadowInnerHTML(newFocusedDateLabelEl!);
        strictEqual(
          newFocusedDateLabel,
          e3,
          `New focused label not matched (${newFocusedDateLabel})`);
      }
    });

    it(`focuses date by keyboard (Down)`, async () => {
      el.min = date13;
      el.value = date15;
      await forceUpdate(el);

      const datepickerBodyCalendarViewEl = t.getDatepickerBodyCalendarView();
      isNotNull(datepickerBodyCalendarViewEl, `Calendar view not found`);

      const keyboardEventOptions: KeyboardEventOptions = {
        keyCode: KEYCODES_MAP.ARROW_DOWN,
      };
      triggerEvent(datepickerBodyCalendarViewEl, 'keyup', keyboardEventOptions);
      await forceUpdate(el);

      strictEqual(t.elem.value, '2020-01-22', `New focused date not matched (${t.elem.value})`);

      const btnCalendarSelectorEl = t.getBtnCalendarSelector();
      isNotNull(btnCalendarSelectorEl, `Calendar selector not found`);

      const btnCalendarSelectorLabel = getShadowInnerHTML(btnCalendarSelectorEl);
      strictEqual(
        btnCalendarSelectorLabel,
        `Wed, Jan 22`,
        `Updated calendar selector label not matched (${btnCalendarSelectorLabel})`);

      const newFocusedDateLabelEl = t.getDatepickerBodyCalendarViewDayFocusedDiv();
      isNotNull(newFocusedDateLabelEl, `New focused date not found`);

      const newFocusedDateLabel = getShadowInnerHTML(newFocusedDateLabelEl!);
      strictEqual(
        newFocusedDateLabel,
        '22',
        `New focused label not matched (${newFocusedDateLabel})`);
    });

    it(`focuses date by keyboard (Down + last focusable date/ disabled date)`, async () => {
      el.min = date13;
      el.max = '2020-01-24';
      await forceUpdate(el);

      const tasks = [
        async () => {
          el.value = '2020-01-22';
          await forceUpdate(el);
          return {
            id: 0,
            e: '2020-01-22',
            e1: '2020-01-24',
            e2: 'Fri, Jan 24',
            e3: '24',
          };
        },
        async () => {
          el.value = '2020-01-15';
          el.disabledDates = '2020-01-22';
          await forceUpdate(el);
          return {
            id: 1,
            e: '2020-01-22',
            e1: '2020-01-21',
            e2: 'Tue, Jan 21',
            e3: '21',
          };
        },
      ];

      for (const fn of tasks) {
        const { id, e, e1, e2, e3 } = await fn();
        if (!id) {
          strictEqual(el.value, e, `'value' not updated (${el.value})`);
          strictEqual(t.elem.value, e, `'value' not updated (${t.elem.value}})`);
        }
        if (id === 1) strictEqual(el.disabledDates, e, `'disabledDates' not updated`);

        const datepickerBodyCalendarViewEl = t.getDatepickerBodyCalendarView();
        isNotNull(datepickerBodyCalendarViewEl, `Calendar view not found`);

        const keyboardEventOptions: KeyboardEventOptions = {
          keyCode: KEYCODES_MAP.ARROW_DOWN,
        };
        triggerEvent(datepickerBodyCalendarViewEl, 'keyup', keyboardEventOptions);
        await forceUpdate(el);

        strictEqual(t.elem.value, e1, `New focused date not matched (${t.elem.value})`);

        const btnCalendarSelectorEl = t.getBtnCalendarSelector();
        isNotNull(btnCalendarSelectorEl, `Calendar selector not found`);

        const btnCalendarSelectorLabel = getShadowInnerHTML(btnCalendarSelectorEl);
        strictEqual(
          btnCalendarSelectorLabel,
          e2,
          `Updated calendar selector label not matched (${btnCalendarSelectorLabel})`);

        const newFocusedDateLabelEl = t.getDatepickerBodyCalendarViewDayFocusedDiv();
        isNotNull(newFocusedDateLabelEl, `New focused date not found`);

        const newFocusedDateLabel = getShadowInnerHTML(newFocusedDateLabelEl!);
        strictEqual(
          newFocusedDateLabel,
          e3,
          `New focused label not matched (${newFocusedDateLabel})`);
      }
    });

    it(`focuses date by keyboard (PgUp)`, async () => {
      el.min = date13;
      el.value = '2020-02-22';
      await forceUpdate(el);

      const datepickerBodyCalendarViewEl = t.getDatepickerBodyCalendarView();
      isNotNull(datepickerBodyCalendarViewEl, `Calendar view not found`);

      const keyboardEventOptions: KeyboardEventOptions = {
        keyCode: KEYCODES_MAP.PAGE_UP,
      };
      triggerEvent(datepickerBodyCalendarViewEl, 'keyup', keyboardEventOptions);
      await forceUpdate(el);

      strictEqual(t.elem.value, '2020-01-22', `New focused date not matched (${t.elem.value})`);

      const btnCalendarSelectorEl = t.getBtnCalendarSelector();
      isNotNull(btnCalendarSelectorEl, `Calendar selector not found`);

      const btnCalendarSelectorLabel = getShadowInnerHTML(btnCalendarSelectorEl);
      strictEqual(
        btnCalendarSelectorLabel,
        `Wed, Jan 22`,
        `Updated calendar selector label not matched (${btnCalendarSelectorLabel})`);

      const newFocusedDateLabelEl = t.getDatepickerBodyCalendarViewDayFocusedDiv();
      isNotNull(newFocusedDateLabelEl, `New focused date not found`);

      const newFocusedDateLabel = getShadowInnerHTML(newFocusedDateLabelEl!);
      strictEqual(
        newFocusedDateLabel,
        '22',
        `New focused label not matched (${newFocusedDateLabel})`);
    });

    it(`focuses date by keyboard (PgUp + first focusable date/ disabled date)`, async () => {
      el.min = date13;
      await forceUpdate(el);

      const tasks = [
        async () => {
          el.value = '2020-01-22';
          await forceUpdate(el);
          return {
            id: 0,
            e: '2020-01-22',
            e1: '2020-01-13',
            e2: 'Mon, Jan 13',
            e3: '13',
          };
        },
        async () => {
          el.value = '2020-02-22';
          el.disabledDates = '2020-01-22';
          await forceUpdate(el);
          return {
            id: 1,
            e: '2020-01-22',
            e1: '2020-01-23',
            e2: 'Thu, Jan 23',
            e3: '23',
          };
        },
      ];

      for (const fn of tasks) {
        const { id, e, e1, e2, e3 } = await fn();
        if (!id) {
          strictEqual(el.value, e, `'value' not updated (${el.value})`);
          strictEqual(t.elem.value, e, `'value' not updated (${t.elem.value})`);
        }
        if (id === 1) strictEqual(el.disabledDates, e, `'disabledDates' not updated`);

        const datepickerBodyCalendarViewEl = t.getDatepickerBodyCalendarView();
        isNotNull(datepickerBodyCalendarViewEl, `Calendar view not found`);

        const keyboardEventOptions: KeyboardEventOptions = {
          keyCode: KEYCODES_MAP.PAGE_UP,
        };
        triggerEvent(datepickerBodyCalendarViewEl, 'keyup', keyboardEventOptions);
        await forceUpdate(el);

        strictEqual(t.elem.value, e1, `New focused date not matched (${t.elem.value})`);

        const btnCalendarSelectorEl = t.getBtnCalendarSelector();
        isNotNull(btnCalendarSelectorEl, `Calendar selector not found`);

        const btnCalendarSelectorLabel = getShadowInnerHTML(btnCalendarSelectorEl);
        strictEqual(
          btnCalendarSelectorLabel,
          e2,
          `Updated calendar selector label not matched (${btnCalendarSelectorLabel})`);

        const newFocusedDateLabelEl = t.getDatepickerBodyCalendarViewDayFocusedDiv();
        isNotNull(newFocusedDateLabelEl, `New focused date not found`);

        const newFocusedDateLabel = getShadowInnerHTML(newFocusedDateLabelEl!);
        strictEqual(
          newFocusedDateLabel,
          e3,
          `New focused label not matched (${newFocusedDateLabel})`);
      }
    });

    it(`focuses date by keyboard (PgDown)`, async () => {
      el.min = date13;
      el.value = '2020-01-20';
      await forceUpdate(el);

      const datepickerBodyCalendarViewEl = t.getDatepickerBodyCalendarView();
      isNotNull(datepickerBodyCalendarViewEl, `Calendar view not found`);

      const keyboardEventOptions: KeyboardEventOptions = {
        keyCode: KEYCODES_MAP.PAGE_DOWN,
      };
      triggerEvent(datepickerBodyCalendarViewEl, 'keyup', keyboardEventOptions);
      await forceUpdate(el);

      strictEqual(t.elem.value, '2020-02-20', `New focused date not matched (${t.elem.value})`);

      const btnCalendarSelectorEl = t.getBtnCalendarSelector();
      isNotNull(btnCalendarSelectorEl, `Calendar selector not found`);

      const btnCalendarSelectorLabel = getShadowInnerHTML(btnCalendarSelectorEl);
      strictEqual(
        btnCalendarSelectorLabel,
        `Thu, Feb 20`,
        `Updated calendar selector label not matched (${btnCalendarSelectorLabel})`);

      const newFocusedDateLabelEl = t.getDatepickerBodyCalendarViewDayFocusedDiv();
      isNotNull(newFocusedDateLabelEl, `New focused date not found`);

      const newFocusedDateLabel = getShadowInnerHTML(newFocusedDateLabelEl!);
      strictEqual(
        newFocusedDateLabel,
        '20',
        `New focused label not matched (${newFocusedDateLabel})`);
    });

    it(`focuses date by keyboard (PgDown + last focusable date/ disabled date)`, async () => {
      el.min = date13;
      el.max = '2020-02-20',
      await forceUpdate(el);

      const tasks = [
        async () => {
          el.value = '2020-02-20';
          await forceUpdate(el);
          return {
            id: 0,
            e: '2020-02-20',
            e1: '2020-02-20',
            e2: 'Thu, Feb 20',
            e3: '20',
          };
        },
        async () => {
          el.value = '2020-01-17';
          el.disabledDates = '2020-02-17';
          await forceUpdate(el);
          return {
            id: 1,
            e: '2020-02-17',
            e1: '2020-02-14',
            e2: 'Fri, Feb 14',
            e3: '14',
          };
        },
      ];

      for (const fn of tasks) {
        const { id, e, e1, e2, e3 } = await fn();
        if (!id) {
          strictEqual(el.value, e, `'value' not updated (${el.value})`);
          strictEqual(t.elem.value, e, `'value' not updated (${t.elem.value})`);
        }
        if (id === 1) strictEqual(el.disabledDates, e, `'disabledDates' not updated`);

        const datepickerBodyCalendarViewEl = t.getDatepickerBodyCalendarView();
        isNotNull(datepickerBodyCalendarViewEl, `Calendar view not found`);

        const keyboardEventOptions: KeyboardEventOptions = {
          keyCode: KEYCODES_MAP.PAGE_DOWN,
        };
        triggerEvent(datepickerBodyCalendarViewEl, 'keyup', keyboardEventOptions);
        await forceUpdate(el);

        strictEqual(t.elem.value, e1, `New focused date not matched (${t.elem.value})`);

        const btnCalendarSelectorEl = t.getBtnCalendarSelector();
        isNotNull(btnCalendarSelectorEl, `Calendar selector not found`);

        const btnCalendarSelectorLabel = getShadowInnerHTML(btnCalendarSelectorEl);
        strictEqual(
          btnCalendarSelectorLabel,
          e2,
          `Updated calendar selector label not matched (${btnCalendarSelectorLabel})`);

        const newFocusedDateLabelEl = t.getDatepickerBodyCalendarViewDayFocusedDiv();
        isNotNull(newFocusedDateLabelEl, `New focused date not found`);

        const newFocusedDateLabel = getShadowInnerHTML(newFocusedDateLabelEl!);
        strictEqual(
          newFocusedDateLabel,
          e3,
          `New focused label not matched (${newFocusedDateLabel})`);
      }
    });

    it(`focuses date by keyboard (Alt + PgUp)`, async () => {
      el.min = date13;
      el.value = '2021-01-22';
      await forceUpdate(el);

      const datepickerBodyCalendarViewEl = t.getDatepickerBodyCalendarView();
      isNotNull(datepickerBodyCalendarViewEl, `Calendar view not found`);

      const keyboardEventOptions: KeyboardEventOptions = {
        keyCode: KEYCODES_MAP.PAGE_UP,
        altKey: true,
      };
      triggerEvent(datepickerBodyCalendarViewEl, 'keyup', keyboardEventOptions);
      await forceUpdate(el);

      strictEqual(t.elem.value, '2020-01-22', `New focused date not matched (${t.elem.value})`);

      const btnCalendarSelectorEl = t.getBtnCalendarSelector();
      isNotNull(btnCalendarSelectorEl, `Calendar selector not found`);

      const btnCalendarSelectorLabel = getShadowInnerHTML(btnCalendarSelectorEl);
      strictEqual(
        btnCalendarSelectorLabel,
        `Wed, Jan 22`,
        `Updated calendar selector label not matched (${btnCalendarSelectorLabel})`);

      const newFocusedDateLabelEl = t.getDatepickerBodyCalendarViewDayFocusedDiv();
      isNotNull(newFocusedDateLabelEl, `New focused date not found`);

      const newFocusedDateLabel = getShadowInnerHTML(newFocusedDateLabelEl!);
      strictEqual(
        newFocusedDateLabel,
        '22',
        `New focused label not matched (${newFocusedDateLabel})`);
    });

    it(`focuses date by keyboard (Alt + PgUp + first focusable date/ disabled date)`,
    async () => {
      el.min = date13;
      await forceUpdate(el);

      const tasks = [
        async () => {
          el.value = '2021-01-12';
          await forceUpdate(el);
          return {
            id: 0,
            e: '2021-01-12',
            e1: '2020-01-13',
            e2: 'Mon, Jan 13',
            e3: '13',
          };
        },
        async () => {
          el.value = '2021-02-22';
          el.disabledDates = '2020-02-22';
          await forceUpdate(el);
          return {
            id: 1,
            e: '2020-02-22',
            e1: '2020-02-24',
            e2: 'Mon, Feb 24',
            e3: '24',
          };
        },
      ];

      for (const fn of tasks) {
        const { id, e, e1, e2, e3 } = await fn();
        if (!id) {
          strictEqual(el.value, e, `'value' not updated (${el.value})`);
          strictEqual(t.elem.value, e, `'value' not updated (${t.elem.value})`);
        }
        if (id === 1) strictEqual(el.disabledDates, e, `'disabledDates' not updated`);

        const datepickerBodyCalendarViewEl = t.getDatepickerBodyCalendarView();
        isNotNull(datepickerBodyCalendarViewEl, `Calendar view not found`);

        const keyboardEventOptions: KeyboardEventOptions = {
          keyCode: KEYCODES_MAP.PAGE_UP,
          altKey: true,
        };
        triggerEvent(datepickerBodyCalendarViewEl, 'keyup', keyboardEventOptions);
        await forceUpdate(el);

        strictEqual(t.elem.value, e1, `New focused date not matched (${t.elem.value})`);

        const btnCalendarSelectorEl = t.getBtnCalendarSelector();
        isNotNull(btnCalendarSelectorEl, `Calendar selector not found`);

        const btnCalendarSelectorLabel = getShadowInnerHTML(btnCalendarSelectorEl);
        strictEqual(
          btnCalendarSelectorLabel,
          e2,
          `Updated calendar selector label not matched (${btnCalendarSelectorLabel})`);

        const newFocusedDateLabelEl = t.getDatepickerBodyCalendarViewDayFocusedDiv();
        isNotNull(newFocusedDateLabelEl, `New focused date not found`);

        const newFocusedDateLabel = getShadowInnerHTML(newFocusedDateLabelEl!);
        strictEqual(
          newFocusedDateLabel,
          e3,
          `New focused label not matched (${newFocusedDateLabel})`);
      }
    });

    it(`focuses date by keyboard (Alt + PgDown)`, async () => {
      el.max = '2021-01-25';
      el.value = '2020-01-22';
      await forceUpdate(el);

      const datepickerBodyCalendarViewEl = t.getDatepickerBodyCalendarView();
      isNotNull(datepickerBodyCalendarViewEl, `Calendar view not found`);

      const keyboardEventOptions: KeyboardEventOptions = {
        keyCode: KEYCODES_MAP.PAGE_DOWN,
        altKey: true,
      };
      triggerEvent(datepickerBodyCalendarViewEl, 'keyup', keyboardEventOptions);
      await forceUpdate(el);

      strictEqual(t.elem.value, '2021-01-22', `New focused date not matched (${t.elem.value})`);

      const btnCalendarSelectorEl = t.getBtnCalendarSelector();
      isNotNull(btnCalendarSelectorEl, `Calendar selector not found`);

      const btnCalendarSelectorLabel = getShadowInnerHTML(btnCalendarSelectorEl);
      strictEqual(
        btnCalendarSelectorLabel,
        `Fri, Jan 22`,
        `Updated calendar selector label not matched (${btnCalendarSelectorLabel})`);

      const newFocusedDateLabelEl = t.getDatepickerBodyCalendarViewDayFocusedDiv();
      isNotNull(newFocusedDateLabelEl, `New focused date not found`);

      const newFocusedDateLabel = getShadowInnerHTML(newFocusedDateLabelEl!);
      strictEqual(
        newFocusedDateLabel,
        '22',
        `New focused label not matched (${newFocusedDateLabel})`);
    });

    it(`focuses date by keyboard (Alt + PgDown + last focusable date/ disabled date)`,
    async () => {
      el.max = '2021-01-22';
      await forceUpdate(el);

      const tasks = [
        async () => {
          el.value = '2021-01-22';
          await forceUpdate(el);
          return {
            id: 0,
            e: '2021-01-22',
            e1: '2021-01-22',
            e2: 'Fri, Jan 22',
            e3: '22',
          };
        },
        async () => {
          el.value = '2020-01-20';
          el.disabledDates = '2021-01-20';
          await forceUpdate(el);
          return {
            id: 1,
            e: '2021-01-20',
            e1: '2021-01-19',
            e2: 'Tue, Jan 19',
            e3: '19',
          };
        },
      ];

      for (const fn of tasks) {
        const { id, e, e1, e2, e3 } = await fn();
        if (!id) {
          strictEqual(el.value, e, `'value' not updated (${el.value})`);
          strictEqual(t.elem.value, e, `'value' not updated (${t.elem.value})`);
        }
        if (id === 1) strictEqual(el.disabledDates, e, `'disabledDates' not updated`);

        const datepickerBodyCalendarViewEl = t.getDatepickerBodyCalendarView();
        isNotNull(datepickerBodyCalendarViewEl, `Calendar view not found`);

        const keyboardEventOptions: KeyboardEventOptions = {
          keyCode: KEYCODES_MAP.PAGE_DOWN,
          altKey: true,
        };
        triggerEvent(datepickerBodyCalendarViewEl, 'keyup', keyboardEventOptions);
        await forceUpdate(el);

        strictEqual(t.elem.value, e1, `New focused date not matched (${t.elem.value})`);

        const btnCalendarSelectorEl = t.getBtnCalendarSelector();
        isNotNull(btnCalendarSelectorEl, `Calendar selector not found`);

        const btnCalendarSelectorLabel = getShadowInnerHTML(btnCalendarSelectorEl);
        strictEqual(
          btnCalendarSelectorLabel,
          e2,
          `Updated calendar selector label not matched (${btnCalendarSelectorLabel})`);

        const newFocusedDateLabelEl = t.getDatepickerBodyCalendarViewDayFocusedDiv();
        isNotNull(newFocusedDateLabelEl, `New focused date not found`);

        const newFocusedDateLabel = getShadowInnerHTML(newFocusedDateLabelEl!);
        strictEqual(
          newFocusedDateLabel,
          e3,
          `New focused label not matched (${newFocusedDateLabel})`);
      }
    });

    it(`focuses date by keyboard (Home)`, async () => {
      el.min = date13;
      el.value = date17;
      await forceUpdate(el);

      const datepickerBodyCalendarViewEl = t.getDatepickerBodyCalendarView();
      isNotNull(datepickerBodyCalendarViewEl, `Calendar view not found`);

      const keyboardEventOptions: KeyboardEventOptions = {
        keyCode: KEYCODES_MAP.HOME,
      };
      triggerEvent(datepickerBodyCalendarViewEl, 'keyup', keyboardEventOptions);
      await forceUpdate(el);

      strictEqual(t.elem.value, '2020-01-13', `New focused date not matched (${t.elem.value})`);

      const btnCalendarSelectorEl = t.getBtnCalendarSelector();
      isNotNull(btnCalendarSelectorEl, `Calendar selector not found`);

      const btnCalendarSelectorLabel = getShadowInnerHTML(btnCalendarSelectorEl);
      strictEqual(
        btnCalendarSelectorLabel,
        `Mon, Jan 13`,
        `Updated calendar selector label not matched (${btnCalendarSelectorLabel})`);

      const newFocusedDateLabelEl = t.getDatepickerBodyCalendarViewDayFocusedDiv();
      isNotNull(newFocusedDateLabelEl, `New focused date not found`);

      const newFocusedDateLabel = getShadowInnerHTML(newFocusedDateLabelEl!);
      strictEqual(
        newFocusedDateLabel,
        '13',
        `New focused label not matched (${newFocusedDateLabel})`);
    });

    it(`focuses date by keyboard (Home + first focusable date/ disabled date)`, async () => {
      el.min = date13;
      await forceUpdate(el);

      const tasks = [
        async () => {
          el.value = date13;
          await forceUpdate(el);
          return {
            id: 0,
            e: '2020-01-13',
            e1: '2020-01-13',
            e2: 'Mon, Jan 13',
            e3: '13',
          };
        },
        async () => {
          el.value = '2020-01-20';
          el.disabledDates = '2020-01-13';
          await forceUpdate(el);
          return {
            id: 1,
            e: '2020-01-13',
            e1: '2020-01-14',
            e2: 'Tue, Jan 14',
            e3: '14',
          };
        },
      ];

      for (const fn of tasks) {
        const { id, e, e1, e2, e3 } = await fn();
        if (!id) {
          strictEqual(el.value, e, `'value' not updated (${el.value})`);
          strictEqual(t.elem.value, e, `'value' not updated (${t.elem.value})`);
        }
        if (id === 1) strictEqual(el.disabledDates, e, `'disabledDates' not updated`);

        const datepickerBodyCalendarViewEl = t.getDatepickerBodyCalendarView();
        isNotNull(datepickerBodyCalendarViewEl, `Calendar view not found`);

        const keyboardEventOptions: KeyboardEventOptions = {
          keyCode: KEYCODES_MAP.HOME,
        };
        triggerEvent(datepickerBodyCalendarViewEl, 'keyup', keyboardEventOptions);
        await forceUpdate(el);

        strictEqual(t.elem.value, e1, `New focused date not matched (${t.elem.value})`);

        const btnCalendarSelectorEl = t.getBtnCalendarSelector();
        isNotNull(btnCalendarSelectorEl, `Calendar selector not found`);

        const btnCalendarSelectorLabel = getShadowInnerHTML(btnCalendarSelectorEl);
        strictEqual(
          btnCalendarSelectorLabel,
          e2,
          `Updated calendar selector label not matched (${btnCalendarSelectorLabel})`);

        const newFocusedDateLabelEl = t.getDatepickerBodyCalendarViewDayFocusedDiv();
        isNotNull(newFocusedDateLabelEl, `New focused date not found`);

        const newFocusedDateLabel = getShadowInnerHTML(newFocusedDateLabelEl!);
        strictEqual(
          newFocusedDateLabel,
          e3,
          `New focused label not matched (${newFocusedDateLabel})`);
      }
    });

    it(`focuses date by keyboard (End)`, async () => {
      el.max = '2020-01-22';
      el.value = date13;
      await forceUpdate(el);

      const datepickerBodyCalendarViewEl = t.getDatepickerBodyCalendarView();
      isNotNull(datepickerBodyCalendarViewEl, `Calendar view not found`);

      const keyboardEventOptions: KeyboardEventOptions = {
        keyCode: KEYCODES_MAP.END,
      };
      triggerEvent(datepickerBodyCalendarViewEl, 'keyup', keyboardEventOptions);
      await forceUpdate(el);

      strictEqual(t.elem.value, '2020-01-22', `New focused date not matched (${t.elem.value})`);

      const btnCalendarSelectorEl = t.getBtnCalendarSelector();
      isNotNull(btnCalendarSelectorEl, `Calendar selector not found`);

      const btnCalendarSelectorLabel = getShadowInnerHTML(btnCalendarSelectorEl);
      strictEqual(
        btnCalendarSelectorLabel,
        `Wed, Jan 22`,
        `Updated calendar selector label not matched (${btnCalendarSelectorLabel})`);

      const newFocusedDateLabelEl = t.getDatepickerBodyCalendarViewDayFocusedDiv();
      isNotNull(newFocusedDateLabelEl, `New focused date not found`);

      const newFocusedDateLabel = getShadowInnerHTML(newFocusedDateLabelEl!);
      strictEqual(
        newFocusedDateLabel,
        '22',
        `New focused label not matched (${newFocusedDateLabel})`);
    });

    it(`focuses date by keyboard (End + last focusable date/ disabled date)`, async () => {
      el.max = '2020-01-22';
      await forceUpdate(el);

      const tasks = [
        async () => {
          el.value = '2020-01-22';
          await forceUpdate(el);
          return {
            id: 0,
            e: '2020-01-22',
            e1: '2020-01-22',
            e2: 'Wed, Jan 22',
            e3: '22',
          };
        },
        async () => {
          el.value = date15;
          el.disabledDates = '2020-01-22';
          await forceUpdate(el);
          return {
            id: 1,
            e: '2020-01-22',
            e1: '2020-01-21',
            e2: 'Tue, Jan 21',
            e3: '21',
          };
        },
      ];

      for (const fn of tasks) {
        const { id, e, e1, e2, e3 } = await fn();
        if (!id) {
          strictEqual(el.value, e, `'value' not updated (${el.value})`);
          strictEqual(t.elem.value, e, `'value' not updated (${t.elem.value})`);
        }
        if (id === 1) strictEqual(el.disabledDates, e, `'disabledDates' not updated`);

        const datepickerBodyCalendarViewEl = t.getDatepickerBodyCalendarView();
        isNotNull(datepickerBodyCalendarViewEl, `Calendar view not found`);

        const keyboardEventOptions: KeyboardEventOptions = {
          keyCode: KEYCODES_MAP.END,
        };
        triggerEvent(datepickerBodyCalendarViewEl, 'keyup', keyboardEventOptions);
        await forceUpdate(el);

        strictEqual(t.elem.value, e1, `New focused date not matched (${t.elem.value})`);

        const btnCalendarSelectorEl = t.getBtnCalendarSelector();
        isNotNull(btnCalendarSelectorEl, `Calendar selector not found`);

        const btnCalendarSelectorLabel = getShadowInnerHTML(btnCalendarSelectorEl);
        strictEqual(
          btnCalendarSelectorLabel,
          e2,
          `Updated calendar selector label not matched (${btnCalendarSelectorLabel})`);

        const newFocusedDateLabelEl = t.getDatepickerBodyCalendarViewDayFocusedDiv();
        isNotNull(newFocusedDateLabelEl, `New focused date not found`);

        const newFocusedDateLabel = getShadowInnerHTML(newFocusedDateLabelEl!);
        strictEqual(
          newFocusedDateLabel,
          e3,
          `New focused label not matched (${newFocusedDateLabel})`);
      }
    });

    it(`updates datepicker by keyboard (Enter)`, async () => {
      el.min = date13;
      el.value = '2020-01-22';
      await forceUpdate(el);

      const datepickerBodyCalendarViewEl = t.getDatepickerBodyCalendarView();
      isNotNull(datepickerBodyCalendarViewEl, `Calendar view not found`);

      triggerEvent(
        datepickerBodyCalendarViewEl, 'keyup', { keyCode: KEYCODES_MAP.ARROW_LEFT });
      await forceUpdate(el);

      strictEqual(
        t.elem.value, '2020-01-21', `New focused date not updated (${t.elem.value})`);

      const valueMatchedFromEvent = runTestOnDialogClosed((ev) => {
        const { opened, value } = ev.detail;

        strictEqual(value, '2020-01-21', `Updated value from event not matched (${value})`);
        strictEqual(
          el.value,
          '2020-01-21',
          `Datepicker dialog's 'value' not updated (${el.value})`);
        strictEqual(
          t.elem.value,
          '2020-01-21',
          `Datepicker dialog's 'value' not updated (${t.elem.value})`);
        isTrue(!opened, `Datepicker dialog's should be closed`);
        isTrue(
          'none' === getComputedStylePropertyValue(el, 'display'),
          `Datepicker dialog's 'display' should set to 'none'`);
        isTrue(
          el.hasAttribute('aria-hidden'),
          `Datepicker dialog's has to be closed after new date selection`);
      });

      triggerEvent(datepickerBodyCalendarViewEl, 'keyup', { keyCode: KEYCODES_MAP.ENTER });
      await forceUpdate(el);
      await valueMatchedFromEvent;
    });

    it(`updates datepicker by keyboard (Space)`, async () => {
      el.min = date13;
      el.value = '2020-01-22';
      await forceUpdate(el);

      const datepickerBodyCalendarViewEl = t.getDatepickerBodyCalendarView();
      isNotNull(datepickerBodyCalendarViewEl, `Calendar view not found`);

      triggerEvent(
        datepickerBodyCalendarViewEl, 'keyup', { keyCode: KEYCODES_MAP.ARROW_LEFT });
      await forceUpdate(el);

      strictEqual(
        t.elem.value, '2020-01-21', `New focused date not updated (${t.elem.value})`);

      const valueMatchedFromEvent = runTestOnDialogClosed((ev) => {
        const { opened, value } = ev.detail;

        strictEqual(value, '2020-01-21', `Updated value from event not matched (${value})`);
        strictEqual(
          el.value,
          '2020-01-21',
          `Datepicker dialog's 'value' not updated (${el.value})`);
        strictEqual(
          t.elem.value,
          '2020-01-21',
          `Datepicker dialog's 'value' not updated (${t.elem.value})`);
        isTrue(!opened, `Datepicker dialog's should be closed`);
        isTrue(
          'none' === getComputedStylePropertyValue(el, 'display'),
          `Datepicker dialog's 'display' should set to 'none'`);
        isTrue(
          el.hasAttribute('aria-hidden'),
          `Datepicker dialog's has to be closed after new date selection`);
      });

      triggerEvent(datepickerBodyCalendarViewEl, 'keyup', { keyCode: KEYCODES_MAP.SPACE });
      await forceUpdate(el);
      await valueMatchedFromEvent;
    });

    it(`closes datepicker dialog by keyboard (Escape)`, async () => {
      el.min = date13;
      el.value = '2020-01-22';
      await forceUpdate(el);

      const datepickerBodyCalendarViewEl = t.getDatepickerBodyCalendarView();
      isNotNull(datepickerBodyCalendarViewEl, `Calendar view not found`);

      triggerEvent(
        datepickerBodyCalendarViewEl, 'keyup', { keyCode: KEYCODES_MAP.ARROW_LEFT });
      await forceUpdate(el);

      strictEqual(
        t.elem.value, '2020-01-21', `New focused date not updated (${t.elem.value})`);

      const valueMatchedFromEvent = runTestOnDialogClosed((ev) => {
        const { opened, value } = ev.detail;
        const expectedValue = '2020-01-22';

        strictEqual(value, expectedValue, `Updated value from event not matched (${value})`);
        strictEqual(
          el.value,
          expectedValue,
          `Datepicker dialog's 'value' not updated (${el.value})`);
        strictEqual(
          t.elem.value,
          '2020-01-21',
          `Datepicker dialog's 'value' not updated (${t.elem.value})`);
        isTrue(!opened, `Datepicker dialog's should be closed`);
        isTrue(
          'none' === getComputedStylePropertyValue(el, 'display'),
          `Datepicker dialog's 'display' should set to 'none'`);
        isTrue(
          el.hasAttribute('aria-hidden'),
          `Datepicker dialog's has to be closed after new date selection`);
      });

      const dialogDismissActionButton = t.getDialogDismissActionButton();
      isNotNull(dialogDismissActionButton, `Dialog dismiss action button not found`);

      /**
       * NOTE: Keyboard events triggers `click` event on native HTML buttons.
       */
      triggerEvent(dialogDismissActionButton, 'click');
      await forceUpdate(el);
      await valueMatchedFromEvent;
      await forceUpdate(el);
    });

    it(`updates datepicker by triggering confirm button (Enter/ Space)`, async () => {
      el.min = date13;
      el.value = '2020-01-22';
      await forceUpdate(el);

      const datepickerBodyCalendarViewEl = t.getDatepickerBodyCalendarView();
      isNotNull(datepickerBodyCalendarViewEl, `Calendar view not found`);

      triggerEvent(
        datepickerBodyCalendarViewEl, 'keyup', { keyCode: KEYCODES_MAP.ARROW_LEFT });
      await forceUpdate(el);

      strictEqual(
        t.elem.value, '2020-01-21', `New focused date not updated (${t.elem.value})`);

      const valueMatchedFromEvent = runTestOnDialogClosed((ev) => {
        const { opened, value } = (ev as CustomEvent).detail;
        const expectedValue = '2020-01-21';

        strictEqual(value, expectedValue, `Updated value from event not matched (${value})`);
        strictEqual(
          el.value,
          expectedValue,
          `Datepicker dialog's 'value' not updated (${el.value})`);
        strictEqual(
          t.elem.value,
          expectedValue,
          `Datepicker dialog's 'value' not updated (${t.elem.value})`);
        isTrue(!opened, `Datepicker dialog's should be closed`);
        isTrue(
          'none' === getComputedStylePropertyValue(el, 'display'),
          `Datepicker dialog's 'display' should set to 'none'`);
        isTrue(
          el.hasAttribute('aria-hidden'),
          `Datepicker dialog's has to be closed after new date selection`);
      });

      const dialogConfirmActionButton = t.getDialogConfirmActionButton();
      isNotNull(dialogConfirmActionButton, `Dialog confirm action button not found`);

      /**
       * NOTE: Keyboard events triggers `click` event on native HTML buttons.
       */
      triggerEvent(dialogConfirmActionButton, 'click');
      await forceUpdate(el);
      await valueMatchedFromEvent;
    });

    it(`does not update datepicker by triggering dismiss button (Enter/ Space)`, async () => {
      el.min = date13;
      el.value = '2020-01-22';
      await forceUpdate(el);

      const datepickerBodyCalendarViewEl = t.getDatepickerBodyCalendarView();
      isNotNull(datepickerBodyCalendarViewEl, `Calendar view not found`);

      triggerEvent(
        datepickerBodyCalendarViewEl, 'keyup', { keyCode: KEYCODES_MAP.ARROW_LEFT });
      await forceUpdate(el);

      strictEqual(
        t.elem.value, '2020-01-21', `New focused date not updated (${t.elem.value})`);

      const valueMatchedFromEvent = runTestOnDialogClosed((ev) => {
        const { opened, value } = ev.detail;
        const expectedValue = '2020-01-22';

        strictEqual(value, expectedValue, `Updated value from event not matched (${value})`);
        strictEqual(
          el.value,
          expectedValue,
          `Datepicker dialog's 'value' not updated (${el.value})`);
        strictEqual(
          t.elem.value,
          '2020-01-21',
          `Datepicker dialog's 'value' not updated (${t.elem.value})`);
        isTrue(!opened, `Datepicker dialog's should be closed`);
        isTrue(
          'none' === getComputedStylePropertyValue(el, 'display'),
          `Datepicker dialog's 'display' should set to 'none'`);
        isTrue(
          el.hasAttribute('aria-hidden'),
          `Datepicker dialog's has to be closed after new date selection`);
      });

      const dialogDismissActionButton = t.getDialogDismissActionButton();
      isNotNull(dialogDismissActionButton, `Dialog dismiss action button not found`);

      /**
       * NOTE: Keyboard events triggers `click` event on native HTML buttons.
       */
      triggerEvent(dialogDismissActionButton, 'click');
      await forceUpdate(el);
      await valueMatchedFromEvent;
    });

    it(`updates datepicker with previously selected date by reopening datepicker dialog`,
    async () => {
      el.min = date13;
      el.value = '2020-01-22';
      await forceUpdate(el);

      const datepickerBodyCalendarViewEl = t.getDatepickerBodyCalendarView();
      isNotNull(datepickerBodyCalendarViewEl, `Calendar view not found`);

      triggerEvent(
        datepickerBodyCalendarViewEl, 'keyup', { keyCode: KEYCODES_MAP.ARROW_LEFT });
      await forceUpdate(el);

      strictEqual(
        t.elem.value, '2020-01-21', `New focused date not updated (${t.elem.value})`);

      const valueMatchedFromEvent = runTestOnDialogClosed((ev) => {
        const { opened, value } = ev.detail;
        const expectedValue = '2020-01-22';

        strictEqual(value, expectedValue, `Updated value from event not matched (${value})`);
        strictEqual(
          el.value,
          expectedValue,
          `Datepicker dialog's 'value' not updated (${el.value})`);
        strictEqual(
          t.elem.value,
          '2020-01-21',
          `Datepicker dialog's 'value' not updated (${t.elem.value})`);
        isTrue(!opened, `Datepicker dialog's should be closed`);
        isTrue(
          'none' === getComputedStylePropertyValue(el, 'display'),
          `Datepicker dialog's 'display' should set to 'none'`);
        isTrue(
          el.hasAttribute('aria-hidden'),
          `Datepicker dialog's has to be closed after new date selection`);
      });

      const dialogDismissActionButton = t.getDialogDismissActionButton();
      isNotNull(dialogDismissActionButton, `Dialog dismiss action button not found`);

      /**
       * NOTE: Keyboard events triggers `click` event on native HTML buttons.
       */
      triggerEvent(dialogDismissActionButton, 'click');
      await forceUpdate(el);
      await valueMatchedFromEvent;
      await forceUpdate(el);

      el.open();
      await forceUpdate(el);

      strictEqual(
        t.elem.value,
        '2020-01-21',
        `Previously selected date not matched (${t.elem.value})`);

      const dialogConfirmActionButton = t.getDialogConfirmActionButton();
      isNotNull(dialogConfirmActionButton, `Dialog confirm button not found`);

      const updateValueFromEvent = runTestOnDialogClosed((ev) => {
        const { opened, value } = ev.detail;
        const expectedValue = '2020-01-21';

        strictEqual(value, expectedValue, `Updated value from event not matched (${value})`);
        strictEqual(
          el.value,
          expectedValue,
          `Datepicker dialog's 'value' not updated (${el.value})`);
        strictEqual(
          t.elem.value,
          expectedValue,
          `Datepicker dialog's 'value' not updated (${t.elem.value})`);
        isTrue(!opened, `Datepicker dialog's should be closed`);
        isTrue(
          'none' === getComputedStylePropertyValue(el, 'display'),
          `Datepicker dialog's 'display' should set to 'none'`);
        isTrue(
          el.hasAttribute('aria-hidden'),
          `Datepicker dialog's has to be closed after new date selection`);
      });
      /**
       * NOTE: Keyboard events triggers `click` event on native HTML buttons.
       */
      triggerEvent(dialogConfirmActionButton, 'click');
      await forceUpdate(el);
      await updateValueFromEvent;
    });

  });

});