import React from 'react';
import { Route, Routes } from 'react-router';
import MobileNewPost from './MobileNewPost';
import Review from './Review';

function routes() {
  return (
    <Routes>
      <Route path="/" element={<Review />} />
      <Route path="/mobile/newpost" element={<MobileNewPost />} />
    </Routes>
  );
}

export default routes;
