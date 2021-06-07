import React, { useContext } from "react";
import {
  Avatar,
  AvatarBadge,
  AvatarGroup,
  HStack,
  IconButton,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { PhoneIcon, ArrowBackIcon } from "@chakra-ui/icons";

import { AccountContext } from "App";
import VideoCallModal from "components/VideoCallModal";
import { ChatContext } from "pages/ChatList";
import useRoom from "hooks/useRoom";

const ChatHeader = ({ roomId, onBack }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { account } = useContext(AccountContext);
  const [{ room }] = useRoom(roomId);

  const {
    actions: { onCallUser },
  } = useContext(ChatContext);
  if (!roomId) return null;
  return (
    <>
      <HStack
        w="100%"
        bg="white"
        px="2"
        py="3"
        borderBottom="1px solid #EDF2F7"
        justifyContent="space-between"
      >
        <HStack spacing="1">
          {onBack && (
            <IconButton
              size="sm"
              _focus="none"
              _active="none"
              bg="transparent !important"
              variant="ghost"
              fontSize="1.4rem"
              onClick={onBack}
              icon={<ArrowBackIcon />}
            />
          )}
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
          <Text ml="2">{room.name || room.userName}</Text>
        </HStack>
        {room.otherMembers.length === 1 && (
          <IconButton
            onClick={() => {
              onOpen();
              onCallUser(room._id);
            }}
            size="lg"
            fontSize="1.5rem"
            colorScheme="green"
            icon={<PhoneIcon />}
          />
        )}
      </HStack>
      <VideoCallModal
        isOpen={isOpen}
        onClose={onClose}
        room={room}
        receiver={room?.members?.find((u) => u._id !== account._id)}
      />
    </>
  );
};

export default ChatHeader;
