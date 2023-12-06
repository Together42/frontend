import React, { useState, useCallback, useEffect } from 'react';
import AuthForm from '@auth/AuthForm';
import PasswordForm from '@auth/PasswordForm';
import '@css/Auth/Auth.scss';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import ProfileChangeModalShow from '@recoil/ProfileChangeModalShow';
import SignUpProfileState from '@recoil/SignUpProfileState';

function Auth() {
  const [signUpMode, setSignUpMode] = useState(false);
  const [PasswordMode, setPasswordMode] = useState(false);
  const setOpenProfileModal = useSetRecoilState(ProfileChangeModalShow);
  const profileImage = useRecoilValue(SignUpProfileState);

  const url: string = 'http://localhost:4242/auth/google';

  const handleLogin = useCallback((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    const width = 500;
    const height = 600;
    const left = window.outerWidth / 2 + (window.screenX || window.screenLeft || 0) - (width / 2);
    const top = window.outerHeight / 2 + (window.screenY || window.screenTop || 0) - (height / 2);
    const features: string = `width=${width},height=${height},left=${left},top=${top}`;
    const popup: Window | null = window.open(url, 'Google Login', features);
    if (popup) {
      popup.focus();
    }
  }, []);

  return (
    <a href={url}>
      <button>test123</button>
    </a>
  );
}

export default Auth;
