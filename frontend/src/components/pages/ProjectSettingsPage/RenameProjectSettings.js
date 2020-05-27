import React, { useCallback, useState } from 'react';
import {
  Box,
  Button,
  Divider,
  Heading,
  Input,
  InputGroup,
  Text,
  useColorMode,
} from '@chakra-ui/core';
import { useToasts } from 'react-toast-notifications';
import axios from 'axios';

const projectsEndpoint = process.env.REACT_APP_BACKEND_URL + '/projects';
const requestProjectRename = (projectId, name) =>
  axios.patch(
    `${projectsEndpoint}/${projectId}`,
    { name },
    { withCredentials: true },
  );

function RenameProjectSettings({ projectInfo, setProjectInfo }) {
  const [projectName, setProjectName] = useState('');
  const { colorMode } = useColorMode();
  const { addToast } = useToasts();

  const inviteUser = useCallback(() => {
    requestProjectRename(projectInfo.id, projectName)
      .then((res) => {
        addToast(`Has cambiado el nombre del proyecto a "${projectName}"`, {
          appearance: 'success',
          autoDismiss: true,
        });

        setProjectInfo({
          ...projectInfo,
          name: projectName,
        });

        setProjectName('');
      })
      .catch((err) => {
        addToast(`Ha ocurrido un error desconocido: ${err}`, {
          appearance: 'error',
          autoDismiss: true,
        });
      });
  }, [projectInfo, setProjectInfo, projectName, addToast]);

  return (
    <Box
      p={4}
      mt={12}
      bg={colorMode === 'dark' ? 'gray.700' : 'gray.100'}
      rounded="md"
    >
      <Heading as="h2" size="md">
        Cambiar nombre de proyecto
      </Heading>

      <Divider />

      <Text mt={4}>Aquí puedes cambiar el nombre del proyecto.</Text>

      <InputGroup mt={4}>
        <Input
          width="auto"
          flexGrow="1"
          name="projectName"
          id="projectName"
          type="text"
          placeholder="Nombre de proyecto"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />

        <Button ml={6} variantColor="blue" onClick={inviteUser}>
          Cambiar nombre
        </Button>
      </InputGroup>
    </Box>
  );
}

export default RenameProjectSettings;
