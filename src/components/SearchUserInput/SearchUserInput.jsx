import React, { useContext, useRef, useMemo } from 'react';
import {
  Avatar,
  Center,
  Divider,
  Input,
  InputGroup,
  InputLeftElement,
  List,
  ListItem,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import debounce from 'lodash.debounce';

import { useModel } from 'model';
import { AccountContext } from 'App';

const SearchUserInput = ({
  placeholder,
  hasSearchIcon = true,
  onUserClick,
  renderResultList,
  ...rest
}) => {
  const [{ users, loading }, { getUsers }] = useModel(
    'user',
    ({ getUsers, users: usersModel, loading }) => ({
      users: (getUsers.ids || []).map(id => usersModel[id]),
      loading: getUsers.loading,
    }),
  );
  const { account } = useContext(AccountContext);
  const debounceRef = useRef();

  const onHandleSearch = keyword => {
    if (!keyword) return;
    debounceRef.current && debounceRef.current.cancel();
    debounceRef.current = debounce(() => getUsers(keyword), 300);
    debounceRef.current();
  };
  const usersData = useMemo(
    () => users.filter(u => u._id !== account._id),
    [users, account._id],
  );
  return (
    <>
      <InputGroup {...rest}>
        {hasSearchIcon && (
          <InputLeftElement
            pointerEvents="none"
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
      {loading && (
        <Center>
          <Spinner
            thickness="3px"
            speed="0.65s"
            emptyColor="gray.200"
            color="orange.300"
            size="lg"
          />
        </Center>
      )}
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
    </>
  );
};
const DefaultResultList = ({ users, onUserClick }) => (
  <List spacing="2">
    {users.map(u => (
      <ListItem
        key={u._id}
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
