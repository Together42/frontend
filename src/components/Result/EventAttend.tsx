import React, { useEffect } from 'react';
import '@css/Result/Result.scss';
import errorAlert from '@globalObj/function/errorAlert';
import { getToken } from '@cert/TokenStorage';
import { useNavigate, useParams } from 'react-router';
import apiClient from '@service/apiClient';

function EventAttend() {
  const navigate = useNavigate();
  const { eventId } = useParams();

  const requestRegister = async (eventId: string) => {
    apiClient
      .post(`/meetups/${eventId}/attendance`)
      .then(() => {
        alert('이벤트 참여에 신청되셨습니다');
      })
      .catch((err) => {
        errorAlert(err);
      });
    navigate('/');
  };
  useEffect(() => {
    if (!getToken()) {
      alert('로그인을 하셔야 신청 가능합니다!');
      navigate('/');
      return;
    }
    requestRegister(eventId);
  }, []);

  return <></>;
}

export default EventAttend;
