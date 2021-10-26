import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/color-mode';
import { ArrowRightIcon } from '@chakra-ui/icons';
import { useToasts } from 'react-toast-notifications';
import { useForm } from 'react-hook-form';
import LoginRegisterLayout from '../LoginRegisterLayout';
import useDocumentTitle from '../../hooks/documentTitleHook';
import { formatTitle, isResponseError } from '../../utils';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  EXPIRED_MAIL_TOKEN_ERROR,
  INACTIVE_ACCOUNT_ERROR,
  INVALID_CREDENTIALS_ERROR,
} from '@timeit/error-types';
import { performPasswordReset } from '../../api';

const schema = yup.object().shape({
  newPassword: yup.string().required().trim().min(8),
});

export default function RecoverPasswordPage() {
  const { handleSubmit, errors, register, formState } = useForm({
    resolver: yupResolver(schema),
  });
  const [showPassword, setShowPassword] = useState(false);
  const { addToast } = useToasts();
  const history = useHistory();
  const { token } = useParams();

  const inputBg = useColorModeValue('white', 'gray.600');

  useDocumentTitle(formatTitle('Restablecimiento de contraseña'));

  async function onSubmit(values) {
    try {
      await performPasswordReset(values, token);

      addToast(
        'Has cambiado tu contraseña correctamente, ya puedes iniciar sesión con ella',
        { appearance: 'success', autoDismiss: true },
      );

      history.push('/');
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
      } else if (isResponseError(err, EXPIRED_MAIL_TOKEN_ERROR)) {
        addToast('El enlace que has usado ha caducado, solicita uno nuevo', {
          appearance: 'error',
          autoDismiss: true,
        });

        history.push('/');
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
      <Heading as="h1">Establece tu nueva contraseña</Heading>

      <Text mt={4}>
        Al realizar esta operación actualizaremos la contraseña de tu cuenta.
        Seguirás teniendo la sesión iniciada en cualquier navegador o
        aplicación.
      </Text>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl mt={4} isInvalid={!!errors.newPassword}>
          <FormLabel htmlFor="newPassword">Nueva contraseña</FormLabel>
          <InputGroup size="md">
            <Input
              name="newPassword"
              id="newPassword"
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
            {errors.newPassword && errors.newPassword.message}
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
