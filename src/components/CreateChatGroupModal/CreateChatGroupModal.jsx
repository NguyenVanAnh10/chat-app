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
import isEqual from 'lodash.isequal';

import { useModel } from 'model';
import { AccountContext } from 'App';
import SearchFriendInput from 'components/SearchFriendInput';

const selector = ({ createRoom, rooms: roomsModel }) => ({
  createRoomState: createRoom,
  rooms: Object.keys(roomsModel).map(id => roomsModel[id]),
});

const CreateChatGroupModal = ({ isOpen, onClose, onSelectRoom }) => {
  const [{ createRoomState, rooms }, { createRoom }] = useModel('message', selector);
  const [{ friends }] = useModel(
    'account',
    ({ me, users }) => ({
      friends: (me.friendIds || []).map(id => users[id]),
    }),
  );
  const toast = useToast();
  const { control, handleSubmit } = useForm();
  const { account } = useContext(AccountContext);

  useUpdateEffect(() => {
    if (createRoomState.loading || createRoomState.error) return;
    onSelectRoom(createRoomState.id);
    onClose();
  }, [createRoomState]);

  const onHandleSumbit = handleSubmit(data => {
    if (data.userIds.length < 3) return;
    const room = rooms.find(r => isEqual(
      r.userIds.sort(),
      [account.id, ...data.userIds.map(u => u.id)].sort(),
    ));
    if (room) {
      onSelectRoom(room.id);
      toast({
        description: 'Group existed',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      onClose();
      return;
    }
    createRoom({
      name: data.name,
      userIds: [account.id, ...data.userIds.map(u => u.id)],
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
          <form onSubmit={onHandleSumbit}>
            <Controller
              name="name"
              control={control}
              defaultValue=""
              rules={{ required: 'Set group name' }}
              render={({ field, fieldState: { error, invalid } }) => (
                <FormControl isInvalid={invalid}>
                  <Input placeholder="Room name" {...field} />
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
                  <FormControl isInvalid={invalid} marginTop="5">
                    <HStack spacing={4}>
                      {users.map(u => (
                        <Tag
                          size="md"
                          key={u.id}
                          colorScheme="blue"
                        >
                          <TagLabel>{u.userName}</TagLabel>
                          <TagCloseButton />
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
          </form>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={onHandleSumbit}
            isLoading={createRoomState.loading}
          >
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateChatGroupModal;
