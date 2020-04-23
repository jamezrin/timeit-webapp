import React from 'react';
import { Link } from 'react-router-dom';
import { Box, List, ListItem } from '@chakra-ui/core';

export default function DebugNav() {
  return (
    <Box position="absolute" bottom="0" left="0" py={2} px={4} m={3} rounded="md" bg="white" shadow="xl">
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
