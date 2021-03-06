import React, { useState } from 'react';
import '@css/Auth/AuthForm.scss';
import ProfileModal from '@auth/ProfileModal';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import ProfileChangeModalShow from '@recoil/ProfileChangeModalShow';
import GlobalLoginState from '@recoil/GlobalLoginState';
import axios from 'axios';
import { saveToken } from '@cert/TokenStorage';
import { useNavigate } from 'react-router';
import SignUpProfileState from '@recoil/SignUpProfileState';
import { saveAuth } from '@cert/AuthStorage';
import getAddress from '@globalObj/function/getAddress';

interface Props {
  signUpMode: boolean;
  setSignUpMode: React.Dispatch<React.SetStateAction<boolean>>;
}

function AuthForm(props: Props) {
  const { signUpMode, setSignUpMode } = props;
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [passCheck, setPassCheck] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const openProfileModal = useRecoilValue(ProfileChangeModalShow);
  const setLoginState = useSetRecoilState(GlobalLoginState);
  const profileImageState = useRecoilValue(SignUpProfileState);
  const navigate = useNavigate();

  const login = () => {
    axios
      .post(`${getAddress()}/api/auth/login`, {
        intraId: id,
        password,
      })
      .then((res) => {
        if (res.data.token) {
          setLoginState(() => {
            return {
              id,
              isLogin: true,
              isAdmin: id === 'tkim',
              profileUrl: res.data.profile,
            };
          });
          saveToken(res.data.token);
          saveAuth({ id, url: res.data.url });
          alert('로그인 되셨습니다');
          navigate('/');
        } else {
          setErrorMessage('토큰 받아오기 실패');
        }
      })
      .catch((error) => {
        if (error?.response?.data) setErrorMessage(error.response.data.message);
        else setErrorMessage('알 수 없는 에러..');
      });
  };

  const signUp = () => {
    axios
      .post(`${getAddress()}/api/auth/signup`, {
        intraId: id,
        password,
        email,
        profile:
          process.env.NODE_ENV === 'production'
            ? `https://together42.github.io${profileImageState}`
            : profileImageState,
      })
      .then((res) => {
        if (res.data && res.data.token) {
          saveToken(res.data.token);
          saveAuth({
            id,
            url:
              process.env.NODE_ENV === 'production'
                ? `https://together42.github.io${profileImageState}`
                : profileImageState,
          });
          alert('회원가입 되셨습니다!');
          setSignUpMode(false);
          setPassCheck('');
          setEmail('');
        } else {
          setErrorMessage('토큰 받아오기 실패');
        }
      })
      .catch((error) => {
        if (error?.response?.data?.message) {
          setErrorMessage(error.response.data.message);
        } else setErrorMessage('알 수 없는 에러..');
      });
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
    setErrorMessage('');
    if (signUpMode) {
      if (password === passCheck) signUp();
      else setErrorMessage('비밀번호 재입력이 다릅니다!');
    } else login();
  };

  const onChange = (e: any) => {
    setErrorMessage('');
    if (e.target.id === 'id') setId(e.target.value);
    else if (e.target.id === 'password' && password.length < 15) setPassword(e.target.value);
    else if (e.target.id === 'email') setEmail(e.target.value);
    else if (e.target.id === 'passCheck') setPassCheck(e.target.value);
  };

  return (
    <div className="authForm">
      {openProfileModal && <ProfileModal />}
      <form className="authForm--form" onSubmit={onSubmit}>
        <div className="authForm--forFlex">
          <div className="authForm--label">
            <span>아이디</span>
          </div>
          <input
            className="authForm--input"
            id="id"
            placeholder="인트라 id 소문자"
            onFocus={(e) => (e.target.placeholder = '')}
            onBlur={(e) => (e.target.placeholder = '인트라 id 소문자')}
            onChange={onChange}
            maxLength={15}
          ></input>
        </div>
        <div className="authForm--forFlex">
          <div className="authForm--label">
            <span>비밀번호</span>
          </div>
          <input
            className="authForm--input password"
            id="password"
            type="password"
            placeholder="8 글자 이상"
            onFocus={(e) => (e.target.placeholder = '')}
            onBlur={(e) => (e.target.placeholder = '8 글자 이상')}
            onChange={onChange}
            maxLength={15}
          ></input>
        </div>
        {signUpMode && (
          <>
            <div className="authForm--forFlex">
              <div className="authForm--label">
                <span>비번확인</span>
              </div>
              <input
                className="authForm--input passCheck"
                id="passCheck"
                type="password"
                placeholder="비밀번호 재입력"
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = '비밀번호 재입력')}
                onChange={onChange}
                maxLength={15}
              ></input>
            </div>
            <div className="authForm--forFlex">
              <div className="authForm--label">
                <span>이메일</span>
              </div>
              <input
                className="authForm--input email"
                id="email"
                type="email"
                placeholder="개인이메일 가능"
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = '개인이메일 가능')}
                onChange={onChange}
                value={email}
                maxLength={30}
              ></input>
            </div>
          </>
        )}
        <div className="authForm--buttonWrapper">
          <div className="authForm--error_message">
            <span>{errorMessage}</span>
          </div>
          <button className="authForm--button">{signUpMode ? '회원가입' : '로그인'}</button>
        </div>
      </form>
    </div>
  );
}

export default AuthForm;
