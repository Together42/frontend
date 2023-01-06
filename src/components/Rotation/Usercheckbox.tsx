import React, { useEffect, useState } from 'react';
import getAddress from '@globalObj/function/getAddress';
import axios from 'axios';
import '@css/Rotation/Rotation.scss';

const Issue = (props) => {
  const [Checked, setChecked] = useState(false);

  const checkHandler = ({ target }) => {
    setChecked(!Checked);
    checkedItemHandler(target.id, target.checked);
    console.log(target);
  };

  const checkedItemHandler = (id, isChecked) => {
    if (isChecked) {
      props.checkedItems.add(id);
      props.setCheckedItems(props.checkedItems);
    } else if (!isChecked && props.checkedItems.has(id)) {
      props.checkedItems.delete(id);
      props.setCheckedItems(props.checkedItems);
    }
  };
  console.log(props.checkedItems);

  return (
    <div className="pretty p-curve rotation--eachUserInput">
      <input type="checkbox" id={props.id} checked={Checked} onChange={(e) => checkHandler(e)} />
      <div className="state p-info">
        <label>{props.id}</label>
      </div>
    </div>
  );
};

export const CheckedUserList = () => {
  const [UserList, setUserList] = useState(null);
  const [checkedItems, setCheckedItems] = useState(new Set());

  const getUserList = () => {
    axios
      .get(`${getAddress()}/api/auth/userList`)
      .then((res) => res.data.userList)
      .then((res2) => setUserList(res2))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getUserList();
  }, []);

  return (
    <>
      {UserList
        ? UserList.map((e) => <Issue id={e['intraId']} checkedItems={checkedItems} setCheckedItems={setCheckedItems} />)
        : null}
    </>
  );
};
