import React, { useState } from 'react';
import { Link as RouteLink, useHistory } from 'react-router-dom';

import LoginRegisterLayout from '../../LoginRegisterLayout';
import { useToasts } from 'react-toast-notifications';
import { useForm } from 'react-hook-form';

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
  Text,
} from '@chakra-ui/core';

import axios from 'axios';
import useDocumentTitle from '../../../hooks/documentTitleHook';
import { formatTitle } from '../../../utils';
import * as yup from 'yup';

const registerEndpoint = process.env.REACT_APP_BACKEND_URL + '/create-account';
const requestRegister = (values) => axios.post(
  registerEndpoint,
  values,
  { withCredentials: true }
); // prettier-ignore

const schema = yup.object().shape({
  emailAddress: yup.string().email().required(),
  password: yup.string().required().trim().min(8),
  firstName: yup.string().trim().required(),
  lastName: yup.string().trim().required(),
});

export default function RegisterPage() {
  const { handleSubmit, errors, register, formState } = useForm({
    validationSchema: schema,
  });
  const history = useHistory();
  const { addToast } = useToasts();
  useDocumentTitle(formatTitle('Creación de cuenta'));

  async function onSubmit(values) {
    try {
      await requestRegister(values);

      addToast(
        'Te has registrado correctamente, verifica tu cuenta para poder iniciar sesión',
        { appearance: 'success', autoDismiss: true, autoDismissTimeout: 10000 },
      );

      history.push('/login');
    } catch (err) {
      if (err.response.data.error.type === 'ACCOUNT_ALREADY_EXISTS') {
        addToast('Ya existe una cuenta con ese correo electronico', {
          appearance: 'error',
          autoDismiss: true,
        });
      }
    }
  }

  const [showPassword, setShowPassword] = useState(false);

  return (
    <LoginRegisterLayout>
      <Heading as="h1">Crea una cuenta</Heading>

      <Text mt={4}>
        O si ya tienes una cuenta,&nbsp;
        <Link as={RouteLink} to="/login" color="blue.500">
          inicia sesión
        </Link>
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
          />
          <FormErrorMessage>
            {errors.emailAddress && errors.emailAddress.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl mt={4} isInvalid={!!errors.firstName}>
          <FormLabel htmlFor="firstName">Nombre</FormLabel>
          <Input
            name="firstName"
            id="firstName"
            placeholder="John"
            ref={register}
          />
          <FormErrorMessage>
            {errors.firstName && errors.firstName.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl mt={4} isInvalid={!!errors.lastName}>
          <FormLabel htmlFor="lastName">Apellidos</FormLabel>
          <Input
            name="lastName"
            id="lastName"
            placeholder="Smith"
            ref={register}
            errorBorderColor="red.500"
          />
          <FormErrorMessage>
            {errors.lastName && errors.lastName.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl mt={4} isInvalid={!!errors.password}>
          <FormLabel htmlFor="password">Contraseña</FormLabel>
          <InputGroup size="md">
            <Input
              name="password"
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="$tr0ng p@ssw0rd"
              ref={register}
              errorBorderColor="red.500"
            />
            <InputRightElement width="4.5rem" mr={{ base: 4, lg: 12 }}>
              <Button
                h="1.75rem"
                size="sm"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </Button>
            </InputRightElement>
          </InputGroup>
          <FormErrorMessage>
            {errors.password && errors.password.message}
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
