import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { useDisclosure } from '@chakra-ui/react';

import { AccountContext } from 'App';
import useQuery from 'hooks/useQuery';
import RegisterModal from 'components/RegisterModal';
import LoginForm from './LoginForm';
import ConfirmPasswordRegisterForm from './ConfirmPasswordRegisterForm';
import { useModel } from 'model';

const Login = ({ location }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { registry_token: registryToken } = useQuery();
  const { account } = useContext(AccountContext);
  const [{ loginState }] = useModel('account', state => ({
    loginState: state.login,
  }));

  if (account.id && !loginState.loading) {
    console.log('location', location);

    return <Redirect to={location.state} />;
  }

  return (
    <>
      {registryToken ? (
        <ConfirmPasswordRegisterForm registryToken={registryToken} />
      ) : (
        <LoginForm loginState={loginState} onOpenRegister={onOpen} />
      )}
      <RegisterModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default Login;
