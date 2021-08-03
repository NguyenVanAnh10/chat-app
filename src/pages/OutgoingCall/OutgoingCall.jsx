import React, { useContext, useEffect } from 'react';
import { useUpdateEffect } from 'react-use';
import {
  Text,
  VStack,
  AspectRatio,
  IconButton,
  Center,
} from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import qs from 'query-string';

import VideoPlayer from 'components/VideoCallModal/VideoPlayer';
import { HangoutPhoneIcon } from 'components/CustomIcons';
import { ChatContext } from 'pages/ChatApp';
import Avatar from 'components/Avatar';

import { AccountContext } from 'App';
import { useConversation } from 'hooks/useConversations';

import styles from './OutgoingCall.module.scss';

const OutgoingCall = () => {
  const { conversationId, friendId } = qs.parse(useLocation().search);

  const [{ streamVideos, callState }, { onLeaveCall, onCallFriend }] = useContext(ChatContext);

  const { account } = useContext(AccountContext);
  const [{ conversation }] = useConversation({ conversationId, friendId });

  useEffect(() => {
    const data = { conversationId: conversationId || conversation.id };
    if (!conversationId && !conversation.id && friendId) {
      data.addresseeIds = [friendId];
    }
    onCallFriend(data);
  }, []);

  useUpdateEffect(() => {
    // finish call
    if ((!callState.accepted && !callState.declined) || callState.declined) {
      window.close();
    }
  }, [callState.accepted, callState.declined]);

  const renderCallingNameAndAvatar = () => {
    if (conversation.members.length === 2) {
      const participant = conversation.members.find(m => m.id !== account.id);
      return (
        <VStack
          mx="auto"
          zIndex="1"
          spacing="4"
          color="whiteAlpha.900"
          userSelect="none"
        >
          <Avatar
            name={participant.userName}
            src={participant.avatar}
            size="xl"
          />
          <Text fontSize="xl">
            {participant.userName}
          </Text>
          <Text>{callState.declined ? 'Busy' : 'Call...'}</Text>
        </VStack>
      );
    }
  };

  return (
    <Center
      pos="relative"
      h="100%"
      bg="blackAlpha.900"
      minH="100vh"
      className={styles.OutgoingCall}
    >
      {!!streamVideos.current && (
      <AspectRatio
        ratio={4 / 3}
        w="100%"
        position="absolute"
        maxW="250px"
        right="3"
        top="3"
        borderRadius="lg"
        overflow="hidden"
        zIndex="1"
      >
        <VideoPlayer videoSrc={streamVideos.current} />
      </AspectRatio>
      )}
      {callState.accepted && !!streamVideos.remote && (
      <AspectRatio
        ratio={1}
        w="100%"
        h="100%"
        maxH="100%"
        maxW="100%"
        left="0"
        top="0"
        position="absolute"
        overflow="hidden"
        className="is-full-screen"
      >
        <VideoPlayer
          videoSrc={streamVideos.remote}
          isFullScreen
          options={{ muted: false }}
        />
      </AspectRatio>
      )}
      { !callState.accepted && renderCallingNameAndAvatar()}
      <IconButton
        position="absolute"
        bottom="10"
        p="1"
        left="50%"
        transform="translateX(-50%)"
        color="white"
        size="xl"
        fontSize="3rem"
        colorScheme="red"
        borderRadius="100%"
        _focus="none"
        opacity="0.6"
        _hover={{ opacity: 1 }}
        icon={<HangoutPhoneIcon />}
        m="0 auto"
        onClick={() => {
          onLeaveCall(conversationId || conversation.id);
          window.close();
        }}
      />
    </Center>
  );
};

export default OutgoingCall;
