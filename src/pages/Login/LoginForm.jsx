import React from "react";
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

import PasswordInput from "components/PasswordInput";
import { useModel } from "model";

const LoginForm = ({ onOpenRegister }) => {
  const { control, handleSubmit } = useForm();
  const [{ error, loading, loginError }, { login }] = useModel(
    "account",
    ({ login, getMe }) => ({
      loading: login.loading,
      loginError: login.error,
      error: getMe.error,
    })
  );

  const onHandleLogin = handleSubmit((user) => login(user));
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
        {(error || loginError) && (
          <Alert status="error" marginTop="5">
            <AlertIcon />
            <AlertDescription>
              {error?.message || loginError?.message || "Something went wrong"}
            </AlertDescription>
          </Alert>
        )}
        <ButtonGroup spacing="5" marginTop="8">
          <Button
            background="red.100"
            onClick={onHandleLogin}
            isLoading={loading}
          >
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
