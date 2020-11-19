import React, { useContext, useState } from 'react';

import {
  Box,
  Flex,
  Heading,
  IconButton,
  Text,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { RiLogoutBoxRLine } from 'react-icons/ri';
import AuthContext, {
  requestDeauthentication,
} from '../../state/authenticationContext';
import { useToasts } from 'react-toast-notifications';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

// eslint-disable-next-line no-unused-vars
const MenuItems = ({ children }) => (
  <Text mt={{ base: 4, md: 0 }} mr={6} display="block">
    {children}
  </Text>
);

export default function Header(props) {
  const [collapse, setCollapse] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();
  const { refreshStatus } = useContext(AuthContext);
  const { addToast } = useToasts();
  const navbarBg = useColorModeValue('white', 'gray.800');

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
      bg={navbarBg}
      color="blue.500"
      shadow="md"
      position="sticky"
      top="0"
      {...props}
      zIndex="100"
    >
      <Flex align="center" mr={5}>
        <Heading as="h1" fontSize="24px">
          TimeIt
        </Heading>
      </Flex>

      <Box
        display={{ base: 'block', md: 'none' }}
        onClick={() => setCollapse(!collapse)}
      >
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
        {/*
        <MenuItems>Docs</MenuItems>
        <MenuItems>Examples</MenuItems>
        <MenuItems>Blog</MenuItems>
        */}
      </Box>

      <Box
        display={{ base: collapse ? 'block' : 'none', md: 'block' }}
        mt={{ base: 4, md: 0 }}
      >
        <IconButton
          aria-label="Cambiar modo de color"
          variant="ghost"
          icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
          onClick={toggleColorMode}
          mx={1}
        />
        <IconButton
          aria-label="Cerrar sesión"
          variant="ghost"
          icon={<RiLogoutBoxRLine />}
          fontSize="24px"
          onClick={deauthenticateUser}
          mx={1}
        />
      </Box>
    </Flex>
  );
}
