export const MILLISEC_IN_SEC = 1000;
export const SEC_IN_MIN = 60;
export const MIN_IN_HOUR = 60;
export const MILLISEC_IN_MIN = SEC_IN_MIN * MILLISEC_IN_SEC;
export const MILLISEC_IN_HOUR = MIN_IN_HOUR * MILLISEC_IN_MIN;
export const KST_OFFSET = 9;

export const getKoreaDate = (date: Date = new Date()) => {
  const utc = date.getTime() + date.getTimezoneOffset() * MILLISEC_IN_MIN;
  const KR_TIME_DIFF = KST_OFFSET * MILLISEC_IN_HOUR;
  const koreaDate = new Date(utc + KR_TIME_DIFF);
  return koreaDate;
};
export const isWeekend = (day: Date | number) =>
  typeof day === 'number' ? (day % 7) % 6 === 0 : day.getDay() % 6 === 0;
export const setLimitMinDate = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 1);
export const setLimitMaxDate = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 2, 0);

export const setTileDisabled =
  (fns: Function[]) =>
  ({ date, view }) =>
    fns.some((fn) => fn({ date, view }));
export const rules = {
  isWeekend: ({ date, _view }: { date: Date; _view: any }) => isWeekend(date.getDay()),
};
export const getDaysInMonth = (date: Date, offsetMonth = 0) =>
  new Date(date.getFullYear(), date.getMonth() + 1 + offsetMonth, 0).getDate();
export const getDaysInNextMonth = (date: Date) => getDaysInMonth(date, 1);
export const getFirstDayOfMonth = (date: Date, offsetMonth = 0) =>
  new Date(date.getFullYear(), date.getMonth() + 1 + offsetMonth, 0).getDay();
export const getFirstDayOfNextMonth = (date: Date) => getFirstDayOfMonth(date, 1);
export const getActiveStartDate = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 1);
export const createWeekdays = (firstDayOfMonth: number, daysInMonth: number) =>
  new Array(daysInMonth)
    .fill(null)
    .reduce((prev, _el, idx) => (isWeekend(firstDayOfMonth + (idx % 7)) ? prev : { ...prev, [idx + 1]: false }), {});
export const createInitialObject = (date: Date) =>
  createWeekdays(getFirstDayOfNextMonth(date), getDaysInNextMonth(date));
