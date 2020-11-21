import React, { useCallback, useState } from 'react';
import {
  Box,
  Button,
  Divider,
  Heading,
  Input,
  InputGroup,
  Text,
} from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/color-mode';
import { useToasts } from 'react-toast-notifications';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const projectsEndpoint = process.env.REACT_APP_BACKEND_URL + '/projects';
const requestProjectDelete = (projectId) => axios.delete(
  `${projectsEndpoint}/${projectId}`,
  { withCredentials: true }
); // prettier-ignore

function DeleteProjectSettings({ projectInfo }) {
  const [typedProjectName, setTypedProjectName] = useState('');
  const inputBg = useColorModeValue('white', 'gray.600');
  const wrapperBg = useColorModeValue('gray.100', 'gray.700');
  const { addToast } = useToasts();
  const history = useHistory();

  const deleteProject = useCallback(() => {
    requestProjectDelete(projectInfo.id)
      .then((res) => {
        history.push('/');
        addToast(`Has borrado el proyecto "${projectInfo.name}"`, {
          appearance: 'success',
          autoDismiss: true,
        });
      })
      .catch((err) => {
        addToast(`Ha ocurrido un error desconocido: ${err}`, {
          appearance: 'error',
          autoDismiss: true,
        });
      });
  }, [projectInfo, history, addToast]);

  return (
    <Box p={4} mt={12} bg={wrapperBg} rounded="md">
      <Heading as="h2" size="md">
        Borrar proyecto
      </Heading>

      <Divider my={2} />

      <Text mt={4}>
        Confirma que quieres borrar este proyecto escribiendo su nombre debajo.
        Una vez borres el proyecto, se borrarán todas las sesiones, eventos de
        aplicación y notas relacionados permanentemente.
      </Text>

      <InputGroup mt={4}>
        <Input
          width="auto"
          flexGrow="1"
          name="projectName"
          type="text"
          placeholder="Nombre de proyecto"
          value={typedProjectName}
          onChange={(e) => setTypedProjectName(e.target.value)}
          bg={inputBg}
        />

        <Button
          ml={6}
          colorScheme="red"
          disabled={typedProjectName !== projectInfo.name}
          onClick={deleteProject}
        >
          Borrar proyecto
        </Button>
      </InputGroup>
    </Box>
  );
}

export default DeleteProjectSettings;
