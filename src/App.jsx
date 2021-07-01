import React, {
  createContext,
  useContext,
  useEffect as useReactEffect,
  lazy,
  Suspense,
} from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { useCookie } from 'react-use';

import { useModel } from 'model';
import LoadingPage from 'pages/LoadingPage';

const ChatList = lazy(() => import('pages/ChatApp'));
const Login = lazy(() => import('pages/Login'));
const ExceptionPage = lazy(() => import('pages/ExceptionPage'));
const Register = lazy(() => import('pages/Register'));

export const AccountContext = createContext({});

function App() {
  const [{ account }] = useModel('account', ({ me }) => ({
    account: me,
  }));

  return (
    <ChakraProvider>
      <AccountContext.Provider value={{ account }}>
        <Suspense fallback={<LoadingPage />}>
          <Switch>
            <R authorize exact path="/" component={ChatList} />
            <R path="/login" component={Login} />
            <R path="/register" component={Register} />
            <R path="*" component={ExceptionPage} />
          </Switch>
        </Suspense>
      </AccountContext.Provider>
    </ChakraProvider>
  );
}

const R = ({ authorize, location, ...rest }) => {
  const [{ loading }, { getMe }] = useModel('account', ({ getMe: getMeState }) => ({
    loading: getMeState.loading,
    error: getMeState.error,
  }));
  const [token] = useCookie('token_user');

  const { account } = useContext(AccountContext);
  useReactEffect(() => {
    token && getMe();
  }, []);

  if (loading) {
    return (
      <LoadingPage />
    );
  }
  if (!authorize) {
    return <Route {...rest} />;
  }
  if (!account.id) {
    return <Redirect to="/login" />;
  }
  return <Route {...rest} />;
};

export default App;
