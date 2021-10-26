import React from 'react';
import { Flex, Spinner, Text } from '@chakra-ui/react';

export const FullPageLoadSpinner = ({ message = 'Cargando la aplicación' }) => (
  <Flex
    flexGrow={1}
    justifyContent="center"
    alignItems="center"
    direction="column"
  >
    <Spinner
      thickness="4px"
      speed="0.65s"
      emptyColor="gray.200"
      color="blue.500"
      size="xl"
    />
    <Text mt={4}>{message}</Text>
  </Flex>
);

export default FullPageLoadSpinner;
