import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useSWRConfig } from 'swr';
import axios from 'axios';
import TextareaAutosize from 'react-textarea-autosize';
import DeviceMode from '@recoil/DeviceMode';
import NewPostingModalShow from '@recoil/Review/NewPostingModalShow';
import SelectedEvent from '@recoil/Review/SelectedEvent';
import SelectSomeModalShow from '@recoil/Review/SelectSomeModalShow';
import SelectedTeam from '@recoil/Review/SelectedTeam';
import errorAlert from '@globalObj/function/errorAlert';
import getAddress from '@globalObj/function/getAddress';
import { ReviewPostingFileType, ReviewPostingUrlType } from '@usefulObj/types';
import { getToken } from '@cert/TokenStorage';
import SelectSomeModal from '@review/SelectSomeModal';
import UplaodBtn from '@review/UploadBtn';
import PreviewBox from '@review/PreviewBox';
import '@css/Review/NewPost/Desktop.scss';
import '@css/Review/NewPost/Mobile.scss';
import defaultImg from '@img/uploadDefault.png';
import leftAngle from '@img/angle-left-solid.svg';
import Xmark from '@img/xmark-solid-white.svg';

function NewPosting() {
  const navigate = useNavigate();
  const setNewPostModalShow = useSetRecoilState(NewPostingModalShow);
  const [selectSomeModalShow, setSelectSomeModalShow] = useRecoilState(SelectSomeModalShow);
  const [selectedEvent, setSelectedEvent] = useRecoilState(SelectedEvent);
  const [selectedTeam, setSelectedTeam] = useRecoilState(SelectedTeam);
  const deviceMode = useRecoilValue(DeviceMode);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isEventBtnClicked, setIsEventBtnClicked] = useState(false);
  const [isAddMemBtnClicked, setIsAddMemBtnClicked] = useState(false);
  const [postFileArr, setPostFileArr] = useState<ReviewPostingFileType[]>([]);
  const [postUrlArr, setPostUrlArr] = useState<ReviewPostingUrlType[]>([]);
  const isEventMode = (selectedEvent && selectedTeam) || (!selectedEvent && !selectedTeam);
  const { mutate } = useSWRConfig();
  const EXTRA_CLASS_NAME = deviceMode === 'mobile' ? '--mobile' : '';

  const closeModal = useCallback(() => {
    setSelectSomeModalShow(false);
    setNewPostModalShow(false);
    navigate('/review');
  }, [navigate, setNewPostModalShow, setSelectSomeModalShow]);

  const postImage = useCallback(
    async (boardId: string) => {
      const formData = new FormData();
      if (postFileArr.length) {
        postFileArr.forEach((file) => formData.append('image', file['file']));
        formData.append('boardId', boardId);
        await axios.post(`${getAddress()}/api/board/upload`, formData).catch((err) => errorAlert(err));
      }
    },
    [postFileArr],
  );

  const postNewPosting = useCallback(() => {
    if (selectedEvent && selectedTeam) {
      axios
        .post(
          `${getAddress()}/api/board`,
          {
            eventId: selectedEvent['id'],
            title,
            contents: content,
            attendMembers: Object.values(selectedTeam)[0],
          },
          {
            headers: {
              Authorization: 'Bearer ' + getToken(),
            },
          },
        )
        .then(async (res) => {
          await postImage(res.data.post.toString());
          mutate(`${getAddress()}/api/board/?eventId=${selectedEvent['id']}`);
          mutate(`${getAddress()}/api/board`);
          mutate(`${getAddress()}/api/together/matching`);
          setSelectedEvent(null);
          alert('성공적으로 게시되었습니다');
          closeModal();
        })
        .catch((err) => errorAlert(err));
    } else if (!selectedEvent) alert('이벤트를 선택해 주세요');
    else if (!selectedTeam) alert('팀을 선택해 주세요');
  }, [closeModal, content, mutate, postImage, selectedEvent, selectedTeam, setSelectedEvent, title]);

  const onChangeTitle = (e: any) => {
    setTitle(e.target.value);
  };

  const onClickEventModalOpen = () => {
    setIsAddMemBtnClicked(false);
    setIsEventBtnClicked(true);
    setSelectSomeModalShow(true);
  };

  const onClickAddMemModalOpen = () => {
    if (selectedEvent) {
      setIsEventBtnClicked(false);
      setIsAddMemBtnClicked(true);
      setSelectSomeModalShow(true);
    } else {
      alert('이벤트 선택을 먼저 해주세요');
    }
  };

  const onChangeContent = (e: any) => {
    setContent(e.target.value);
  };

  const onSubmitPosting = () => {
    if (getToken()) {
      postNewPosting();
    } else {
      alert('로그인을 하셔야 포스팅 하실 수 있습니다');
      navigate('/auth');
    }
  };

  const onClickUpload = (e: any) => {
    setPostFileArr((prev) =>
      prev.concat(
        Array.from(e.target.files).map((file: Blob, idx) => ({
          id: prev.length + idx,
          file,
          type: file['type'].slice(0, 5),
        })),
      ),
    );
    setPostUrlArr((prev) =>
      prev.concat(
        Array.from(e.target.files).map((file: Blob, idx) => ({
          id: prev.length + idx,
          url: URL.createObjectURL(file),
          type: file['type'].slice(0, 5),
        })),
      ),
    );
  };

  useEffect(() => {
    if (!selectSomeModalShow) {
      setIsAddMemBtnClicked(false);
      setIsEventBtnClicked(false);
    }
  }, [selectSomeModalShow]);

  useEffect(() => {
    return () => {
      setSelectedTeam(null);
      closeModal();
    };
  }, [closeModal, setSelectedTeam]);

  useEffect(() => {
    if (deviceMode === 'desktop') {
      navigate('/review');
      setNewPostModalShow(true);
    } else if (deviceMode === 'mobile') {
      navigate('/review/mobile/newpost');
    }
  }, [deviceMode, navigate, setNewPostModalShow]);

  return (
    <div
      className={`review--newposting${EXTRA_CLASS_NAME}--background`}
      onClick={deviceMode === 'desktop' ? () => closeModal() : null}
    >
      {deviceMode === 'desktop' ? (
        <img className="review--newposting--xmark" src={Xmark} alt={Xmark} onClick={() => closeModal()} />
      ) : null}
      <div className={`review--newposting${EXTRA_CLASS_NAME}--devision`} onClick={(e) => e.stopPropagation()}>
        <div className={`review--newposting${EXTRA_CLASS_NAME}--mobile_header`}>
          <img
            className={`review--newposting${EXTRA_CLASS_NAME}--left_angle`}
            src={leftAngle}
            alt={leftAngle}
            onClick={() => closeModal()}
          ></img>
        </div>
        <div className={`review--newposting${EXTRA_CLASS_NAME}--imageBox`}>
          {!postUrlArr.length ? (
            <div className={`review--newposting${EXTRA_CLASS_NAME}--add_files`}>
              <img
                className={`review--newposting${EXTRA_CLASS_NAME}--add_file--upload_img`}
                src={defaultImg}
                alt={defaultImg}
              />
              <p>이미지를 업로드 해주세용!</p>
              <UplaodBtn innerText="업로드" onClickFunc={onClickUpload} />
            </div>
          ) : (
            <>
              <div className={`review--newposting${EXTRA_CLASS_NAME}--added_files`}>
                <div className={`review--newposting${EXTRA_CLASS_NAME}--add_files--submitted_wrapper`}>
                  <div className={`review--newposting${EXTRA_CLASS_NAME}--add_files--submitted_title`}>Uploads</div>
                  <PreviewBox postUrlArr={postUrlArr} setPostFileArr={setPostFileArr} setPostUrlArr={setPostUrlArr} />
                </div>
                <UplaodBtn innerText="추가 업로드" onClickFunc={onClickUpload} />
              </div>
            </>
          )}
        </div>
        <div className={`review--newposting${EXTRA_CLASS_NAME}--submitBox`}>
          <div className={`review--newposting${EXTRA_CLASS_NAME}--header`}>
            <input
              className={`review--newposting${EXTRA_CLASS_NAME}--header--title`}
              placeholder="제목 입력"
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = '제목 입력')}
              value={title}
              onChange={onChangeTitle}
            />
            <div className={`review--newposting${EXTRA_CLASS_NAME}--header--selectorWrapper`}>
              <div className={`review--newposting${EXTRA_CLASS_NAME}--header--eventSelector`}>
                <span onClick={onClickEventModalOpen}>{isEventMode ? '이벤트 찾기' : '팀원 찾기'}</span>
                {isEventBtnClicked &&
                  selectSomeModalShow &&
                  (isEventMode ? <SelectSomeModal mode="modal_event" /> : <SelectSomeModal mode="modal_team" />)}
              </div>
              <div className={`review--newposting${EXTRA_CLASS_NAME}--header--addTeamMem`}>
                <span onClick={onClickAddMemModalOpen}>팀원 추가</span>
                {isAddMemBtnClicked && selectSomeModalShow && <SelectSomeModal mode="modal_addMem" />}
              </div>
            </div>
          </div>
          {(selectedEvent || selectedTeam) && (
            <div className={`review--newposting${EXTRA_CLASS_NAME}--selectedInfo`}>
              {selectedEvent && (
                <>
                  <span>이벤트 </span>
                  <span>{selectedEvent['title']}</span>
                </>
              )}
              {selectedTeam && (
                <>
                  <span>팀</span>
                  <span>team {Object.keys(selectedTeam)[0]}</span>
                  <span>팀원</span>
                  <div>
                    {Object.values(selectedTeam)[0].map((member) => (
                      <span>{member['intraId']} </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
          <div className={`review--newposting${EXTRA_CLASS_NAME}--newposting_wrapper`}>
            <TextareaAutosize
              className={`review--newposting${EXTRA_CLASS_NAME}--newposting`}
              minRows={10}
              placeholder="글을 작성해주세요"
              value={content}
              onChange={onChangeContent}
            />
            <div className={`review--newposting${EXTRA_CLASS_NAME}--button--forFlex`}>
              <button className={`review--newposting${EXTRA_CLASS_NAME}--button`} onClick={onSubmitPosting}>
                <span>게시</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewPosting;
