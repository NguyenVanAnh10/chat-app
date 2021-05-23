import React, { useContext, useEffect, useRef } from "react";
import {
  Avatar,
  Box,
  Flex,
  HStack,
  IconButton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { RepeatIcon } from "@chakra-ui/icons";
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
            mt="3"
            flexDir={m.senderId !== account._id ? "row" : "row-reverse"}
          >
            <Avatar
              name={m.senderId}
              size="sm"
              zIndex="2"
              bottom="-10px"
            ></Avatar>
            <HStack spacing="1">
              {!!m.error && (
                <IconButton
                  bg="transparent"
                  icon={<RepeatIcon color="red.500" />}
                />
              )}
              <VStack
                className={`message ${
                  m.senderId !== account._id ? "receive" : "send"
                }`}
                zIndex="1"
              >
                <Text>{m.content}</Text>
                <HStack spacing="2" color="blackAlpha.600">
                  <Text fontSize="xs">
                    {dayjs(m.createAt).format("h:mm A")}
                  </Text>
                  {m.senderId === account._id &&
                    !m.error &&
                    m.hadSeenMessageUsers.length === 1 && (
                      <Text fontSize="xs">
                        {m.status ? "Delivered" : "Sending"}
                      </Text>
                    )}
                  {!!m.error && <Text fontSize="xs">Sending Error</Text>}
                  {m.hadSeenMessageUsers.length === 2 &&
                    m.senderId === account._id && (
                      <Text fontSize="xs">Seen</Text>
                    )}
                </HStack>
              </VStack>
            </HStack>
          </HStack>
        ))}
      </Flex>
    </Box>
  );
};
export default MessageList;
