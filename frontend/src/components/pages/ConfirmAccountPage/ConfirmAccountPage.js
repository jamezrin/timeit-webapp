import React, { useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
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
    requestConfirmAccount(token).then((res) => {
      history.push('/');

      addToast(`Has confirmado tu cuenta, ya puedes iniciar sesión`, {
        appearance: 'success',
        autoDismiss: true,
      });
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
