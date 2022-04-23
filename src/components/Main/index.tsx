import React from 'react';
import Header from '@utils/Header';
import Navbar from '@utils/Navbar';
import '@css/Main.scss';
import MainSubmit from './MainSubmit';
import MainList from './MainList';
import MainResult from './MainResult';
import Footer from '@utils/Footer';

function Main() {
  return (
    <>
      <Header />
      <Navbar />
      <MainSubmit />
      <MainList />
      <MainResult />
      <Footer />
    </>
  );
}

export default Main;
