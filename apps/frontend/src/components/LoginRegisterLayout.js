import React from 'react';

import { Box, Button, Flex, Image, Text } from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/color-mode';
import timeManagementSvg from '../assets/time_management.svg';
import mainAppCoverLogo from '../assets/brand-logo.svg';
import { noDragOrSelectCss } from '../utils';

export default function LoginRegisterLayout({ children }) {
  const imageBoxBg = useColorModeValue(
    { base: 'gray.100', lg: 'transparent' },
    'gray.900',
  );
  const wrapperBg = useColorModeValue('gray.100', 'gray.900');
  const childWrapperBg = useColorModeValue(
    { base: 'white', lg: 'gray.200' },
    'gray.800',
  );

  return (
    <Flex height="100vh" direction={{ base: 'column', lg: 'row' }}>
      <Box bg={wrapperBg} width={{ base: '100%', lg: 6 / 10 }} pb={10}>
        <Flex
          height="100%"
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Box py={{ base: 4, lg: 0 }} bg={imageBoxBg} width="100%">
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

          <Box mt={8} px={4} maxWidth={{ base: 'auto', lg: '36rem' }}>
            <Text textAlign="justify">
              Bienvenido/a a TimeIt, una plataforma de código abierto y libre
              para controlar tu tiempo. Podrás crear proyectos con multiples
              usuarios y utilizar tu cliente de escritorio para ver que
              aplicaciones estás usando y durante cuanto tiempo. Con un diseño
              minimalista y usando las tecnologías mas modernas para dar una
              buena experiencia de usuario.
            </Text>
          </Box>

          <Box
            as="a"
            mt={5}
            href="https://github.com/jamezrin/timeit-client"
            target="_blank"
          >
            <Button colorScheme="blue">Cliente de escritorio</Button>
          </Box>
        </Flex>
      </Box>

      <Box
        bg={childWrapperBg}
        width={{ base: '100%', lg: 4 / 10 }}
        px={4}
        py={10}
      >
        {children}
      </Box>
    </Flex>
  );
}
