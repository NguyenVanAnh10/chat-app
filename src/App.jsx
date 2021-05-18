import React, {
  useState,
  createContext,
  useContext,
  useEffect as useReactEffect,
} from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { io } from "socket.io-client";

import ChatView from "pages/ChatView";
import Login from "pages/Login";
import Register from "pages/Register";
import api from "services/api";

const socket = io(process.env.REACT_APP_HEROKU_API);

export const AccountContext = createContext({});

function App() {
  const [account, setAccount] = useState({});

  return (
    <ChakraProvider>
      <AccountContext.Provider
        value={{
          socket,
          account,
          setAccount,
        }}
      >
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
  const { account, setAccount } = useContext(AccountContext);
  useReactEffect(() => {
    authorize &&
      api.GET("/me").then((acc) => {
        setAccount(acc);
      });
  }, []);

  if (!authorize) {
    return <Route {...rest} />;
  }
  if (!!account.error) {
    return <Redirect to="/login" />;
  }
  return <Route {...rest} />;
};

export default App;
