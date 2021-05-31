import React, { useContext } from "react";
import { useUpdateEffect } from "react-use";
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
} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import isEqual from "lodash.isequal";

import { useModel } from "model";
import { AccountContext } from "App";
import SearchUser from "components/SearchUser";

const CreateChatGroupModal = ({ isOpen, onClose, onSelectRoom }) => {
  const [{ createRoomState, rooms }, { createRoom }] = useModel(
    "message",
    ({ createRoom, rooms: roomsModel }) => ({
      createRoomState: createRoom,
      rooms: Object.keys(roomsModel).map((id) => roomsModel[id]),
    })
  );
  const toast = useToast();
  const { control, handleSubmit } = useForm();
  const { account } = useContext(AccountContext);

  useUpdateEffect(() => {
    if (createRoomState.loading || createRoomState.error) return;
    onSelectRoom(createRoomState._id);
    onClose();
  }, [createRoomState]);

  const onHandleSumbit = handleSubmit((data) => {
    const room = rooms.find((r) =>
      isEqual(
        r.userIds.sort(),
        [account._id, ...data.userIds.map((u) => u._id)].sort()
      )
    );
    if (room) {
      onSelectRoom(room._id);
      toast({
        description: "Group existed",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      onClose();
      return;
    }
    createRoom({
      name: data.name,
      userIds: [account._id, ...data.userIds.map((u) => u._id)],
      createrId: account._id,
    });
  });
  const onHandleAddUser = (user, { users, onAdd }) => {
    if (users.find((u) => u._id === user._id)) return;
    onAdd([...users, user]);
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
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
              rules={{ required: "Room name is required" }}
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
              rules={{ required: "Email is required" }}
              render={({
                field: { onChange, value: users },
                fieldState: { error, invalid },
              }) => (
                <FormControl isInvalid={invalid} marginTop="5">
                  <HStack spacing={4}>
                    {users.map((u) => (
                      <Tag
                        size="md"
                        key={u._id}
                        borderRadius="full"
                        variant="solid"
                        bg="pink.100"
                        color="pink.600"
                      >
                        <TagLabel>{u.userName}</TagLabel>
                        <TagCloseButton />
                      </Tag>
                    ))}
                  </HStack>
                  {error && (
                    <FormErrorMessage>{error.message}</FormErrorMessage>
                  )}
                  <SearchUser
                    mt="5"
                    hasSearchIcon={false}
                    placeholder="Add user..."
                    onUserClick={(u) =>
                      onHandleAddUser(u, { users, onAdd: onChange })
                    }
                  />
                </FormControl>
              )}
            />
          </form>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="ghost"
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
