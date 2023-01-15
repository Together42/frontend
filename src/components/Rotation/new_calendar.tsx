import React, { useState, useEffect, useRef } from 'react';

export const SelectedDates = (props) => {
  const mounted = useRef(false);

  const getUnavailableDates = (value) => {
    const date = value.getDate();
    if (props.unavailableDates.find(date)) {
      props.unavailableDates.reduce(date);
      props.setUnavailableDates(props.unavailableDates);
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
    <div>
      {props.unavailableDates.map((e) => (
        <span>{e}</span>
      ))}
    </div>
  );
};
