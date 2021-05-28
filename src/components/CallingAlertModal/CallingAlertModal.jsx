import React, { useEffect as useReactEffect } from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogOverlay,
  Button,
  Text,
} from "@chakra-ui/react";

import { useModel } from "model";

const CallingAlertModal = ({ callerId, onDecline, isOpen, onAnswer }) => {
  const [{ caller }, { getUser }] = useModel("user", ({ users, getUser }) => ({
    caller: users[getUser.id] || {},
  }));
  useReactEffect(() => {
    callerId && getUser(callerId);
  }, [callerId]);

  if (!caller._id) return null;

  return (
    <AlertDialog
      motionPreset="slideInBottom"
      onClose={onDecline}
      isOpen={isOpen}
      isCentered
    >
      <AlertDialogOverlay />
      <AlertDialogContent>
        <AlertDialogBody pt="10">
          <Text fontSize="lg" fontWeight="bold">
            {caller.name || caller.userName} is calling...
          </Text>
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button onClick={onDecline} colorScheme="red">
            Decline
          </Button>
          <Button colorScheme="green" ml={3} onClick={onAnswer}>
            Answer
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default CallingAlertModal;