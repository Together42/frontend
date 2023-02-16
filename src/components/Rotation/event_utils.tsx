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
  try {
    const res = await axios.get(`${getAddress()}/api/rotation`);
    const data = await res.data;
    rotationArr = rotatedArrAllInfo(data);
  } catch (error) {
    console.log(error);
  }
  return rotationArr;
}

export async function getRotationMonthArr(month, year) {
  let rotationArr = [];
  try {
    const res = await axios.get(`${getAddress()}/api/rotation`, {params: {month: month, year: year}});
    const data = await res.data;
    rotationArr = rotatedArr(data);
  } catch (error) {
    console.log(error);
  }
  return rotatedArr;
}
