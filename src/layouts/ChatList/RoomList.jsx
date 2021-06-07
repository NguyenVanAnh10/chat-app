import React, { useContext, useEffect as useReactEffect } from "react";
import {
  Avatar,
  AvatarBadge,
  AvatarGroup,
  Box,
  HStack,
  IconButton,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { AddUsersIcon } from "components/CustomIcons";
import classNames from "classnames";

import { AccountContext } from "App";
import useRoom, { useRooms } from "hooks/useRoom";
import { useModel } from "model";
import CreateChatGroupModal from "components/CreateChatGroupModal";

import styles from "./RoomList.module.scss";

const RoomList = ({ selectedRoomId, onSelectRoomId }) => {
  const { account } = useContext(AccountContext);
  const roomIds = useRooms();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box pt="5" className={styles.RoomList}>
      <HStack justifyContent="space-between">
        <Text fontSize="sm">All messages</Text>
        <IconButton
          bg="transparent"
          color="pink.200"
          _hover={{ bg: "pink.50" }}
          icon={<AddUsersIcon boxSize="1.5rem" color="pink.500" />}
          onClick={onOpen}
        />
      </HStack>
      <VStack marginTop="5" alignItems="flex-start">
        {roomIds.map((roomId) => (
          <RoomItem
            key={roomId}
            roomId={roomId}
            active={selectedRoomId === roomId}
            onClick={() => onSelectRoomId(roomId)}
          />
        ))}
      </VStack>
      <CreateChatGroupModal
        isOpen={isOpen}
        onClose={onClose}
        onSelectRoomId={onSelectRoomId}
      />
    </Box>
  );
};

const RoomItem = ({ roomId, active, onClick }) => {
  const { account } = useContext(AccountContext);
  const [{ room }, { haveSeenNewMessages }] = useRoom(roomId);

  if (!room._id) return null;
  const onHandleClick = () => {
    onClick();
    if (!room.newMessageNumber) return;
    haveSeenNewMessages({ roomId: room._id, userId: account._id });
  };
  return (
    <HStack
      key={room._id}
      p="1"
      spacing="3"
      w="100%"
      borderRadius="5"
      cursor="pointer"
      className={classNames("item", {
        "selected-item": active,
      })}
      onClick={onHandleClick}
    >
      <AvatarGroup size="md" max={3}>
        {room.otherMembers.length > 1
          ? room.members.map((o) => (
              <Avatar key={o._id} name={o.userName}>
                <AvatarBadge boxSize="0.8em" bg="green.500" />
              </Avatar>
            ))
          : room.otherMembers.map((o) => (
              <Avatar key={o._id} name={o.userName}>
                <AvatarBadge boxSize="0.8em" bg="green.500" />
              </Avatar>
            ))}
      </AvatarGroup>
      <Text>{room.name || room.userName}</Text>
      {!!room.newMessageNumber && (
        <Text
          ml="auto !important"
          borderRadius="100%"
          bg="red.500"
          color="white"
          fontSize="sm"
          fontWeight="bold"
          width="5"
          height="5"
          textAlign="center"
        >
          {room.newMessageNumber}
        </Text>
      )}
    </HStack>
  );
};

export default RoomList;
