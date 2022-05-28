import { PostingType } from '@globalObj/object/types';
import errorAlert from '@globalObj/function/errorAlert';
import axios from 'axios';
import { SetterOrUpdater } from 'recoil';
import getAddress from './getAddress';

function GetBoards(
  eventId: number,
  setBoardsObj: SetterOrUpdater<{
    [x: string]: PostingType[];
  }>,
) {
  axios
    .get(`${getAddress()}/api/board/?eventId=${eventId}`)
    .then((res) => {
      setBoardsObj(res.data);
    })
    .catch((err) => errorAlert(err));
}

export default GetBoards;
