import React from 'react';
import { Route, Routes } from 'react-router';
import MobileComment from './MobileComment';
import MobileEditPost from './MobileEditPost';
import NewPosting from './NewPostingModal';
import Review from './Review';

function routes() {
  return (
    <Routes>
      <Route path="/" element={<Review />} />
      <Route path="/mobile/newpost" element={<NewPosting />} />
      <Route path="/mobile/comment/:id" element={<MobileComment />} />
      <Route path="/mobile/editpost/:id" element={<MobileEditPost />} />
    </Routes>
  );
}

export default routes;
