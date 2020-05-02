import React, { useContext, useState } from 'react';

import { Box, Flex, Heading, IconButton, Text, useColorMode } from '@chakra-ui/core';
import { RiLogoutBoxRLine } from 'react-icons/ri';
import AuthContext, { requestDeauthentication } from '../state/authenticationContext';
import { useToasts } from 'react-toast-notifications';

const MenuItems = ({ children }) => (
  <Text mt={{ base: 4, md: 0 }} mr={6} display="block">
    {children}
  </Text>
);

const Header = (props) => {
  const [collapse, setCollapse] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();
  const { refreshStatus } = useContext(AuthContext);
  const { addToast } = useToasts();

  const deauthenticateUser = () => {
    requestDeauthentication().then(() => {
      addToast('Has cerrado tu sesión correctamente', {
        appearance: 'info',
        autoDismiss: true,
      });

      refreshStatus();
    });
  };

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

      <Box display={{ base: 'block', md: 'none' }} onClick={() => setCollapse(!collapse)}>
        <svg
          fill={colorMode === 'dark' ? '#fff' : '#000'}
          width="12px"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Menu</title>
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
        </svg>
      </Box>

      <Box
        display={{ base: collapse ? 'block' : 'none', md: 'flex' }}
        width={{ base: 'full', md: 'auto' }}
        alignItems="center"
        flexGrow={1}
      >
        <MenuItems>Docs</MenuItems>
        <MenuItems>Examples</MenuItems>
        <MenuItems>Blog</MenuItems>
      </Box>

      <Box display={{ base: collapse ? 'block' : 'none', md: 'block' }} mt={{ base: 4, md: 0 }}>
        <IconButton variant="ghost" icon={colorMode === 'dark' ? 'sun' : 'moon'} onClick={toggleColorMode} mx={1} />
        <IconButton variant="ghost" fontSize="24px" icon={RiLogoutBoxRLine} onClick={deauthenticateUser} mx={1} />
      </Box>
    </Flex>
  );
};

export default Header;
