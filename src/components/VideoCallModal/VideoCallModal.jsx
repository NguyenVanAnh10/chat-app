import React, { useEffect as useReactEffect } from "react";
import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
} from "@chakra-ui/react";

import useVideoChat from "hooks/useVideoChat";
// import VideoPlayer from "./VideoPlayer";

const VideoCallModal = ({ isCaller = false, isOpen, onClose, room }) => {
  const [
    { currentVideo, currentStreamVideoRef, remoteStreamVideoRef },
    { onCallUser, onAnswerCall, onLeaveCall },
  ] = useVideoChat(room, { activeDevice: isOpen });

  useReactEffect(() => {
    if (!currentVideo) return;
    isCaller ? onCallUser() : onAnswerCall();
  }, [currentVideo]);
  return (
    <Modal size="full" isOpen={isOpen} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <Flex flexWrap="wrap">
            {/* {!!currentStreamVideoRef.current.srcObject && ( */}
            <video
              ref={currentStreamVideoRef}
              playsInline
              muted
              autoPlay
              style={{ width: "100%", maxWidth: 500, height: 200 }}
            />
            {/* )} */}
            {/* {!!currentVideo && <VideoPlayer videoSrc={currentVideo} />}
            {!!currentVideo && <VideoPlayer videoSrc={currentVideo} />}
            {!!currentVideo && <VideoPlayer videoSrc={currentVideo} />} */}
            {/* {!!remoteStreamVideoRef.current?.srcObject && ( */}
            <video
              ref={remoteStreamVideoRef}
              playsInline
              autoPlay
              style={{ width: "100%", maxWidth: 500, height: 200 }}
            />
            {/* )} */}
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={() => {
              onLeaveCall();
              onClose();
            }}
            colorScheme="red"
            m="0 auto"
          >
            Ended
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default VideoCallModal;
