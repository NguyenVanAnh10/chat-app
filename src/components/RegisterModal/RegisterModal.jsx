import React, { useEffect, useState } from 'react';
import { useUpdateEffect } from 'react-use';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  Input,
  Alert,
  AlertIcon,
  AlertDescription,
  FormErrorMessage,
  Text,
} from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';

import { useModel } from 'model';

const RegisterModal = ({ isOpen, onClose }) => {
  const { control, handleSubmit, reset } = useForm({ defaultValues: {} });
  const [isSuccess, setIsSuccess] = useState();
  const [{ registerState: { loading, error } }, { registerAccount }] = useModel('account', state => ({
    registerState: state.registerAccount,
  }));

  useUpdateEffect(() => {
    if (!loading && !error) {
      setIsSuccess(true);
      reset();
    }
  }, [loading]);

  useEffect(() => {
    if (isOpen) return;
    setIsSuccess(false);
    reset();
  }, [isOpen]);

  const onHandleSubmit = handleSubmit(data => {
    registerAccount(data);
  });

  return (
    <Modal
      size="xl"
      isCentered
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Account registration</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isSuccess ? (
            <Text>
              We just have sent registration confirmation email, please check email
            </Text>
          ) : (
            <form>
              <Controller
                name="userName"
                control={control}
                defaultValue=""
                rules={{ required: 'User name is required' }}
                render={({ field, fieldState: { error: err, invalid } }) => (
                  <FormControl isInvalid={invalid}>
                    <Input placeholder="User name" {...field} />
                    {err && (
                      <FormErrorMessage>{err.message}</FormErrorMessage>
                    )}
                  </FormControl>
                )}
              />
              <Controller
                name="email"
                control={control}
                defaultValue=""
                rules={{ required: 'Email is required' }}
                render={({ field, fieldState: { error: err, invalid } }) => (
                  <FormControl isInvalid={invalid} marginTop="5">
                    <Input placeholder="Email" {...field} />
                    {err && (
                      <FormErrorMessage>{err.message}</FormErrorMessage>
                    )}
                  </FormControl>
                )}
              />
            </form>
          )}
          {error && (
            <Alert status="error" marginTop="5">
              <AlertIcon />
              <AlertDescription>
                {error.message || 'Something went wrong'}
              </AlertDescription>
            </Alert>
          )}
        </ModalBody>

        <ModalFooter>
          {!isSuccess && (
            <Button
              colorScheme="blue"
              isLoading={loading}
              onClick={onHandleSubmit}
            >
              Register
            </Button>
          )}
          <Button variant="ghost" ml={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default RegisterModal;
