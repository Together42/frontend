import React from 'react';
import '@css/Main/Main.scss';
import Apply from '@main/Apply';
import AttendeeList from '@main/AttendeeList';
import Footer from '@utils/Footer';
import { Home } from '@main/Home';

function Main() {
  return (
    <>
      <Apply />
      <AttendeeList />
      <Footer />
      {/*<Home />*/}
    </>
  );
}

export default Main;
