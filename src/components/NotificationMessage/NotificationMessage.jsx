import React, { useContext } from 'react';
import { Icon, Text } from '@chakra-ui/react';

import BubbleMessage from 'components/BubbleMessage';
import Notification from 'entities/Notification';
import { AccountContext } from 'App';
import MessageStatus from 'components/MessageStatus';
import { MissedCallIcon, VideoCallIcon } from 'components/CustomIcons';
import { useConversation } from 'hooks/useConversations';

const NotificationMessage = ({
  message,
  showStatusMessage,
}) => {
  const { account } = useContext(AccountContext);
  const [{ conversation }] = useConversation({
    conversationId: message.conversation || message.conversationId,
  });

  const participant = conversation.members.find(m => m.id !== account.id);

  switch (message.content) {
    case Notification.NOTIFICATION_MISS_CALL:
      return (
        <BubbleMessage
          message={message}
          showStatus={false}
          showSeenUsers={false}
        >
          {account.id === message.sender ? (
            <Text>
              {participant.userName}
              missed your video chat
            </Text>
          ) : (
            <Text>
              you missed a video chat with
              {' '}
              {participant.userName}
            </Text>
          )}
        </BubbleMessage>
      );
    case Notification.NOTIFICATION_ENDED_CALL:
      return (
        <BubbleMessage message={message}>
          <Text fontSize="sm" color="gray.700" fontStyle="italic">
            <Icon as={VideoCallIcon} mr="2" fontSize="1.2rem" />
            The video chat ended
          </Text>
          )
          {showStatusMessage && (
            <MessageStatus
              message={message}
              showStatus={false}
              showSeenUsers={false}
            />
          )}
        </BubbleMessage>
      );
    case Notification.NOTIFICATION_DECLINE_CALL:
      return (
        <BubbleMessage message={message}>
          {account.id !== message.sender ? (
            <Text fontSize="sm" color="blue.500" fontStyle="italic">
              <Icon as={MissedCallIcon} mr="2" />
              {participant.userName}
              &nbsp; missed your video chat
            </Text>
          ) : (
            <Text fontSize="sm" color="red.500" fontStyle="italic">
              <Icon as={MissedCallIcon} mr="2" />
              you missed a video chat with &nbsp;
              {participant.userName}
            </Text>
          )}
          {showStatusMessage && (
            <MessageStatus
              message={message}
              showStatus={false}
              showSeenUsers={false}
            />
          )}
        </BubbleMessage>
      );
    default:
      return (
        <BubbleMessage message={message}>
          <Text>{Notification.NOTIFICATION_INCOMING_CALL}</Text>
        </BubbleMessage>
      );
  }
};

export default NotificationMessage;
