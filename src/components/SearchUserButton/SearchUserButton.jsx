import React, { useContext } from 'react';
import { useUpdateEffect } from 'react-use';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import isEqual from 'lodash.isequal';
import { SearchIcon } from '@chakra-ui/icons';

import { useModel } from 'model';
import SearchUserInput from 'components/SearchUserInput';
import { AccountContext } from 'App';

const SearchUserButton = ({ onSelectUser }) => {
  const [{ createRoomState, rooms }, { createRoom }] = useModel(
    'message',
    ({ createRoom, rooms: roomsModel }) => ({
      createRoomState: createRoom,
      rooms: Object.keys(roomsModel).map(id => roomsModel[id]),
    }),
  );
  const { account } = useContext(AccountContext);
  const { isOpen, onClose, onOpen } = useDisclosure();

  useUpdateEffect(() => {
    if (createRoomState.loading || createRoomState.error) return;
    onSelectUser(createRoomState._id);
    onClose();
  }, [createRoomState]);

  const onCreateRoomChat = toUserId => {
    const room = rooms.find(r => isEqual(r.userIds.sort(), [account._id, toUserId].sort()));
    if (room) {
      onSelectUser(room._id);
      onClose();
      return;
    }
    createRoom({
      userIds: [toUserId, account._id],
      createrId: account._id,
    });
  };

  return (
    <>
      <Button
        w="100%"
        focusBorderColor="pink.200"
        leftIcon={<SearchIcon color="gray.400" />}
        onClick={onOpen}
        justifyContent="flex-start"
        fontWeight="light"
        fontSize="md"
        color="gray.400"
        bg="white"
      >
        Search friend...
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody py="5">
            <SearchUserInput onUserClick={u => onCreateRoomChat(u._id)} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SearchUserButton;
