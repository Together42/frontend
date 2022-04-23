import React from 'react';
import Header from '@utils/Header';
import Navbar from '@utils/Navbar';
import '@css/Main/Main.scss';
import Apply from './Apply';
import AttendeeList from './AttendeeList';
import Result from './Result';
import Footer from '@utils/Footer';

function Main() {
  return (
    <>
      <Header />
      <Navbar />
      <Apply />
      <AttendeeList />
      <Result />
      <Footer />
    </>
  );
}

export default Main;
