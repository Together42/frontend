import React, { useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import loadable from '@loadable/component';
import '@css/Rotation/Rotation.scss';
import Header from '@utils/Header';
import Navbar from '@utils/Navbar';
import MobileNavber from '@utils/MobileNavber';
import DeviceMode, { getDeviceMode } from '@recoil/DeviceMode';
import { CheckedUserList } from './Usercheckbox';
import { GetDateOnBusiness } from './DateInputbox';
import { Button } from './Button';
import { AsyncDependenciesBlock } from 'webpack';

export const Rotate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  return (
    <div className="rotation--wrapper">
      <div className="rotation--title">
        📚 {year} {month} 월의 사서 로테이션 📚
      </div>
      <div className="rotation--selectUser">
        <div className="rotation--selectUserTitle">사서를 선택해주세요</div>
        <div className="rotation--checkedUserListBox">
          <CheckedUserList />
        </div>
      </div>
      <div className="rotation--selectDates">
        <div className="rotation--selectDatesTitle">주차별 영업일을 입력해주세요</div>
        <div>
          <GetDateOnBusiness />
        </div>
      </div>
      <div className="rotation--postbutton">
        <Button />
      </div>
    </div>
  );
};
