import React, { useRef, useEffect as useReactEffect } from 'react';
import { useUpdateEffect } from 'react-use';
import { Controller, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  Spinner,
  Text,
  useBreakpointValue,
  useToast,
} from '@chakra-ui/react';

import PasswordInput from 'components/PasswordInput';

import styles from './Login.module.scss';
import { useModel } from 'model';

const selector = ({ validateEmail, setPassword }) => ({
  validateEmailState: validateEmail,
  setPasswordState: setPassword,
});

const ConfirmPasswordRegisterForm = ({ registryToken }) => {
  const toast = useToast();
  const history = useHistory();
  const { control, handleSubmit, watch, reset } = useForm({
    defaultValues: {},
  });
  const [
    { validateEmailState, setPasswordState },
    { validateEmail, setPassword },
  ] = useModel('account', selector);

  const isMobileScreen = useBreakpointValue({ base: true, md: false });

  useReactEffect(() => {
    registryToken && validateEmail({ registryToken });
    return () => reset();
  }, [registryToken]);

  useUpdateEffect(() => {
    if (!setPasswordState.error && !setPasswordState.loading) {
      history.push('/login');
      toast({
        title: 'Set password successfully.',
        description: "You have done account registration, let's login application to experience chatting to friends and family",
        status: 'success',
        duration: 9000,
        position: 'top',
        isClosable: true,
      });
    }
  }, [setPasswordState.loading]);

  const passwordRef = useRef();
  passwordRef.current = watch('password');

  const onSetPassword = handleSubmit(({ password }) => {
    setPassword({ password, registryToken });
  });

  return (
    <Flex
      flexDir="column"
      justify="center"
      align="center"
      className={styles.LoginWrapper}
      bg="blue.200"
      bgGradient="linear(blue.200 0%,blue.100 70%)"
    >
      {validateEmailState.loading ? (
        <Center>
          <Spinner
            thickness="3px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="lg"
          />
        </Center>
      )
        : (
          <Box
            boxShadow="md"
            bg="whiteAlpha.900"
            borderRadius="md"
            padding="8"
            color="blackAlpha.800"
          >
            {validateEmailState.error
              ? <Text color="red.500" fontWeight="bold">{validateEmailState.error?.message || 'Something went wrong'}</Text>
              : (
                <>
                  <Heading size="lg" textAlign="center">Set password</Heading>
                  <form className="form">
                    <Controller
                      name="password"
                      control={control}
                      defaultValue=""
                      rules={{ required: 'Password is required' }}
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
                        required: 'Confirm password is required',
                        // {/* TODO re-password dependency field */}
                        validate: value => value === passwordRef.current || 'Confirm password is not match',
                      }}
                      render={({ field, fieldState: { invalid, error } }) => (
                        <FormControl marginTop="5" isInvalid={invalid}>
                          <PasswordInput placeholder="Confirm password" {...field} />
                          {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
                        </FormControl>
                      )}
                    />

                    {setPasswordState.error && (
                    <Alert status="error" marginTop="5">
                      <AlertIcon />
                      <AlertDescription>
                        {setPasswordState.error?.message || 'Something went wrong'}
                      </AlertDescription>
                    </Alert>
                    )}
                    <Button
                      colorScheme="blue"
                      mt={isMobileScreen ? '8' : '10'}
                      onClick={onSetPassword}
                      w="100%"
                    >
                      Set password
                    </Button>
                  </form>
                </>
              )}
          </Box>
        )}
    </Flex>
  );
};

export default ConfirmPasswordRegisterForm;
