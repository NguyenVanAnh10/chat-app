import React, { useState, useRef, useEffect as useReactEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  FormControl,
  FormErrorMessage,
  Heading,
  Text,
} from "@chakra-ui/react";

import api from "services/api";
import PasswordInput from "components/PasswordInput";

const ConfirmPasswordRegisterForm = ({ token }) => {
  const history = useHistory();
  const { control, handleSubmit, watch, reset } = useForm({
    defaultValues: {},
  });
  const [{ error: tokenError, loading }, seTokenState] = useState({
    loading: true,
  });
  const [{ error: setPasswordError }, setPassword] = useState({});

  useReactEffect(() => {
    api.POST("/login", { token }).then((tokenRes) => {
      seTokenState(tokenRes);
    });
  }, []);

  const passwordRef = useRef();
  passwordRef.current = watch("password");

  const onSetPassword = handleSubmit(({ password }) => {
    api.POST("/register/set_password", { password, token }).then((res) => {
      setPassword(res);
      !res.error && reset({});
      !res.error && history.push("/login");
    });
  });
  if (loading) {
    return <div>Loading...</div>;
  }
  if (!!tokenError) {
    return <Text color="red.500">{tokenError.message}</Text>;
  }
  return (
    <>
      <Heading size="lg">Set password</Heading>
      <form className="form">
        <Controller
          name="password"
          control={control}
          defaultValue=""
          rules={{ required: "Password is required" }}
          render={({ field, fieldState: { invalid, error } }) => (
            <FormControl marginTop="5" isInvalid={invalid}>
              <PasswordInput {...field} />
              {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
            </FormControl>
          )}
        />
        <Controller
          name="confirmPassword"
          control={control}
          defaultValue=""
          rules={{
            required: "Confirm password is required",
            validate: (value) =>
              // {/* TODO: re-password dependency field */}
              value === passwordRef.current || "Confirm password is not match",
          }}
          render={({ field, fieldState: { invalid, error } }) => (
            <FormControl marginTop="5" isInvalid={invalid}>
              <PasswordInput placeholder="Confirm password" {...field} />
              {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
            </FormControl>
          )}
        />

        {setPasswordError && (
          <Alert status="error" marginTop="5">
            <AlertIcon />
            <AlertDescription>
              {setPasswordError.message || "Something went wrong"}
            </AlertDescription>
          </Alert>
        )}
        <Button background="red.100" marginTop="8" onClick={onSetPassword}>
          Set password
        </Button>
      </form>
    </>
  );
};

export default ConfirmPasswordRegisterForm;
