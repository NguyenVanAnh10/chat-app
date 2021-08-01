import React, { useEffect as useReactEffect } from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogOverlay,
  Button,
  Text,
} from '@chakra-ui/react';
import { Helmet } from 'react-helmet';

import { useModel } from 'model';

import imcomingCallSound from 'statics/sounds/incoming_call.wav';
import AlertSound from 'components/AlertSound';

const selector = ({ users, getUser }) => ({
  caller: users[getUser.id] || {},
});

const CallingAlertModal = ({ callerId, onDecline, isOpen, onAnswer }) => {
  const [{ caller }, { getUser }] = useModel('user', selector);
  useReactEffect(() => {
    callerId && getUser({ id: callerId });
  }, [callerId]);

  return (
    <>
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
              {caller.name || caller.userName}
              {' '}
              is calling...
            </Text>
            <AlertSound src={imcomingCallSound} isPlay={isOpen} />
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
      <Helmet>
        <title>
          {isOpen ? `${caller.name || caller.userName} is calling...` : 'AloRice'}
        </title>
      </Helmet>
    </>
  );
};
export default CallingAlertModal;
