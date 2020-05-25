import { List, ListItem, PseudoBox, useColorMode } from '@chakra-ui/core';
import { Link } from 'react-router-dom';
import React from 'react';

function ProjectSessionList({ getMemberFullName, sessions, projectInfo }) {
  const { colorMode } = useColorMode();

  return (
    <List>
      {sessions &&
        sessions.map((session) => (
          <ListItem key={session.id}>
            <Link to={`/project/${projectInfo.id}/session/${session.id}`}>
              <PseudoBox
                bg={colorMode === 'dark' ? 'gray.900' : 'gray.100'}
                shadow="md"
                p={3}
                mb={4}
                _hover={{
                  transform: 'scale(1.03)',
                }}
              >
                Sesión {session.id} | {session.createdAt} |{' '}
                {session.endedAt || 'En curso'}
              </PseudoBox>
            </Link>
          </ListItem>
        ))}
    </List>
  );
}

export default ProjectSessionList;
