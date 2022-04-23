import React from 'react';
import header_image from '@img/header_image.png';
import '@css/Header.scss';

function Header() {
  return (
    <div>
      <img src={header_image} alt="header_image"></img>
      <p className="header--title">Together 42</p>
    </div>
  );
}

export default Header;
