import React, { useContext } from 'react';
import { HStack, IconButton, Text, useDisclosure } from '@chakra-ui/react';

import { AddUsersIcon } from 'components/CustomIcons';
import useConversations from 'hooks/useConversations';
import CreateChatGroupModal from 'components/CreateChatGroupModal';
import ListItem from 'components/ListItem';
import { MenuContext } from 'contexts/menuContext';
import ConversationItem from 'components/ConversationItem';

const ConversationList = () => {
  const { menuState, setMenuState } = useContext(MenuContext);
  const selectedconversationId = menuState[menuState.active]?.conversationId;

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [{ conversations }] = useConversations({ forceFetchingConversations: true });

  const onHandleClick = conversation => {
    setMenuState(prev => ({
      ...prev,
      [menuState.active]: { ...prev[menuState.active], conversationId: conversation.id },
    }));
  };
  const onHandleSelectConversation = id => {
    setMenuState(prev => ({
      ...prev,
      [menuState.active]: { ...prev[menuState.active], conversationId: id },
    }));
  };

  return (
    <>
      <ListItem
        data={conversations}
        emptyText="No message"
        pt="5"
        header={
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
        }
        renderItem={conversation => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            active={selectedconversationId === conversation.id}
            onClick={() => onHandleClick(conversation)}
          />
        )}
      />
      <CreateChatGroupModal
        isOpen={isOpen}
        onClose={onClose}
        onSelectConversation={onHandleSelectConversation}
      />
    </>
  );
};

export default ConversationList;
