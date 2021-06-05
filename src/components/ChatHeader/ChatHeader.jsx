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
import { PhoneIcon } from "@chakra-ui/icons";

import { AccountContext } from "App";
import VideoCallModal from "components/VideoCallModal";
import { ChatContext } from "pages/ChatView";

const ChatHeader = ({ room }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { account } = useContext(AccountContext);
  const {
    actions: { onCallUser },
  } = useContext(ChatContext);

  return (
    <>
      <HStack
        w="100%"
        bg="white"
        px="5"
        py="3.5"
        borderBottom="1px solid #EDF2F7"
        justifyContent="space-between"
      >
        <HStack>
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
        </HStack>
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
      </HStack>
      {room && (
        <VideoCallModal
          isOpen={isOpen}
          onClose={onClose}
          room={room}
          receiver={room?.members?.find((u) => u._id !== account._id)}
        />
      )}
    </>
  );
};

export default ChatHeader;
