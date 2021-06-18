import React, { useContext } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, FormControl, FormErrorMessage, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, VStack } from '@chakra-ui/react';

import { AccountContext } from 'App';
import UploadImage from 'components/UploadImage';
import { useModel } from 'model';

import defaultAvatar from 'statics/images/default_user.png';

const UpdateAccountInfoModal = ({ isOpen, onClose }) => {
  const { account } = useContext(AccountContext);
  const [, { updateMe }] = useModel('account', () => ({}));

  const { control, handleSubmit } = useForm({
    defaultValues: {
      userName: account.userName,
      email: account.email,
      avatar: { src: account.avatar },
    },
  });

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
      <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update account information</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing="5">
              <Controller
                name="avatar"
                control={control}
                rules={{ required: 'User name is required' }}
                render={({ field, fieldState: { error: err, invalid } }) => (
                  <FormControl isInvalid={invalid}>
                    <UploadImage
                      onSelectImage={({ base64Image, contentBlob }) => field.onChange({
                        ...field.value,
                        src: contentBlob,
                        base64Image,
                      })}
                      renderButton={() => (
                        <Image
                          mx="auto"
                          borderRadius="100%"
                          src={field.value?.src || defaultAvatar}
                          boxSize="120px"
                          objectFit="cover"
                          alt="Avatar"
                          transition="opacity 0.3s ease"
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
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              variant="solid"
              mr="2"
              onClick={handleUpdate}
            >
              Update
            </Button>
            <Button colorScheme="blue" variant="ghost" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default UpdateAccountInfoModal;
