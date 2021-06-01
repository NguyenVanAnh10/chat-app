import React, { useContext } from "react";
import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import isEqual from "lodash.isequal";
import { useUpdateEffect } from "react-use";

import { useModel } from "model";
import { AccountContext } from "App";
import SearchUser from "components/SearchUser";
import RoomList from "./RoomList";

const MainSideNav = ({
  width,
  isMobileScreen,
  selectedRoomId,
  onSelectRoom,
}) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <Flex
      flexDir="column"
      flex="1"
      p="2"
      bg="white"
      width={isMobileScreen ? "calc(100vw - 66px)" : 300}
      transition="width 0.3s ease"
      zIndex="3"
    >
      <Flex
        alignItems="center"
        h="4rem"
        borderBottom="1px solid rgba(0, 0, 0, 0.08)"
      >
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
      </Flex>
      <RoomList selectedRoomId={selectedRoomId} onSelectRoom={onSelectRoom} />
      <SearchFriendModal
        isOpen={isOpen}
        onClose={onClose}
        onSelectRoom={onSelectRoom}
      />
    </Flex>
  );
};
const SearchFriendModal = ({ isOpen, onClose, onSelectRoom }) => {
  const [{ createRoomState, rooms }, { createRoom }] = useModel(
    "message",
    ({ createRoom, rooms: roomsModel }) => ({
      createRoomState: createRoom,
      rooms: Object.keys(roomsModel).map((id) => roomsModel[id]),
    })
  );
  const { account } = useContext(AccountContext);
  useUpdateEffect(() => {
    if (createRoomState.loading || createRoomState.error) return;
    onSelectRoom(createRoomState._id);
    onClose();
  }, [createRoomState]);

  const onCreateRoomChat = (toUserId) => {
    const room = rooms.find((r) =>
      isEqual(r.userIds.sort(), [account._id, toUserId].sort())
    );
    if (room) {
      onSelectRoom(room._id);
      onClose();
      return;
    }
    createRoom({
      userIds: [toUserId, account._id],
      createrId: account._id,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody py="5">
          <SearchUser onUserClick={(u) => onCreateRoomChat(u._id)} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default MainSideNav;
