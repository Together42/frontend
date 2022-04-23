import React from 'react';
import '@css/utils/Navbar.scss';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <div className="navbar--wrapper">
      <Link to={`/`}>신청&결과</Link>
      <Link to={`/review`}>친스타그램</Link>
      <Link to={`/auth`}>로그인</Link>
    </div>
  );
}

export default Navbar;
