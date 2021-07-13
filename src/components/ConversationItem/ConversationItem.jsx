import React from 'react';
import {
  AvatarBadge,
  AvatarGroup,
  HStack,
  Text,
} from '@chakra-ui/react';
import classNames from 'classnames';

import Avatar from 'components/Avatar';

import styles from './ConversationItem.module.scss';

const ConversationItem = ({ conversation, active, onClick }) => (
  <HStack
    p="1"
    spacing="3"
    w="100%"
    borderRadius="5"
    cursor="pointer"
    onClick={onClick}
    transition="all 0.3s ease"
    _hover={{ bg: 'purple.50' }}
    className={classNames({ [styles.active]: active })}
  >
    {conversation.otherMembers.filter(m => !!m.id).length > 0 ? (
      <AvatarGroup size="md" max={3}>
        {conversation.otherMembers.length > 1
          ? conversation.members.map(o => (
            <Avatar key={o.id} name={o.userName} src={o.avatar}>
              <AvatarBadge boxSize="0.8em" bg={o.online ? 'green.500' : 'gray.300'} />
            </Avatar>
          ))
          : conversation.otherMembers.map(o => (
            <Avatar key={o.id} name={o.userName} src={o.avatar}>
              <AvatarBadge boxSize="0.8em" bg={o.online ? 'green.500' : 'gray.300'} />
            </Avatar>
          ))}
      </AvatarGroup>
    ) : null}
    <Text>{conversation.name || conversation.userName}</Text>
    {!!conversation.newMessageNumber && (
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
        {conversation.newMessageNumber}
      </Text>
    )}
  </HStack>
);

export default ConversationItem;
