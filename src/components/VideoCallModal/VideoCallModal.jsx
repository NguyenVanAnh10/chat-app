import React, { useContext } from "react";
import { useUpdateEffect } from "react-use";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  Avatar,
  AvatarGroup,
  Heading,
  VStack,
  AspectRatio,
  IconButton,
} from "@chakra-ui/react";

import VideoPlayer from "./VideoPlayer";
import { HangoutPhoneIcon } from "components/CustomIcons";
import { ChatContext } from "pages/ChatList";

import styles from "./VideoCallModal.module.scss";

const VideoCallModal = ({ receiver = null, isOpen, onClose, room = {} }) => {
  const {
    state: { streamVideos, callState, caller, roomId },
    actions: { onLeaveCall },
  } = useContext(ChatContext);

  useUpdateEffect(() => {
    // finish call
    if (!callState.accepted && !callState.declined) {
      onClose();
    }
  }, [callState.accepted]);

  useUpdateEffect(() => {
    // decline call
    if (callState.declined) {
      onClose();
    }
  }, [callState.declined]);

  return (
    <Modal
      size="full"
      isOpen={isOpen}
      closeOnOverlayClick={false}
      isCentered
      blockScrollOnMount={true}
      preserveScrollBarGap={true}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalBody
          bg="pink.100"
          d="flex"
          flexDir="column"
          justifyContent="center"
          className={styles.VideoCallModal}
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
          {!!receiver && !callState.accepted && (
            <VStack mx="auto" zIndex="1">
              <AvatarGroup size="xl" max={3}>
                {room.otherMembers.length > 1
                  ? room.members.map((o) => (
                      <Avatar key={o._id} name={o.userName}></Avatar>
                    ))
                  : room.otherMembers.map((o) => (
                      <Avatar key={o._id} name={o.userName}></Avatar>
                    ))}
              </AvatarGroup>
              <Heading size="md">{receiver.userName} </Heading>
              <Text>{callState.declined ? "Busy" : "Call..."}</Text>
            </VStack>
          )}
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
              onLeaveCall(roomId || room._id);
              onClose();
            }}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
export default VideoCallModal;
