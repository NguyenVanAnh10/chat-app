import React, { useContext } from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

import SearchFriendInput from 'components/SearchFriendInput';
import usefriends from 'hooks/useFriends';
import { MenuContext } from 'contexts/menuContext';
import { menuKeys } from 'configs/configs';

const SearchUserButton = () => {
  const { setMenuState } = useContext(MenuContext);
  const [{ friends }] = usefriends({ forceFetchingFriends: true });
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      <Button
        w="100%"
        focusBorderColor="pink.200"
        leftIcon={<SearchIcon color="gray.400" />}
        onClick={onOpen}
        justifyContent="flex-start"
        fontWeight="light"
        fontSize="md"
        color="gray.400"
        bg="white"
      >
        Search friend...
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody py="5">
            <SearchFriendInput
              friendData={friends}
              listHeight={`calc(${window.innerHeight}px - 11.25rem - 41px)`}
              onFriendClick={friend => {
                setMenuState(prev => ({
                  ...prev,
                  [menuKeys.CONTACT_BOOK]: {
                    ...prev[menuKeys.CONTACT_BOOK],
                    conversationId: friend.conversation,
                  },
                  active: menuKeys.CONTACT_BOOK,
                }));
                onClose();
              }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SearchUserButton;
