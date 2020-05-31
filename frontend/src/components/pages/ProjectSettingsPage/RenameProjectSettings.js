import React from 'react';
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
import { useForm } from 'react-hook-form';

const projectsEndpoint = process.env.REACT_APP_BACKEND_URL + '/projects';
const requestProjectRename = (projectId, name) =>
  axios.patch(
    `${projectsEndpoint}/${projectId}`,
    { name },
    { withCredentials: true },
  );

function RenameProjectSettings({ projectInfo, setProjectInfo }) {
  const { handleSubmit, errors, reset, register, formState } = useForm();
  const { colorMode } = useColorMode();
  const { addToast } = useToasts();

  async function onSubmit({ projectName }) {
    try {
      await requestProjectRename(projectInfo.id, projectName);

      addToast(`Has cambiado el nombre del proyecto a "${projectName}"`, {
        appearance: 'success',
        autoDismiss: true,
      });

      setProjectInfo({
        ...projectInfo,
        name: projectName,
      });

      // Clean the form up
      reset();
    } catch (err) {
      addToast(`Ha ocurrido un error desconocido: ${err}`, {
        appearance: 'error',
        autoDismiss: true,
      });
    }
  }

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

      <form onSubmit={handleSubmit(onSubmit)}>
        <InputGroup mt={4}>
          <Input
            width="auto"
            flexGrow="1"
            name="projectName"
            type="text"
            placeholder="Nombre de proyecto"
            ref={register}
          />

          <Button
            ml={6}
            variantColor="blue"
            isLoading={formState.isSubmitting}
            type="submit"
          >
            Cambiar nombre
          </Button>
        </InputGroup>
      </form>
    </Box>
  );
}

export default RenameProjectSettings;
