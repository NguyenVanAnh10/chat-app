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

const selector = ({ me, addFriend, users, getUsers }) => ({
  addFriendIds: me.addFriends.map(f => f.friendId),
  addFriendState: addFriend,
  notFriends: (getUsers?.ids || [])
    .filter(id => !me.friendIds.includes(id)).map(id => users[id]),
});

const AddFriendModal = ({ isOpen, onClose }) => {
  const [{ addFriendIds, addFriendState, notFriends }, { addFriend }] = useModel('account', selector);
  const { account } = useContext(AccountContext);

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add friend</ModalHeader>
        <ModalBody>
          <SearchUserInput
            mt="0"
            usersData={notFriends.filter(u => u.id !== account.id)}
            hasSearchIcon={false}
            placeholder="Find friend..."
            renderResultList={data => (
              <ListItem
                mt="3"
                spacing="7"
                data={data}
                emptyText="No friend"
                renderItem={user => (
                  <FriendItem
                    key={user.id}
                    user={user}
                    loading={addFriendState[user.id]?.loading}
                    isFriendRequest={addFriendIds.includes(user.id)}
                    onAddfriend={() => addFriend({ userId: account.id, friendId: user.id })}
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
      variant={isFriendRequest ? 'outline' : 'solid'}
      isLoading={loading}
      onClick={onAddfriend}
      disabled={isFriendRequest || loading}
    >
      {!isFriendRequest ? 'Add friend' : 'Sent friend request'}
    </Button>
  </HStack>
);

export default AddFriendModal;
