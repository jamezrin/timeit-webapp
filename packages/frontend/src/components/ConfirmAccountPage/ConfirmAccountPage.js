import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import { Flex } from '@chakra-ui/react';
import axios from 'axios';
import FullPageLoadSpinner from '../FullPageLoadSpinner';
import useDocumentTitle from '../../hooks/documentTitleHook';
import { formatTitle, isResponseError } from '../../utils';
import {
  EXPIRED_MAIL_TOKEN_ERROR,
  INACTIVE_ACCOUNT_ERROR,
  INVALID_CREDENTIALS_ERROR,
} from 'common';

const confirmAccountEndpoint = process.env.REACT_APP_BACKEND_URL + `/confirm-account`; // prettier-ignore
const requestConfirmAccount = (token) => axios.post(
  `${confirmAccountEndpoint}/${token}`,
  {},
  { withCredentials: true }
); // prettier-ignore

export default function ConfirmAccountPage() {
  const { token } = useParams();
  const history = useHistory();
  const { addToast } = useToasts();
  useDocumentTitle(formatTitle('Confirmación de cuenta'));

  useEffect(() => {
    requestConfirmAccount(token)
      .then((res) => {
        history.push('/');

        addToast(`Has confirmado tu cuenta, ya puedes iniciar sesión`, {
          appearance: 'success',
          autoDismiss: true,
        });
      })
      .catch((err) => {
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
      });
  }, [addToast, token, history]);

  return (
    <Flex
      height="100vh"
      width="100vw"
      justifyContent="center"
      alignItems="center"
    >
      <FullPageLoadSpinner message="Confirmando tu cuenta..." />
    </Flex>
  );
}
