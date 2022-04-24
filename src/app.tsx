import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import loadable from '@loadable/component';
import '@css/fonts.scss';
import Header from '@utils/Header';
import Navbar from '@utils/Navbar';

const Main = loadable(() => import('@main/index'));
const Auth = loadable(() => import('@auth/index'));
const Review = loadable(() => import('@review/index'));

const App = () => {
  return (
    <RecoilRoot>
      <Router basename={process.env.NODE_ENV === 'production' ? 'Together42' : ''}>
        <Header />
        <Navbar />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/review" element={<Review />} />
        </Routes>
      </Router>
    </RecoilRoot>
  );
};

export default App;
