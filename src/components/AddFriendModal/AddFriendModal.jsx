import React from 'react';
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

const AddFriendModal = ({ isOpen, onClose }) => (
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
                  key={user._id}
                  user={user}
                  onAddfriend={() => console.log(user)}
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

const FriendItem = ({ user, onAddfriend }) => (
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
      onClick={onAddfriend}
    >
      Add friend
    </Button>
  </HStack>
);

export default AddFriendModal;
