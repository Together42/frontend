import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import loadable from '@loadable/component';

const Main = loadable(() => import('@main/'));

const App = () => {
  return (
    <Router basename={process.env.NODE_ENV === 'production' ? 'Together42' : ''}>
      <Routes>
        <Route path="/" element={<Main />} />
      </Routes>
    </Router>
  );
};

export default App;
