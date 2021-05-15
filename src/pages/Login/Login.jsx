import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import { Flex, Box, useDisclosure } from "@chakra-ui/react";

import { AccountContext } from "App";
import useQuery from "hooks/useQuery";
import RegisterModal from "components/RegisterModal";
import LoginForm from "./LoginForm";
import ConfirmPasswordRegisterForm from "./ConfirmPasswordRegisterForm";

import styles from "./Login.module.scss";

const Login = () => {
  const { account } = useContext(AccountContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { token } = useQuery();

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
          {!!token ? (
            <ConfirmPasswordRegisterForm token={token} />
          ) : (
            <LoginForm onOpenRegister={onOpen} />
          )}
        </Box>
      </Flex>
      <RegisterModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default Login;
