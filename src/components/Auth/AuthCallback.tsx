import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { saveToken } from '@cert/TokenStorage';
import { useNavigate } from 'react-router-dom';

const AuthCallback = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');
  const navigate = useNavigate();

  useEffect(() => {
    console.log('LoginSucess', token);
    saveToken(token);
    navigate('/');
  }, []);

  return <></>;
};

export default AuthCallback;
