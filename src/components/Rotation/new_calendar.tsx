import React, { useEffect, useRef } from 'react';

export const SelectedDates = (props) => {
  const mounted = useRef(false);
  var arr;

  const getUnavailableDates = (value) => {
    const date = value.getDate();
    if (props.unavailableDates.indexOf(date) > -1) {
      arr = props.unavailableDates.filter((e) => e != date);
      props.setUnavailableDates(arr);
    } else {
      props.unavailableDates.push(date);
      props.setUnavailableDates(props.unavailableDates);
    }
  };

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
    } else {
      getUnavailableDates(props.value);
    }
  }, [props.value]);

  return (
    <>
      {props.unavailableDates.length == 0 && <span>선택된 날짜가 없습니다</span>}
      {props.unavailableDates.map((e) => {
        return <span>{e}</span>;
      })}
    </>
  );
};
