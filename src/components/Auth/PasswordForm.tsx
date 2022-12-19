import React, { useState } from 'react';
import axios from 'axios';
import getAddress from '@globalObj/function/getAddress';
import '@css/Auth/PasswordForm.scss';
import { useNavigate } from 'react-router';

function PasswordForm() {
  const [id, setId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passCheck, setPassCheck] = useState('');
  const [cert, setCert] = useState('');
  const [certButton, setCertButton] = useState(false);
  const [checkCert, setCheckCert] = useState(false);
  const [submitButton, setSubmitButton] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const changePassword = () => {
    axios
      .post(`${getAddress()}/api/user/updatePassword`, {
        intraId: id,
        password,
      })
      .then(() => {
        alert('비밀번호가 정상적으로 변경되었습니다!');
        navigate('/');
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
    if (password === passCheck) changePassword();
    else setErrorMessage('비밀번호 재입력이 다릅니다!');
  };
  const checkIdEmail = () => {
    setCertButton(true);
    axios
      .get(`${getAddress()}/api/user/userInfo`, {
        params: {
          intraId: id,
          email,
        },
      })
      .then((res) => {
        console.log(res.data);
        snedEmail();
      })
      .catch((error) => {
        if (error?.response?.data) setErrorMessage(error.response.data.message);
        else setErrorMessage('알 수 없는 에러..');
      });
  };
  const snedEmail = () => {
    axios
      .post(`${getAddress()}/api/auth/mail`, {
        sendEmail: email,
      })
      .then((res) => {
        setCertButton(true);
        alert('메일이 전송되었습니다.');
      })
      .catch((error) => {
        if (error?.response?.data) setErrorMessage(error.response.data.message);
        else setErrorMessage('알 수 없는 에러..');
      });
  };
  const checkCertificate = () => {
    setCheckCert(true);
    setSubmitButton(true);
    axios
      .post(`${getAddress()}/api/auth/cert`, {
        CEA: cert,
      })
      .then((res) => {
        setCheckCert(true);
        setSubmitButton(true);
        alert('인증번호가 맞습니다.');
      })
      .catch((error) => {
        if (error?.response?.data) setErrorMessage(error.response.data.message);
        else setErrorMessage('알 수 없는 에러..');
      });
  };
  const onChange = (e: any) => {
    setErrorMessage('');
    if (e.target.id === 'id') setId(e.target.value);
    else if (e.target.id === 'password' && password.length < 15) setPassword(e.target.value);
    else if (e.target.id === 'passCheck') setPassCheck(e.target.value);
    else if (e.target.id === 'email') setEmail(e.target.value);
    else if (e.target.id === 'cert') setCert(e.target.value);
  };

  return (
    <div className="passwordForm">
      <form className="passwordForm--form" onSubmit={onSubmit}>
        <div className="passwordForm--forFlex">
          <div className="passwordForm--label">
            <span>아이디</span>
          </div>
          <input
            className="passwordForm--input"
            id="id"
            placeholder="인트라 id 소문자"
            onFocus={(e) => (e.target.placeholder = '')}
            onBlur={(e) => (e.target.placeholder = '인트라 id 소문자')}
            onChange={onChange}
            maxLength={15}
            readOnly={certButton ? true : false}
          ></input>
        </div>
        <div className="passwordForm--forFlex">
          <div className="passwordForm--label">
            <span>이메일</span>
          </div>
          <input
            className="passwordForm--input email"
            id="email"
            type="email"
            placeholder="가입한 이메일"
            onFocus={(e) => (e.target.placeholder = '')}
            onBlur={(e) => (e.target.placeholder = '가입한 이메일')}
            value={email}
            onChange={onChange}
            maxLength={30}
            readOnly={certButton ? true : false}
          ></input>
          <div className="passwordForm--button">
            <button onClick={checkIdEmail} className="passwordForm--sendButton">
              전송
            </button>
          </div>
        </div>
        <div className="passwordForm--forFlex">
          <div className="passwordForm--label">
            <span>인증번호</span>
          </div>
          <input
            className="passwordForm--input email"
            id="cert"
            placeholder="인증 번호"
            onFocus={(e) => (e.target.placeholder = '')}
            onBlur={(e) => (e.target.placeholder = '인증 번호')}
            maxLength={30}
            readOnly={checkCert ? true : false}
          ></input>
          <div className="passwordForm--button">
            <button
              onClick={checkCertificate}
              className={`passwordForm--sendButton ${certButton === true ? '' : 'none'}`}
            >
              확인
            </button>
          </div>
        </div>
        {checkCert && (
          <>
            <div className="passwordForm--forFlex">
              <div className="passwordForm--label">
                <span>비밀번호</span>
              </div>
              <input
                className="passwordForm--input password"
                id="password"
                type="password"
                placeholder="8 글자 이상"
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = '8 글자 이상')}
                onChange={onChange}
                maxLength={15}
              ></input>
            </div>
            <div className="passwordForm--forFlex">
              <div className="passwordForm--label">
                <span>비번확인</span>
              </div>
              <input
                className="passwordForm--input passCheck"
                id="passCheck"
                type="password"
                placeholder="비밀번호 재입력"
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = '비밀번호 재입력')}
                onChange={onChange}
                maxLength={15}
              ></input>
            </div>
          </>
        )}
        <div className="passwordForm--buttonWrapper">
          <div className="passwordForm--error_message">
            <span>{errorMessage}</span>
          </div>
          <button className={`passwordForm--submitButton ${submitButton === true ? '' : 'none'}`}>비밀번호 변경</button>
        </div>
      </form>
    </div>
  );
}
export default PasswordForm;
