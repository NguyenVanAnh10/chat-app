import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Avatar,
  AvatarGroup,
  Flex,
  HStack,
  IconButton,
  Image,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { RepeatIcon } from "@chakra-ui/icons";
import dayjs from "dayjs";

import useRoom from "hooks/useRoom";
import { AccountContext } from "App";
import useMessages from "hooks/useMessages";
import MessageListCard from "components/MessageListCard";
import ReviewImageModal from "components/ReviewImageModal";

const MessageList = ({ roomId, className, userId }) => {
  const [{ messages, loading }] = useMessages(roomId, userId, {
    fetchData: true,
  });

  const [{ room }] = useRoom(roomId);
  const { account } = useContext(AccountContext);
  const containerRef = useRef();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [imgSrc, setImgSrc] = useState();

  const members = room.members.reduce((s, m) => ({ ...s, [m._id]: m }), {});
  useEffect(() => {
    !loading && containerRef.current.scrollIntoView(false);
  }, [messages, loading]);

  return (
    <MessageListCard w="100%" className={className} loading={loading}>
      <Flex flexDir="column" mt="5" ref={containerRef}>
        {messages.map((m) => (
          <HStack
            key={m._id || m.keyMsg}
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
              <MessageContent
                message={m}
                members={members}
                containerRef={containerRef}
                onImageClick={() => {
                  if (m.contentType !== "image") return;
                  setImgSrc(m.content);
                  onOpen();
                }}
              />
            </HStack>
          </HStack>
        ))}
      </Flex>
      <ReviewImageModal isOpen={isOpen} onClose={onClose} imgSrc={imgSrc} />
    </MessageListCard>
  );
};
const MessageContent = ({ message, members, containerRef, onImageClick }) => {
  const { account } = useContext(AccountContext);

  switch (message.contentType) {
    case "image":
      return (
        <ImageMessage
          message={message}
          members={members}
          account={account}
          containerRef={containerRef}
          onClick={onImageClick}
        />
      );
    default:
      return (
        <TextMessage message={message} members={members} account={account} />
      );
  }
};

const TextMessage = ({ message, members, account }) => {
  return (
    <VStack
      className={`message ${
        message.senderId !== account._id ? "receive" : "send"
      }`}
      zIndex="1"
    >
      <Text>{message.content}</Text>
      <MessageStatus message={message} account={account} members={members} />
    </VStack>
  );
};

// TODO blink image (blob local image - url server image)
const ImageMessage = ({ message, members, account, containerRef, onClick }) => {
  const [visible, setVisible] = useState(false);
  return (
    <VStack
      mr="2"
      alignItems="flex-end"
      cursor="pointer"
      onClick={() => visible && onClick()}
    >
      <Image
        maxW="100%"
        maxH={200}
        borderRadius="lg"
        objectFit="contain"
        display={!visible ? "block" : "none"}
        objectPosition={message.senderId === account._id ? "right" : "left"}
        src={message.contentBlob}
        onLoad={() => {
          containerRef.current.scrollIntoView(false);
        }}
      />
      <Image
        maxW="100%"
        maxH={200}
        borderRadius="lg"
        objectFit="contain"
        display={visible ? "block" : "none"}
        objectPosition={message.senderId === account._id ? "right" : "left"}
        src={message.content}
        onLoad={() => {
          setVisible(true);
          containerRef.current.scrollIntoView(false);
          URL.revokeObjectURL(message.contentBlob);
          // containerRef.current.scrollIntoView(false);
          // setTimeout(() => URL.revokeObjectURL(message.contentBlob), 100);
        }}
      />
      <MessageStatus message={message} account={account} members={members} />
    </VStack>
  );
};

const MessageStatus = ({ message, account, members }) => {
  return (
    <HStack
      spacing="5"
      color="blackAlpha.600"
      w="100%"
      justifyContent="space-between"
    >
      <Text fontSize="xs">{dayjs(message.createAt).format("h:mm A")}</Text>
      {message.senderId === account._id &&
        !message.error &&
        message.hadSeenMessageUsers.length === 1 && (
          <Text fontSize="xs">{message.status ? "Delivered" : "Sending"}</Text>
        )}
      {!!message.error && <Text fontSize="xs">Sending Error</Text>}
      {message.hadSeenMessageUsers.length > 1 && (
        <AvatarGroup spacing="0.5" max="3" size="2xs" fontSize="xs">
          {message.hadSeenMessageUsers
            .filter((id) => id !== message.senderId && id !== account._id)
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
  );
};

export default MessageList;
