import React, { useContext } from 'react';
import { Avatar, Button, HStack, Stack, Text, VStack } from '@chakra-ui/react';
import { AccountContext } from 'App';
import usefriends from 'hooks/useFriends';
import FriendShip from 'entities/FriendShip';

const UserItem = ({ user, onClick, hideAction = false }) => {
  const { account } = useContext(AccountContext);
  const [
    {
      addFriendRequestState: { loading: adding },
      confirmFriendRequest: { loading: accepting },
    },
    { addFriendRequest, confirmFriendRequest },
  ] = usefriends();

  const renderButton = () => {
    if (!user.friendship) {
      return (
        <Button
          colorScheme="blue"
          size="sm"
          d="block"
          variant="solid"
          isLoading={adding}
          onClick={() => addFriendRequest({ addresseeId: user.id })}
        >
          Add friend
        </Button>
      );
    }
    if (user.friendship.status === FriendShip.ACCEPTED) return null;
    const isRequester = user.friendship.requester === account.id;
    return (
      <Button
        colorScheme="blue"
        size="sm"
        d="block"
        variant={isRequester ? 'outline' : 'solid'}
        isLoading={accepting}
        onClick={() => {
          if (isRequester) return;
          confirmFriendRequest({
            friendshipId: user.friendship.id,
            status: FriendShip.ACCEPTED,
          });
        }}
        disabled={isRequester || accepting}
      >
        {isRequester ? 'Sent friend request' : 'Accept'}
      </Button>
    );
  };

  return (
    <Stack
      w="100%"
      flexDir="row"
      wrap="wrap"
      align="center"
      justify="space-between"
      borderRadius="lg"
      p="1"
      cursor={typeof onClick === 'function' ? 'pointer' : 'auto'}
      _hover={{ bg: typeof onClick === 'function' ? 'blue.50' : 'none' }}
      transition="background 0.3s ease"
      onClick={onClick}
    >
      <HStack>
        <Avatar name={user.userName} src={user.avatar} />
        <VStack align="flex-start" spacing="1">
          <Text fontWeight="bold">{user.userName}</Text>
          <Text fontWeight="light" color="gray.600" fontSize="sm">
            {user.email}
          </Text>
        </VStack>
      </HStack>
      {!hideAction && renderButton()}
    </Stack>
  );
};
export default UserItem;
