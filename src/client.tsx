import React from 'react';
import ReactDOM from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import App from './app';

const rootNode = document.getElementById('app');

ReactDOM.createRoot(rootNode).render(
  <RecoilRoot>
    <App />
  </RecoilRoot>,
);
