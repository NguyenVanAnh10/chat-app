import React from "react";
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

import VideoCallModal from "components/VideoCallModal";

const ChatHeader = ({ room }) => {
  // const [{}, {}] = useVideoChat(room);
  const { isOpen, onOpen, onClose } = useDisclosure();

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
          onClick={onOpen}
          colorScheme="purple"
          icon={<PhoneIcon fontSize="lg" />}
        />
      </HStack>
      <VideoCallModal isCaller isOpen={isOpen} onClose={onClose} room={room} />
    </>
  );
};

export default ChatHeader;
