import React, { useContext } from 'react';
import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';

import SearchUserInput from 'components/SearchUserInput';
import { AccountContext } from 'App';
import Avatar from 'components/Avatar';
import usefriends from 'hooks/useFriends';
import FriendShip from 'entities/FriendShip';

const AddFriendModal = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Add friend</ModalHeader>
      <ModalBody>
        <SearchUserInput
          mt="0"
          hasSearchIcon={false}
          placeholder="Find user..."
          renderItem={user => (
            <FriendItem
              key={user.id}
              user={user}
            />
          )}
        />
      </ModalBody>
      <ModalFooter>
        <Button colorScheme="blue" size="sm" onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

const FriendItem = ({ user }) => {
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
      {renderButton()}
    </Stack>
  );
};

export default AddFriendModal;
