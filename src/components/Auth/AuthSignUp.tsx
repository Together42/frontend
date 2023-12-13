import React from 'react';
import '@css/Auth/Auth.scss';
import { useNavigate } from 'react-router';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import errorAlert from '@globalObj/function/errorAlert';
import apiClient from '@service/apiClient';
import { saveToken } from '@cert/TokenStorage';
import ProfileChangeModalShow from '@recoil/ProfileChangeModalShow';
import SignUpProfileState from '@recoil/SignUpProfileState';
import ProfileModal from '@auth/ProfileModal';

const AuthSignUp = () => {
  const navigate = useNavigate();
  const setOpenProfileModal = useSetRecoilState(ProfileChangeModalShow);
  const openProfileModal = useRecoilValue(ProfileChangeModalShow);
  const profileImage = useRecoilValue(SignUpProfileState);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log('submit', e.target[0].value);
    console.log('submit', e.target[1].value);
    apiClient
      .post('/auth/signup', {
        nickname: e.target[0].value,
        slackId: e.target[1].value,
        imageUrl: profileImage,
      })
      .then((res) => {
        console.log('success', res.data);
        saveToken(res.data.access_token);
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
    <div>
      <div className={`auth--wrapper ${'signup'} `}>
        <div className="auth--profile">
          <img src={profileImage} alt="profile" />
          <p onClick={onClickOpenProfile}>프로필 변경</p>
        </div>
        {openProfileModal && <ProfileModal />}
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="nick name" maxLength={10} />
        <input type="text" placeholder="slack id" maxLength={20} />
        <button>Sign Up</button>
      </form>
    </div>
  );
};

export default AuthSignUp;
