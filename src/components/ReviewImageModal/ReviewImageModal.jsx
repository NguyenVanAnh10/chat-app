import React from "react";
import {
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";

const ReviewImageModal = ({ isOpen, onClose, imgSrc }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <Image src={imgSrc} boxSize="sm" objectFit="contain" />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
export default ReviewImageModal;
