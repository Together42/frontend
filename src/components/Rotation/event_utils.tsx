import { getAuth } from '@cert/AuthStorage';
import apiClient from '@service/apiClient';
import errorAlert from '@globalObj/function/errorAlert';

let eventGuid = 0;

export function createEventId() {
  return String(eventGuid++);
}

function rotatedArrAllInfo(data) {
  const intraId = getAuth() ? getAuth().id : null;
  return data
    .filter((el) => !!el.year && !!el.month && !!el.day)
    .map((el) => ({
      title: el.intraId,
      start: `${el.year}-${String(el.month).padStart(2, '0')}-${String(el.day).padStart(2, '0')}`,
      color: intraId === el.intraId ? '#e79f5a' : '#4992ce',
    }));
}

// DB 내 전체 로테이션 반환
export async function getRotationArr() {
  let rotationArr = [];
  await apiClient
    .get(`/rotations/`)
    .then((res) => {
      const data = res.data;
      rotationArr = rotatedArrAllInfo(data);
    })
    .catch((err) => {
      errorAlert(err);
    });
  return rotationArr;
}

// month와 year에 해당하는 로테이션 반환
export async function getRotationMonthArr(month, year) {
  let rotationArr = [];
  await apiClient
    .get(`/rotations/`, {
      params: { month: month, year: year },
    })
    .then((res) => {
      const data = res.data;
      rotationArr = rotatedArrAllInfo(data);
    })
    .catch((err) => {
      errorAlert(err);
    });
  return rotationArr;
}
