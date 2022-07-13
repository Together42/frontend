import React, { useCallback, useEffect, useState } from 'react';
import '@css/Review/EditPostingModal.scss';
import Xmark from '@img/xmark-solid-white.svg';
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

function NewEditPostingModal(props: {
  boardId: number;
  setEditPostingModalShow: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { boardId, setEditPostingModalShow } = props;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [postFileArr, setPostFileArr] = useState<ReviewPostingFileType[]>([]);
  const [postUrlArr, setPostUrlArr] = useState<ReviewPostingUrlType[]>([]);
  const [boardImgArr, setBoardImgArr] = useState<ReviewPostingUrlType[]>([]);
  const { mutate } = useSWRConfig();
  const { data: boardObj, mutate: mutateBoard } = useSWR<ReviewBoardType>(
    `${getAddress()}/api/board/${boardId}`,
    fetcher,
    {
      dedupingInterval: 600000,
    },
  );

  const closeModal = useCallback(() => {
    setEditPostingModalShow(false);
  }, [setEditPostingModalShow]);

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
          boardObj['images'].filter((obj) => !boardImgArr.find((elem) => elem['url'] !== obj['filePath'])),
        );
      if (postFileArr.length) {
        postFileArr.forEach((file) => formData.append(file['type'].slice(0, 5), file['file']));
        formData.append('boardId', boardId);
        await axios.post(`${getAddress()}/api/board/upload`, formData).catch((err) => errorAlert(err));
      }
    },
    [boardImgArr, boardObj, deleteImage, postFileArr],
  );

  const postEditPosting = useCallback(() => {
    axios
      .put(
        `${getAddress()}/api/board/${boardId}`,
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
        await postImage(boardId.toString());
        mutate(`${getAddress()}/api/board/?eventId=${boardObj['eventId']}`);
        mutate(`${getAddress()}/api/board`);
        mutateBoard();
        alert('성공적으로 수정되었습니다');
        setEditPostingModalShow(false);
      })
      .catch((err) => errorAlert(err));
  }, [boardId, boardObj, content, mutate, mutateBoard, postImage, setEditPostingModalShow, title]);

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

  return (
    <div className="review--editposting--background" onClick={() => closeModal()}>
      <img className="review--editposting--xmark" src={Xmark} alt={Xmark}></img>
      <div className="review--editposting-devision" onClick={(e) => e.stopPropagation()}>
        <div className="review--editposting--left_division">
          <UplaodBtn mode="more" innerText="추가 업로드" onClickFunc={onClickUpload} />
          <div className="review--editposting--add_files">
            <div className="review--editposting--add_files--submitted_wrapper">
              <div className="review--editposting--add_files--submitted_title">Uploads</div>
              <PreviewBox
                boardImgArr={boardImgArr}
                postUrlArr={postUrlArr}
                setPostFileArr={setPostFileArr}
                setPostUrlArr={setPostUrlArr}
                setBoardImgArr={setBoardImgArr}
              />
            </div>
          </div>
        </div>
        <div className="review--editposting--right_division">
          <div className="review--editposting--header">
            <input
              className="review--editposting--header--title"
              placeholder="제목 입력"
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = '제목 입력')}
              value={title}
              onChange={onChangeTitle}
            />
          </div>
          <div className="review--editposting--editposting_wrapper">
            <TextareaAutosize
              className="review--editposting--editposting"
              minRows={10}
              placeholder="글을 작성해주세요"
              value={content}
              onChange={onChangeContent}
            />
            <div className="review--editposting--button--forFlex">
              <button className="review--editposting--button" onClick={onSubmitPosting}>
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
