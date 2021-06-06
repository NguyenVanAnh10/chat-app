import React from "react";
import { Flex } from "@chakra-ui/react";

import RoomList from "./RoomList";
import SearchUserButton from "components/SearchUserButton";

const MainSideNav = ({ selectedRoomId, onSelectRoomId }) => {
  return (
    <Flex
      p="2"
      flex="1"
      zIndex="3"
      bg="white"
      width={300}
      flexDir="column"
      transition="width 0.3s ease"
    >
      <Flex
        h="4rem"
        alignItems="center"
        borderBottom="1px solid rgba(0, 0, 0, 0.08)"
      >
        <SearchUserButton onSelectUser={onSelectRoomId} />
      </Flex>
      <RoomList
        selectedRoomId={selectedRoomId}
        onSelectRoomId={onSelectRoomId}
      />
    </Flex>
  );
};

export default MainSideNav;
