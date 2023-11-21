import React, { useEffect } from 'react';
import '@css/Result/Result.scss';
import axios from 'axios';
import errorAlert from '@globalObj/function/errorAlert';
import { getToken } from '@cert/TokenStorage';
import getAddress from '@globalObj/function/getAddress';
import { useNavigate, useParams } from 'react-router';

function EventAttend() {
  const navigate = useNavigate();
  const { eventId } = useParams();

  const requestRegister = async (eventId: string) => {
    const url = `${getAddress()}/meetups/attendance`;
    const data = { eventId };
    const config = { headers: { Authorization: 'Bearer ' + getToken() } };
    try {
      const resp = await axios.post(url, data, config);
      const { attend } = resp.data;
      console.log(attend);
      alert('이벤트 참여에 신청되셨습니다');
    } catch (error) {
      errorAlert(error);
    }
    navigate('/');
  };
  useEffect(() => {
    if (!getToken()) {
      alert('로그인을 하셔야 신청 가능합니다!');
      navigate('/auth', { state: { from: { pathname: `/event/attend/${eventId}` } } });
      return;
    }
    requestRegister(eventId);
  }, []);

  return <></>;
}

export default EventAttend;
