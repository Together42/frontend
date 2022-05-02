import React, { useRef } from 'react';
import Xmark from '@img/xmark-solid.svg';
import '@css/Main/AttendeeListProfile.scss';
import GlobalLoginState from '@recoil/GlobalLoginState';
import { useRecoilValue } from 'recoil';
import axios from 'axios';
import SelectedEvent from '@recoil/SelectedEvent';
import { getToken } from '@cert/TokenStorage';

interface Props {
  intraID: string;
  image: string;
}

function AttendeeListProfile(props: Props) {
  const { intraID, image } = props;
  const xMarkRef = useRef(null);
  const LoginState = useRecoilValue(GlobalLoginState);
  const selectedEvent = useRecoilValue(SelectedEvent);

  const onClickXmark = () => {
    if (LoginState.id === intraID) {
      axios
        .delete(`${process.env.SERVER_ADR}/api/together/unregister/${selectedEvent['id']}`, {
          headers: {
            Authorization: 'Bearer ' + getToken(),
          },
        })
        .then(() => {
          alert('삭제되었습니다');
        })
        .catch((err) => {
          alert('삭제에 실패했습니다..');
        });
    } else {
      alert('본인만 삭제가 가능해요');
    }
  };

  return (
    <div
      className="main--attendeeList--profile_wrapper"
      key={intraID}
      onMouseOver={() => {
        if (LoginState.id === intraID) xMarkRef.current.style.visibility = 'visible';
      }}
      onMouseOut={() => {
        xMarkRef.current.style.visibility = 'hidden';
      }}
    >
      <img className="main--attendeeList--profile_image" src={image} alt={intraID} />
      <p>{intraID}</p>
      <img className={`main--attendeeList--xmark`} src={Xmark} alt={Xmark} ref={xMarkRef} onClick={onClickXmark} />
    </div>
  );
}

export default AttendeeListProfile;
