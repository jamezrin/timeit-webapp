import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import { Flex } from '@chakra-ui/react';
import FullPageLoadSpinner from '../FullPageLoadSpinner';
import useDocumentTitle from '../../hooks/documentTitleHook';
import { formatTitle, isResponseError } from '../../utils';
import {
  EXPIRED_MAIL_TOKEN_ERROR,
  INACTIVE_ACCOUNT_ERROR,
  INVALID_CREDENTIALS_ERROR,
} from '@timeit/error-types';
import { requestAcceptProjectInvite } from '../../api';

export default function AcceptProjectInvitePage() {
  const { projectId, token } = useParams();
  const history = useHistory();
  const { addToast } = useToasts();
  useDocumentTitle(formatTitle('Invitación a proyecto'));

  useEffect(() => {
    requestAcceptProjectInvite(projectId, token)
      .then((res) => {
        history.push(`/projects/${projectId}`);

        addToast('Has aceptado la invitación de proyecto', {
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
  }, [history, addToast, projectId, token]);

  return (
    <Flex
      height="100vh"
      width="100vw"
      justifyContent="center"
      alignItems="center"
    >
      <FullPageLoadSpinner message="Aceptando la invitación..." />
    </Flex>
  );
}
