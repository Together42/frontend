import React, { useEffect, useRef } from 'react';
import Xmark from '@img/xmark-solid.svg';
import '@css/Main/AttendeeListProfile.scss';
import GlobalLoginState from '@recoil/GlobalLoginState';
import { useRecoilValue } from 'recoil';
import axios from 'axios';

interface Props {
  intraID: string;
  index: number;
  image: string;
}

function AttendeeListProfile(props: Props) {
  const { intraID, index, image } = props;
  const xMarkRef = useRef(null);
  const LoginState = useRecoilValue(GlobalLoginState);
  // console.log(LoginState.profileUrl);
  useEffect(() => {
    // axios.get(`${process.env.SERVER_ADR}/api/matching`);
  }, []);
  return (
    <div
      className="main--attendeeList--profile_wrapper"
      key={index}
      onMouseOver={() => {
        if (LoginState.profileUrl === image) xMarkRef.current.style.visibility = 'visible';
      }}
      onMouseOut={() => {
        xMarkRef.current.style.visibility = 'hidden';
      }}
    >
      <img className="main--attendeeList--profile_image" src={image} alt={`profile${index}`} />
      <p>{intraID}</p>
      <img className={`main--attendeeList--xmark`} src={Xmark} alt={Xmark} ref={xMarkRef} />
    </div>
  );
}

export default AttendeeListProfile;
