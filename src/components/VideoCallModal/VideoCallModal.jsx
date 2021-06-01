import React, { useEffect as useReactEffect } from "react";
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

import useVideoChat from "hooks/useVideoChat";
import VideoPlayer from "./VideoPlayer";
import { HangoutPhoneIcon } from "components/CustomIcons";

import styles from "./VideoCallModal.module.scss";

const VideoCallModal = ({ caller = null, isOpen, onClose, room = {} }) => {
  const [
    { currentVideo, remoteVideo, acceptedCall },
    { onCallUser, onAnswerCall, onLeaveCall },
  ] = useVideoChat(room._id, { activeDevice: isOpen });
  useReactEffect(() => {
    !remoteVideo && acceptedCall && onClose();
  }, [remoteVideo]);

  useReactEffect(() => {
    if (!currentVideo) return;
    caller ? onCallUser() : onAnswerCall();
  }, [currentVideo]);
  return (
    <Modal size="full" isOpen={isOpen} closeOnOverlayClick={false} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalBody
          bg="pink.100"
          d="flex"
          flexDir="column"
          justifyContent="center"
          className={styles.VideoCallModal}
        >
          {!!currentVideo && (
            <AspectRatio
              ratio={4 / 3}
              w="100%"
              position="absolute"
              maxW="150px"
              right="1"
              top="1"
              borderRadius="lg"
              overflow="hidden"
              zIndex="1"
            >
              <VideoPlayer videoSrc={currentVideo} />
            </AspectRatio>
          )}
          {!!remoteVideo && (
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
                videoSrc={remoteVideo}
                isFullScreen
                options={{ muted: false }}
              />
            </AspectRatio>
          )}
          {caller && !acceptedCall && (
            <VStack mx="auto" zIndex="1">
              <AvatarGroup size="lg" max={3}>
                {room.otherMembers.length > 1
                  ? room.members.map((o) => (
                      <Avatar key={o._id} name={o.userName}></Avatar>
                    ))
                  : room.otherMembers.map((o) => (
                      <Avatar key={o._id} name={o.userName}></Avatar>
                    ))}
              </AvatarGroup>
              <Heading size="md">{caller.userName} </Heading>
              <Text>...Calling </Text>
            </VStack>
          )}
          <IconButton
            position="absolute"
            bottom="10"
            left="50%"
            transform="translateX(-50%)"
            color="white"
            size="lg"
            colorScheme="red"
            borderRadius="100%"
            _focus="none"
            opacity="0.6"
            _hover={{ opacity: 1 }}
            icon={<HangoutPhoneIcon fontSize="2.5rem" />}
            m="0 auto"
            onClick={() => {
              onLeaveCall();
              onClose();
            }}
          >
            Ended
          </IconButton>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
export default VideoCallModal;
