import React from 'react';

import timeManagementSvg from '../assets/time_management.svg';
import mainAppCoverLogo from '../assets/logo/TimeIt-logo/cover.png';
import { Box, Flex, Image, Text } from '@chakra-ui/core';

export default function LoginRegisterLayout({ children }) {
  return (
    <Flex height="100vh" width="100vw" direction={{ base: 'column', lg: 'row' }}>
      <Box bg="gray.100" width={{ base: '100%', lg: 6 / 10 }}>
        <Flex height="100%" direction="column" justifyContent="center" alignItems="center">
          <Image width={'20rem'} src={mainAppCoverLogo} alt="" />

          <Image width={'24rem'} src={timeManagementSvg} alt="" />
          <Text mt={8} width={'36rem'} textAlign="center">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec tristique mi, ut faucibus sem. Integer eros
            purus, ultrices vitae lacus vitae, fermentum scelerisque nulla. Suspendisse fringilla ultrices nisl et
            cursus
          </Text>
        </Flex>
      </Box>

      <Box py={8} bg="gray.200" px={4} width={{ base: '100%', lg: 4 / 10 }}>
        {children}
      </Box>
    </Flex>
  );
}
