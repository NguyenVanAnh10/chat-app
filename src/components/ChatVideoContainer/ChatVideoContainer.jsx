import React from 'react';
import {
  AspectRatio,
  Center,
  Flex,
  IconButton,
  Spinner,
  useBreakpointValue,
} from '@chakra-ui/react';

import { HangoutPhoneIcon } from 'components/CustomIcons';
import outgoingCallSound from 'statics/sounds/outgoing_call.mp3';
import AlertSound from 'components/AlertSound';
import VideoPlayer from 'components/VideoCallModal/VideoPlayer';
import useResize from 'hooks/useResize';

/**
 *
 * @param {{
 *      callState: ICallState,
 *      streamVideos: IStreamVideos,
 *      handleStopingCall: () => ({})
 *      renderCallingNameAndAvatar?: () => ({})
 * }} props
 * @returns
 */
export default function ChatVideoContainer({
  callState,
  streamVideos,
  handleStopingCall,
  renderCallingNameAndAvatar,
}) {
  const { height } = useResize();

  if (!streamVideos.current) {
    return (
      <Center pos="relative" bg="blackAlpha.900" h={`${height}px`}>
        <Spinner thickness="3px" speed="0.65s" emptyColor="gray.200" color="blue.400" size="lg" />
      </Center>
    );
  }
  return (
    <Flex
      pos="relative"
      alignItems="center"
      justifyContent="center"
      bg="blackAlpha.900"
      h={`${height}px`}
      overflowY="auto"
    >
      <ChatVideos
        isOutgoingCall={!!renderCallingNameAndAvatar}
        callState={callState}
        currentSrc={streamVideos.current}
        remoteSrcs={streamVideos.remotes}
      />
      {!callState.accepted && renderCallingNameAndAvatar && renderCallingNameAndAvatar()}
      <IconButton
        position="fixed"
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
        onClick={handleStopingCall}
      />
      <AlertSound src={outgoingCallSound} isPlay={!callState.accepted} />
    </Flex>
  );
}

const ChatVideos = ({ isOutgoingCall, callState, currentSrc, remoteSrcs = {} }) => {
  const { width, height } = useResize();
  const isMobileScreen = useBreakpointValue({ base: true, md: false });

  if (Object.keys(remoteSrcs).length === 1 || (!callState.accepted && isOutgoingCall)) {
    return (
      <>
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
          <VideoPlayer videoSrc={currentSrc} options={{ muted: true }} />
        </AspectRatio>
        {callState.accepted &&
          Object.keys(remoteSrcs).map(id => (
            <VideoPlayer
              key={id}
              w="100%"
              maxW={`${isMobileScreen ? (height * 9) / 16 : (height * 16) / 9}px`}
              videoSrc={remoteSrcs[id]}
              options={{ aspectRatio: isMobileScreen ? '9:16' : '16:9' }}
            />
          ))}
      </>
    );
  }
  const dimensionOpts = (() => {
    const options = { maxW: width / 3 - 5, aspectRatio: '4:3' };

    if (Object.keys(remoteSrcs).length < 4 || isMobileScreen) {
      options.maxW = width / 2 - 5;
    }
    if (Object.keys(remoteSrcs).length < 4) {
      options.aspectRatio = '16:9';
    }
    if (isMobileScreen) {
      options.aspectRatio = '9:16';
    }
    return options;
  })();

  return (
    <Flex wrap="wrap" justify="center" w="100%" minH="100%">
      <VideoPlayer
        videoSrc={currentSrc}
        maxW={`${dimensionOpts.maxW}px`}
        options={{ aspectRatio: dimensionOpts.aspectRatio, muted: true }}
      />
      {Object.keys(remoteSrcs).map(id => (
        <VideoPlayer
          key={id}
          videoSrc={remoteSrcs[id]}
          maxW={`${dimensionOpts.maxW}px`}
          options={{ aspectRatio: dimensionOpts.aspectRatio }}
        />
      ))}
    </Flex>
  );
};
