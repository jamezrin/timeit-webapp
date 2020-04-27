import React, { useState } from 'react';

import { Box, Flex, Heading, IconButton, Text, useColorMode } from '@chakra-ui/core';

const MenuItems = ({ children }) => (
  <Text mt={{ base: 4, md: 0 }} mr={6} display="block">
    {children}
  </Text>
);

const Header = (props) => {
  const [collapse, setCollapse] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="1rem"
      bg="white.500"
      color="blue.500"
      shadow="md"
      {...props}
    >
      <Flex align="center" mr={5}>
        <Heading as="h1" size="lg">
          TimeIt
        </Heading>
      </Flex>

      <Box display={{ sm: 'block', md: 'none' }} onClick={() => setCollapse(!collapse)}>
        <svg fill="white" width="12px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <title>Menu</title>
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
        </svg>
      </Box>

      <Box
        display={{ sm: collapse ? 'block' : 'none', md: 'flex' }}
        width={{ sm: 'full', md: 'auto' }}
        alignItems="center"
        flexGrow={1}
      >
        {/*
        <MenuItems>Docs</MenuItems>
        <MenuItems>Examples</MenuItems>
        <MenuItems>Blog</MenuItems>
        */}
      </Box>

      <Box display={{ sm: collapse ? 'block' : 'none', md: 'block' }} mt={{ base: 4, md: 0 }}>
        <IconButton variant="ghost" icon={colorMode === 'dark' ? 'sun' : 'moon'} onClick={toggleColorMode} />
      </Box>
    </Flex>
  );
};

export default Header;
