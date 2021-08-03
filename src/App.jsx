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
import Login from 'pages/Login';

const ChatList = lazy(() => import('pages/ChatApp'));
// const Login = lazy(() => import('pages/Login'));
const ExceptionPage = lazy(() => import('pages/ExceptionPage'));

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
            <R path="/login" component={Login} />
            <R authorize path="/" component={ChatList} />
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
    console.log('location', location);
    return <Redirect to={{ pathname: '/login', state: location }} />;
  }
  return <Route {...rest} />;
};

export default App;
