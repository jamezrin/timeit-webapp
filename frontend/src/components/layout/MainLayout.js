import React from 'react';
import Header from '../Header';

function MainLayout({ children }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}

export default MainLayout;
