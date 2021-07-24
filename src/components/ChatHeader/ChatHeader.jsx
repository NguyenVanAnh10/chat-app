import React, { useContext } from 'react';
import {
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
import { useConversation } from 'hooks/useConversations';
import { MenuContext } from 'contexts/menuContext';
import Avatar from 'components/Avatar';
import useUsers from 'hooks/useUsers';

const ChatHeader = () => {
  const { menuState } = useContext(MenuContext);
  const { conversationId, friendId } = menuState[menuState.active];

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { account } = useContext(AccountContext);
  const [{ conversation }] = useConversation({ conversationId, friendId });
  const [{ users }] = useUsers();
  const isMobileScreen = useBreakpointValue({ base: true, md: false });
  const { setMenuState } = useContext(MenuContext);

  const { actions: { onCallFriend } } = useContext(ChatContext);

  const handleCall = () => {
    const data = { conversationId: conversationId || conversation.id };
    if (!conversationId && !conversation.id && friendId) {
      data.addresseeIds = [friendId];
    }
    onOpen();
    onCallFriend(data);
  };

  const renderHeaderAvatar = () => {
    const participant = conversation.id ? conversation.members?.find(m => m.id !== account.id)
      : users[friendId] || {};
    return (friendId || conversation.members?.length === 2)
      ? (
        <>
          <Avatar
            key={participant.id}
            name={participant.userName}
            src={participant.avatar}
          >
            <AvatarBadge
              boxSize="0.8em"
              bg={participant.online ? 'green.500' : 'gray.300'}
            />
          </Avatar>
          <Text ml="2">{participant.userName}</Text>
        </>
      )
      : (
        <>
          <AvatarGroup size="md" max={3}>
            {conversation.members?.map(o => (
              <Avatar key={o.id} name={o.userName} src={o.avatar}>
                <AvatarBadge boxSize="0.8em" bg={o.online ? 'green.500' : 'gray.300'} />
              </Avatar>
            ))}
          </AvatarGroup>
          <Text ml="2">{conversation.name || 'No name'}</Text>
        </>
      );
  };

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
          {renderHeaderAvatar()}

        </HStack>
        {(friendId || conversation.members?.length === 2) && (
          <IconButton
            onClick={handleCall}
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
        conversation={conversation}
        receiver={conversation.members?.find(u => u.id !== account.id)}
      />
    </>
  );
};

export default ChatHeader;
