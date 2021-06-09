import React, {
  createContext,
  useContext,
  useEffect as useReactEffect,
} from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { Center, ChakraProvider, Spinner } from "@chakra-ui/react";

import { useModel } from "model";
import ChatList from "pages/ChatList";
import Login from "pages/Login";
import Register from "pages/Register";
import ExceptionPage from "pages/ExceptionPage";

export const AccountContext = createContext({});

function App() {
  const [{ account }] = useModel("account", ({ me }) => ({
    account: me,
  }));

  return (
    <ChakraProvider>
      <AccountContext.Provider value={{ account }}>
        <Switch>
          <R authorize exact path="/" component={ChatList} />
          <R path="/login" component={Login} />
          <R path="/register" component={Register} />
          <R path="*" component={ExceptionPage} />
        </Switch>
      </AccountContext.Provider>
    </ChakraProvider>
  );
}

const R = ({ authorize, location, ...rest }) => {
  const [{ loading }, { getMe }] = useModel("account", ({ getMe }) => ({
    loading: getMe.loading,
    error: getMe.error,
  }));
  const { account } = useContext(AccountContext);
  useReactEffect(() => {
    getMe();
  }, []);
  if (loading) {
    return (
      <Center minH="100vh">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="orange.400"
          size="xl"
        />
      </Center>
    );
  }
  if (!authorize) {
    return <Route {...rest} />;
  }
  if (!account._id) {
    return <Redirect to="/login" />;
  }
  return <Route {...rest} />;
};

export default App;
