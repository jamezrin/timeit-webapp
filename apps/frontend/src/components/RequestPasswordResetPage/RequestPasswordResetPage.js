import React from 'react';

import { Link as RouteLink, useHistory, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useToasts } from 'react-toast-notifications';
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Link,
  List,
  ListItem,
  Text,
} from '@chakra-ui/react';
import { ArrowRightIcon } from '@chakra-ui/icons';
import { useColorModeValue } from '@chakra-ui/color-mode';
import LoginRegisterLayout from '../LoginRegisterLayout';
import useDocumentTitle from '../../hooks/documentTitleHook';
import { formatTitle, isResponseError } from '../../utils';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  ACCOUNT_NOT_FOUND_ERROR,
  ALREADY_REQUESTED_MAIL_TOKEN_ERROR,
  INACTIVE_ACCOUNT_ERROR,
} from '@timeit/error-types';
import { requestPasswordReset } from '../../api';

const schema = yup.object().shape({
  emailAddress: yup.string().email().required(),
});

export default function RequestPasswordResetPage() {
  const { handleSubmit, errors, register, formState } = useForm({
    resolver: yupResolver(schema),
  });

  const inputBg = useColorModeValue('white', 'gray.600');

  const { addToast } = useToasts();
  const location = useLocation();
  const history = useHistory();

  useDocumentTitle(formatTitle('Restablecimiento de contraseña'));

  async function onSubmit(values) {
    try {
      await requestPasswordReset(values);

      addToast(
        'Te acabamos de enviar un correo electrónico para que puedas recuperar tu contraseña',
        { appearance: 'success', autoDismiss: true },
      );

      history.replace(
        (location.state && location.state.previousLocation) || '/',
      );
    } catch (err) {
      if (isResponseError(err, INACTIVE_ACCOUNT_ERROR)) {
        addToast(
          'Todavía no has confirmado tu cuenta de usuario, comprueba tu correo electrónico',
          { appearance: 'error', autoDismiss: true },
        );
      } else if (isResponseError(err, ACCOUNT_NOT_FOUND_ERROR)) {
        addToast('No existe ningún usuario con ese correo electrónico', {
          appearance: 'error',
          autoDismiss: true,
        });
      } else if (isResponseError(err, ALREADY_REQUESTED_MAIL_TOKEN_ERROR)) {
        addToast(
          'Solo puedes pedir restablecer la contraseña de tu cuenta cada 12 horas',
          { appearance: 'error', autoDismiss: true },
        );
      } else {
        addToast(`Ha ocurrido un error desconocido: ${err}`, {
          appearance: 'error',
          autoDismiss: true,
        });
      }
    }
  }

  return (
    <LoginRegisterLayout>
      <Heading as="h1">Recupera tu contraseña</Heading>

      <List mt={4}>
        <ListItem>
          Si no tienes una cuenta,&nbsp;
          <Link as={RouteLink} to="/register" color="blue.500">
            crea una nueva cuenta
          </Link>
        </ListItem>
      </List>

      <Text mt={4}>
        Al realizar esta operación te enviaremos un correo electrónico con un
        enlace para restablecer tu contraseña
      </Text>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl mt={4} isInvalid={!!errors.emailAddress}>
          <FormLabel htmlFor="emailAddress">Correo electrónico</FormLabel>
          <Input
            name="emailAddress"
            id="emailAddress"
            type="email"
            placeholder="usuario@ejemplo.org"
            ref={register}
            errorBorderColor="red.500"
            bg={inputBg}
          />
          <FormErrorMessage>
            {errors.emailAddress && errors.emailAddress.message}
          </FormErrorMessage>
        </FormControl>

        <Button
          mt={4}
          colorScheme="blue"
          isLoading={formState.isSubmitting}
          type="submit"
        >
          Continuar <ArrowRightIcon ml={4} />
        </Button>
      </form>
    </LoginRegisterLayout>
  );
}
