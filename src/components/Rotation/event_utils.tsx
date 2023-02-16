import getAddress from '@globalObj/function/getAddress';
import axios from 'axios';
import { getAuth } from '@cert/AuthStorage';

let eventGuid = 0;
let todayStr = new Date().toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today

export function createEventId() {
  return String(eventGuid++);
}

function rotatedArrAllInfo(data) {
  const intraId = getAuth() ? getAuth().id : null;
  return data.filter(el => !!el.attendDate)
    .map(el => el.attendDate.split(',')
      .map(attendDate => ({
        title: el.intraId,
        start: attendDate,
        color: intraId == el.intraId ? '#e79f5a' : '#4992ce'
      }))).flat();

}

function rotatedArr(data) {
  return data.map(el => el.date.map(d => ({ title: el.intraId, start: d }))).flat();
}

export async function getRotationArr() {
  let rotationArr = [];
  await axios
    .get(`${getAddress()}/api/rotation`)
    .then((res) => res.data)
    .then((data) => {
      const rotated = rotatedArrAllInfo(data);
      rotationArr = rotated;
    })
    .catch((err) => console.log(err));
  return rotationArr;
}

export async function getRotationMonthArr(month, year) {
  let rotationArr = [];
  await axios
    .get(`${getAddress()}/api/rotation`, {
      params: {
        month: month,
        year: year,
      },
    })
    .then((res) => res.data)
    .then((data) => {
      const rotated = rotatedArr(data);
      rotationArr = rotated;
    })
    .catch((err) => console.log(err));
  return rotationArr;
}
