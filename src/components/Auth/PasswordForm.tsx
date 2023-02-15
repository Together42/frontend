import React, { useEffect, useState } from 'react';
import axios from 'axios';
import getAddress from '@globalObj/function/getAddress';
import '@css/Auth/PasswordForm.scss';
import { useNavigate } from 'react-router';

function PasswordForm() {
  // 사용자 인트라아이디, 이메일, id
  const [intraId, setIntraId] = useState('');
  const [email, setEmail] = useState('');
  const [id, setId] = useState('');
  // 변경 할 비밀번호
  const [password, setPassword] = useState('');
  const [passCheck, setPassCheck] = useState('');
  // 인증 버튼 클릭 여부 -> 이메일 전송
  const [certButton, setCertButton] = useState(false);
  // 인증 번호
  const [cert, setCert] = useState('');
  // 인증 번호 확인
  const [checkCert, setCheckCert] = useState(false);
  // 인증 번호 입력 타이머(300초 -> 5분)
  const [time, setTime] = useState(300);
  // 타이머 설정을 위한 flag
  const [sendMailFlag, setSendMailFlag] = useState(false);

  const [submitButton, setSubmitButton] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const onSubmit = (e: any) => {
    e.preventDefault();
    setErrorMessage('');
    if (password === passCheck) changePassword();
    else setErrorMessage('비밀번호 재입력이 다릅니다!');
  };
  const changePassword = () => {
    axios
      .put(`${getAddress()}/api/auth/password/${id}`, {
        intraId,
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
  const checkIdEmail = () => {
    axios
      .get(`${getAddress()}/api/auth/userInfo/${intraId}`)
      .then((res) => {
        if (res.data.email === email) {
          setErrorMessage('');
          setId(res.data.id);
          snedEmail();
        } else setErrorMessage('등록된 이메일 정보가 다릅니다.');
      })
      .catch((error) => {
        if (error?.response?.data.message) setErrorMessage(error.response.data.message);
        else setErrorMessage('알 수 없는 에러..');
      });
  };
  const snedEmail = () => {
    axios
      .post(`${getAddress()}/api/auth/mail`, {
        sendEmail: email,
      })
      .then((res) => {
        if (res.data.data === 'success') {
          setTime(300);
          setCertButton(true);
          setSendMailFlag(true);
          setErrorMessage('');
          alert('메일이 전송되었습니다.');
        } else {
          setErrorMessage('메일 전송에 실패했습니다. 다시 시도해 주세요.');
        }
      })
      .catch((error) => {
        if (error?.response?.data) setErrorMessage(error.response.data.message);
        else setErrorMessage('알 수 없는 에러..');
      });
  };
  const checkCertificate = () => {
    setSendMailFlag(false);
    axios
      .post(
        `${getAddress()}/api/auth/cert`,
        {
          CEA: cert,
        },
        { withCredentials: true },
      )
      .then((res) => {
        console.log(res.data.result);
        if (res.data.result === 'success') {
          setCheckCert(true);
          setSubmitButton(true);
          alert('인증번호가 맞습니다.');
        } else {
          setErrorMessage('인증번호가 틀립니다.');
        }
      })
      .catch((error) => {
        if (error?.response?.data) setErrorMessage(error.response.data.message);
        else setErrorMessage('알 수 없는 에러..');
      });
  };
  const onChange = (e: any) => {
    setErrorMessage('');
    if (e.target.id === 'intraId') setIntraId(e.target.value);
    else if (e.target.id === 'password' && password.length < 15) setPassword(e.target.value);
    else if (e.target.id === 'passCheck') setPassCheck(e.target.value);
    else if (e.target.id === 'email') setEmail(e.target.value);
    else if (e.target.id === 'cert') setCert(e.target.value);
  };
  useEffect(() => {
    // 이메일을 전송하면, 타이머 카운터
    if (sendMailFlag === true) {
      if (time > 0) {
        const Counter = setInterval(() => {
          setTime(time - 1);
        }, 1000);
        return () => clearInterval(Counter);
      }
    }
    if (time <= 0) {
      setErrorMessage('인증 시간이 만료되었습니다.\n다시 시도해주세요.');
      setSendMailFlag(false);
      setTime(300);
    }
  }, [sendMailFlag, time]);

  return (
    <div className="passwordForm">
      <form className="passwordForm--form" onSubmit={onSubmit}>
        <div className="passwordForm--forFlex">
          <div className="passwordForm--label">
            <span>아이디</span>
          </div>
          <input
            className="passwordForm--input"
            id="intraId"
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
            <p onClick={checkIdEmail} className={`passwordForm--sendButton ${checkCert === false ? '' : 'none'}`}>
              전송
            </p>
          </div>
        </div>
        <div className="passwordForm--forFlex">
          <div className="passwordForm--label">
            <span>인증번호</span>
          </div>
          <input
            className="passwordForm--input cert"
            id="cert"
            placeholder="인증 번호"
            onFocus={(e) => (e.target.placeholder = '')}
            onBlur={(e) => (e.target.placeholder = '인증 번호')}
            onChange={onChange}
            maxLength={30}
            readOnly={sendMailFlag ? false : true}
          ></input>
          <input
            className="passwordForm--input cert_count"
            placeholder={`${checkCert === true ? '' : Math.trunc((time % 3600) / 60) + ':' + (time % 60)}`}
            readOnly
          ></input>
          <div className="passwordForm--button">
            <p
              onClick={checkCertificate}
              className={`passwordForm--sendButton ${certButton === true && checkCert === false ? '' : 'none'}`}
            >
              확인
            </p>
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
