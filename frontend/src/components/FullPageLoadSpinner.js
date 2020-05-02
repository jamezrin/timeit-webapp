import { Flex, Spinner, Text } from '@chakra-ui/core';
import React from 'react';

export const FullPageLoadSpinner = ({ message }) => (
  <Flex height="100vh" width="100vw" justifyContent="center" alignItems="center" direction="column">
    <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
    <Text mt={4}>{message}</Text>
  </Flex>
);

FullPageLoadSpinner.defaultProps = {
  message: 'Cargando la aplicación',
};

export default FullPageLoadSpinner;
