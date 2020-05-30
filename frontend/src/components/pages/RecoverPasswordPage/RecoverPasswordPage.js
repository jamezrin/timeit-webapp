import React from 'react';
import { useParams } from 'react-router-dom';

// TODO This is similar to request password, but with the new password
export default function RecoverPasswordPage() {
  const { token } = useParams();
  return <span>Token: {token}</span>;
}
