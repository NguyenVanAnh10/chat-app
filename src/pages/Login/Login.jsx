import React, { useState, useContext } from "react";
import { Redirect } from "react-router-dom";

import { AccountContext } from "App";
import api from "services/api";

const Login = () => {
  const { account, setAccount } = useContext(AccountContext);

  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const onHandleLogin = (e) => {
    e.preventDefault();
    api
      .POST("/login", { user, password })
      .then((acc) => {
        setAccount(acc.isVerified ? acc : {});
        setPassword("");
        setUser("");
      })
      .catch((e) => console.error(e));
  };

  if (account.email && account.isVerified) {
    return <Redirect to="/" />;
  }

  return (
    <div>
      <h1>Login</h1>
      <form>
        <input
          type="text"
          placeholder="User"
          value={user}
          onChange={(v) => setUser(v.target.value)}
        />
        <br />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(v) => setPassword(v.target.value)}
        />
        <br />
        <br />
        <input type="submit" value="Login" onClick={onHandleLogin} />
      </form>
    </div>
  );
};
export default Login;
