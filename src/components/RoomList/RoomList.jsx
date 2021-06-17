import React, { useContext } from 'react';
import {
  Box, HStack, IconButton, Text, useDisclosure,
} from '@chakra-ui/react';
import { AddUsersIcon, AddUserIcon } from 'components/CustomIcons';

import { AccountContext } from 'App';
import { useRooms } from 'hooks/useRoom';
import CreateChatGroupModal from 'components/CreateChatGroupModal';
import ListItem from 'components/ListItem';
import { menuKeys } from 'configs/configs';
import { MenuContext } from 'contexts/menuContext';
import RoomItem from 'components/RoomItem';
import AddFriendModal from 'components/AddFriendModal';

const RoomList = ({ roomListType }) => {
  const { account } = useContext(AccountContext);
  const { menuState, setMenuState } = useContext(MenuContext);
  const selectedRoomId = menuState[menuState.active]?.roomId;

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [{ rooms }, { haveSeenNewMessages }] = useRooms(roomListType);

  const onHandleClick = room => {
    setMenuState(prev => ({
      ...prev,
      [menuState.active]: { ...prev[menuState.active], roomId: room.id },
    }));
    if (!room.newMessageNumber?.length) return;
    haveSeenNewMessages({ roomId: room.id, userId: account.id });
  };
  const onHandleSelectRoom = id => {
    setMenuState(prev => ({
      ...prev,
      [menuState.active]: { ...prev[menuState.active], roomId: id },
    }));
  };
  switch (roomListType) {
    case menuKeys.CONTACT_BOOK:
      return (
        <Box pt="5">
          <ListItem
            data={rooms}
            emptyText="No friend"
            header={(
              <HStack justifyContent="space-between">
                <Text fontSize="sm">All friends</Text>
                <IconButton
                  title="add friend"
                  bg="transparent"
                  color="pink.200"
                  _hover={{ bg: 'pink.50' }}
                  icon={<AddUserIcon boxSize="1.1rem" color="blue.500" />}
                  onClick={onOpen}
                />
              </HStack>
            )}
            renderItem={room => (
              <RoomItem
                key={room.id}
                room={room}
                active={selectedRoomId === room.id}
                onClick={() => onHandleClick(room)}
              />
            )}
          />
          <AddFriendModal isOpen={isOpen} onClose={onClose} />
        </Box>
      );
    default:
      return (
        <Box pt="5">
          <ListItem
            data={rooms}
            emptyText="No message"
            header={(
              <HStack justifyContent="space-between">
                <Text fontSize="sm">All messages</Text>
                <IconButton
                  bg="transparent"
                  color="pink.200"
                  _hover={{ bg: 'pink.50' }}
                  icon={<AddUsersIcon boxSize="1.3rem" color="blue.500" />}
                  onClick={onOpen}
                />
              </HStack>
            )}
            renderItem={room => (
              <RoomItem
                key={room.id}
                room={room}
                active={selectedRoomId === room.id}
                onClick={() => onHandleClick(room)}
              />
            )}
          />
          <CreateChatGroupModal
            isOpen={isOpen}
            onClose={onClose}
            onSelectRoom={onHandleSelectRoom}
          />
        </Box>
      );
  }
};

export default RoomList;
