import React, { useEffect, useState } from 'react';
import { getAuth } from '@cert/AuthStorage';
import Calendar from 'react-calendar';
import getAddress from '@globalObj/function/getAddress';
import axios from 'axios';
import { getToken } from '@cert/TokenStorage';
import errorAlert from '@globalObj/function/errorAlert';
import { useSWRConfig } from 'swr';
import 'react-calendar/dist/Calendar.css';
import '@css/Rotation/New_Rotation.scss';
import {
  createWeekdaysObject,
  getKoreaDate,
  getFirstDateOfMonth,
  getLastDateOfMonth,
  getDaysInMonth,
  getFirstDayOfMonth,
  isWeekend,
  MONTH_IN_YEAR,
  getFourthWeekPeriod,
  getNextAttendPeriodString,
  getNextAttendPeriodStrFunction,
} from './rotation_utils';

const DEFAULT_CALENDAR_TYPE = 'US';

/**
 * Type 관련 조언 by youkim
 */
type Tile = { date: Date; view: unknown };
type TileRule = (tile: Tile) => boolean;

/**
 * 사서 로테이션 신청은 특정 기간에 다음달에 대한것
 * - import 해온 util 함수들을 활용하여
 * - 입력으로 받은 date에 대해서 해당 월이 아닌 다음달에 대한 정보를 얻는다.
 */
const getFirstDayOfNextMonth = (date: Date) => getFirstDayOfMonth(date, 1);
const getDaysInNextMonth = (date: Date) => getDaysInMonth(date, 1);
const getFirstDateOfNextMonth = (date: Date) => getFirstDateOfMonth(date, 1);
const getLastDateOfNextMonth = (date: Date) => getLastDateOfMonth(date, 1);

/**
 * 입력으로 받은 현재 시간 정보가 담긴 curr에 대해서 필요한 동작을 수행한다.
 * 사서 로테이션 신청은 특정 기간에 다음달에 대한것이여서 NextMonth에 대한 함수들을 사용한다.
 * - createInitialObject: 평일에 대해 date값을 키로, 값은 false로 초기화된 오브젝트 생성
 * - getActiveStartDate: 달력 시작날짜를 다음달 1일로
 * - setLimit...: 달력을 클릭할 수 있는 날짜를 다음달 1일 ~ 말일 까지
 */
const createInitialObject = (curr: Date) =>
  createWeekdaysObject(getFirstDayOfNextMonth(curr), getDaysInNextMonth(curr));
const getActiveStartDate = getFirstDateOfNextMonth;
const setLimitMinDate = getFirstDateOfNextMonth;
const setLimitMaxDate = getLastDateOfNextMonth;

/**
 * 달력의 클릭 disable 여부 결정하는 함수
 * - 1일 ~ 말일 제한은 minDate && maxDate 속성을 통해 이루어짐
 * - 현재는 주말의 경우만 룰로서 활용중
 * - 입력 ({ date, _view }
 * - 출력 boolean { date: Date; _view: any }) => isWeekend(date),
 */
const setTileDisabled =
  (fns: TileRule[]) =>
  ({ date, view }: Tile) =>
    fns.some((fn) => fn({ date, view }));

const rules = {
  weekdayOnly: ({ date, view: _view }) => isWeekend(date),
} as const satisfies Record<string, TileRule>;

/**
 * 전체 평일에 대해 선택여부 정보를 가진 record 오브젝트에서
 * 선택된 날짜들로만 이루어진 number[] 추출
 */
const createUnavailableDates = (record: Record<string, boolean>) =>
  Object.entries(record)
    .filter(([_, selected]) => selected)
    .map(([date_key, _]) => parseInt(date_key));

/**
 * 사서 로테이션 신청 기간: ISO기준 4주차 월요일 ~ 일요일
 */
const getRotationApplicationPeriod = getFourthWeekPeriod;

const calculateIsRotationApplicationPeriod = (curr: Date) => {
  const [startDate, endDate] = getRotationApplicationPeriod(curr);
  const todayDate = curr.getDate();
  return startDate <= todayDate && todayDate <= endDate;
};

const periodToString = getNextAttendPeriodStrFunction(getRotationApplicationPeriod);

export const Rotate = () => {
  const currentDate = new Date();
  // const currentDate = getKoreaDate(); //이것이 필요할까? 아직 잘 모르겠다.
  const initialRecord = createInitialObject(new Date(currentDate.setDate(26)));
  const year = currentDate.getFullYear();
  const month = ((currentDate.getMonth() + 1) % MONTH_IN_YEAR) + 1;
  const intraId = getAuth()?.id ?? null;
  const isRotationApplicationPeriod = calculateIsRotationApplicationPeriod(currentDate);
  const [value, onChange] = useState<null | Date>(null);
  const [record, setRecord] = useState({ ...initialRecord });
  const [unavailableDates, setUnavailableDates] = useState<number[]>([]);
  const [openSelectModal, setOpenSelectModal] = useState(false);

  const { mutate } = useSWRConfig();

  useEffect(() => {
    const d = value?.getDate();
    if (!!d && d in initialRecord) {
      // 초기값 && 애초에 넘어오면 안 되는 날짜 정보가 넘어오는것 방지
      setRecord((prev) => ({ ...prev, [d]: !prev[d] })); // 해당키에 하는 value만 반전
    }
  }, [value]);

  useEffect(() => {
    setUnavailableDates(createUnavailableDates(record));
  }, [record]);

  const onClickSetDateModal = () => {
    setOpenSelectModal((prev) => !prev);
  };

  const resetDates = () => {
    setRecord((_) => ({ ...initialRecord }));
  };

  const onClickPostEvent = () => {
    if (!isRotationApplicationPeriod || !calculateIsRotationApplicationPeriod(new Date())) {
      alert('신청기간이 아닙니다!');
      return;
    }
    if (getToken()) {
      axios
        .post(
          `${getAddress()}/api/rotation/attend`,
          {
            intraId: intraId,
            attendLimit: unavailableDates,
          },
          {
            headers: {
              Authorization: 'Bearer ' + getToken(),
            },
          },
        )
        .then((res) => {
          alert('신청되었습니다');
          mutate(`${getAddress()}/api/rotation/attend`);
        })
        .catch((err) => errorAlert(err));
    }
  };

  const onClickCancel = () => {
    if (!isRotationApplicationPeriod || !calculateIsRotationApplicationPeriod(new Date())) {
      alert('신청기간이 아닙니다!');
      return;
    }
    axios
      .delete(`${getAddress()}/api/rotation/attend`, {
        headers: {
          Authorization: 'Bearer ' + getToken(),
        },
        data: {
          intraId: intraId,
        },
      })
      .then(() => {
        alert('신청 취소되었습니다');
      })
      .catch((err) => errorAlert(err));
  };

  if (!isRotationApplicationPeriod) {
    return (
      <div className="rotation--wrapper">
        <div className="rotation--title">현재 사서 로테이션 신청기간이 아닙니다.</div>
        <div className="rotation--title">(다음 신청기간: {periodToString(currentDate)})</div>
      </div>
    );
  }
  return (
    <>
      <div className="rotation--wrapper">
        <div className="rotation--title">
          {intraId} 님, {year} {month}월 사서 로테이션에 참여하시나요 ?
        </div>
        <div className="rotation--title">(신청기간: {periodToString(currentDate)})</div>
        <div className="rotation--button">
          <div>
            <button onClick={onClickSetDateModal}>Yes!</button>
          </div>
          <div>
            <button onClick={onClickCancel}>신청 취소</button>
          </div>
        </div>
        {openSelectModal && (
          <div className="rotation--selectDates">
            <div className="rotation-selectDates-title">
              <p>참여가 어려운 날짜를 선택해주세요 !</p>
              <p>해당 날짜를 고려해서 랜덤 매칭이 이루어집니다</p>
              <p>(필수 사항은 아닙니다)</p>
            </div>
            <div>
              <Calendar
                calendarType={DEFAULT_CALENDAR_TYPE}
                activeStartDate={getActiveStartDate(currentDate)}
                minDate={setLimitMinDate(currentDate)}
                maxDate={setLimitMaxDate(currentDate)}
                tileDisabled={setTileDisabled([rules.weekdayOnly])}
                value={value}
                onClickDay={onChange}
              ></Calendar>
            </div>
            <div className="rotation--viewSelectDates">
              <div className="rotation-viewSelectDates-title">선택한 날짜</div>
              <div className="rotation--selectDates-box">
                {unavailableDates.map((e) => (
                  <span key={e}>{e} </span>
                ))}
              </div>
              <div className="rotation--reset">
                <button onClick={resetDates}>
                  <div>reset</div>
                </button>
              </div>
            </div>
            <button className="select-button" onClick={onClickPostEvent}>
              신청
            </button>
          </div>
        )}
      </div>
    </>
  );
};
