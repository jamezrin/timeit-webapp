import React from 'react';
import Header from './Header';
import { Flex } from '@chakra-ui/react';

function MainLayout({ children }) {
  return (
    <Flex height="100vh" direction="column">
      <Header />

      <Flex
        direction="column"
        maxWidth={{ base: '100%', lg: '100rem' }}
        marginX="auto"
        width="100%"
        height="100%"
      >
        {children}
      </Flex>
    </Flex>
  );
}

export default MainLayout;
