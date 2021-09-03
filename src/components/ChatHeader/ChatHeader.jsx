import React, { useContext } from 'react';
import {
  AvatarBadge,
  AvatarGroup,
  HStack,
  IconButton,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import { PhoneIcon, ArrowBackIcon } from '@chakra-ui/icons';
import qs from 'query-string';

import { AccountContext } from 'App';
import { useConversation } from 'hooks/useConversations';
import { MenuContext } from 'contexts/menuContext';
import Avatar from 'components/Avatar';
import { ChatContext } from 'pages/ChatApp';
import { useFriend } from 'hooks/useFriends';

const ChatHeader = () => {
  const { menuState, setMenuState } = useContext(MenuContext);
  const { conversationId } = menuState[menuState.active];
  const [{ incomingCallWindow }, { onOutgoingCall }] = useContext(ChatContext);

  const { account } = useContext(AccountContext);
  const [{ conversation }] = useConversation({ conversationId });
  const [{ friend }] = useFriend({ conversationId });

  const isMobileScreen = useBreakpointValue({ base: true, md: false });

  const renderHeaderAvatar = () => {
    const participant = conversation.members?.find(m => m.id !== account.id) || friend;
    return conversation.members?.length > 2 ? (
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
    ) : (
      <>
        <Avatar key={participant.id} name={participant.userName} src={participant.avatar}>
          <AvatarBadge boxSize="0.8em" bg={participant.online ? 'green.500' : 'gray.300'} />
        </Avatar>
        <Text ml="2">{participant.userName}</Text>
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
        {/* {(conversation.members?.length === 2 || !!friend.id) && ( */}
        <IconButton
          size="lg"
          fontSize="1.5rem"
          colorScheme="green"
          icon={<PhoneIcon />}
          onClick={() => {
            if (incomingCallWindow.current) {
              incomingCallWindow.current.close();
            }
            onOutgoingCall(conversationId);
            window.open(
              `/call/outgoing?${qs.stringify({ conversationId, friendId: friend.id })}`,
              'outgoing-call',
              `height=${window.innerHeight},width=${window.innerWidth}`,
            );
          }}
        />
        {/* )} */}
      </HStack>
    </>
  );
};

export default ChatHeader;
