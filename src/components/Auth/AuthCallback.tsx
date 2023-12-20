import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { saveToken } from '@cert/TokenStorage';
import { useNavigate } from 'react-router-dom';
import { getDecodedToken } from '@cert/TokenStorage';
import GlobalLoginState from '@recoil/GlobalLoginState';
import { useSetRecoilState } from 'recoil';

const AuthCallback = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const setLoginState = useSetRecoilState(GlobalLoginState);

  useEffect(() => {
    saveToken(token);
    setLoginState(() => {
      return {
        id: getDecodedToken().id,
        isLogin: true,
        isAdmin: false,
        profileUrl: getDecodedToken().url,
      };
    });
    navigate('/');
  }, []);

  return <></>;
};

export default AuthCallback;
