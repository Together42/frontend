import React from 'react';
import '@css/utils/Footer.scss';
import cute from '@img/cute.png';

function Footer() {
  return (
    <div className="footer">
      <div className="footer--p_wrapper">
        <p>Made by Kyungsle & tkim</p>
      </div>
      <img src={cute} alt="cute" className="footer--image" />
    </div>
  );
}

export default Footer;
