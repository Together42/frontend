import getAddress from '@globalObj/function/getAddress';
import React from 'react';
import axios from 'axios';

let eventGuid = 0;
let todayStr = new Date().toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today

export function createEventId() {
  return String(eventGuid++);
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
      const rotated = rotatedArr(data);
      rotationArr = rotated;
    })
    .catch((err) => console.log(err));
  return rotationArr;
}
