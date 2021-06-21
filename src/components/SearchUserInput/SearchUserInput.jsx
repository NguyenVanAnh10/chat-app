import React, { useContext, useRef, useState } from 'react';
import {
  Divider,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import debounce from 'lodash.debounce';

import useUsers from 'hooks/useUsers';
import { AccountContext } from 'App';
import ListItem from 'components/ListItem';

const SearchUserInput = ({
  placeholder,
  hasSearchIcon = true,
  onUserClick,
  renderResultList,
  renderItem = () => {},
  ...rest
}) => {
  const [keyword, setKeyword] = useState();
  const { account } = useContext(AccountContext);
  const debounceRef = useRef();
  const [{ usersArray: users, getUsersState: { loading } }, { getUsers }] = useUsers();

  const onHandleSearch = kw => {
    setKeyword(kw);
    if (!kw) return;
    debounceRef.current && debounceRef.current.cancel();
    debounceRef.current = debounce(() => getUsers({
      userId: account.id,
      keyword: kw,
    }),
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
          placeholder={placeholder || 'Search user...'}
          border="none"
          onChange={e => onHandleSearch(e.target.value)}
        />
      </InputGroup>
      {!loading && (keyword || !!users.length) && <Divider my="1" />}
      <ListItem
        mt="3"
        spacing="7"
        data={users}
        loading={loading}
        hideEmptyBox={!keyword}
        emptyText="User not found"
        renderItem={renderItem}
      />
    </>
  );
};

export default SearchUserInput;
