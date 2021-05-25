import React, { useContext, useEffect, useRef } from "react";
import {
  Avatar,
  AvatarGroup,
  Box,
  Flex,
  HStack,
  IconButton,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { RepeatIcon } from "@chakra-ui/icons";
import dayjs from "dayjs";

import useRoom from "hooks/useRoom";
import { AccountContext } from "App";
import useMessages from "hooks/useMessages";
import MessageListCard from "components/MessageListCard";

const MessageList = ({ roomId, className, userId }) => {
  const [{ messages, loading }] = useMessages(roomId, userId);

  const [{ room }] = useRoom(roomId);
  const { account } = useContext(AccountContext);
  const containerRef = useRef();

  const members = room.members.reduce((s, m) => ({ ...s, [m._id]: m }), {});
  useEffect(() => {
    !loading && containerRef.current.scrollIntoView(false);
  }, [messages, loading]);

  return (
    <MessageListCard w="100%" className={className} loading={loading}>
      <Flex flexDir="column" mt="5" ref={containerRef}>
        {messages.map((m) => (
          <HStack
            key={m._id}
            mt="3"
            flexDir={m.senderId !== account._id ? "row" : "row-reverse"}
          >
            <Avatar
              name={members[m.senderId]?.userName || "N/A"}
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
                <MessageContent
                  content={m.content}
                  contentType={m.contentType}
                />
                <HStack spacing="5" color="blackAlpha.600">
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
                  {m.hadSeenMessageUsers.length > 1 && (
                    <AvatarGroup spacing="0.5" max="3" size="2xs" fontSize="xs">
                      {m.hadSeenMessageUsers
                        .filter((id) => id !== m.senderId && id !== account._id)
                        .map((userId) => (
                          <Avatar
                            key={userId}
                            border="none"
                            name={members[userId]?.userName}
                          />
                        ))}
                    </AvatarGroup>
                  )}
                </HStack>
              </VStack>
            </HStack>
          </HStack>
        ))}
      </Flex>
    </MessageListCard>
  );
};
const MessageContent = ({ contentType, content }) => {
  switch (contentType) {
    case "image":
      return (
        <Box boxSize="xs">
          <Image
            src={content}
            loading="lazy"
            // TODO setTimeout
            onLoad={() => setTimeout(() => URL.revokeObjectURL(content), 100)}
            alt="image"
          />
        </Box>
      );
    default:
      return <Text>{content}</Text>;
  }
};
export default MessageList;
