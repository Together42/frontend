import React, { useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import loadable from '@loadable/component';
import '@css/fonts.scss';
import Header from '@utils/Header';
import Navbar from '@utils/Navbar';
import MobileNavber from '@utils/MobileNavber';
import DeviceMode, { getDeviceMode } from '@recoil/DeviceMode';

const Main = loadable(() => import('@main/index'));
const Auth = loadable(() => import('@auth/index'));
const Review = loadable(() => import('@review/routes'));
const EventLog = loadable(() => import('@main/Log'));
const Result = loadable(() => import('@result/index'));
const Timeline = loadable(() => import('@timeline/index'));
const Rotation = loadable(() => import('@rotation/routes'));

const App = () => {
  const setDeviceMode = useSetRecoilState(getDeviceMode);
  const device = useRecoilValue(DeviceMode);

  useEffect(() => {
    function handleSize() {
      setDeviceMode(window.innerWidth);
    }
    handleSize();
    window.addEventListener('resize', handleSize);
    return () => window.removeEventListener('resize', handleSize);
  }, [device, setDeviceMode]);

  return (
    <Router>
      <Header />
      {device === 'desktop' ? <Navbar /> : <MobileNavber />}
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/event/log" element={<EventLog />} />
        <Route path="/event/match" element={<Result />} />
        <Route path="/rotation/*" element={<Rotation />} />
        <Route path="/review/*" element={<Review />} />
        <Route path="/2022-timeline/" element={<Timeline />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </Router>
  );
};

export default App;
