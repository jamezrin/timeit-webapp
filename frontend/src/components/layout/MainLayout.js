import React from 'react';
import { Flex, Box } from '@chakra-ui/core';
import Header from '../Header';

const MainLayout = ({ children }) => {
  return (
    <Flex width="100vw" height="100vh" direction="column">
      <Header />
      {children}
    </Flex>
  );
};

export default MainLayout;
