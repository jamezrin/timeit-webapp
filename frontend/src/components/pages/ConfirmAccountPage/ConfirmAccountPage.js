import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import FullPageLoadSpinner from '../../base/FullPageLoadSpinner';
import { Flex } from '@chakra-ui/core';
import axios from 'axios';
import { useToasts } from 'react-toast-notifications';

const confirmAccountEndpoint =
  process.env.REACT_APP_BACKEND_URL + `/confirm-account`;
const requestConfirmAccount = (token) =>
  axios.post(
    `${confirmAccountEndpoint}/${token}`,
    {},
    { withCredentials: true },
  );

export default function ConfirmAccountPage() {
  const { token } = useParams();
  const history = useHistory();
  const { addToast } = useToasts();

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
        if (err.response && err.response.data.error) {
          if (err.response.data.error.type === 'INVALID_CREDENTIALS') {
            addToast('Las credenciales introducidas no son validas', {
              appearance: 'error',
              autoDismiss: true,
            });
          } else if (err.response.data.error.type === 'INACTIVE_ACCOUNT') {
            addToast(
              'Todavía no has confirmado tu cuenta de usuario, comprueba tu correo electrónico',
              { appearance: 'error', autoDismiss: true },
            );
          } else if (err.response.data.error.type === 'EXPIRED_MAIL_TOKEN') {
            addToast(
              'El enlace que has usado ha caducado, solicita uno nuevo',
              {
                appearance: 'error',
                autoDismiss: true,
              },
            );

            history.push('/');
          }
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
