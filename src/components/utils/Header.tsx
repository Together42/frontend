import React from 'react';
import header_image from '@img/header_image.png';
import '@css/utils/Header.scss';
import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();

  const onClickHeader = () => {
    navigate('/');
  };
  return (
    <div className="header--wrapper">
      <img src={header_image} alt="header_image" className="header--image" onClick={onClickHeader}></img>
      <p className="header--title" onClick={onClickHeader}>
        Together 42
      </p>
    </div>
  );
}

export default Header;
