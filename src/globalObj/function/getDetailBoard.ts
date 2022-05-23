import { ReviewBoardType } from '@globalObj/object/types';
import errorAlert from '@utils/errorAlert';
import axios from 'axios';
import getAddress from './getAddress';

function getDetailBoard(boardId: number, setBoardObj: React.Dispatch<React.SetStateAction<ReviewBoardType>>) {
  axios
    .get(`${getAddress()}/api/board/${boardId}`)
    .then((res) => {
      setBoardObj(res.data);
    })
    .catch((err) => errorAlert(err));
}

export default getDetailBoard;
