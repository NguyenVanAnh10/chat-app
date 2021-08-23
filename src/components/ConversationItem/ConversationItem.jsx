import React, { useContext } from 'react';
import { AvatarBadge, AvatarGroup, HStack, Text } from '@chakra-ui/react';

import Avatar from 'components/Avatar';
import { AccountContext } from 'App';
import useMessages from 'hooks/useMessages';

const ConversationItem = ({ conversation, active, onClick }) => {
  const { account } = useContext(AccountContext);
  const [
    {
      unseenMessagesState: { total },
    },
  ] = useMessages({ conversationId: conversation.id }, { forceFetchingUnseenMessages: true });

  const renderConversationNameAndAvatar = () => {
    if (conversation.members.length === 2) {
      const participant = conversation.members.find(m => m.id !== account.id);
      return (
        <>
          <Avatar key={participant.id} name={participant.userName} src={participant.avatar}>
            <AvatarBadge boxSize="0.8em" bg={participant.online ? 'green.500' : 'gray.300'} />
          </Avatar>
          <Text isTruncated>{participant.userName}</Text>
        </>
      );
    }
    return (
      <>
        <AvatarGroup size="md" max={3}>
          {conversation.members
            .filter(m => !!m.id)
            .map(m => (
              <Avatar key={m.id} name={m.userName} src={m.avatar}>
                <AvatarBadge boxSize="0.8em" bg={m.online ? 'green.500' : 'gray.300'} />
              </Avatar>
            ))}
        </AvatarGroup>
        <Text isTruncated>{conversation.name || 'No name'}</Text>
      </>
    );
  };

  return (
    <HStack
      p="1"
      spacing="3"
      w="100%"
      borderRadius="5"
      cursor="pointer"
      onClick={onClick}
      transition="all 0.3s ease"
      _hover={{ bg: 'purple.50' }}
      _active={{ bg: '#feebc8' }}
      bg={active ? '#feebc8' : 'transparent'}
    >
      {renderConversationNameAndAvatar()}
      {!!total && (
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
          {total}
        </Text>
      )}
    </HStack>
  );
};

export default ConversationItem;
