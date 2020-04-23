import React, { useState } from 'react';

import LoginRegisterLayout from '../LoginRegisterLayout';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Text,
} from '@chakra-ui/core';
import { Link as RouteLink } from 'react-router-dom';

const authenticateEndpoint = process.env.REACT_APP_BACKEND_URL + '/authenticate';

export default function LoginPage() {
  const { handleSubmit, errors, register, formState } = useForm();

  function onSubmit(values) {
    axios
      .post(
        authenticateEndpoint,
        {
          ...values,
        },
        {
          withCredentials: true,
        },
      )
      .then(console.log)
      .catch(console.error);
  }

  const [showPassword, setShowPassword] = useState(false);

  return (
    <LoginRegisterLayout>
      <Heading as="h1">Inicia sesión</Heading>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl mt={4} isInvalid={errors.emailAddress}>
          <FormLabel htmlFor="emailAddress">Correo electrónico</FormLabel>
          <Input name="emailAddress" id="emailAddress" type="email" placeholder="usuario@ejemplo.org" ref={register} />
          <FormErrorMessage>{errors.emailAddress && errors.emailAddress.message}</FormErrorMessage>
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
        <Button mt={4} variantColor="purple" isLoading={formState.isSubmitting} type="submit">
          Continuar
        </Button>
      </form>

      <Text mt={4}>
        Si no tienes una cuenta,&nbsp;
        <Link as={RouteLink} to="/register" color="blue.500">
          hazte una ahora
        </Link>
      </Text>

      <Text>
        Si no te acuerdas de tu contraseña,&nbsp;
        <Link as={RouteLink} to="/register" color="blue.500">
          recuperala
        </Link>
      </Text>
    </LoginRegisterLayout>
  );
}
