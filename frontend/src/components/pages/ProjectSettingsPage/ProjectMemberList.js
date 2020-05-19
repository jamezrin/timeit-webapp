import React, { useEffect, useState } from 'react';
import { Box, Divider, Heading, List, ListItem, useColorMode } from '@chakra-ui/core';
import { useToasts } from 'react-toast-notifications';
import axios from 'axios';

const projectsEndpoint = process.env.REACT_APP_BACKEND_URL + '/projects';
const requestProjectMembers = (projectId) => axios.get(`${projectsEndpoint}/${projectId}/members`, { withCredentials: true }); // prettier-ignore

function ProjectMemberList({ projectInfo }) {
  const [members, setMembers] = useState(null);
  const { colorMode } = useColorMode();
  const { addToast } = useToasts();

  useEffect(() => {
    requestProjectMembers(projectInfo.id)
      .then((res) => {
        setMembers(res.data);
      })
      .catch((err) => {
        addToast(`Ha ocurrido un error desconocido: ${err}`, {
          appearance: 'error',
          autoDismiss: true,
        });
      });
  }, [addToast, projectInfo]);

  return (
    <Box p={4} mt={12} bg={colorMode === 'dark' ? 'gray.700' : 'gray.100'} rounded="md">
      <Heading as="h2" size="md">
        Miembros del proyecto
      </Heading>

      <Divider />

      <List mt={4}>
        {members &&
          members.map((member) => (
            <ListItem
              key={member.id}
              bg={colorMode === 'dark' ? 'gray.600' : 'gray.200'}
              p="3"
              _hover={{
                transform: 'scale(1.01)',
              }}
            >
              {member.user.firstName} {member.user.lastName}
            </ListItem>
          ))}
      </List>
    </Box>
  );
}

export default ProjectMemberList;
