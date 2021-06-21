import React from 'react';
import {
  AvatarBadge,
  AvatarGroup,
  HStack,
  Text,
} from '@chakra-ui/react';
import classNames from 'classnames';

import Avatar from 'components/Avatar';

import styles from './RoomItem.module.scss';

const RoomItem = ({ room, active, onClick }) => (
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
    {room.otherMembers.filter(m => !!m.id).length > 0 ? (
      <AvatarGroup size="md" max={3}>
        {room.otherMembers.length > 1
          ? room.members.map(o => (
            <Avatar key={o.id} name={o.userName} src={o.avatar}>
              <AvatarBadge boxSize="0.8em" bg={o.online ? 'green.500' : 'gray.300'} />
            </Avatar>
          ))
          : room.otherMembers.map(o => (
            <Avatar key={o.id} name={o.userName} src={o.avatar}>
              <AvatarBadge boxSize="0.8em" bg={o.online ? 'green.500' : 'gray.300'} />
            </Avatar>
          ))}
      </AvatarGroup>
    ) : null}
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

export default RoomItem;
