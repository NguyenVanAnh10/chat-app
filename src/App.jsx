import React, {
  createContext,
  useContext,
  useEffect as useReactEffect,
} from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { ChakraProvider, Text } from "@chakra-ui/react";

import { useModel } from "model";
import ChatView from "pages/ChatView";
import Login from "pages/Login";
import Register from "pages/Register";

export const AccountContext = createContext({});

function App() {
  const [{ account }] = useModel("account", ({ me }) => ({
    account: me,
  }));

  return (
    <ChakraProvider>
      <AccountContext.Provider value={{ account }}>
        <Switch>
          <R authorize exact path="/" component={ChatView} />
          <R path="/login" component={Login} />
          <R path="/register" component={Register} />
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
    return <Text>Loading...</Text>;
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
