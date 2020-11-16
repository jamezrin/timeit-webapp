import { Flex, Spinner, Text } from '@chakra-ui/react';
import React from 'react';

export const FullPageLoadSpinner = ({ message = 'Cargando la aplicación' }) => (
  <Flex
    height="100%"
    justifyContent="center"
    alignItems="center"
    direction="column"
  >
    <Spinner
      thickness="4px"
      speed="0.65s"
      emptyColor="gray.200"
      color="blue.500"
      boxSize="xl"
    />
    <Text mt={4}>{message}</Text>
  </Flex>
);

export default FullPageLoadSpinner;
