import React, { useContext, useEffect, useRef } from "react";
import { Avatar, Box, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import dayjs from "dayjs";

import { AccountContext } from "App";

const MessageList = ({ className, messages = [] }) => {
  const { account } = useContext(AccountContext);
  const containerRef = useRef();

  useEffect(() => {
    containerRef.current.scrollIntoView(false);
  }, [messages]);
  return (
    <Box w="100%" className={className}>
      <Flex flexDir="column" mt="5" ref={containerRef}>
        {messages.map((m) => (
          <HStack
            key={m._id}
            flexDir={m.sender !== account.userName ? "row" : "row-reverse"}
          >
            <Avatar
              name={m.sender}
              size="sm"
              zIndex="2"
              bottom="-10px"
            ></Avatar>
            <VStack
              className={`message ${
                m.sender !== account.userName ? "receive" : "send"
              }`}
              zIndex="1"
            >
              <Text>{m.content}</Text>
              <HStack spacing="2" color="blackAlpha.600">
                <Text fontSize="xs">{dayjs(m.createAt).format("h:mm A")}</Text>
                {m.sender === account.userName && (
                  <Text fontSize="xs">Sent</Text>
                )}
              </HStack>
            </VStack>
          </HStack>
        ))}
      </Flex>
    </Box>
  );
};
export default MessageList;
