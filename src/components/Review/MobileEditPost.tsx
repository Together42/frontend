import React, { useCallback, useEffect, useState } from 'react';
import '@css/Review/MobileEditPost.scss';
import leftAngle from '@img/angle-left-solid.svg';
import TextareaAutosize from 'react-textarea-autosize';
import axios from 'axios';
import errorAlert from '@globalObj/function/errorAlert';
import { getToken } from '@cert/TokenStorage';
import getAddress from '@globalObj/function/getAddress';
import { imageType, ReviewBoardType, ReviewPostingFileType, ReviewPostingUrlType } from '@globalObj/object/types';
import UplaodBtn from '@utils/uploadBtn';
import PreviewBox from './PreviewBox';
import useSWR, { useSWRConfig } from 'swr';
import fetcher from '@globalObj/function/fetcher';
import { useNavigate, useParams } from 'react-router';
import DeviceMode from '@recoil/DeviceMode';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import EditPostingModalShow from '@recoil/Review/EditPostingModalShow';

function MobileEditPost() {
  const { id: boardId } = useParams();
  const navigate = useNavigate();
  const deviceMode = useRecoilValue(DeviceMode);
  const setEditPostingModalShow = useSetRecoilState(EditPostingModalShow);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [postFileArr, setPostFileArr] = useState<ReviewPostingFileType[]>([]);
  const [postUrlArr, setPostUrlArr] = useState<ReviewPostingUrlType[]>([]);
  const [boardImgArr, setBoardImgArr] = useState<ReviewPostingUrlType[]>([]);
  const { mutate } = useSWRConfig();
  const { data: boardObj, mutate: mutateBoard } = useSWR<ReviewBoardType>(
    `${getAddress()}/api/board/${Number(boardId)}`,
    fetcher,
    {
      dedupingInterval: 600000,
    },
  );

  const closeModal = useCallback(() => {
    navigate('/review');
  }, [navigate]);

  const deleteImage = useCallback(
    async (deleteBoardImg: imageType[]) => {
      deleteBoardImg.forEach(async (obj) => {
        await axios
          .delete(`${getAddress()}/api/board/image/remove/${obj['imageId']}`)
          .then(() => {
            mutate(`${getAddress()}/api/board/?eventId=${boardObj['eventId']}`);
            mutate(`${getAddress()}/api/board`);
            mutateBoard();
          })
          .catch((err) => errorAlert(err));
      });
    },
    [boardObj, mutate, mutateBoard],
  );

  const postImage = useCallback(
    async (boardId: string) => {
      const formData = new FormData();
      if (boardObj['images'].length !== boardImgArr.length)
        await deleteImage(
          boardObj['images'].filter((obj) => !boardImgArr.find((elem) => elem['url'] === obj['filePath'])),
        );
      if (postFileArr.length) {
        postFileArr.forEach((file) => formData.append('image', file['file']));
        formData.append('boardId', boardId);
        await axios.post(`${getAddress()}/api/board/upload`, formData).catch((err) => errorAlert(err));
      }
    },
    [boardImgArr, boardObj, deleteImage, postFileArr],
  );

  const postEditPosting = useCallback(() => {
    axios
      .put(
        `${getAddress()}/api/board/${Number(boardId)}`,
        {
          eventId: boardObj['eventId'],
          title,
          contents: content,
        },
        {
          headers: {
            Authorization: 'Bearer ' + getToken(),
          },
        },
      )
      .then(async () => {
        await postImage(boardId);
        mutate(`${getAddress()}/api/board/?eventId=${boardObj['eventId']}`);
        mutate(`${getAddress()}/api/board`);
        mutateBoard();
        closeModal();
        alert('성공적으로 수정되었습니다');
      })
      .catch((err) => errorAlert(err));
  }, [boardId, boardObj, closeModal, content, mutate, mutateBoard, postImage, title]);

  const onChangeTitle = (e: any) => {
    setTitle(e.target.value);
  };

  const onChangeContent = (e: any) => {
    setContent(e.target.value);
  };

  const onSubmitPosting = () => {
    if (getToken()) {
      postEditPosting();
    } else alert('로그인을 하셔야 포스팅 하실 수 있습니다');
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
    return () => {
      closeModal();
    };
  }, [closeModal, mutateBoard]);

  useEffect(() => {
    if (boardObj) {
      setTitle(boardObj['title']);
      setContent(boardObj['contents']);
      setBoardImgArr(
        boardObj['images'].map((obj) => ({
          id: obj['imageId'],
          url: obj['filePath'],
          type: obj['fileType'],
        })),
      );
    }
  }, [boardObj]);

  useEffect(() => {
    if (deviceMode === 'desktop') navigate('/review');
  }, [deviceMode, navigate]);

  useEffect(() => {
    if (deviceMode === 'desktop') {
      navigate(`/review`);
      setEditPostingModalShow((prev) => {
        return { ...prev, [boardId]: true };
      });
    }
  }, [boardId, deviceMode, navigate, setEditPostingModalShow]);

  return (
    <div className="review--editposting--mobile--background">
      <div className="review--editposting--mobile--mobile_header">
        <img
          className="review--editposting--mobile--left_angle"
          src={leftAngle}
          alt={leftAngle}
          onClick={() => closeModal()}
        ></img>
      </div>
      <div className="review--editposting--mobile--imageBox">
        <div className="review--editposting--mobile--add_files">
          <div className="review--editposting--mobile--add_files--submitted_wrapper">
            <div className="review--editposting--mobile--add_files--submitted_title">Uploads</div>
            <PreviewBox
              boardImgArr={boardImgArr}
              postUrlArr={postUrlArr}
              setPostFileArr={setPostFileArr}
              setPostUrlArr={setPostUrlArr}
              setBoardImgArr={setBoardImgArr}
            />
          </div>
          <UplaodBtn innerText="추가 업로드" onClickFunc={onClickUpload} />
        </div>
      </div>
      <div className="review--editposting--mobile--submitBox">
        <div className="review--editposting--mobile--header">
          <input
            className="review--editposting--mobile--header--title"
            placeholder="제목 입력"
            onFocus={(e) => (e.target.placeholder = '')}
            onBlur={(e) => (e.target.placeholder = '제목 입력')}
            value={title}
            onChange={onChangeTitle}
          />
        </div>
        <div className="review--editposting--mobile--editposting_wrapper">
          <TextareaAutosize
            className="review--editposting--mobile--editposting"
            minRows={10}
            placeholder="글을 작성해주세요"
            value={content}
            onChange={onChangeContent}
          />
          <div className="review--editposting--mobile--button--forFlex">
            <button className="review--editposting--mobile--button" onClick={onSubmitPosting}>
              <span>게시</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MobileEditPost;
