import React from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';

import SearchUserInput from 'components/SearchUserInput';

const AddFriendModal = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Add friend</ModalHeader>
      <ModalBody>
        <SearchUserInput mt="0" hasSearchIcon={false} placeholder="Find user..." />
      </ModalBody>
      <ModalFooter>
        <Button colorScheme="blue" size="sm" onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default AddFriendModal;
