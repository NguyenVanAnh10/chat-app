import React, { useContext } from 'react';
import { AvatarBadge, HStack, IconButton, Text, useDisclosure } from '@chakra-ui/react';

import { AddUserIcon } from 'components/CustomIcons';
import useFriends from 'hooks/useFriends';
import ListItem from 'components/ListItem';
import { MenuContext } from 'contexts/menuContext';
import AddFriendModal from 'components/AddFriendModal';
import Avatar from 'components/Avatar';

const FriendList = () => {
  const { menuState, setMenuState } = useContext(MenuContext);
  const selectedConversationId = menuState[menuState.active]?.conversationId;

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [{ friends, loading }] = useFriends({ forceFetchingFriends: true });

  const onHandleClick = friend => {
    setMenuState(prev => ({
      ...prev,
      [menuState.active]: { ...prev[menuState.active], conversationId: friend.conversation },
    }));
  };

  return (
    <>
      <ListItem
        data={friends}
        emptyText="No friend"
        loading={loading}
        pt="5"
        header={
          <HStack justifyContent="space-between">
            <Text fontSize="sm">All friends</Text>
            <IconButton
              title="add friend"
              bg="transparent"
              color="pink.200"
              _hover={{ bg: 'pink.50' }}
              icon={<AddUserIcon boxSize="1.1rem" color="blue.500" />}
              onClick={onOpen}
            />
          </HStack>
        }
        renderItem={friend => (
          <FriendItem
            key={friend.id}
            friend={friend}
            active={selectedConversationId === friend.conversation}
            onClick={() => onHandleClick(friend)}
          />
        )}
      />
      <AddFriendModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

const FriendItem = ({ friend, active, onClick }) => (
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
    <Avatar name={friend.userName} src={friend.avatar}>
      <AvatarBadge boxSize="0.8em" bg={friend.online ? 'green.500' : 'gray.300'} />
    </Avatar>
    <Text>{friend.name || friend.userName}</Text>
    {!!friend.newMessageNumber && (
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
        {friend.newMessageNumber}
      </Text>
    )}
  </HStack>
);
export default FriendList;
