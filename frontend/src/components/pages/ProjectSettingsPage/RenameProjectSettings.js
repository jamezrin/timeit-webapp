import React, { useEffect } from 'react';
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  Heading,
  Input,
  InputGroup,
  Text,
  useColorMode,
} from '@chakra-ui/core';
import { useToasts } from 'react-toast-notifications';
import axios from 'axios';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';

const projectsEndpoint = process.env.REACT_APP_BACKEND_URL + '/projects';
const requestProjectRename = (projectId, name) => axios.patch(
  `${projectsEndpoint}/${projectId}`,
  { name },
  { withCredentials: true },
); // prettier-ignore

const schema = yup.object().shape({
  projectName: yup.string().required().trim().min(4),
});

function RenameProjectSettings({ projectInfo, setProjectInfo }) {
  const { handleSubmit, errors, reset, register, formState } = useForm({
    validationSchema: schema,
  });
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
    <Box p={4} bg={colorMode === 'dark' ? 'gray.700' : 'gray.100'} rounded="md">
      <Heading as="h2" size="md">
        Cambiar nombre de proyecto
      </Heading>

      <Divider />

      <Text mt={4}>Aquí puedes cambiar el nombre del proyecto.</Text>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl mt={4} isInvalid={!!errors.projectName}>
          <InputGroup mt={4}>
            <Input
              width="auto"
              flexGrow="1"
              name="projectName"
              type="text"
              placeholder="Nombre de proyecto"
              ref={register}
              errorBorderColor="red.500"
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

          <FormErrorMessage>
            {errors.projectName && errors.projectName.message}
          </FormErrorMessage>
        </FormControl>
      </form>
    </Box>
  );
}

export default RenameProjectSettings;
