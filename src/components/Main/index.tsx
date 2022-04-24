import React from 'react';
import '@css/Main/Main.scss';
import Apply from './Apply';
import AttendeeList from './AttendeeList';
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
