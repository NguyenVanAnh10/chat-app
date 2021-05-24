import React, { useContext, useRef } from "react";
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
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import debounce from "lodash.debounce";

import { useModel } from "model";
import { AccountContext } from "App";

const SearchUser = ({
  placeholder,
  hasSearchIcon = true,
  onUserClick,
  ...rest
}) => {
  const [{ users }, { getUsers }] = useModel(
    "user",
    ({ getUsers, users: usersModel }) => ({
      users: (getUsers.ids || []).map((id) => usersModel[id]),
    })
  );
  const debounceRef = useRef();
  const { account } = useContext(AccountContext);

  const onHandleSearch = (keyword) => {
    if (!keyword) return;
    debounceRef.current && debounceRef.current.cancel();
    debounceRef.current = debounce(() => getUsers(keyword), 300);
    debounceRef.current();
  };
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
          placeholder={placeholder || "Search friend..."}
          border="none"
          onChange={(e) => onHandleSearch(e.target.value)}
        />
      </InputGroup>
      {!!users.length && (
        <>
          <Divider mb="5" mt="1" />
          <List spacing="2">
            {users
              .filter((u) => u._id !== account._id)
              .map((u) => (
                <ListItem
                  key={u._id}
                  d="flex"
                  cursor="pointer"
                  bg="pink.50"
                  p="2"
                  borderRadius="md"
                  transition="all 0.3s ease"
                  _hover={{ bg: "pink.100" }}
                  onClick={() => onUserClick(u)}
                >
                  <Avatar name={u.userName} />
                  <VStack
                    ml="4"
                    alignItems="flex-start"
                    spacing={0}
                    color="gray.600"
                  >
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
    </>
  );
};

export default SearchUser;
