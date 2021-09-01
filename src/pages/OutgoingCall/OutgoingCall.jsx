import React, { useContext, useEffect } from 'react';
import { useUpdateEffect } from 'react-use';
import {
  Text,
  VStack,
  AspectRatio,
  IconButton,
  Center,
  Spinner,
  Heading,
  Box,
  Icon,
  HStack,
} from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';

import VideoPlayer from 'components/VideoCallModal/VideoPlayer';
import Video from 'components/VideoCallModal/Video';
import {
  HangoutPhoneIcon,
  NotAllowedMicrophoneIcon,
  NotAllowedVideoIcon,
} from 'components/CustomIcons';
import { ChatContext } from 'pages/ChatApp';
import Avatar from 'components/Avatar';
import { AccountContext } from 'App';
import { useConversation } from 'hooks/useConversations';
import AlertSound from 'components/AlertSound';

import styles from './OutgoingCall.module.scss';
import Action from 'entities/Action';
import outgoingCallSound from 'statics/sounds/outgoing_call.mp3';
import useQuery from 'hooks/useQuery';
import { useFriend } from 'hooks/useFriends';

const OutgoingCall = () => {
  const { conversationId, friendId } = useQuery(useLocation().search);

  const [{ streamVideos, callState }, { onLeaveCall, onCallFriend }] = useContext(ChatContext);

  const { account } = useContext(AccountContext);
  const [{ conversation }] = useConversation({ conversationId }, { forceFetching: true });
  const [{ friend }] = useFriend({ friendId }, { forceFetching: true });

  useEffect(() => {
    conversation.id &&
      onCallFriend({
        conversationId,
        peerIds: conversation.members.map(m => m.id),
      });
  }, [conversation.id]);

  useUpdateEffect(() => {
    // finish call
    if ((!callState.accepted && !callState.declined) || callState.declined) {
      onCloseWindow();
    }
  }, [callState.accepted, callState.declined]);

  const onCloseWindow = () => {
    window.opener.postMessage({ type: Action.CLOSE_OUTGOING_CALL_WINDOW }, '*');
    window.close();
  };

  const renderCallingNameAndAvatar = () => {
    if (conversation.members?.length === 2 || !!friend.id) {
      const participant = conversation.members?.find(m => m.id !== account.id) || friend;
      return (
        <VStack mx="auto" zIndex="1" spacing="4" color="whiteAlpha.900" userSelect="none">
          <Avatar name={participant.userName} src={participant.avatar} size="xl" />
          <Text fontSize="xl">{participant.userName}</Text>
          <Text>{callState.declined ? 'Busy' : 'Call...'}</Text>
        </VStack>
      );
    }
  };

  if (streamVideos.error?.name) return <MediaDevicesNotAllowed />;

  return (
    <Center
      pos="relative"
      h="100%"
      bg="blackAlpha.900"
      minH={`${window.innerHeight}px`}
      className={styles.OutgoingCall}
    >
      {streamVideos.current ? (
        <>
          {/* <AspectRatio
            ratio={4 / 3}
            w="100%"
            position="absolute"
            maxW="250px"
            right="3"
            top="3"
            borderRadius="lg"
            overflow="hidden"
            zIndex="1"
          > */}
          {/* <VideoPlayer videoSrc={streamVideos.current} /> */}
          <Video srcObject={streamVideos.current} />
          {/* </AspectRatio> */}

          {callState.accepted &&
            Object.keys(streamVideos.remotes).map(id => (
              <React.Fragment key={id}>
                <Video srcObject={streamVideos.remotes[id]} />
                {/* <VideoPlayer
                  // isFullScreen
                  videoSrc={streamVideos.remotes[id]}
                  options={{ muted: false }}
                />
                <VideoPlayer
                  // isFullScreen
                  videoSrc={streamVideos.remotes[id]}
                  options={{ muted: false }}
                /> */}
              </React.Fragment>
              // <AspectRatio
              //   key={id}
              //   ratio={1}
              //   w="100%"
              //   h="100%"
              //   maxH="100%"
              //   maxW="100%"
              //   left="0"
              //   top="0"
              //   position="absolute"
              //   overflow="hidden"
              //   // className="is-full-screen"
              // >
              //   <VideoPlayer
              //     isFullScreen
              //     videoSrc={streamVideos.remotes[id]}
              //     options={{ muted: false }}
              //   />
              // </AspectRatio>
            ))}
          {!callState.accepted && renderCallingNameAndAvatar()}
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
              onCloseWindow();
            }}
          />
          <AlertSound src={outgoingCallSound} isPlay={!callState.accepted} />
        </>
      ) : (
        <Spinner thickness="3px" speed="0.65s" emptyColor="gray.200" color="blue.400" size="lg" />
      )}
    </Center>
  );
};

const MediaDevicesNotAllowed = () => (
  <Center
    pos="relative"
    h="100%"
    bg="blackAlpha.900"
    minH={`${window.innerHeight}px`}
    color="whiteAlpha.900"
  >
    <Box pos="absolute" maxW="300px" borderRadius="md" bg="gray.700" p="3" right="2" top="2">
      <Heading size="sm">
        You&apos;ll need to allow microphone and camera access for video chats.
      </Heading>
      <Text fontSize="sm">Allow Camera and Microphone Access</Text>
    </Box>
    <Box maxW="600px" px="3">
      <HStack justify="center">
        <Icon fontSize="50px" as={NotAllowedVideoIcon} />
        <Icon fontSize="60px" as={NotAllowedMicrophoneIcon} />
      </HStack>
      <Heading size="lg" mt="4">
        You Haven&apos;t Allowed Alorice Access to Your Camera and Microphone
      </Heading>
      <Text mt="3">
        Allow Alorice to use your camera and microphone so others on the call can see and hear you.
        You can turn this off later.
      </Text>
    </Box>
  </Center>
);

export default OutgoingCall;
