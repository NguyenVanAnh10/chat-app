import React, { useState, useEffect } from "react";
import { Redirect } from "react-router";

import api from "services/api";
import useQuery from "hooks/useQuery";

const Register = () => {
  const [formData, setFormData] = useState({});
  const [{ error, success }, setStatus] = useState({});
  const [checkToken, setCheckToken] = useState({});
  const { token } = useQuery();

  const onHandleSubmit = (e) => {
    e.preventDefault();
    api
      .POST("/register", formData)
      .then(({ error }) => setStatus({ success: !error, error }));
  };

  useEffect(() => {
    token &&
      api
        .GET("/register", { token })
        .then(({ error }) => setCheckToken({ success: !error, error }));
  }, [token]);

  if (success) {
    return (
      <div>
        We just have sent a mail to you for confirmation, please check email
      </div>
    );
  }

  if (checkToken.success) {
    return <Redirect to="/login" />;
  }

  if (checkToken.error) {
    return (
      <div>
        Token can be expired time or is not exactly, please register again.
      </div>
    );
  }
  return (
    <form onSubmit={onHandleSubmit}>
      <div>
        <input
          type="text"
          placeholder="Username"
          value={formData.userName}
          onChange={(e) =>
            setFormData({ ...formData, userName: e.target.value })
          }
        />
      </div>
      <div>
        <input
          type="email"
          placeholder="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
      </div>
      <div>
        <input type="submit" value="Register" />
      </div>
      {error && <div>{error.message || "Something went wrong"}</div>}
    </form>
  );
};
export default Register;
