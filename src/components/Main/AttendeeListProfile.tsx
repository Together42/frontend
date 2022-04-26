import React, { useRef } from 'react';
import Xmark from '@img/xmark-solid.svg';
import '@css/Main/AttendeeListProfile.scss';

interface Props {
  intraID: string;
  index: number;
  image: string;
}

function AttendeeListProfile(props: Props) {
  const { intraID, index, image } = props;
  const xMarkRef = useRef(null);
  // console.log(xMarkRef);
  return (
    <div
      className="main--attendeeList--profile_wrapper"
      key={index}
      onMouseOver={() => {
        xMarkRef.current.style.visibility = 'visible';
      }}
      onMouseOut={() => {
        xMarkRef.current.style.visibility = 'hidden';
      }}
    >
      <img className="main--attendeeList--profile_image" src={image} alt={`profile${index}`} />
      <p>{intraID}</p>
      <img className={`main--attendeeList--xmark`} src={Xmark} alt={Xmark} ref={xMarkRef} />
    </div>
  );
}

export default AttendeeListProfile;
