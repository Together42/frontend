import getAddress from '@globalObj/function/getAddress';
import { getDecodedToken } from '@cert/TokenStorage';
import apiClient from '@service/apiClient';
import errorAlert from '@globalObj/function/errorAlert';

let eventGuid = 0;
let todayStr = new Date().toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today

export function createEventId() {
  return String(eventGuid++);
}

function rotatedArrAllInfo(data) {
  const intraId = getDecodedToken() ? getDecodedToken().id : null;
  return data
    .filter((el) => !!el.year && !!el.month && !!el.day)
    .map((el) => ({
      title: el.intraId,
      start: `${el.year}-${String(el.month).padStart(2, '0')}-${String(el.day).padStart(2, '0')}`,
      color: intraId === el.intraId ? '#e79f5a' : '#4992ce',
    }));
}

function rotatedArr(data) {
  return data.map((el) => ({
    title: el.intraId,
    start: `${el.year}-${el.month}-${el.day}`,
  }));
}

// 일단 다음 달 로테이션만 반환
export async function getRotationArr() {
  let rotationArr = [];
  apiClient
    .get(`/rotations/`)
    .then((res) => {
      const data = res.data;
      rotationArr = rotatedArr(data);
    })
    .catch((err) => {
      errorAlert(err);
    });
  return rotationArr;
}

export async function getRotationMonthArr(month, year) {
  let rotationArr = [];
  apiClient
    .get(`/rotations/`, {
      params: { month: month, year: year },
    })
    .then((res) => {
      const data = res.data;
      rotationArr = rotatedArr(data);
    })
    .catch((err) => {
      errorAlert(err);
    });
  return rotatedArr;
}
