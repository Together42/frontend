import React, { useState } from 'react';
import '@css/Auth/AuthForm.scss';

function AuthForm() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = (e: any) => {
    e.preventDefault();
  };

  const onChange = (e: any) => {
    if (e.target.id === 'id') setId(e.target.value);
    else if (e.target.id === 'password') setPassword(e.target.value);
  };

  return (
    <div className="authForm">
      <form className="authForm--form" onSubmit={onSubmit}>
        <div>
          <input
            className="authForm--input"
            id="id"
            placeholder="인트라 id 입력"
            onChange={onChange}
            value={id}
          ></input>
        </div>
        <div>
          <input
            className="authForm--input password"
            id="password"
            placeholder="문자+숫자로 9자 이상"
            onChange={onChange}
            value={password}
          ></input>
        </div>
        <button className="authForm--button">로그인</button>
      </form>
    </div>
  );
}

export default AuthForm;
