import React, { useCallback, useEffect, useState } from 'react';
import '@css/Review/MobileEditPost.scss';
import leftAngle from '@img/angle-left-solid.svg';
import TextareaAutosize from 'react-textarea-autosize';
import axios from 'axios';
import errorAlert from '@globalObj/function/errorAlert';
import { getToken } from '@cert/TokenStorage';
import getAddress from '@globalObj/function/getAddress';
import { imageType, ReviewBoardType } from '@globalObj/object/types';
import UplaodBtn from '@utils/uploadBtn';
import PreviewBox from './PreviewBox';
import useSWR, { useSWRConfig } from 'swr';
import fetcher from '@globalObj/function/fetcher';
import { useNavigate, useParams } from 'react-router';

function MobileEditPost() {
  const { id: boardId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [postFileArr, setPostFileArr] = useState<File[]>([]);
  const [postUrlArr, setPostUrlArr] = useState<string[]>([]);
  const [boardImgArr, setBoardImgArr] = useState<string[]>([]);
  const [deleteImgArr, setDeleteImgArr] = useState<string[]>([]);
  const [deleteIdxArr, setDeleteIdxArr] = useState<number[]>([]);
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
        await deleteImage(boardObj['images'].filter((obj) => !boardImgArr.includes(obj['filePath'])));
      if (postFileArr.length) {
        postFileArr.forEach((file) => formData.append('image', file));
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
    setPostFileArr((prev) => prev.concat(Object.values(e.target.files)));
    setPostUrlArr((prev) => prev.concat(Array.from(e.target.files).map((file: Blob) => URL.createObjectURL(file))));
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
      setBoardImgArr(boardObj['images'].map((imgObj) => imgObj['filePath']));
    }
  }, [boardObj]);

  useEffect(() => {
    if (deleteImgArr.length > 0) {
      setBoardImgArr((prev) => prev.filter((img) => !deleteImgArr.includes(img)));
      setPostFileArr((prev) => prev.filter((_, idx) => !deleteIdxArr.includes(idx)));
      setPostUrlArr((prev) => prev.filter((img) => !deleteImgArr.includes(img)));
    }
  }, [deleteIdxArr, deleteImgArr]);

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
              mode="edit"
              setDeleteImgArr={setDeleteImgArr}
              setDeleteIdxArr={setDeleteIdxArr}
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
