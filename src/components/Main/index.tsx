import React from 'react';
import '@css/Main/Main.scss';
import Apply from '@main/Apply';
import AttendeeList from '@main/AttendeeList';
import Footer from '@utils/Footer';

function Main() {
  return (
    <>
      <Apply />
      <AttendeeList />
      <Footer />
    </>
  );
}

export default Main;
