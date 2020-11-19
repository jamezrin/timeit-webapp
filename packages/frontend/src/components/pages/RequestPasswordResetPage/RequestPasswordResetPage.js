import React from 'react';

import { Link as RouteLink, useHistory, useLocation } from 'react-router-dom';
import LoginRegisterLayout from '../../LoginRegisterLayout';
import { useForm } from 'react-hook-form';
import { useToasts } from 'react-toast-notifications';
import axios from 'axios';

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
import useDocumentTitle from '../../../hooks/documentTitleHook';
import { formatTitle } from '../../../utils';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { ArrowRightIcon } from '@chakra-ui/icons';
import { useColorModeValue } from '@chakra-ui/color-mode';

const requestPasswordEndpoint = process.env.REACT_APP_BACKEND_URL + "/request-password-reset"; // prettier-ignore
const requestPasswordReset = (values) => axios.post(
  requestPasswordEndpoint,
  values,
  { withCredentials: true }
); // prettier-ignore

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
      if (err.response && err.response.data.error) {
        if (err.response.data.error.type === 'INACTIVE_ACCOUNT') {
          addToast(
            'Todavía no has confirmado tu cuenta de usuario, comprueba tu correo electrónico',
            { appearance: 'error', autoDismiss: true },
          );
        } else if (err.response.data.error.type === 'ACCOUNT_NOT_FOUND') {
          addToast('No existe ningún usuario con ese correo electrónico', {
            appearance: 'error',
            autoDismiss: true,
          });
        } else if (
          err.response.data.error.type === 'ALREADY_REQUESTED_MAIL_TOKEN'
        ) {
          addToast(
            'Solo puedes pedir restablecer la contraseña de tu cuenta cada 12 horas',
            { appearance: 'error', autoDismiss: true },
          );
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
