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
import { AsyncDependenciesBlock } from 'webpack';
import { useNavigate } from 'react-router';

export const Button = () => {
  const navigate = useNavigate();
  const onClickMode = () => {
    navigate('/rotation/result');
  };
  return <button onClick={onClickMode}>완료</button>;
};
