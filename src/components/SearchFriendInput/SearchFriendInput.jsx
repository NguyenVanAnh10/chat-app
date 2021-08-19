import React, { useRef, useState } from 'react';
import { Divider, Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import debounce from 'lodash.debounce';

import { useUpdateEffect } from 'react-use';
import ListItem from 'components/ListItem';
import UserItem from 'components/UserItem';

const SearchFriendInput = ({
  placeholder,
  friendData = [],
  hasSearchIcon = true,
  onFriendClick,
  renderResultList,
  listHeight = 'auto',
  ...rest
}) => {
  const [friends, setFriends] = useState(friendData);
  const debounceRef = useRef();

  useUpdateEffect(() => {
    setFriends(friendData);
  }, [friendData]);

  const onHandleSearch = kw => {
    debounceRef.current && debounceRef.current.cancel();
    debounceRef.current = debounce(
      () => setFriends(friendData.filter(u => u.userName.includes(kw))),
      300,
    );
    debounceRef.current();
  };
  return (
    <>
      <InputGroup {...rest}>
        {hasSearchIcon && (
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
        )}
        <Input
          w="100%"
          _focus="none"
          placeholder={placeholder || 'Search friend...'}
          border="none"
          onChange={e => onHandleSearch(e.target.value)}
        />
      </InputGroup>
      <Divider />
      <ListItem
        spacing="5"
        bodyCss={{ maxH: listHeight }}
        data={friends}
        emptyText="Friend not found"
        renderItem={friend => (
          <UserItem
            key={friend.id}
            hideAction
            user={friend}
            onClick={() => onFriendClick(friend)}
          />
        )}
      />
    </>
  );
};

export default SearchFriendInput;
