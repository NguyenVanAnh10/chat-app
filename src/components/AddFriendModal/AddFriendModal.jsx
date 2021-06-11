import React, { useContext } from 'react';
import {
  Avatar,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from '@chakra-ui/react';

import ListItem from 'components/ListItem';
import SearchUserInput from 'components/SearchUserInput';
import { useModel } from 'model';
import { AccountContext } from 'App';

const AddFriendModal = ({ isOpen, onClose }) => {
  const [{ addFriendState }, { addFriend }] = useModel('account', ({ addFriends }) => ({
    addFriendState: addFriends,
  }));
  const { account } = useContext(AccountContext);

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add friend</ModalHeader>
        <ModalBody>
          <SearchUserInput
            mt="0"
            hasSearchIcon={false}
            placeholder="Find friend..."
            renderResultList={data => (
              <ListItem
                mt="3"
                spacing="7"
                data={data}
                renderItem={user => (
                  <FriendItem
                    loading={addFriendState[user._id]?.loading}
                    isFriendRequest={addFriendState.ids.includes(user._id)}
                    key={user._id}
                    user={user}
                    onAddfriend={() => addFriend({ userId: account._id, friendId: user._id })}
                  />
                )}
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
};

const FriendItem = ({ user, onAddfriend, loading, isFriendRequest }) => (
  <HStack spacing="4" w="100%">
    <Avatar name={user.userName} />
    <VStack align="flex-start" spacing="1">
      <Text fontWeight="bold">{user.userName}</Text>
      <Text fontWeight="light" color="gray.600" fontSize="sm">
        {user.email}
      </Text>
    </VStack>
    <Button
      colorScheme="blue"
      size="sm"
      ml="auto !important"
      d="block"
      isLoading={loading}
      onClick={onAddfriend}
      disabled={isFriendRequest || loading}
    >
      {!isFriendRequest ? 'Add friend' : 'Sent friend request'}
    </Button>
  </HStack>
);

export default AddFriendModal;
