import React, { useContext } from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogOverlay,
  Button,
  Text,
} from '@chakra-ui/react';
import qs from 'query-string';

import imcomingCallSound from 'statics/sounds/incoming_call.mp3';
import AlertSound from 'components/AlertSound';
import { useUser } from 'hooks/useUsers';
import { ChatContext } from 'pages/ChatApp';

const CallingAlertModal = ({ callerId, onDecline, isOpen, onAcceptCall, conversationId }) => {
  const [{ user: caller }] = useUser(callerId);
  const [{ incomingCallWindow }] = useContext(ChatContext);

  return (
    <AlertDialog
      motionPreset="slideInBottom"
      onClose={onDecline}
      isOpen={isOpen}
      isCentered
      closeOnOverlayClick={false}
    >
      <AlertDialogOverlay />
      <AlertDialogContent>
        <AlertDialogBody pt="10">
          <Text fontSize="lg" fontWeight="bold">
            {`${caller.name || caller.userName} is calling...`}
          </Text>
          <AlertSound src={imcomingCallSound} isPlay={isOpen} />
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button onClick={onDecline} colorScheme="red">
            Decline
          </Button>
          <Button
            colorScheme="green"
            ml={3}
            onClick={() => {
              onAcceptCall();
              incomingCallWindow.current = window.open(
                `/call/incoming?${qs.stringify({ conversationId, callerId })}`,
                'incoming-call',
                `height=${window.innerHeight},width=${window.innerWidth}`,
              );
            }}
          >
            Answer
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default CallingAlertModal;
