import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { saveToken } from '@cert/TokenStorage';

const AuthCallback = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');
  

  useEffect(() => {
    console.log('LoginSucess', token);
    saveToken(token);

  }, []);

  return <></>;
};

export default AuthCallback;
