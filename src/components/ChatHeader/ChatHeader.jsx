import React, { useContext } from 'react';
import {
  Avatar,
  AvatarBadge,
  AvatarGroup,
  HStack,
  IconButton,
  Text,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react';
import { PhoneIcon, ArrowBackIcon } from '@chakra-ui/icons';

import { AccountContext } from 'App';
import VideoCallModal from 'components/VideoCallModal';
import { ChatContext } from 'pages/ChatApp';
import useRoom from 'hooks/useRoom';
import { MenuContext } from 'contexts/menuContext';

import defaultAvatar from 'statics/images/default_user.png';

const ChatHeader = ({ roomId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { account } = useContext(AccountContext);
  const [{ room }] = useRoom(roomId);
  const isMobileScreen = useBreakpointValue({ base: true, md: false });
  const { setMenuState } = useContext(MenuContext);

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
          {isMobileScreen && (
            <IconButton
              size="sm"
              _focus="none"
              _active="none"
              bg="transparent !important"
              variant="ghost"
              fontSize="1.4rem"
              onClick={() => setMenuState(prev => ({ ...prev, [prev.active]: {} }))}
              icon={<ArrowBackIcon />}
            />
          )}
          <AvatarGroup size="md" max={3}>
            {room.otherMembers.length > 1
              ? room.members.map(o => (
                <Avatar key={o.id} name={o.userName} src={o.avatar || defaultAvatar}>
                  <AvatarBadge boxSize="0.8em" bg="green.500" />
                </Avatar>
              ))
              : room.otherMembers.map(o => (
                <Avatar key={o.id} name={o.userName} src={o.avatar || defaultAvatar}>
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
              onCallUser(room.id);
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
        receiver={room?.members?.find(u => u.id !== account.id)}
      />
    </>
  );
};

export default ChatHeader;
