import React, { useEffect } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4242',
  withCredentials: true,
});

const AuthSignUp = () => {
  const handleClick = () => {
    console.log('click');
    api.get('user/test').then((res) => {
      console.log(res);
      window.close();
    }).catch((err) => {
      console.log(err);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('submit', e.target[0].value);
    console.log('submit', e.target[1].value);
    api.post('/auth/signup', {
      nickname: e.target[0].value,
      slackId: e.target[1].value,
    }).catch((err) => {
      console.log(err);
    });
  };
  return (
    <div>
      <h1>signup page</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="nick name" maxLength={10} />
        <input type="text" placeholder="slack id" maxLength={20} />
        <button>제출</button>
      </form>
      <button onClick={handleClick}>test</button>
    </div>
  );
};

export default AuthSignUp;
