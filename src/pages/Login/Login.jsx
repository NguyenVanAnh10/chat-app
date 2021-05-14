import React, { useState, useContext } from "react";
import { Redirect } from "react-router-dom";
import {
  Flex,
  Box,
  Heading,
  FormControl,
  Input,
  Button,
  ButtonGroup,
  Alert,
  AlertIcon,
  AlertDescription,
  useDisclosure,
} from "@chakra-ui/react";

import { AccountContext } from "App";
import api from "services/api";
import RegisterModal from "components/RegisterModal";

import styles from "./Login.module.scss";

const Login = () => {
  const { account, setAccount } = useContext(AccountContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [user, setUser] = useState({});
  const [error, setError] = useState(null);

  const onHandleLogin = (e) => {
    api
      .POST("/login", user)
      .then((acc) => {
        if (acc.error) return setError(acc.error);
        acc.isVerified && setAccount(acc.isVerified);
        setUser({});
      })
      .catch((e) => console.error(e));
  };

  if (account.email && account.isVerified) {
    return <Redirect to="/" />;
  }

  return (
    <>
      <Flex
        flexDir="column"
        justifyContent="center"
        alignItems="center"
        className={styles.Login}
        bgGradient={[
          "linear(to-tr, teal.300,yellow.400)",
          "linear(to-t, blue.200, teal.500)",
          "linear(to-b, orange.100, purple.300)",
        ]}
        color="gray.600"
      >
        <Box
          className="login-box"
          bg="red.50"
          borderRadius="sm"
          borderColor="red.50"
          padding="10"
          textAlign="center"
          w="sm"
        >
          <Heading size="lg">RiceLo</Heading>
          <form className="form">
            <FormControl id="user" isRequired>
              <Input
                placeholder="User name"
                value={user.name || ""}
                onChange={(v) => setUser({ ...user, name: v.target.value })}
              />
            </FormControl>
            <FormControl id="user" isRequired>
              <Input
                marginTop="5"
                placeholder="Password"
                type="password"
                value={user.password || ""}
                onChange={(v) => setUser({ ...user, password: v.target.value })}
              />
            </FormControl>
            {error && (
              <Alert status="error" marginTop="5">
                <AlertIcon />
                <AlertDescription>
                  {error.message || "Something went wrong"}
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
                onClick={onOpen}
              >
                Register
              </Button>
            </ButtonGroup>
          </form>
        </Box>
      </Flex>
      <RegisterModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};
export default Login;
