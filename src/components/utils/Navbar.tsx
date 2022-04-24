import React from 'react';
import '@css/utils/Navbar.scss';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <div className="navbar--wrapper">
      <Link to={`/`}>신청하기</Link>
      <Link to={`/Result`}>결과보기</Link>
      <Link to={`/review`}>친스타그램</Link>
      <Link to={`/auth`}>로그인하기</Link>
    </div>
  );
}

export default Navbar;
