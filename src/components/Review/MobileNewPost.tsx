import React, { useCallback, useEffect, useState } from 'react';
import '@css/Review/MobileNewPost.scss';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import TextareaAutosize from 'react-textarea-autosize';
import axios from 'axios';
import errorAlert from '@globalObj/function/errorAlert';
import { getToken } from '@cert/TokenStorage';
import SelectedEvent from '@recoil/Review/SelectedEvent';
import SelectSomeModal from '@review/SelectSomeModal';
import SelectSomeModalShow from '@recoil/Review/SelectSomeModalShow';
import getAddress from '@globalObj/function/getAddress';
import SelectedTeam from '@recoil/Review/SelectedTeam';
import defaultImg from '@img/uploadDefault.png';
import UplaodBtn from '@review/UploadBtn';
import PreviewBox from './PreviewBox';
import { useSWRConfig } from 'swr';
import leftAngle from '@img/angle-left-solid.svg';
import { useNavigate } from 'react-router';
import { ReviewPostingFileType, ReviewPostingUrlType } from '@usefulObj/types';
import DeviceMode from '@recoil/DeviceMode';
import NewPostingModalShow from '@recoil/Review/NewPostingModalShow';

function MobileNewPost() {
  const navigate = useNavigate();
  const [selectSomeModalShow, setSelectSomeModalShow] = useRecoilState(SelectSomeModalShow);
  const [selectedEvent, setSelectedEvent] = useRecoilState(SelectedEvent);
  const [selectedTeam, setSelectedTeam] = useRecoilState(SelectedTeam);
  const setNewPostModalShow = useSetRecoilState(NewPostingModalShow);
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
    setSelectSomeModalShow(false);
    navigate('/review');
  }, [navigate, setSelectSomeModalShow]);

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
    setSelectSomeModalShow(true);
  };

  const onClickAddMemModalOpen = () => {
    if (selectedEvent) {
      setIsEventBtnClicked(false);
      setIsAddMemBtnClicked(true);
      setSelectSomeModalShow(true);
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
    if (deviceMode === 'desktop') {
      navigate('/review');
      setNewPostModalShow(true);
    }
  }, [deviceMode, navigate, setNewPostModalShow]);

  return deviceMode === 'mobile' ? (
    <div className="review--newposting--mobile--background">
      <div className="review--newposting--mobile--mobile_header">
        <img
          className="review--newposting--mobile--left_angle"
          src={leftAngle}
          alt={leftAngle}
          onClick={() => closeModal()}
        ></img>
      </div>
      <div className="review--newposting--mobile--imageBox">
        {!postUrlArr.length ? (
          <div className="review--newposting--mobile--add_files">
            <img className="review--newposting--mobile--add_file--upload_img" src={defaultImg} alt={defaultImg} />
            <p>???????????? ????????? ????????????!</p>
            <UplaodBtn innerText="?????????" onClickFunc={onClickUpload} />
          </div>
        ) : (
          <>
            <div className="review--newposting--mobile--added_files">
              <div className="review--newposting--mobile--add_files--submitted_wrapper">
                <div className="review--newposting--mobile--add_files--submitted_title">Uploads</div>
                <PreviewBox postUrlArr={postUrlArr} setPostFileArr={setPostFileArr} setPostUrlArr={setPostUrlArr} />
              </div>
              <UplaodBtn innerText="?????? ?????????" onClickFunc={onClickUpload} />
            </div>
          </>
        )}
      </div>
      <div className="review--newposting--mobile--submitBox">
        <div className="review--newposting--mobile--header">
          <input
            className="review--newposting--mobile--header--title"
            placeholder="?????? ??????"
            onFocus={(e) => (e.target.placeholder = '')}
            onBlur={(e) => (e.target.placeholder = '?????? ??????')}
            value={title}
            onChange={onChangeTitle}
          />
          <div className="review--newposting--mobile--header--selectorWrapper">
            <div className="review--newposting--mobile--header--eventSelector">
              <span onClick={onClickEventModalOpen}>{isEventMode ? '????????? ??????' : '?????? ??????'}</span>
              {isEventBtnClicked &&
                selectSomeModalShow &&
                (isEventMode ? <SelectSomeModal mode="modal_event" /> : <SelectSomeModal mode="modal_team" />)}
            </div>
            <div className="review--newposting--mobile--header--addTeamMem">
              <span onClick={onClickAddMemModalOpen}>?????? ??????</span>
              {isAddMemBtnClicked && selectSomeModalShow && <SelectSomeModal mode="modal_addMem" />}
            </div>
          </div>
        </div>
        {(selectedEvent || selectedTeam) && (
          <div className="review--newposting--mobile--selectedInfo">
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
        <div className="review--newposting--mobile--newposting_wrapper">
          <TextareaAutosize
            className="review--newposting--mobile--newposting"
            minRows={10}
            placeholder="?????? ??????????????????"
            value={content}
            onChange={onChangeContent}
          />
          <div className="review--newposting--mobile--button--forFlex">
            <button className="review--newposting--mobile--button" onClick={onSubmitPosting}>
              <span>??????</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null;
}

export default MobileNewPost;
