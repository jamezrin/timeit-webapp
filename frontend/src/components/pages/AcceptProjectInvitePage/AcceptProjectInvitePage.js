import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import FullPageLoadSpinner from '../../base/FullPageLoadSpinner';
import { Flex } from '@chakra-ui/core';
import axios from 'axios';
import { useToasts } from 'react-toast-notifications';
import useDocumentTitle from '@rehooks/document-title';
import { formatTitle } from '../../../utils';

const projectsEndpoint = process.env.REACT_APP_BACKEND_URL + `/projects`;
const requestAcceptProjectInvite = (projectId, token) => axios.post(
  `${projectsEndpoint}/${projectId}/accept-invite/${token}`,
  {},
  { withCredentials: true }
); // prettier-ignore

export default function AcceptProjectInvitePage() {
  const { projectId, token } = useParams();
  const history = useHistory();
  const { addToast } = useToasts();
  useDocumentTitle(formatTitle('Invitación a proyecto'));

  useEffect(() => {
    requestAcceptProjectInvite(projectId, token)
      .then((res) => {
        history.push(`${projectsEndpoint}/${projectId}`);

        addToast('Has aceptado la invitación de proyecto', {
          appearance: 'success',
          autoDismiss: true,
        });
      })
      .catch((err) => {
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
