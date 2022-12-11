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
const Result = loadable(() => import('@result/index'));
const Timeline = loadable(() => import('@timeline/index'));

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
    <Router basename={process.env.NODE_ENV === 'production' ? 'frontend' : ''}>
      <Header />
      {device === 'desktop' ? <Navbar /> : <MobileNavber />}
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/result" element={<Result />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/review/*" element={<Review />} />
        <Route path="/2022-timeline/" element={<Timeline />} />
      </Routes>
    </Router>
  );
};

export default App;
