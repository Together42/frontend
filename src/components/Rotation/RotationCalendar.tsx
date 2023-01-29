import React from 'react';
import '@css/Rotation/Rotation.scss';
import Calendar from './Calendar';

export const RotationCalendar = () => {
  return (
    <>
      <div className="rotation--wrapper">새로 일정 등록 시 꼭 로그인한 아이디로 생성해주세요! </div>
      <Calendar />
    </>
  );
};
