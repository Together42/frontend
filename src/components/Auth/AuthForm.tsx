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
  const profileImageUrl = useRecoilValue(SignUpProfileState);
  const navigate = useNavigate();

  const onSubmit = (e: any) => {
    e.preventDefault();
    setErrorMessage('');
    if (signUpMode) {
      if (password === passCheck) {
        axios
          .post(`${process.env.SERVER_ADR}/api/auth/signup`, {
            loginId: id,
            pw: password,
            email,
            url: profileImageUrl,
          })
          .then((res) => {
            if (res.data.token) {
              saveToken(res.data.token);
              alert('회원가입 되셨습니다!');
              setSignUpMode(false);
              setPassCheck('');
              setEmail('');
            } else {
              alert('서버에서 잘못된 데이터가 들어왔습니다');
            }
          })
          .catch((error) => {
            if (error && error.response && error.response.data) setErrorMessage(error.response.data);
            else alert('서버 통신 에러');
          });
      } else {
        setErrorMessage('비밀번호 재입력이 다릅니다!');
      }
    } else {
      axios
        .post(`${process.env.SERVER_ADR}/api/auth/login`, {
          loginId: id,
          pw: password,
        })
        .then((res) => {
          if (res.data.token) {
            setLoginState(() => {
              return {
                id,
                isLogin: true,
                isAdmin: id === 'tkim',
                profileUrl: res.data.url,
              };
            });
            saveToken(res.data.token);
            alert('로그인 되셨습니다.!');
            navigate('/');
          } else {
            alert('서버에서 잘못된 데이터가 들어왔습니다');
          }
        })
        .catch((error) => {
          if (error && error.response && error.response.data) setErrorMessage(error.response.data);
          else alert('서버 통신 에러');
        });
    }
  };

  const onChange = (e: any) => {
    setErrorMessage('');
    if (e.target.id === 'id') setId(e.target.value);
    else if (e.target.id === 'password') setPassword(e.target.value);
    else if (e.target.id === 'email') setEmail(e.target.value);
    else setPassCheck(e.target.value);
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
            placeholder="인트라 id 입력"
            onFocus={(e) => (e.target.placeholder = '')}
            onBlur={(e) => (e.target.placeholder = '인트라 id 입력')}
            onChange={onChange}
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
