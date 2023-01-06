import React, { useState, useEffect } from 'react';
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
import { AsyncDependenciesBlock } from 'webpack';
import LoadingSpinner from './Loading';
import { RotateUserResult } from './RotateUserResult';

export const RotateResult = () => {
  const [Loading, setLoading] = useState(true);

  //여기서 async 로 결과 가져온다

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000),
      [];
  });

  return <div>{Loading ? <LoadingSpinner /> : <RotateUserResult />}</div>;
};
