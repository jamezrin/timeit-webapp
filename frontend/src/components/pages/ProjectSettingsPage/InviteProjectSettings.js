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
  useColorMode,
} from '@chakra-ui/react';
import { useToasts } from 'react-toast-notifications';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const projectsEndpoint = process.env.REACT_APP_BACKEND_URL + '/projects';
const requestProjectInvite = (projectId, emailAddress) => axios.post(
  `${projectsEndpoint}/${projectId}/invite`,
  { emailAddress },
  { withCredentials: true }
); // prettier-ignore

const schema = yup.object().shape({
  emailAddress: yup.string().email().required(),
});

function InviteProjectSettings({ projectInfo, updateMembers }) {
  const { handleSubmit, reset, errors, register, formState } = useForm({
    resolver: yupResolver(schema),
  });
  const { colorMode } = useColorMode();
  const { addToast } = useToasts();

  async function onSubmit({ emailAddress }) {
    try {
      await requestProjectInvite(projectInfo.id, emailAddress);

      addToast(`Has enviado una invitación a "${emailAddress}"`, {
        appearance: 'success',
        autoDismiss: true,
      });

      // Clean the form up
      reset();

      // Refresh the user list
      updateMembers();
    } catch (err) {
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
    }
  }

  return (
    <Box
      p={4}
      mt={12}
      bg={colorMode === 'dark' ? 'gray.700' : 'gray.100'}
      rounded="md"
    >
      <Heading as="h2" boxSize="md">
        Invitar a usuario
      </Heading>

      <Divider />

      <Text mt={4}>
        Invita a un usuario para monitorizar su trabajo. Podrás cambiar su rol
        en la lista de miembros. Aparecerá como un miembro cuando acepte la
        invitación.
      </Text>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl mt={4} isInvalid={!!errors.emailAddress}>
          <InputGroup mt={4}>
            <Input
              width="auto"
              flexGrow="1"
              name="emailAddress"
              type="text"
              placeholder="Correo electrónico"
              ref={register}
              errorBorderColor="red.500"
            />

            <Button
              ml={6}
              colorScheme="blue"
              isLoading={formState.isSubmitting}
              type="submit"
            >
              Invitar usuario
            </Button>
          </InputGroup>

          <FormErrorMessage>
            {errors.emailAddress && errors.emailAddress.message}
          </FormErrorMessage>
        </FormControl>
      </form>
    </Box>
  );
}

export default InviteProjectSettings;
