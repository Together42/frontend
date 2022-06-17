import React from 'react';
import { Route, Routes } from 'react-router';
import MobileComment from './MobileComment';
import MobileNewPost from './MobileNewPost';
import Review from './Review';

function routes() {
  return (
    <Routes>
      <Route path="/" element={<Review />} />
      <Route path="/mobile/newpost" element={<MobileNewPost />} />
      <Route path="/mobile/comment/:id" element={<MobileComment />} />
    </Routes>
  );
}

export default routes;
