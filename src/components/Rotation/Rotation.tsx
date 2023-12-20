import React, { useEffect, useState, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDecodedToken } from '@cert/TokenStorage';
import Calendar, { CalendarTileProperties } from 'react-calendar';
import getAddress from '@globalObj/function/getAddress';
import { getToken } from '@cert/TokenStorage';
import errorAlert from '@globalObj/function/errorAlert';
import { useSWRConfig } from 'swr';
import 'react-calendar/dist/Calendar.css';
import '@css/Rotation/New_Rotation.scss';
import {
  createWeekdaysObject,
  getFirstDateOfMonth,
  getLastDateOfMonth,
  getDaysInMonth,
  getFirstDayOfMonth,
  isWeekend,
  isSunday,
  MONTH_IN_YEAR,
  getFourthWeekFromMondayToFridayPeriod,
  getNextAttendPeriodStrFunction,
} from './rotation_utils';
import apiClient from '@service/apiClient';

const DEFAULT_CALENDAR_TYPE = 'US';

/**
 * Type 관련 조언 by youkim
 */
type Tile = { date: Date; view: unknown };
type TileRule = (tile: Tile) => boolean;
type DateCallback = (value: Date, event: MouseEvent<HTMLButtonElement>) => void; // react-calendar's
/*
 * [update 23.12.18]
 * - 4주차 로테이션 제한 삭제를 위해 주석 처리 후 수정
 */
// interface TitleBoxProps {
//   isRotationApplicationPeriod: boolean;
//   isSubmit: boolean;
//   intraId: string;
//   currentDate: Date;
// }
interface TitleBoxProps {
  isSubmit: boolean;
  intraId: string;
  currentDate: Date;
}

interface SelectDateBoxProps {
  isSubmit: boolean;
  currentDate: Date;
  handleOnClick: DateCallback;
  record: { [x: string]: boolean };
  resetDates: () => void;
  onClickCancel: () => void;
  onClickPostEvent: () => void;
}

interface OneTypeObject<T> {
  [key: string]: T;
}

type NumberKey = string | number;
type UpdateValueFunc<T> = (key: NumberKey, value: T, obj: OneTypeObject<T>) => T;
type UpdateObjectOneValueFunc<T> = (
  key: NumberKey,
  obj: OneTypeObject<T>,
  updateFunc: UpdateValueFunc<T>,
) => OneTypeObject<T>;

interface FrontendAttendLimitData {
  attendDate: string; // "2023-04-12,2023-04-27,2023-04-28,"
  attendLimit: number[]; // "[3,4,5,6,7,10,11,13,14,17,18,19,20,21,24,25,26]"
  id: number; // 102
  intraId: string; // "jim"
  isSet: number; // 1
}

interface BackendAttendLimitData {
  userId: number;
  intraId: string;
  year: number;
  month: number;
  attendLimit: number[]; // [1,2,3,4,5,6,7,8,9,10,11,12,13,14]
}

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
  exceptSunday: ({ date, view: _view }) => isSunday(date),
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
 * 사서 로테이션 신청 기간: ISO기준 4주차 월요일 ~ 금요일 (23.06.27 업데이트 이전 월요일 ~ 일요일)
 */
// const getRotationApplicationPeriod = getFourthWeekPeriod;
const getRotationApplicationPeriod = getFourthWeekFromMondayToFridayPeriod;

const calculateIsRotationApplicationPeriod = (curr: Date) => {
  const [startDate, endDate] = getRotationApplicationPeriod(curr);
  const todayDate = curr.getDate();
  return startDate <= todayDate && todayDate <= endDate;
};

const periodToString = getNextAttendPeriodStrFunction(getRotationApplicationPeriod);

/**
 * Axios 요청
 */
const getAttendLimit = async () => {
  const data: BackendAttendLimitData = await apiClient
    .get(`/rotations/attendance`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });

  const year = data.year;
  const month = data.month;
  const attendDate = JSON.stringify(
    data.attendLimit
      ?.map((day) => `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`)
      .join(','),
  );

  const newData: FrontendAttendLimitData = {
    id: data.userId,
    intraId: data.intraId,
    attendDate: attendDate,
    attendLimit: data.attendLimit,
    isSet: 1,
  };

  return newData;
};

/**
 *  updateRecord: Axios 요청을 통해 받은 attendLimit를 적용시킨 Record 반환
 */
const updateOneValue = <T,>(key: NumberKey, obj: OneTypeObject<T>, updateFunc: UpdateValueFunc<T>) => {
  if (key in obj) {
    obj[key] = updateFunc(key, obj[key], obj);
  }
  return obj;
};

const toggleValue: UpdateValueFunc<boolean> = (_key, value, _obj) => !value;

const updateRecord = (initialRecord: OneTypeObject<boolean>, attendLimit: number[]) =>
  attendLimit.reduce((record, date) => updateOneValue(date, record, toggleValue), { ...initialRecord });

/*
 * [update 23.12.18]
 * 4주차 로테이션 제한 삭제를 위해 주석 처리 후 수정
 */
// const TitleBox = ({ isRotationApplicationPeriod, isSubmit, intraId, currentDate }: TitleBoxProps) => {
//   const nextMonth = ((currentDate.getMonth() + 1) % MONTH_IN_YEAR) + 1;
//   const titleMessage = !isRotationApplicationPeriod
//     ? '현재 사서 로테이션 신청기간이 아닙니다.'
//     : isSubmit
//     ? `${intraId} 님, ${nextMonth}월 사서 로테이션 참여 감사합니다 😀`
//     : `${intraId} 님, ${nextMonth}월 사서 로테이션에 참여해주세요 !`;
//   const periodMessage = isRotationApplicationPeriod
//     ? `(신청기간: ${periodToString(currentDate)})`
//     : `(다음 신청기간: ${periodToString(currentDate)})`;
//   return (
//     <div className="rotation--title">
//       <p>{titleMessage}</p>
//       <p>{periodMessage}</p>
//     </div>
//   );
// };
const TitleBox = ({ isSubmit, intraId, currentDate }: TitleBoxProps) => {
  const nextMonth = ((currentDate.getMonth() + 1) % MONTH_IN_YEAR) + 1;
  const titleMessage = isSubmit
    ? `${intraId} 님, ${nextMonth}월 사서 로테이션 참여 감사합니다 😀`
    : `${intraId} 님, ${nextMonth}월 사서 로테이션에 참여해주세요 !`;
  return (
    <div className="rotation--title">
      <p>{titleMessage}</p>
    </div>
  );
};

/*
 * [update 23.12.18]
 * 4주차 로테이션 제한 삭제를 위해 주석 처리
 */
const SelectDateNoticeBox = ({ isSubmit }: { isSubmit: boolean }) => (
  <div className="rotation-selectDates-title">
    {isSubmit ? (
      <>
        {/* <p>신청기간내 로테이션 참여를 취소할 수 있습니다.</p> */}
        <p>(수정이 필요한 경우에는 취소후 재신청 !!!)</p>
      </>
    ) : (
      <>
        <p>참여가 어려운 날짜를 선택해주세요!</p>
        <p>해당 날짜를 고려해서 랜덤 매칭이 이루어집니다</p>
      </>
    )}
  </div>
);

const SelectDateBox = ({
  isSubmit,
  currentDate,
  handleOnClick,
  record,
  resetDates,
  onClickCancel,
  onClickPostEvent,
}: SelectDateBoxProps) => {
  const onClickDay = isSubmit ? undefined : handleOnClick; // 제출된 상태에서는 캘린더는 확인용
  /**
   * setTileClassName(): 각 Tile에 CSS로 적절한 배경색을 부여하는 코드
   * - disabled: (1일 ~ 말일 && 평일 && 기타 조건)에 해당하지 않는 날짜에 적용
   * - selectable: 제출 상태 && disabled가 아닌 날짜
   * - selected: 제출 단계 && 불가능한 날짜로 선택중
   * - attendLimited: 제출 상태 && 불가능한 날짜로 선택했었음
   */
  const setTileClassName = ({ activeStartDate, date, view }: CalendarTileProperties) => {
    const classNames: string[] = [];
    const nextMonth = currentDate.getMonth() + 2 > 12 ? 1 : currentDate.getMonth() + 2;
    const _currentDate = date.getDate();
    const _currentMonth = date.getMonth() + 1;
    if (nextMonth !== _currentMonth) {
      classNames.push('disabled');
      return classNames;
    }
    if (!isSubmit) {
      classNames.push('selectable');
    }
    if (isSubmit && record[_currentDate]) {
      classNames.push('attendLimited');
    }
    if (!isSubmit && record[_currentDate]) {
      classNames.push('selected');
    }
    return classNames;
  };

  return (
    <div className="rotation--selectDates">
      <SelectDateNoticeBox isSubmit={isSubmit} />
      <div>
        <Calendar
          calendarType={DEFAULT_CALENDAR_TYPE}
          activeStartDate={getActiveStartDate(currentDate)}
          minDate={setLimitMinDate(currentDate)}
          maxDate={setLimitMaxDate(currentDate)}
          tileDisabled={setTileDisabled([rules.weekdayOnly])}
          tileClassName={setTileClassName}
          onClickDay={onClickDay}
        ></Calendar>
      </div>
      <div className="rotation--viewSelectDates">
        {!isSubmit && (
          <div className="rotation--reset">
            <button onClick={resetDates}>reset</button>
          </div>
        )}
      </div>
      {isSubmit ? (
        <button className="select-button" onClick={onClickCancel}>
          신청 취소
        </button>
      ) : (
        <button className="select-button" onClick={onClickPostEvent}>
          신청
        </button>
      )}
    </div>
  );
};

export const Rotate = () => {
  const navigate = useNavigate();
  const currentDate = new Date();
  const initialRecord = createInitialObject(currentDate);
  const intraId = getDecodedToken()?.id ?? null;
  const isRotationApplicationPeriod = calculateIsRotationApplicationPeriod(currentDate);
  const [record, setRecord] = useState(() => ({ ...initialRecord }));
  const [isSubmit, setIsSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // pageReload 관련하여 추가, 아지 관련 기능 완전 업데이트 X
  const { mutate } = useSWRConfig();

  /**
   * axios 요청 단계에서 신청기간 여부를 한번더 체크하는 이유
   * - 신청 기간내 페이지 진입 후, 신청기간이 지날 수 있기때문
   * [update 23.12.18]
   * 4주차 로테이션 제한 삭제를 위해 주석 처리
   */
  // const checkIsPeriod = (alertMessage: string | null = '신청기간이 아닙니다!') => {
  //   if (!isRotationApplicationPeriod || !calculateIsRotationApplicationPeriod(new Date())) {
  //     if (alertMessage !== null) {
  //       alert(alertMessage);
  //     }
  //     return false;
  //   }
  //   return true;
  // };

  const checkTokenAndRedirect = (
    alertMessage: string | null = '토큰이 유효하지 않습니다! 로그인 페이지로 리다이렉트 됩니다.',
  ) => {
    if (getToken() === null) {
      if (alertMessage !== null) {
        alert(alertMessage);
      }
      navigate('/auth', { state: { from: { pathname: `/rotations` } } });
      return false;
    }
    return true;
  };

  const handleOnClick: DateCallback = (value, _) => {
    const date = value.getDate();
    if (date in initialRecord) {
      setRecord((prev) => ({ ...prev, [date]: !prev[date] }));
    }
  };

  const resetDates = () => setRecord({ ...initialRecord });

  const pageReload = () => {
    if (!isLoading) {
      window.location.reload();
      // 아래 코드는 추후 보완하여 업데이트
      // setRecord(() => ({ ...initialRecord }));
      // setIsSumbit(false);
      // setIsLoading(true);
    }
  };

  /*
   * [update 23.12.18]
   * 4주차 로테이션 제한 삭제를 위해 주석 처리 후 수정
   */
  const onClickPostEvent = async () => {
    // if (!checkIsPeriod() || !checkTokenAndRedirect()) {
    //   return;
    // }
    if (!checkTokenAndRedirect()) {
      return;
    }
    if (window.confirm('사서 로테이션 참석 신청하시겠습니까?')) {
      const attendDate = createUnavailableDates(record);
      apiClient
        .post('/rotations/attendance', {
          attendLimit: attendDate,
        })
        .then(() => {
          alert('성공적으로 신청되었습니다');
          mutate(`${getAddress()}/rotations/attendance`);
          pageReload();
        })
        .catch((err) => {
          errorAlert(err);
        });
    }
  };

  /*
   * [update 23.12.18]
   * 4주차 로테이션 제한 삭제를 위해 주석 처리 후 수정
   */
  const onClickCancel = async () => {
    // if (!checkIsPeriod() || !checkTokenAndRedirect()) {
    //   return;
    // }
    if (!checkTokenAndRedirect()) {
      return;
    }
    if (window.confirm('사서 로테이션 참석을 취소하시겠습니까?')) {
      await apiClient
        .delete(`/rotations/attendance`)
        .then(() => {
          alert('성공적으로 신청 취소되었습니다');
          mutate(`${getAddress()}/rotations/attendance`);
          setIsSubmit(false);
          pageReload();
        })
        .catch((err) => {
          errorAlert(err);
        });
    }
  };

  /**
   * fetchAttendLimit()
   * - 신청기간내, 로테이션 참석을 신청한 상태라면 정보를 받아와서 확인 가능
   * - attendLimitData: 로테이션 참석을 신청한 상태라면 [ AttendLimitData ] 형태
   * - attendLimit: "[1,2,3]" 배열이 문자열화 되어있으므로 JSON.parse로 파싱
   * - 로테이션 참석을 신청한 상태라면 attendLimit 셋하고, isSubmit을 true로 놓는다.
   * [update 23.12.12]
   * - attendLimitData를 단 하나의 객체가 들어있는 객체 배열 아닌, 단일 객체를 받아서 처리하는 것으로 가정.
   * - 따라서 반환값도 단일 객체가 된다.
   * [update 23.12.18]
   * - 4주차 로테이션 제한 삭제를 위해 주석 처리 후 수정
   */
  useEffect(() => {
    async function fetchAttendLimit(intraId: string, currDate: Date) {
      if (checkTokenAndRedirect(null) && intraId) {
        try {
          const attendLimitData = await getAttendLimit();
          const attendLimit = attendLimitData.attendLimit;
          setIsSubmit(false);
          setRecord(updateRecord(initialRecord, attendLimit));
        } catch (error) {
          setIsSubmit(false);
        }
      }
      setIsLoading(false);
    }
    if (isLoading) {
      fetchAttendLimit(intraId, currentDate);
    }
  }, [isLoading]);

  /*
   * [update 23.12.18]
   * - 4주차 로테이션 제한 삭제를 위해 주석 처리 후 수정
   */
  // return (
  //   <div className="rotation--wrapper">
  //     <TitleBox
  //       isRotationApplicationPeriod={isRotationApplicationPeriod}
  //       isSubmit={isSubmit}
  //       intraId={intraId}
  //       currentDate={currentDate}
  //     />
  //     {isRotationApplicationPeriod && (
  //       <SelectDateBox
  //         isSubmit={isSubmit}
  //         currentDate={currentDate}
  //         handleOnClick={handleOnClick}
  //         record={record}
  //         resetDates={resetDates}
  //         onClickCancel={onClickCancel}
  //         onClickPostEvent={onClickPostEvent}
  //       />
  //     )}
  //   </div>
  // );
  return (
    <div className="rotation--wrapper">
      <TitleBox isSubmit={isSubmit} intraId={intraId} currentDate={currentDate} />
      <SelectDateBox
        isSubmit={isSubmit}
        currentDate={currentDate}
        handleOnClick={handleOnClick}
        record={record}
        resetDates={resetDates}
        onClickCancel={onClickCancel}
        onClickPostEvent={onClickPostEvent}
      />
    </div>
  );
};
