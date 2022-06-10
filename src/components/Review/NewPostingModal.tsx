import React, { useCallback, useEffect, useState } from 'react';
import '@css/Review/NewPostingModal.scss';
import Xmark from '@img/xmark-solid-white.svg';
import { useRecoilState, useSetRecoilState } from 'recoil';
import TextareaAutosize from 'react-textarea-autosize';
import axios from 'axios';
import errorAlert from '@globalObj/function/errorAlert';
import { getToken } from '@cert/TokenStorage';
import SelectedEvent from '@recoil/Review/SelectedEvent';
import NewPostingModalShow from '@recoil/Review/NewPostingModalShow';
import SelectSomeModal from '@review/SelectSomeModal';
import SelectSomeModalShow from '@recoil/Review/SelectSomeModalShow';
import getAddress from '@globalObj/function/getAddress';
import SelectedTeam from '@recoil/Review/SelectedTeam';
import defaultImg from '@img/uploadDefault.png';
import UplaodBtn from '@utils/uploadBtn';
import PreviewBox from './PreviewBox';
import { useSWRConfig } from 'swr';

function NewEditPostingModal() {
  const setNewEditModalShow = useSetRecoilState(NewPostingModalShow);
  const [selectSomeModalShow, setSelectSomeModalShow] = useRecoilState(SelectSomeModalShow);
  const [selectedEvent, setSelectedEvent] = useRecoilState(SelectedEvent);
  const [selectedTeam, setSelectedTeam] = useRecoilState(SelectedTeam);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isEventBtnClicked, setIsEventBtnClicked] = useState(false);
  const [isAddMemBtnClicked, setIsAddMemBtnClicked] = useState(false);
  const [postFileArr, setPostFileArr] = useState<File[]>([]);
  const [postUrlArr, setPostUrlArr] = useState<string[]>([]);
  const [deleteImgArr, setDeleteImgArr] = useState<string[]>([]);
  const [deleteIdxArr, setDeleteIdxArr] = useState<number[]>([]);
  const isEventMode = (selectedEvent && selectedTeam) || (!selectedEvent && !selectedTeam);
  const { mutate } = useSWRConfig();

  const closeModal = useCallback(() => {
    setNewEditModalShow(false);
    setSelectSomeModalShow(false);
  }, [setNewEditModalShow, setSelectSomeModalShow]);

  const postImage = useCallback(
    async (boardId: string) => {
      const formData = new FormData();
      if (postFileArr.length) {
        postFileArr.forEach((file) => formData.append('image', file));
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
    } else alert('로그인을 하셔야 포스팅 하실 수 있습니다');
  };

  const onClickUpload = (e: any) => {
    setPostFileArr((prev) => prev.concat(Object.values(e.target.files)));
    setPostUrlArr((prev) => prev.concat(Array.from(e.target.files).map((file: Blob) => URL.createObjectURL(file))));
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
    if (deleteImgArr.length > 0) {
      setPostFileArr((prev) => prev.filter((_, idx) => !deleteIdxArr.includes(idx)));
      setPostUrlArr((prev) => prev.filter((img) => !deleteImgArr.includes(img)));
    }
  }, [deleteIdxArr, deleteImgArr]);

  return (
    <div className="review--newposting--background" onClick={() => closeModal()}>
      <img className="review--newposting--xmark" src={Xmark} alt={Xmark}></img>
      <div className="review--newposting-devision" onClick={(e) => e.stopPropagation()}>
        <div className="review--newposting--left_division">
          {!postUrlArr.length ? (
            <div className="review--newposting--add_files">
              <img className="review--newposting--add_file--upload_img" src={defaultImg} alt={defaultImg}></img>
              <p>이미지를 업로드 해주세용!</p>
              <UplaodBtn innerText="업로드" onClickFunc={onClickUpload} />
            </div>
          ) : (
            <>
              <UplaodBtn mode="more" innerText="추가 업로드" onClickFunc={onClickUpload} />
              <div className="review--newposting--add_files">
                <div className="review--newposting--add_files--submitted_wrapper">
                  <div className="review--newposting--add_files--submitted_title">Uploads</div>
                  <PreviewBox
                    postUrlArr={postUrlArr}
                    mode="new"
                    setDeleteImgArr={setDeleteImgArr}
                    setDeleteIdxArr={setDeleteIdxArr}
                  />
                </div>
              </div>
            </>
          )}
        </div>
        <div className="review--newposting--right_division">
          <div className="review--newposting--header">
            <input
              className="review--newposting--header--title"
              placeholder="제목 입력"
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = '제목 입력')}
              value={title}
              onChange={onChangeTitle}
            />
            <div className="review--newposting--header--selectorWrapper">
              <div className="review--newposting--header--eventSelector">
                <span onClick={onClickEventModalOpen}>{isEventMode ? '이벤트 찾기' : '팀원 찾기'}</span>
                {isEventBtnClicked &&
                  selectSomeModalShow &&
                  (isEventMode ? <SelectSomeModal mode="modal_event" /> : <SelectSomeModal mode="modal_team" />)}
              </div>
              <div className="review--newposting--header--addTeamMem">
                <span onClick={onClickAddMemModalOpen}>팀원 추가</span>
                {isAddMemBtnClicked && selectSomeModalShow && <SelectSomeModal mode="modal_addMem" />}
              </div>
            </div>
          </div>
          {(selectedEvent || selectedTeam) && (
            <div className="review--newposting--selectedInfo">
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
          <div className="review--newposting--newposting_wrapper">
            <TextareaAutosize
              className="review--newposting--newposting"
              minRows={10}
              placeholder="글을 작성해주세요"
              value={content}
              onChange={onChangeContent}
            />
            <div className="review--newposting--button--forFlex">
              <button className="review--newposting--button" onClick={onSubmitPosting}>
                <span>게시</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewEditPostingModal;
