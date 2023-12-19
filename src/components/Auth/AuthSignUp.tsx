import React, { useState } from 'react';
import '@css/Auth/Auth.scss';
import { useNavigate } from 'react-router';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import errorAlert from '@globalObj/function/errorAlert';
import apiClient from '@service/apiClient';
import { saveToken } from '@cert/TokenStorage';
import { saveAuth } from '@cert/AuthStorage';
import ProfileChangeModalShow from '@recoil/ProfileChangeModalShow';
import SignUpProfileState from '@recoil/SignUpProfileState';
import ProfileModal from '@auth/ProfileModal';
import GlobalLoginState from '@recoil/GlobalLoginState';

const AuthSignUp = () => {
  const navigate = useNavigate();
  const setOpenProfileModal = useSetRecoilState(ProfileChangeModalShow);
  const openProfileModal = useRecoilValue(ProfileChangeModalShow);
  const profileImage = useRecoilValue(SignUpProfileState);
  const setLoginState = useSetRecoilState(GlobalLoginState);
  const [nicknameError, setNicknameError] = useState(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!e.target[0].value) {
      setNicknameError(true);
      return;
    }
    apiClient
      .post('/auth/signup', {
        nickname: e.target[0].value,
        slackId: e.target[1].value,
        imageUrl: profileImage,
      })
      .then((res) => {
        saveToken(res.data.access_token);
        saveAuth(res.data.access_token);
        setLoginState(() => {
          return {
            id: res.data.id,
            isLogin: true,
            isAdmin: false,
            profileUrl: res.data.url,
          };
        });
        navigate('/');
      })
      .catch((err) => {
        errorAlert(err);
      });
  };

  const onClickOpenProfile = () => {
    setOpenProfileModal((prev) => !prev);
  };

  return (
    <>
      <div className={`auth--wrapper`}>
        <div className="auth--profile">
          <img src={profileImage} alt="profile" />
          <p onClick={onClickOpenProfile}>프로필 변경</p>
        </div>
        {openProfileModal && <ProfileModal />}
        <form className={`authForm`} onSubmit={handleSubmit}>
          <input type="text" placeholder="닉네임을 입력해주세요" maxLength={10} className={`authForm--input`} />
          {nicknameError && <p className={`authForm--error_message`}>닉네임을 입력해주세요.</p>}
          <br />
          <input type="text" placeholder="slack id" maxLength={20} className={`authForm--input`} />
          <br />
          <button className={`authForm--button`}>Sign Up</button>
        </form>
      </div>
    </>
  );
};

export default AuthSignUp;
