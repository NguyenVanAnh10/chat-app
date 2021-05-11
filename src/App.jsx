import React, { useState, createContext, useContext } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import ChatView from "pages/ChatView";
import Login from "pages/Login";

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
      </Switch>
    </AccountContext.Provider>
  );
}

const R = ({ authorize, location, ...rest }) => {
  const { account } = useContext(AccountContext);
  if (!authorize) {
    return <Route {...rest} />;
  }
  if (!account.id) {
    return <Redirect to="/login" />;
  }
  return <Route {...rest} />;
};

export default App;
