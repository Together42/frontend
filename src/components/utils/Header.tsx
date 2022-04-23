import React from 'react';
import header_image from '@img/header_image.png';
import '@css/utils/Header.scss';

function Header() {
  return (
    <div className="header--wrapper">
      <img src={header_image} alt="header_image" className="header--image"></img>
      <p className="header--title">Together 42</p>
    </div>
  );
}

export default Header;
