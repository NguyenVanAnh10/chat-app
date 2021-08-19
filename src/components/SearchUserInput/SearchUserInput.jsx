import React, { useRef, useState } from 'react';
import { Divider, Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import debounce from 'lodash.debounce';

import ListItem from 'components/ListItem';
import useUsers from 'hooks/useUsers';
import UserItem from 'components/UserItem';

const SearchUserInput = ({ placeholder, hasSearchIcon = true, renderResultList, ...rest }) => {
  const [keyword, setKeyword] = useState();
  const debounceRef = useRef();
  const [
    {
      arrayUsers: users,
      getUsersState: { loading },
    },
    { getUsers },
  ] = useUsers();

  const onHandleSearch = kw => {
    setKeyword(kw);
    if (!kw) return;
    debounceRef.current && debounceRef.current.cancel();
    debounceRef.current = debounce(
      () =>
        getUsers({
          keyword: kw,
        }),
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
          placeholder={placeholder || 'Search user...'}
          border="none"
          onChange={e => onHandleSearch(e.target.value)}
        />
      </InputGroup>
      {!loading && (keyword || !!users.length) && <Divider />}
      <ListItem
        spacing="5"
        data={users}
        loading={loading}
        hideEmptyBox={!keyword}
        emptyText="User not found"
        bodyCss={{
          maxH: `calc(${window.innerHeight}px - 9.75rem - 175px)`,
        }}
        renderItem={user => <UserItem key={user.id} user={user} />}
      />
    </>
  );
};

export default SearchUserInput;
