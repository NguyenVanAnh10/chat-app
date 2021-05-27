import React, { useEffect as useReactEffect } from "react";
import {
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";

import useVideoChat from "hooks/useVideoChat";
import VideoPlayer from "./VideoPlayer";

const VideoCallModal = ({ isCaller = false, isOpen, onClose, room }) => {
  const [
    { currentVideo, remoteVideo, hasReceivedACall },
    { onCallUser, onAnswerCall },
  ] = useVideoChat(room, { activeDevice: isOpen });

  useReactEffect(() => {
    if (!currentVideo) return;
    isCaller ? onCallUser() : onAnswerCall();
  }, [currentVideo]);
  console.log("hasReceivedACall", hasReceivedACall);
  return (
    <Modal
      size="full"
      isOpen={isOpen}
      onClose={() => {
        onClose();
        // onLeaveCall();
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <Flex flexWrap="wrap">
            {!!currentVideo && <VideoPlayer currentVideo={currentVideo} />}
            {/* {!!currentVideo && <VideoPlayer currentVideo={currentVideo} />}
            {!!currentVideo && <VideoPlayer currentVideo={currentVideo} />}
            {!!currentVideo && <VideoPlayer currentVideo={currentVideo} />} */}
            {!!remoteVideo && (
              // <AspectRatio ratio={3}>
              <VideoPlayer
                currentVideo={remoteVideo}
                options={{ muted: false }}
              />
              // </AspectRatio>
            )}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
export default VideoCallModal;
