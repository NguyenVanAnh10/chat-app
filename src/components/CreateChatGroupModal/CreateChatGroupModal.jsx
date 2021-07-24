import React from 'react';
import { useUpdateEffect } from 'react-use';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  FormControl,
  FormErrorMessage,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tag,
  TagCloseButton,
  TagLabel,
} from '@chakra-ui/react';
import { Controller, useForm } from 'react-hook-form';

import useConversations from 'hooks/useConversations';
import SearchFriendInput from 'components/SearchFriendInput';
import usefriends from 'hooks/useFriends';

const CreateChatGroupModal = ({ isOpen, onClose, onSelectConversation }) => {
  const [{ createState }, { createConversation }] = useConversations();
  const [{ friends }] = usefriends({ forceFetchingFriends: true });

  const { control, handleSubmit, reset } = useForm({ name: '', userIds: [] });

  useUpdateEffect(() => {
    if (createState.loading || createState.error) return;
    onSelectConversation(createState.id);
    onClose();
  }, [createState]);

  const onHandleSumbit = handleSubmit(data => {
    if (data.userIds.length < 2) return;
    createConversation({
      name: data.name,
      userIds: data.userIds.map(u => u.id),
    });
  });

  const handleClose = () => {
    reset({ name: '', userIds: [] });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color="gray.600">Create group chat</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Controller
            name="name"
            control={control}
            defaultValue=""
            rules={{ required: 'Set group name' }}
            render={({ field, fieldState: { error, invalid } }) => (
              <FormControl isInvalid={invalid}>
                <Input placeholder="Conversation name" {...field} />
                {error && (
                <FormErrorMessage>{error.message}</FormErrorMessage>
                )}
              </FormControl>
            )}
          />
          <Controller
            name="userIds"
            control={control}
            defaultValue={[]}
            rules={{
              required: 'Add friend to chat group',
              validate: value => value.length > 1 || 'Group chat is greater 2 friends',
            }}
            render={({
              field: { onChange, value },
              fieldState: { error, invalid },
            }) => (
              <>
                <FormControl isInvalid={invalid} mt="5">
                  <HStack spacing={2}>
                    {value.map(u => (
                      <Tag
                        size="md"
                        key={u.id}
                        colorScheme="blue"
                      >
                        <TagLabel>{u.userName}</TagLabel>
                        <TagCloseButton onClick={() => {
                          onChange(value.filter(user => u.id !== user.id));
                        }}
                        />
                      </Tag>
                    ))}
                  </HStack>
                  {error && (
                    <FormErrorMessage>{error.message}</FormErrorMessage>
                  )}
                </FormControl>
                <SearchFriendInput
                  mt="5"
                  friendData={friends}
                  hasSearchIcon={false}
                  placeholder="Find friend..."
                  onFriendClick={friend => {
                    if (value.some(f => friend.id === f.id)) return;
                    onChange([...value, friend]);
                  }}
                />
              </>
            )}
          />
          {createState.error && (
          <Alert status="error" mt="5">
            <AlertIcon />
            <AlertDescription>{createState.error.message || createState.error.name || 'Something went wrong'}</AlertDescription>
          </Alert>
          )}
        </ModalBody>

        <ModalFooter>
          <Button mr={3} colorScheme="blue" onClick={onClose} variant="ghost">
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={onHandleSumbit}
            isLoading={createState.loading}
          >
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateChatGroupModal;
