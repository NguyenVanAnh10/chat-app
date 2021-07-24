import React, { useRef, useState } from 'react';
import {
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

import Avatar from 'components/Avatar';
import EmptyList from 'components/EmptyList';
import { useUpdateEffect } from 'react-use';

const SearchFriendInput = ({
  placeholder,
  friendData = [],
  hasSearchIcon = true,
  onFriendClick,
  renderResultList,
  ...rest
}) => {
  const [friends, setFriends] = useState(friendData);
  const debounceRef = useRef();

  useUpdateEffect(() => {
    setFriends(friendData);
  }, [friendData]);

  const onHandleSearch = kw => {
    debounceRef.current && debounceRef.current.cancel();
    debounceRef.current = debounce(() => setFriends(friendData
      .filter(u => u.userName.includes(kw))),
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
      {!!friends.length && (
        <>
          <Divider mb="5" mt="1" />
          <List spacing="2">
            {friends.filter(u => !!u.id).map(u => (
              <ListItem
                key={u.id}
                d="flex"
                cursor="pointer"
                bg="pink.50"
                p="2"
                borderRadius="md"
                transition="all 0.3s ease"
                _hover={{ bg: 'blue.100' }}
                onClick={() => onFriendClick(u)}
              >
                <Avatar name={u.userName} src={u.avatar} />
                <VStack ml="4" alignItems="flex-start" spacing={0} color="gray.600">
                  <Text fontSize="md" fontWeight="bold">
                    {u.userName}
                  </Text>
                  <Text fontSize="sm">{u.email}</Text>
                </VStack>
              </ListItem>
            ))}
          </List>
        </>
      )}
      {!friends.length && <EmptyList pt="5" content="Friend not found" />}
    </>
  );
};

export default SearchFriendInput;
