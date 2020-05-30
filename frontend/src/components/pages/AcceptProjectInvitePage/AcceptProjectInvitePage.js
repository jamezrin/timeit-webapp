import React, { useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import FullPageLoadSpinner from '../../base/FullPageLoadSpinner';
import { Flex } from '@chakra-ui/core';
import axios from 'axios';
import { useToasts } from 'react-toast-notifications';

const projectsEndpoint = process.env.REACT_APP_BACKEND_URL + `/projects`;
const requestAcceptProjectInvite = (projectId, token) =>
  axios.post(
    `${projectsEndpoint}/${projectId}/accept-invite/${token}`,
    {},
    { withCredentials: true },
  );

export default function AcceptProjectInvitePage() {
  const { projectId, token } = useParams();
  const history = useHistory();
  const { addToast } = useToasts();

  useEffect(() => {
    requestAcceptProjectInvite(projectId, token).then((res) => {
      history.push(`${projectsEndpoint}/${projectId}`);

      addToast('Has aceptado la invitación de proyecto', {
        appearance: 'success',
        autoDismiss: true,
      });
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
