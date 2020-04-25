import React from 'react';
import { Link } from 'react-router-dom';
import { Box, List, ListItem, useColorMode } from '@chakra-ui/core';

export default function DebugNav() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box
      position="fixed"
      zIndex="20"
      bottom="0"
      left="0"
      p={4}
      m={3}
      rounded="md"
      bg={colorMode === 'dark' ? 'gray.900' : 'white'}
      shadow="xl"
    >
      <List>
        <ListItem>
          <Link to="/login">Login</Link>
        </ListItem>
        <ListItem>
          <Link to="/register">Register</Link>
        </ListItem>
        <ListItem>
          <Link to="/test1">Test1</Link>
        </ListItem>
        <ListItem>
          <Link to="/home">Home</Link>
        </ListItem>
      </List>
    </Box>
  );
}
