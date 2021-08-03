import React, { useContext, useEffect } from 'react';
import { useUpdateEffect } from 'react-use';
import {
  Center,
  AspectRatio,
  IconButton,
} from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import qs from 'query-string';

import VideoPlayer from 'components/VideoCallModal/VideoPlayer';
import { HangoutPhoneIcon } from 'components/CustomIcons';
import { ChatContext } from 'pages/ChatApp';

import { useConversation } from 'hooks/useConversations';

import styles from './IncomingCall.module.scss';

const IncomingCall = () => {
  const { callerId: friendId, conversationId } = qs.parse(useLocation().search);
  const remoteSignal = window.localStorage.getItem('remoteSignal');

  const [{ streamVideos, callState }, { onLeaveCall, onAnswerCall }] = useContext(ChatContext);

  const [{ conversation }] = useConversation({ friendId, conversationId });

  useEffect(() => {
    onAnswerCall({ remoteSignal, conversationId });
  }, []);

  useUpdateEffect(() => {
    // finish call
    if ((!callState.accepted && !callState.declined)
    || callState.declined || callState.isOutgoing) {
      window.close();
    }
  }, [callState.accepted, callState.declined, callState.isOutgoing]);

  return (
    <Center
      pos="relative"
      h="100%"
      bg="blackAlpha.900"
      minH={`${window.innerHeight}px`}
      className={styles.IncomingCall}
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
      {/* { !callState.accepted && (
      <VStack mx="auto" zIndex="1" spacing="4">{renderCallingNameAndAvatar()}</VStack>
      )} */}
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

export default IncomingCall;
