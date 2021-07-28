import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  Input,
  Text,
  useBreakpointValue,
  VStack,
} from '@chakra-ui/react';

import PasswordInput from 'components/PasswordInput';
import { useModel } from 'model';

import styles from './Login.module.scss';

const LoginForm = ({ onOpenRegister, loginState: { error, loading } }) => {
  const { control, handleSubmit } = useForm();

  const [, { login }] = useModel('account', state => state);
  const isMobileScreen = useBreakpointValue({ base: true, md: false });
  const onHandleLogin = handleSubmit(user => login(user));
  const handleKeyDown = e => {
    if (e.keyCode === 13) {
      onHandleLogin();
    }
  };
  return (
    <Flex
      flexDir="column"
      justify="center"
      align="center"
      className={styles.LoginWrapper}
      bg="blue.200"
      bgGradient="linear(blue.200 0%,blue.100 70%)"
      onKeyDown={handleKeyDown}
    >
      <Box
        boxShadow="md"
        bg="whiteAlpha.900"
        borderRadius="md"
        padding="8"
        color="gray.600"
      >
        <Heading size="lg" textAlign="center">Alo Rice</Heading>
        <form className="form">
          <VStack spacing={isMobileScreen ? '4' : '6'}>
            <Controller
              name="userName"
              control={control}
              defaultValue=""
              rules={{ required: "Please type your's username" }}
              render={({ field, fieldState: { invalid, error: err } }) => (
                <FormControl isInvalid={invalid}>
                  <Input placeholder="User name" {...field} />
                  {err && <FormErrorMessage>{err.message}</FormErrorMessage>}
                </FormControl>
              )}
            />
            <Controller
              name="password"
              control={control}
              defaultValue=""
              rules={{ required: 'Password is required' }}
              render={({ field, fieldState: { invalid, error: err } }) => (
                <FormControl isInvalid={invalid}>
                  <PasswordInput placeholder="Password" {...field} />
                  {err && <FormErrorMessage>{err.message}</FormErrorMessage>}
                </FormControl>
              )}
            />
          </VStack>
          { error && (
            <Alert status="error" marginTop="5">
              <AlertIcon />
              <AlertDescription>
                {error?.message || 'Something went wrong'}
              </AlertDescription>
            </Alert>
          )}
        </form>
        <Button
          mt={isMobileScreen ? '8' : '10'}
          w="100%"
          colorScheme="blue"
          onClick={onHandleLogin}
          isLoading={loading}
        >
          Login
        </Button>
        <Text mt="6" textAlign="center">
          Don&apos;t have account?&nbsp;
          <Button
            colorScheme="teal"
            variant="link"
            _focus="none"
            fontWeight="normal"
            onClick={onOpenRegister}
          >
            Register now
          </Button>
        </Text>
      </Box>
    </Flex>
  );
};
export default LoginForm;
