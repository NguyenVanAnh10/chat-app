import React, { useState, useContext } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  ButtonGroup,
  FormControl,
  FormErrorMessage,
  Heading,
  Input,
} from "@chakra-ui/react";

import { AccountContext } from "App";
import api from "services/api";
import PasswordInput from "components/PasswordInput";

const LoginForm = ({ onOpenRegister }) => {
  const { control, handleSubmit } = useForm();
  const [error, setError] = useState(null);
  const { account, setAccount } = useContext(AccountContext);

  const onHandleLogin = handleSubmit((user) => {
    api.POST("/login", user).then((acc) => {
      if (acc.error) return setError(acc.error);
      acc.isVerified && setAccount(acc);
    });
  });

  return (
    <>
      <Heading size="lg">RiceLo</Heading>
      <form className="form">
        <Controller
          name="userName"
          control={control}
          defaultValue=""
          rules={{ required: "Please type your's username" }}
          render={({ field, fieldState: { invalid, error } }) => (
            <FormControl isInvalid={invalid}>
              <Input placeholder="User name" {...field} />
              {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
            </FormControl>
          )}
        />
        <Controller
          name="password"
          control={control}
          defaultValue=""
          rules={{ required: "Password is required" }}
          render={({ field, fieldState: { invalid, error } }) => (
            <FormControl isInvalid={invalid} marginTop="5">
              <PasswordInput placeholder="Password" {...field} />
              {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
            </FormControl>
          )}
        />
        {(error || account.error) && (
          <Alert status="error" marginTop="5">
            <AlertIcon />
            <AlertDescription>
              {error?.message ||
                account.error?.message ||
                "Something went wrong"}
            </AlertDescription>
          </Alert>
        )}
        <ButtonGroup spacing="5" marginTop="8">
          <Button background="red.100" onClick={onHandleLogin}>
            Login
          </Button>
          <Button
            alignSelf="center"
            colorScheme="teal"
            variant="link"
            onClick={onOpenRegister}
          >
            Register
          </Button>
        </ButtonGroup>
      </form>
    </>
  );
};
export default LoginForm;
