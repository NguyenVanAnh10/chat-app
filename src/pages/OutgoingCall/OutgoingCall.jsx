import React, { useContext, useEffect } from 'react';
import { useUpdateEffect } from 'react-use';
import { Text, VStack, Center, Heading, Box, Icon, HStack } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';

import { NotAllowedMicrophoneIcon, NotAllowedVideoIcon } from 'components/CustomIcons';
import { ChatContext } from 'pages/ChatApp';
import Avatar from 'components/Avatar';
import { AccountContext } from 'App';
import { useConversation } from 'hooks/useConversations';

import Action from 'entities/Action';
import useQuery from 'hooks/useQuery';
import { useFriend } from 'hooks/useFriends';
import ChatVideoContainer from 'components/ChatVideoContainer';

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
    return (
      <VStack mx="auto" zIndex="1" spacing="4" color="whiteAlpha.900" userSelect="none">
        <Text fontSize="xl">{conversation.name}</Text>
        <Text>{callState.declined ? 'Busy' : 'Call...'}</Text>
      </VStack>
    );
  };

  if (streamVideos.error?.name) return <MediaDevicesNotAllowed />;

  return (
    <ChatVideoContainer
      callState={callState}
      streamVideos={streamVideos}
      renderCallingNameAndAvatar={renderCallingNameAndAvatar}
      handleStopingCall={() => {
        onLeaveCall(conversationId || conversation.id);
        onCloseWindow();
      }}
    />
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
