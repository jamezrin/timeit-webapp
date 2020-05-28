import React from 'react';
import { useParams } from 'react-router-dom';

export default function AccountConfirmPage() {
  const { token } = useParams();
  return <span>Token: {token}</span>;
}
