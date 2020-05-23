import React, { useCallback, useState } from 'react';
import { Box, Button, Divider, Heading, Input, InputGroup, Text, useColorMode } from '@chakra-ui/core';
import { useToasts } from 'react-toast-notifications';
import axios from 'axios';

const projectsEndpoint = process.env.REACT_APP_BACKEND_URL + '/projects';
const requestProjectInvite = (projectId, emailAddress) => axios.post(
  `${projectsEndpoint}/${projectId}/invite`,
  { emailAddress },
  { withCredentials: true }
); // prettier-ignore

function InviteProjectSettings({ projectInfo }) {
  const [emailAddress, setEmailAddress] = useState('');
  const { colorMode } = useColorMode();
  const { addToast } = useToasts();

  const inviteUser = useCallback(() => {
    requestProjectInvite(projectInfo.id, emailAddress)
      .then((res) => {
        addToast(`Has enviado una invitación a "${emailAddress}"`, {
          appearance: 'success',
          autoDismiss: true,
        });

        setEmailAddress('');
      })
      .catch((err) => {
        if (err.response && err.response.data.error) {
          if (err.response.data.error.type === 'ACCOUNT_NOT_FOUND') {
            addToast('No existe ningún usuario con ese correo electrónico', {
              appearance: 'error',
              autoDismiss: true,
            });
          } else if (err.response.data.error.type === 'ALREADY_PROJECT_MEMBER') {
            addToast('Este usuario ya es un miembro del proyecto', {
              appearance: 'error',
              autoDismiss: true,
            });
          }
        } else {
          addToast(`Ha ocurrido un error desconocido: ${err}`, {
            appearance: 'error',
            autoDismiss: true,
          });
        }
      });
  }, [projectInfo, emailAddress, addToast]);

  return (
    <Box p={4} mt={12} bg={colorMode === 'dark' ? 'gray.700' : 'gray.100'} rounded="md">
      <Heading as="h2" size="md">
        Invitar a usuario
      </Heading>

      <Divider />

      <Text mt={4}>
        Invita a un usuario para monitorizar su trabajo. Podrás cambiar su rol en la lista de miembros. Aparecerá como
        un miembro cuando acepte la invitación.
      </Text>

      <InputGroup mt={4}>
        <Input
          width="auto"
          flexGrow="1"
          name="projectName"
          id="projectName"
          type="text"
          placeholder="Correo electrónico"
          value={emailAddress}
          onChange={(e) => setEmailAddress(e.target.value)}
        />

        <Button ml={6} variantColor="blue" onClick={inviteUser}>
          Invitar usuario
        </Button>
      </InputGroup>
    </Box>
  );
}

export default InviteProjectSettings;
