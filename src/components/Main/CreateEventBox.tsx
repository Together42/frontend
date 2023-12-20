import { getToken } from '@cert/TokenStorage';
import errorAlert from '@globalObj/function/errorAlert';
import getAddress from '@globalObj/function/getAddress';
import React, { useCallback, useState } from 'react';
import '@css/Main/CreateEventBox.scss';
import { useSWRConfig } from 'swr';
import { useNavigate } from 'react-router';
import apiClient from '@service/apiClient';

interface Props {
  setCreateMode: React.Dispatch<React.SetStateAction<boolean>>;
}

function CreateEventBox(props: Props) {
  const { setCreateMode } = props;
  const navigate = useNavigate();
  const [createTitle, setCreateTitle] = useState('');
  const [createDescription, setCreateDescription] = useState('');
  const { mutate } = useSWRConfig();

  const postCreateEvent = useCallback(() => {
    if (getToken()) {
      apiClient
        .post('/meetups', {
          title: createTitle,
          description: createDescription,
          categoryId: 2,
        })
        .then((res) => {
          alert('생성되었습니다');
          mutate(`${getAddress()}/meetups`);
          setCreateDescription('');
          setCreateTitle('');
          setCreateMode(false);
        })
        .catch((err) => {
          errorAlert(err);
        });
    } else {
      alert('로그인을 하셔야 생성 가능합니다!');
      navigate('/');
    }
  }, [createDescription, createTitle, mutate, navigate, setCreateMode]);

  const onSubmitCreate = (e: any) => {
    e.preventDefault();
    postCreateEvent();
  };

  const onChange = (e: any) => {
    if (e.target.id === 'title') setCreateTitle(e.target.value);
    else setCreateDescription(e.target.value);
  };

  return (
    <div className="main--apply--create_wrapper">
      <form className="main--apply--create_form" onSubmit={onSubmitCreate}>
        <div className="main--apply--create_input_wrapper">
          <div className="main--apply--create_input_label">
            <span>친바제목</span>
          </div>
          <input
            className="main--apply--create_input"
            id="title"
            placeholder="친바제목입력"
            onFocus={(e) => (e.target.placeholder = '')}
            onBlur={(e) => (e.target.placeholder = '친바제목입력')}
            maxLength={40}
            onChange={onChange}
          ></input>
        </div>
        <div className="main--apply--create_textarea_wrapper">
          <div className="main--apply--create_textarea_label">
            <span>친바설명</span>
          </div>
          <textarea
            className="main--apply--create_textarea"
            id="description"
            placeholder="친바설명입력"
            onFocus={(e) => (e.target.placeholder = '')}
            onBlur={(e) => (e.target.placeholder = '친바설명입력')}
            rows={4}
            maxLength={200}
            onChange={onChange}
          ></textarea>
        </div>
        <div className="main--apply--create_button_wrapper">
          <button className="main--apply--create_button">
            <span>친바생성</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateEventBox;
