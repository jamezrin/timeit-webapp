import React, { useState } from 'react';
import { Link as RouteLink, useHistory } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import { useForm } from 'react-hook-form';
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
} from '@chakra-ui/react';
import { ArrowRightIcon } from '@chakra-ui/icons';
import { useColorModeValue } from '@chakra-ui/color-mode';
import LoginRegisterLayout from '../LoginRegisterLayout';
import useDocumentTitle from '../../hooks/documentTitleHook';
import { formatTitle, isResponseError } from '../../utils';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { ACCOUNT_ALREADY_EXISTS_ERROR } from '@timeit/error-types';
import { requestAccountCreation } from '../../api';

const schema = yup.object().shape({
  emailAddress: yup.string().email().required(),
  password: yup.string().required().trim().min(8),
  firstName: yup.string().trim().required(),
  lastName: yup.string().trim().required(),
});

export default function RegisterPage() {
  const { handleSubmit, errors, register, formState } = useForm({
    resolver: yupResolver(schema),
  });

  const inputBg = useColorModeValue('white', 'gray.600');

  const history = useHistory();
  const { addToast } = useToasts();
  useDocumentTitle(formatTitle('Creación de cuenta'));

  async function onSubmit(values) {
    try {
      await requestAccountCreation(values);

      addToast(
        'Te has registrado correctamente, verifica tu cuenta para poder iniciar sesión',
        { appearance: 'success', autoDismiss: true, autoDismissTimeout: 10000 },
      );

      history.push('/login');
    } catch (err) {
      if (isResponseError(err, ACCOUNT_ALREADY_EXISTS_ERROR)) {
        addToast('Ya existe una cuenta con ese correo electronico', {
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
            bg={inputBg}
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
            errorBorderColor="red.500"
            bg={inputBg}
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
            bg={inputBg}
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
              bg={inputBg}
            />
            <InputRightElement width="6.5rem" mr={{ base: 4, lg: 12 }}>
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
