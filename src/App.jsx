import React, { useState, createContext, useContext } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import ChatView from "pages/ChatView";
import Login from "pages/Login";
import Register from "pages/Register";

export const AccountContext = createContext({});

function App() {
  const [account, setAccount] = useState({});
  return (
    <AccountContext.Provider
      value={{
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
  );
}

const R = ({ authorize, location, ...rest }) => {
  const { account } = useContext(AccountContext);
  if (!authorize) {
    return <Route {...rest} />;
  }
  if (!account.isVerified) {
    return <Redirect to="/login" />;
  }
  return <Route {...rest} />;
};

export default App;
