import React, { useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import loadable from '@loadable/component';
import '@css/fonts.scss';
import Header from '@utils/Header';
import Navbar from '@utils/Navbar';
import { clearToken } from '@cert/TokenStorage';

const Main = loadable(() => import('@main/index'));
const Auth = loadable(() => import('@auth/index'));
const Review = loadable(() => import('@review/index'));
const Result = loadable(() => import('@result/index'));

const App = () => {
  // 22.06.15일 이후에 반드시 삭제!
  useEffect(() => {
    clearToken();
  }, []);

  return (
    <RecoilRoot>
      <Router basename={process.env.NODE_ENV === 'production' ? 'frontend' : ''}>
        <Header />
        <Navbar />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/result" element={<Result />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/review" element={<Review />} />
        </Routes>
      </Router>
    </RecoilRoot>
  );
};

export default App;
