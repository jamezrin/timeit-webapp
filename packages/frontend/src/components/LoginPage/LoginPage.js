import React, { useContext, useState } from 'react';

import { Link as RouteLink, useHistory, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useToasts } from 'react-toast-notifications';
import LoginRegisterLayout from '../LoginRegisterLayout';

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
  List,
  ListItem,
} from '@chakra-ui/react';

import AuthContext, { fetchAuthStatus } from '../../state/authContext';
import useDocumentTitle from '../../hooks/documentTitleHook';
import { formatTitle, isResponseError } from '../../utils';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { ArrowRightIcon } from '@chakra-ui/icons';
import { useColorModeValue } from '@chakra-ui/color-mode';
import { INACTIVE_ACCOUNT_ERROR, INVALID_CREDENTIALS_ERROR } from 'common';
import { requestAuthentication } from '../../api';

const schema = yup.object().shape({
  emailAddress: yup.string().email().required(),
  password: yup.string().required().trim().min(8),
});

export default function LoginPage() {
  const { handleSubmit, errors, register, formState } = useForm({
    resolver: yupResolver(schema),
  });

  const inputBg = useColorModeValue('white', 'gray.600');

  const [showPassword, setShowPassword] = useState(false);
  const { addToast } = useToasts();
  const location = useLocation();
  const history = useHistory();
  const { setAuthStatus } = useContext(AuthContext);

  useDocumentTitle(formatTitle('Inicio de sesión'));

  async function onSubmit(values) {
    try {
      await requestAuthentication(values);

      fetchAuthStatus().then((authStatus) => {
        setAuthStatus(authStatus);

        addToast('Has iniciado sesión correctamente', {
          appearance: 'success',
          autoDismiss: true,
        });

        history.replace(
          (location.state && location.state.previousLocation) || '/',
        );
      });
    } catch (err) {
      if (isResponseError(err, INVALID_CREDENTIALS_ERROR)) {
        addToast('Las credenciales introducidas no son válidas', {
          appearance: 'error',
          autoDismiss: true,
        });
      } else if (isResponseError(err, INACTIVE_ACCOUNT_ERROR)) {
        addToast(
          'Todavía no has confirmado tu cuenta de usuario, comprueba tu correo electrónico',
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
      <Heading as="h1">Inicia sesión</Heading>

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
        <FormControl mt={4} isInvalid={!!errors.emailAddress}>
          <FormLabel htmlFor="emailAddress">Correo electrónico</FormLabel>
          <Input
            name="emailAddress"
            id="emailAddress"
            type="text"
            placeholder="usuario@ejemplo.org"
            ref={register}
            errorBorderColor="red.500"
            bg={inputBg}
          />
          <FormErrorMessage>
            {errors.emailAddress && errors.emailAddress.message}
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
