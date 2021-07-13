import React, { useContext } from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import isEqual from 'lodash.isequal';
import { SearchIcon } from '@chakra-ui/icons';

import { useModel } from 'model';
import SearchFriendInput from 'components/SearchFriendInput';
import { AccountContext } from 'App';

const SearchUserButton = ({ onSelectUser }) => {
  const [{ conversations }] = useModel(
    'message',
    ({ conversations: conversationsModel }) => ({
      conversations: Object.keys(conversationsModel).map(id => conversationsModel[id]),
    }),
  );
  const [{ friends }] = useModel(
    'account',
    ({ me, users }) => ({
      friends: (me.friendIds || []).map(id => users[id]),
    }),
  );
  const { account } = useContext(AccountContext);
  const { isOpen, onClose, onOpen } = useDisclosure();

  const onCreateConversationChat = toUserId => {
    const conversation = conversations.find(r => isEqual(r.userIds.sort(),
      [account.id, toUserId].sort()));
    onSelectUser(conversation.id);
    onClose();
  };

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
              usersData={friends}
              onUserClick={u => onCreateConversationChat(u.id)}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SearchUserButton;
