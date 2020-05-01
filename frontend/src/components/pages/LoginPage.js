import React, { useCallback, useState } from 'react';

import LoginRegisterLayout from '../layout/LoginRegisterLayout';
import { useForm } from 'react-hook-form';
import axios from 'axios';
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
} from '@chakra-ui/core';

import { Link as RouteLink, useHistory, useLocation } from 'react-router-dom';
import authenticationBackend, { refreshAuthStatus } from '../../utils/authenticationBackend';

const authenticateEndpoint = process.env.REACT_APP_BACKEND_URL + '/authenticate';

export default function LoginPage() {
  const { handleSubmit, errors, register, formState } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const { addToast } = useToasts();
  const location = useLocation();
  const history = useHistory();

  async function onSubmit(values) {
    try {
      await axios.post(authenticateEndpoint, values, { withCredentials: true });
      /*refreshAuthStatus().then((authStatus) => {

      });*/
      addToast('Has iniciado sesión correctamente', {
        appearance: 'success',
        autoDismiss: true,
      });

      history.replace((location.state && location.state.previousLocation) || '/');
    } catch (err) {
      if (err.response.data.error.type === 'INVALID_CREDENTIALS') {
        addToast('Las credenciales introducidas no son validas', {
          appearance: 'error',
          autoDismiss: true,
        });
      }
    }
  }

  return (
    <LoginRegisterLayout>
      <Heading as="h1">Inicia sesión</Heading>

      {/* TODO: show something telling the user that login is available (or in the future, confirm the account) */}
      {/* TODO: maybe use https://github.com/jossmac/react-toast-notifications for showing this info */}
      {location?.state?.accountCreated && <p>Ya puedes iniciar sesión</p>}

      <List mt={4}>
        <ListItem>
          Si no tienes una cuenta,&nbsp;
          <Link as={RouteLink} to="/register" color="blue.500">
            crea una nueva cuenta
          </Link>
        </ListItem>
        <ListItem>
          Si no te acuerdas de tu contraseña,&nbsp;
          <Link as={RouteLink} to="/recover_password" color="blue.500">
            recupera tu contraseña
          </Link>
        </ListItem>
      </List>

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
        <Button mt={4} variantColor="blue" isLoading={formState.isSubmitting} type="submit">
          Continuar <Icon ml={4} name="arrow-right" />
        </Button>
      </form>
    </LoginRegisterLayout>
  );
}
