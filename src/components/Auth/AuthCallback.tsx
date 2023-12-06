import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { saveToken } from '@cert/TokenStorage';

const AuthCallback = () => {

  useEffect(() => {
    if (window.opener) {
      window.close();
    }
  }, []);

  return <></>;
};

export default AuthCallback;
