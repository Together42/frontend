import React, { useCallback, useEffect, useState } from 'react';
import '@css/Review/NewPostingModal.scss';
import Xmark from '@img/xmark-solid-white.svg';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
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
import UplaodBtn from '@review/UploadBtn';
import PreviewBox from './PreviewBox';
import { useSWRConfig } from 'swr';
import leftAngle from '@img/angle-left-solid.svg';
import { ReviewPostingFileType, ReviewPostingUrlType } from '@usefulObj/types';
import DeviceMode from '@recoil/DeviceMode';
import { useNavigate } from 'react-router';

function NewPostingModal() {
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

  const closeModal = useCallback(() => {
    setNewPostModalShow(false);
    setSelectSomeModalShow(false);
  }, [setNewPostModalShow, setSelectSomeModalShow]);

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
          alert('??????????????? ?????????????????????');
          closeModal();
        })
        .catch((err) => errorAlert(err));
    } else if (!selectedEvent) alert('???????????? ????????? ?????????');
    else if (!selectedTeam) alert('?????? ????????? ?????????');
  }, [closeModal, content, mutate, postImage, selectedEvent, selectedTeam, setSelectedEvent, title]);

  const onChangeTitle = (e: any) => {
    setTitle(e.target.value);
  };

  const onClickEventModalOpen = () => {
    setIsAddMemBtnClicked(false);
    setIsEventBtnClicked(true);
    setSelectSomeModalShow((prev) => !prev);
  };

  const onClickAddMemModalOpen = () => {
    if (selectedEvent) {
      setIsEventBtnClicked(false);
      setIsAddMemBtnClicked(true);
      setSelectSomeModalShow((prev) => !prev);
    } else {
      alert('????????? ????????? ?????? ????????????');
    }
  };

  const onChangeContent = (e: any) => {
    setContent(e.target.value);
  };

  const onSubmitPosting = () => {
    if (getToken()) {
      postNewPosting();
    } else alert('???????????? ????????? ????????? ?????? ??? ????????????');
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
    if (deviceMode === 'mobile') navigate('/review/mobile/newpost');
  }, [deviceMode, navigate]);

  return (
    <div className="review--newposting--background" onClick={() => closeModal()}>
      <img className="review--newposting--xmark" src={Xmark} alt={Xmark} onClick={() => closeModal()} />
      <div className="review--newposting-devision" onClick={(e) => e.stopPropagation()}>
        <div className="review--newposting--mobile_header">
          <img
            className="review--newposting--left_angle"
            src={leftAngle}
            alt={leftAngle}
            onClick={() => closeModal()}
          ></img>
        </div>
        <div className="review--newposting--left_division">
          {!postUrlArr.length ? (
            <div className="review--newposting--add_files">
              <img className="review--newposting--add_file--upload_img" src={defaultImg} alt={defaultImg} />
              <p>???????????? ????????? ????????????!</p>
              <UplaodBtn innerText="?????????" onClickFunc={onClickUpload} />
            </div>
          ) : (
            <>
              <div className="review--newposting--added_files">
                <div className="review--newposting--add_files--submitted_wrapper">
                  <div className="review--newposting--add_files--submitted_title">Uploads</div>
                  <PreviewBox postUrlArr={postUrlArr} setPostFileArr={setPostFileArr} setPostUrlArr={setPostUrlArr} />
                </div>
                <UplaodBtn innerText="?????? ?????????" onClickFunc={onClickUpload} />
              </div>
            </>
          )}
        </div>
        <div className="review--newposting--right_division">
          <div className="review--newposting--header">
            <input
              className="review--newposting--header--title"
              placeholder="?????? ??????"
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = '?????? ??????')}
              value={title}
              onChange={onChangeTitle}
            />
            <div className="review--newposting--header--selectorWrapper">
              <div className="review--newposting--header--eventSelector">
                <span onClick={onClickEventModalOpen}>{isEventMode ? '????????? ??????' : '?????? ??????'}</span>
                {isEventBtnClicked &&
                  selectSomeModalShow &&
                  (isEventMode ? <SelectSomeModal mode="modal_event" /> : <SelectSomeModal mode="modal_team" />)}
              </div>
              <div className="review--newposting--header--addTeamMem">
                <span onClick={onClickAddMemModalOpen}>?????? ??????</span>
                {isAddMemBtnClicked && selectSomeModalShow && <SelectSomeModal mode="modal_addMem" />}
              </div>
            </div>
          </div>
          {(selectedEvent || selectedTeam) && (
            <div className="review--newposting--selectedInfo">
              {selectedEvent && (
                <>
                  <span>????????? </span>
                  <span>{selectedEvent['title']}</span>
                </>
              )}
              {selectedTeam && (
                <>
                  <span>???</span>
                  <span>team {Object.keys(selectedTeam)[0]}</span>
                  <span>??????</span>
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
              placeholder="?????? ??????????????????"
              value={content}
              onChange={onChangeContent}
            />
            <div className="review--newposting--button--forFlex">
              <button className="review--newposting--button" onClick={onSubmitPosting}>
                <span>??????</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewPostingModal;
