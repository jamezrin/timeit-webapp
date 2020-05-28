import React, { useContext, useState } from 'react';

import {
  Link as RouteLink,
  useHistory,
  useLocation,
  useParams,
} from 'react-router-dom';
import LoginRegisterLayout from '../../LoginRegisterLayout';
import { useForm } from 'react-hook-form';
import { useToasts } from 'react-toast-notifications';

import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  List,
  ListItem,
  Text,
} from '@chakra-ui/core';

import axios from 'axios';

const requestPasswordEndpoint =
  process.env.REACT_APP_BACKEND_URL + '/request-password-reset';
const requestPasswordReset = (values) =>
  axios.post(requestPasswordEndpoint, values, { withCredentials: true });

export default function LoginPage() {
  const { handleSubmit, errors, register, formState } = useForm();
  const { addToast } = useToasts();
  const location = useLocation();
  const { token } = useParams();
  const history = useHistory();

  async function onSubmit(values) {
    try {
      await requestPasswordReset(values);

      addToast('Comprueba tu correo electrónico para recuperar tu contraseña', {
        appearance: 'success',
        autoDismiss: true,
      });

      history.replace(
        (location.state && location.state.previousLocation) || '/',
      );
    } catch (err) {
      addToast('Ha ocurrido un error al procesar su petición', {
        appearance: 'error',
        autoDismiss: true,
      });
    }
  }

  return (
    <LoginRegisterLayout>
      <Heading as="h1">Recupera tu contraseña</Heading>

      <Text mt={4}>
        Si tienes una cuenta, te envíaremos un correo electrónico con un enlace
        para restablecer tu contraseña
      </Text>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl mt={4} isInvalid={errors.emailAddress}>
          <FormLabel htmlFor="emailAddress">Correo electrónico</FormLabel>
          <Input
            name="emailAddress"
            id="emailAddress"
            type="email"
            placeholder="usuario@ejemplo.org"
            ref={register}
          />
          <FormErrorMessage>
            {errors.emailAddress && errors.emailAddress.message}
          </FormErrorMessage>
        </FormControl>

        <Button
          mt={4}
          variantColor="blue"
          isLoading={formState.isSubmitting}
          type="submit"
        >
          Continuar <Icon ml={4} name="arrow-right" />
        </Button>
      </form>
    </LoginRegisterLayout>
  );
}
