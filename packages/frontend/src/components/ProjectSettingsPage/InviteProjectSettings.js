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
import { useToasts } from 'react-toast-notifications';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useColorModeValue } from '@chakra-ui/color-mode';
import { ACCOUNT_NOT_FOUND_ERROR, ALREADY_PROJECT_MEMBER_ERROR } from 'common';
import { isResponseError } from '../../utils';
import { requestProjectInvite } from '../../api';

const schema = yup.object().shape({
  emailAddress: yup.string().email().required(),
});

function InviteProjectSettings({ projectInfo, updateMembers }) {
  const { handleSubmit, reset, errors, register, formState } = useForm({
    resolver: yupResolver(schema),
  });

  const inputBg = useColorModeValue('white', 'gray.600');
  const wrapperBg = useColorModeValue('gray.100', 'gray.700');

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
      if (isResponseError(err, ACCOUNT_NOT_FOUND_ERROR)) {
        addToast('No existe ningún usuario con ese correo electrónico', {
          appearance: 'error',
          autoDismiss: true,
        });
      } else if (isResponseError(err, ALREADY_PROJECT_MEMBER_ERROR)) {
        addToast('Este usuario ya es un miembro del proyecto', {
          appearance: 'error',
          autoDismiss: true,
        });
      } else {
        addToast(`Ha ocurrido un error desconocido: ${err}`, {
          appearance: 'error',
          autoDismiss: true,
        });
      }
    }
  }

  return (
    <Box p={4} mt={12} bg={wrapperBg} rounded="md">
      <Heading as="h2" size="md">
        Invitar a usuario
      </Heading>

      <Divider my={2} />

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
              bg={inputBg}
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
