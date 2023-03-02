/**
 * rotation_utils.ts
 * - 이곳의 함수들은 주로 로테이션 관련 기능에 필요한 Date관련 핸들링에 필요한 함수들이다.
 * - 캘린더에서 Date객체를 사용하는 경우가 종종 있어서, 입력을 Date객체를 받도록 했다.
 */
export const MILLISEC_IN_SEC = 1000;
export const SEC_IN_MIN = 60;
export const MIN_IN_HOUR = 60;
export const MILLISEC_IN_MIN = SEC_IN_MIN * MILLISEC_IN_SEC;
export const MILLISEC_IN_HOUR = MIN_IN_HOUR * MILLISEC_IN_MIN;
export const KST_OFFSET = 9;

export const MONTH_IN_YEAR = 12;
export const DAY_IN_WEEK = 7;

export const getKoreaDate = (date = new Date()) => {
  const utc = date.getTime() + date.getTimezoneOffset() * MILLISEC_IN_MIN;
  const KR_TIME_DIFF = KST_OFFSET * MILLISEC_IN_HOUR;
  const koreaDate = new Date(utc + KR_TIME_DIFF);
  return koreaDate;
};
export const isWeekend = (day: Date | number) =>
  typeof day === 'number' ? (day % DAY_IN_WEEK) % 6 === 0 : day.getDay() % 6 === 0;

/**
 * get...DateOfMonth: 특정달의 첫날 || 마지막날 리턴
 * getDaysInMonth: 특정달의 일수 리턴 (e.g. 1월: 31일, 2월은 28일(2024년도엔 29일))
 * getFirstDayOfMonth: 특정달의 첫날의 day값 리턴 (e.g. 2023년 3월 => 3(수요일을 의미))
 * createWeekdays...: 특정달의 평일로만 이루어진 배열 || 오브젝트 생성하여 리턴.
 */
export const getFirstDateOfMonth = (date: Date, offsetMonth = 0) =>
  new Date(date.getFullYear(), date.getMonth() + offsetMonth, 1);
export const getLastDateOfMonth = (date: Date, offsetMonth = 0) =>
  new Date(date.getFullYear(), date.getMonth() + 1 + offsetMonth, 0);

export const getDaysInMonth = (date: Date, offsetMonth = 0) => getLastDateOfMonth(date, offsetMonth).getDate();
export const getFirstDayOfMonth = (date: Date, offsetMonth = 0) => getFirstDateOfMonth(date, offsetMonth).getDay();

export const createWeekdaysArray = (firstDayOfMonth: number, daysInMonth: number) =>
  Array.from({ length: daysInMonth }, (_, idx) => idx + 1).filter((date) => !isWeekend(firstDayOfMonth + date - 1));
export const createWeekdaysObject = (firstDayOfMonth: number, daysInMonth: number, initialValue = false) =>
  Object.fromEntries(createWeekdaysArray(firstDayOfMonth, daysInMonth).map((date) => [date, initialValue]));

export const getWeekNumber = (dateFrom = new Date()) => {
  // 해당 날짜 (일)
  const currentDate = dateFrom.getDate();

  // 이번 달 1일로 지정
  const startOfMonth = new Date(dateFrom.setDate(1));

  // 이번 달 1일이 무슨 요일인지 확인
  const weekDay = startOfMonth.getDay(); // 0: Sun ~ 6: Sat

  // ((요일 - 1) + 해당 날짜) / 7일로 나누기 = N 주차
  return Math.floor((weekDay - 1 + currentDate) / DAY_IN_WEEK) + 1;
};
