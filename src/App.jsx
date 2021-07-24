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
  const [{ account }, { getMe }] = useModel('account', ({ me }) => ({
    account: me,
  }));
  const [token] = useCookie('user_token');

  useReactEffect(() => {
    token && getMe();
  }, []);
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

const selector = ({ getMe: getMeState }) => ({
  loading: getMeState.loading,
  error: getMeState.error,
});
const R = ({ authorize, location, ...rest }) => {
  const [{ loading }] = useModel('account', selector);

  const { account } = useContext(AccountContext);

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
