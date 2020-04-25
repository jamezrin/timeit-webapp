import React, { useState } from 'react';
import { Link as RouteLink, useHistory } from 'react-router-dom';

import LoginRegisterLayout from '../LoginRegisterLayout';
import { useForm } from 'react-hook-form';

import axios from 'axios';

import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  InputGroup,
  InputRightElement,
  Link,
  Heading,
  Text,
  Icon,
} from '@chakra-ui/core';

const registerEndpoint = process.env.REACT_APP_BACKEND_URL + '/create-account';

export default function RegisterPage() {
  const { handleSubmit, errors, register, formState } = useForm();
  const history = useHistory();

  // https://tylermcginnis.com/react-router-protected-routes-authentication/
  function onSubmit(values) {
    axios
      .post(
        registerEndpoint,
        {
          ...values,
        },
        {
          withCredentials: true,
        },
      )
      .then(console.log)
      .catch(console.error);
    history.push({
      pathname: '/login',
      state: {
        accountCreated: true,
      },
    });
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
        <FormControl mt={4} isInvalid={errors.emailAddress}>
          <FormLabel htmlFor="emailAddress">Correo electrónico</FormLabel>
          <Input name="emailAddress" id="emailAddress" type="email" placeholder="usuario@ejemplo.org" ref={register} />
          <FormErrorMessage>{errors.emailAddress && errors.emailAddress.message}</FormErrorMessage>
        </FormControl>

        <FormControl mt={4} isInvalid={errors.firstName}>
          <FormLabel htmlFor="firstName">Nombre</FormLabel>
          <Input name="firstName" id="firstName" placeholder="John" ref={register} />
          <FormErrorMessage>{errors.firstName && errors.firstName.message}</FormErrorMessage>
        </FormControl>

        <FormControl mt={4} isInvalid={errors.lastName}>
          <FormLabel htmlFor="lastName">Apellidos</FormLabel>
          <Input name="lastName" id="lastName" placeholder="Smith" ref={register} />
          <FormErrorMessage>{errors.lastName && errors.lastName.message}</FormErrorMessage>
        </FormControl>

        <FormControl mt={4} isInvalid={errors.password}>
          <FormLabel htmlFor="password">Contraseña</FormLabel>
          <InputGroup size="md">
            <Input
              name="password"
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="$tr0ng p@ssw0rd"
              ref={register}
            />
            <InputRightElement width="4.5rem" mr={12}>
              <Button h="1.75rem" size="sm" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </Button>
            </InputRightElement>
          </InputGroup>

          <FormErrorMessage>{errors.password && errors.password.message}</FormErrorMessage>
        </FormControl>
        <Button mt={4} variantColor="blue" isLoading={formState.isSubmitting} type="submit">
          Continuar <Icon ml={4} name="arrow-right" />
        </Button>
      </form>
    </LoginRegisterLayout>
  );
}
