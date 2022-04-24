import React from 'react';
import '@css/Result/Footer.scss';
import cute from '@img/cute.png';

function Footer() {
  return (
    <div className="result--footer">
      <img src={cute} alt="cute" className="result--footer--image" />
    </div>
  );
}

export default Footer;
