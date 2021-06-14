import React, { useRef, useState } from 'react';
import {
  Avatar,
  Divider,
  Input,
  InputGroup,
  InputLeftElement,
  List,
  ListItem,
  Text,
  VStack,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import debounce from 'lodash.debounce';

import EmptyList from 'components/EmptyList';

const SearchUserInput = ({
  placeholder,
  usersData = [],
  hasSearchIcon = true,
  onUserClick,
  renderResultList,
  ...rest
}) => {
  const [users, setUsers] = useState(usersData);
  const debounceRef = useRef();

  const onHandleSearch = kw => {
    if (!kw) return;
    debounceRef.current && debounceRef.current.cancel();
    debounceRef.current = debounce(() => setUsers(usersData.filter(u => u.userName.includes(kw))),
      300);
    debounceRef.current();
  };
  return (
    <>
      <InputGroup {...rest}>
        {hasSearchIcon && (
          <InputLeftElement
            pointerEvents="none"
            // eslint-disable-next-line react/no-children-prop
            children={<SearchIcon color="gray.300" />}
          />
        )}
        <Input
          w="100%"
          _focus="none"
          placeholder={placeholder || 'Search friend...'}
          border="none"
          onChange={e => onHandleSearch(e.target.value)}
        />
      </InputGroup>
      {!!users.length && (
        <>
          <Divider mb="5" mt="1" />
          {renderResultList ? (
            renderResultList(usersData)
          ) : (
            <DefaultResultList users={usersData} onUserClick={onUserClick} />
          )}
        </>
      )}
      {!users.length && <EmptyList pt="5" content="Friend not found" />}
    </>
  );
};
const DefaultResultList = ({ users, onUserClick }) => (
  <List spacing="2">
    {users.map(u => (
      <ListItem
        key={u.id}
        d="flex"
        cursor="pointer"
        bg="pink.50"
        p="2"
        borderRadius="md"
        transition="all 0.3s ease"
        _hover={{ bg: 'pink.100' }}
        onClick={() => onUserClick(u)}
      >
        <Avatar name={u.userName} />
        <VStack ml="4" alignItems="flex-start" spacing={0} color="gray.600">
          <Text fontSize="md" fontWeight="bold">
            {u.userName}
          </Text>
          <Text fontSize="sm">{u.email}</Text>
        </VStack>
      </ListItem>
    ))}
  </List>
);

export default SearchUserInput;
