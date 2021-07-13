import React, { useContext } from 'react';
import { useUpdateEffect } from 'react-use';
import {
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
  useToast,
} from '@chakra-ui/react';
import { Controller, useForm } from 'react-hook-form';

import { useModel } from 'model';
import { AccountContext } from 'App';
import SearchFriendInput from 'components/SearchFriendInput';
import useUsers from 'hooks/useUsers';

const selector = ({ createConversation, conversations: conversationsModel }) => ({
  createConversationState: createConversation,
  conversations: Object.keys(conversationsModel).map(id => conversationsModel[id]),
});

const CreateChatGroupModal = ({ isOpen, onClose, onSelectConversation }) => {
  const [{ createConversationState, conversations }, { createConversation }] = useModel('message', selector);
  const [{ friends }] = useUsers();

  const toast = useToast();
  const { control, handleSubmit } = useForm();
  const { account } = useContext(AccountContext);

  useUpdateEffect(() => {
    if (createConversationState.loading || createConversationState.error) return;
    onSelectConversation(createConversationState.id);
    onClose();
  }, [createConversationState]);

  const onHandleSumbit = handleSubmit(data => {
    if (data.userIds.length < 2) return;
    const userIds = [account.id, ...data.userIds.map(u => u.id)].sort().join(',');
    const conversation = conversations.find(r => r.userIds.sort().join(',') === userIds);

    if (conversation) {
      onSelectConversation(conversation.id);
      toast({
        description: 'Group existed',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      onClose();
      return;
    }
    createConversation({
      name: data.name,
      userIds,
      createrId: account.id,
    });
  });
  const onHandleAddUser = (user, { users, onAdd }) => {
    if (users.find(u => u.id === user.id)) return;
    onAdd([...users, user]);
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create group chat</ModalHeader>
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
              field: { onChange, value: users },
              fieldState: { error, invalid },
            }) => (
              <>
                <FormControl isInvalid={invalid} mt="5">
                  <HStack spacing={2}>
                    {users.map(u => (
                      <Tag
                        size="md"
                        key={u.id}
                        colorScheme="blue"
                      >
                        <TagLabel>{u.userName}</TagLabel>
                        <TagCloseButton onClick={() => {
                          onChange(users.filter(user => u.id !== user.id));
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
                  usersData={friends}
                  hasSearchIcon={false}
                  placeholder="Find friend..."
                  onUserClick={u => onHandleAddUser(u, { users, onAdd: onChange })}
                />
              </>
            )}
          />
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={onHandleSumbit}
            isLoading={createConversationState.loading}
          >
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateChatGroupModal;
