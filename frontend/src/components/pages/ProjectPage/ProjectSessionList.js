import { List, ListItem, PseudoBox, useColorMode } from '@chakra-ui/core';
import { Link } from 'react-router-dom';
import React from 'react';

function ProjectSessionList({ sessions, projectInfo }) {
  const { colorMode } = useColorMode();

  return (
    <List mt={12}>
      {sessions &&
        sessions.map((session) => (
          <ListItem key={session.id}>
            <Link to={`/project/${projectInfo.id}/session/${session.id}`}>
              <PseudoBox
                bg={colorMode === 'dark' ? 'gray.900' : 'gray.100'}
                shadow="md"
                p={6}
                mb={4}
                _hover={{
                  transform: 'scale(1.03)',
                }}
              >
                Sesión {session.id}
              </PseudoBox>
            </Link>
          </ListItem>
        ))}
    </List>
  );
}

export default ProjectSessionList;
