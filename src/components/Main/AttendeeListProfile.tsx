import React, { useCallback, useRef } from 'react';
import Xmark from '@img/xmark-solid.svg';
import '@css/Main/AttendeeListProfile.scss';
import GlobalLoginState from '@recoil/GlobalLoginState';
import { useRecoilValue } from 'recoil';
import axios from 'axios';
import SelectedEvent from '@recoil/MainSelectedEvent';
import { getToken } from '@cert/TokenStorage';
import errorAlert from '@globalObj/function/errorAlert';
import getAddress from '@globalObj/function/getAddress';
import { useSWRConfig } from 'swr';

interface Props {
  intraID: string;
  image: string;
}

function AttendeeListProfile(props: Props) {
  const { intraID, image } = props;
  const xMarkRef = useRef(null);
  const LoginState = useRecoilValue(GlobalLoginState);
  const selectedEvent = useRecoilValue(SelectedEvent);
  const { mutate } = useSWRConfig();

  const cancleEventAttend = useCallback(
    (eventId: number) => {
      axios
        .delete(`${getAddress()}/api/together/unregister/${eventId}`, {
          headers: {
            Authorization: 'Bearer ' + getToken(),
          },
        })
        .then(() => {
          alert('삭제되었습니다');
          mutate(`${getAddress()}/api/together/${selectedEvent.id}`);
        })
        .catch((err) => errorAlert(err));
    },
    [mutate, selectedEvent.id],
  );

  const onClickXmark = () => {
    if (LoginState.id === intraID && selectedEvent.id) {
      if (window.confirm('정말로 취소하시나여?')) {
        if (window.confirm('진짜로요?')) cancleEventAttend(selectedEvent['id']);
        else alert('잘생각했어요>,.<');
      } else alert('감사합니다^&^');
    } else alert('본인만 삭제가 가능해요');
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
