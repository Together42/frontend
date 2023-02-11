import getAddress from '@globalObj/function/getAddress';
import axios from 'axios';

let eventGuid = 0;
let todayStr = new Date().toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today

export function createEventId() {
  return String(eventGuid++);
}

function rotatedArrAllInfo(data) {
  const rotatedArr = [];
  let newdata = data.filter((e) => {
    return e.attendDate !== undefined && e.attendDate !== null;
  });
  newdata.map((e) => {
    e.attendDate = e.attendDate.split(',');
  });

  newdata.map((e) => {
    e.attendDate.map((attendDate) => {
      rotatedArr.push({ title: e.intraId, start: attendDate });
    });
  });
  return rotatedArr;
}

function rotatedArr(data) {
  const rotatedArr = [];
  data.map((e) => {
    e.date.map((date) => {
      rotatedArr.push({ title: e.intraId, start: date });
    });
  });
  return rotatedArr;
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