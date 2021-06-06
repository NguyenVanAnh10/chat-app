import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Avatar,
  HStack,
  IconButton,
  Stack,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { RepeatIcon } from "@chakra-ui/icons";

import useRoom from "hooks/useRoom";
import { AccountContext } from "App";
import useMessages from "hooks/useMessages";
import MessageListCard from "components/MessageListCard";
import ReviewImageModal from "components/ReviewImageModal";
import MessageContent from "components/MessageContent";
import Message from "entities/Message";

const MessageList = ({ roomId, className, userId }) => {
  const [{ messages, loading }] = useMessages(roomId, userId, {
    fetchData: true,
  });

  const [{ room }] = useRoom(roomId);
  const { account } = useContext(AccountContext);
  const containerRef = useRef();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [imgSrc, setImgSrc] = useState();

  // TODO aggregate messages
  const aggregateMessages = messages.reduce((s, c, index, msgArr) => {
    if (!index || msgArr[index - 1].senderId !== c.senderId) {
      s = [...s, c];
      return s;
    }
    s = [
      ...(s.length > 1 ? s.slice(0, s.length - 1) : []),
      {
        ...c,
        aggregateMsg: s[s.length - 1]?.aggregateMsg
          ? [...s[s.length - 1]?.aggregateMsg, c]
          : [s[s.length - 1], c],
      },
    ];
    return s;
  }, []);

  const members = room.members.reduce((s, m) => ({ ...s, [m._id]: m }), {});
  useEffect(() => {
    !loading && containerRef.current.scrollIntoView(false);
  }, [messages, loading]);

  return (
    <MessageListCard w="100%" className={className} loading={loading}>
      <VStack mt="5" spacing="3" ref={containerRef} alignItems="flex-start">
        {aggregateMessages.map((m, index, arrMsg) => (
          <Stack
            key={m._id || m.keyMsg}
            spacing="1"
            w="100%"
            direction={m.senderId !== account._id ? "row" : "row-reverse"}
          >
            <Avatar
              name={members[m.senderId]?.userName || "N/A"}
              size="sm"
              zIndex="2"
            ></Avatar>
            <HStack spacing="1" maxW="70%">
              {!!m.error && (
                <IconButton
                  bg="transparent"
                  icon={<RepeatIcon color="red.500" />}
                />
              )}
              {!m.aggregateMsg ? (
                <MessageContent
                  roomId={roomId}
                  message={m}
                  members={members}
                  containerRef={containerRef}
                  onImageClick={() => {
                    if (m.contentType !== Message.CONTENT_TYPE_IMAGE) return;
                    setImgSrc(m.content);
                    onOpen();
                  }}
                />
              ) : (
                <Stack
                  spacing="2"
                  align={m.senderId !== account._id ? "flex-start" : "flex-end"}
                >
                  {m.aggregateMsg.map((mm, ii, aa) => (
                    <MessageContent
                      roomId={roomId}
                      key={mm._id || mm.keyMsg}
                      message={mm}
                      members={members}
                      containerRef={containerRef}
                      showStatusMessage={ii === aa.length - 1}
                      onImageClick={() => {
                        if (mm.contentType !== Message.CONTENT_TYPE_IMAGE)
                          return;
                        setImgSrc(mm.content);
                        onOpen();
                      }}
                    />
                  ))}
                </Stack>
              )}
            </HStack>
          </Stack>
        ))}
      </VStack>
      <ReviewImageModal isOpen={isOpen} onClose={onClose} imgSrc={imgSrc} />
    </MessageListCard>
  );
};

export default MessageList;
