import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import LoginRegisterLayout from '../../LoginRegisterLayout';
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
  Text,
} from '@chakra-ui/core';
import { useForm } from 'react-hook-form';
import { useToasts } from 'react-toast-notifications';
import axios from 'axios';
import useDocumentTitle from '../../../hooks/documentTitleHook';
import { formatTitle } from '../../../utils';
import * as yup from 'yup';

const recoverPasswordEndpoint = process.env.REACT_APP_BACKEND_URL + `/perform-password-reset`; // prettier-ignore
const requestPasswordReset = (values, token) => axios.post(
  `${recoverPasswordEndpoint}/${token}`,
  values,
  { withCredentials: true }
); // prettier-ignore

const schema = yup.object().shape({
  newPassword: yup.string().required().trim().min(8),
});

export default function RecoverPasswordPage() {
  const { handleSubmit, errors, register, formState } = useForm({
    validationSchema: schema,
  });
  const [showPassword, setShowPassword] = useState(false);
  const { addToast } = useToasts();
  const history = useHistory();
  const { token } = useParams();
  useDocumentTitle(formatTitle('Restablecimiento de contraseña'));

  async function onSubmit(values) {
    try {
      await requestPasswordReset(values, token);

      addToast(
        'Has cambiado tu contraseña correctamente, ya puedes iniciar sesión con ella',
        { appearance: 'success', autoDismiss: true },
      );

      history.push('/');
    } catch (err) {
      if (err.response && err.response.data.error) {
        if (err.response.data.error.type === 'INVALID_CREDENTIALS') {
          addToast('Las credenciales introducidas no son válidas', {
            appearance: 'error',
            autoDismiss: true,
          });
        } else if (err.response.data.error.type === 'INACTIVE_ACCOUNT') {
          addToast(
            'Todavía no has confirmado tu cuenta de usuario, comprueba tu correo electrónico',
            { appearance: 'error', autoDismiss: true },
          );
        } else if (err.response.data.error.type === 'EXPIRED_MAIL_TOKEN') {
          addToast('El enlace que has usado ha caducado, solicita uno nuevo', {
            appearance: 'error',
            autoDismiss: true,
          });

          history.push('/');
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
            />
            <InputRightElement width="4.5rem" mr={12}>
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
