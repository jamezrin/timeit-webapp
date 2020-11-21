import React from 'react';
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
} from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/color-mode';
import { useToasts } from 'react-toast-notifications';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { requestProjectRename } from '../../api';

const schema = yup.object().shape({
  projectName: yup.string().required().trim().min(4),
});

function RenameProjectSettings({ projectInfo, setProjectInfo }) {
  const { handleSubmit, errors, reset, register, formState } = useForm({
    resolver: yupResolver(schema),
  });

  const inputBg = useColorModeValue('white', 'gray.600');
  const wrapperBg = useColorModeValue('gray.100', 'gray.700');

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
    <Box p={4} bg={wrapperBg} rounded="md">
      <Heading as="h2" size="md">
        Cambiar nombre de proyecto
      </Heading>

      <Divider my={2} />

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
              bg={inputBg}
            />

            <Button
              ml={6}
              colorScheme="blue"
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
