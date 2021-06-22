import React, { useContext, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, AlertDescription, AlertIcon, Avatar, Button, FormControl, FormErrorMessage,
  Input, Modal, ModalBody, ModalCloseButton, ModalContent,
  ModalFooter, ModalHeader, ModalOverlay, useToast, VStack } from '@chakra-ui/react';
import { useUpdateEffect } from 'react-use';

import { AccountContext } from 'App';
import UploadImage from 'components/UploadImage';
import { useModel } from 'model';

const selector = ({ updateMe }) => ({ updateState: updateMe });

const UpdateAccountInfoModal = ({ isOpen, onClose }) => {
  const { account } = useContext(AccountContext);
  const [{ updateState }, { updateMe }] = useModel('account', selector);
  const toast = useToast();

  const { control, handleSubmit, reset } = useForm();

  useEffect(() => {
    reset({
      userName: account.userName,
      email: account.email,
      avatar: { src: account.avatar },
    });
  }, [account]);

  useUpdateEffect(() => {
    if (!updateState.loading && !updateState.error) {
      toast({
        description: 'Update successfully',
        status: 'success',
        duration: 9000,
      });
      handleClose();
    }
  }, [updateState.loading]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleUpdate = handleSubmit(data => {
    if (!data.avatar?.base64Image) return;
    updateMe({
      id: account.id,
      userName: account.userName,
      email: account.email,
      base64AvatarImage: data.avatar.base64Image,
    });
  });
  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update account information</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Controller
              name="avatar"
              control={control}
              rules={{ required: 'User name is required' }}
              render={({ field, fieldState: { error: err, invalid } }) => (
                <FormControl isInvalid={invalid}>
                  <UploadImage
                    mx="auto"
                    borderRadius="100%"
                    cursor="pointer"
                    onSelectImage={({ base64Image, contentBlob }) => field.onChange({
                      ...field.value,
                      src: contentBlob,
                      base64Image,
                    })}
                    renderButton={() => (
                      <Avatar
                        size="2xl"
                        name={account.userName}
                        src={field.value?.src}
                        transition="all 0.3s ease"
                        _hover={{ opacity: 0.8 }}
                      />
                    )}
                  />
                  {err && (
                  <FormErrorMessage>{err.message}</FormErrorMessage>
                  )}
                </FormControl>
              )}
            />
            <VStack spacing="5" mt="9">
              <Controller
                name="userName"
                control={control}
                rules={{ required: 'User name is required' }}
                render={({ field, fieldState: { error: err, invalid } }) => (
                  <FormControl isInvalid={invalid}>
                    <Input placeholder="User name" isDisabled {...field} />
                    {err && (
                    <FormErrorMessage>{err.message}</FormErrorMessage>
                    )}
                  </FormControl>
                )}
              />
              <Controller
                name="email"
                control={control}
                rules={{ required: 'Email is required' }}
                render={({ field, fieldState: { error: err, invalid } }) => (
                  <FormControl isInvalid={invalid}>
                    <Input placeholder="Email" isDisabled {...field} />
                    {err && (
                    <FormErrorMessage>{err.message}</FormErrorMessage>
                    )}
                  </FormControl>
                )}
              />
            </VStack>
            {updateState.error && (
            <Alert status="error" marginTop="5">
              <AlertIcon />
              <AlertDescription>
                {updateState.error?.message || 'Something went wrong'}
              </AlertDescription>
            </Alert>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              variant="solid"
              mr="2"
              isLoading={updateState.loading}
              onClick={handleUpdate}
            >
              Update
            </Button>
            <Button colorScheme="blue" variant="ghost" onClick={handleClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default UpdateAccountInfoModal;
