import React from 'react';

import timeManagementSvg from '../assets/time_management.svg';
import mainAppCoverLogo from '../assets/brand-logo.svg';
import { Box, Flex, Image, Text, useColorMode } from '@chakra-ui/core';
import { noDragOrSelectCss } from '../utils';

export default function LoginRegisterLayout({ children }) {
  const { colorMode } = useColorMode();

  return (
    <Flex height="100vh" direction={{ base: 'column', lg: 'row' }}>
      <Box
        bg={
          colorMode === 'dark' ? 'gray.700' : { base: 'white', lg: 'gray.100' }
        }
        width={{ base: '100%', lg: 6 / 10 }}
        pb={10}
      >
        <Flex
          height="100%"
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Box
            py={{ base: 4, lg: 0 }}
            bg={{ base: 'gray.100', lg: 'none' }}
            width="100%"
          >
            <Image
              m="auto"
              maxWidth="15rem"
              src={mainAppCoverLogo}
              alt=""
              css={{
                ...noDragOrSelectCss,
              }}
            />
          </Box>

          <Image
            maxWidth="24rem"
            src={timeManagementSvg}
            display={{ base: 'none', lg: 'block' }}
            alt=""
            px={10}
            css={{
              ...noDragOrSelectCss,
            }}
          />

          <Text mt={8} px={4} maxWidth={{ base: 'auto', lg: '36rem' }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec
            tristique mi, ut faucibus sem. Integer eros purus, ultrices vitae
            lacus vitae, fermentum scelerisque nulla. Suspendisse fringilla
            ultrices nisl et cursus
          </Text>
        </Flex>
      </Box>

      <Box
        bg={
          colorMode === 'dark' ? 'gray.800' : { base: 'white', lg: 'gray.200' }
        }
        width={{ base: '100%', lg: 4 / 10 }}
        px={4}
        py={10}
      >
        {children}
      </Box>
    </Flex>
  );
}
