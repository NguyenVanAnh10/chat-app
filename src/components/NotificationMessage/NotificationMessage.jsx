import React, { useContext, forwardRef } from 'react';
import { Icon, Text } from '@chakra-ui/react';

import BubbleMessage from 'components/BubbleMessage';
import Notification from 'entities/Notification';
import { AccountContext } from 'App';
import MessageStatus from 'components/MessageStatus';
import { MissedCallIcon, VideoCallIcon } from 'components/CustomIcons';
import { useConversation } from 'hooks/useConversations';
import { useFriend } from 'hooks/useFriends';
import { useUser } from 'hooks/useUsers';

const NotificationMessage = forwardRef(({ message, showStatusMessage }, ref) => {
  const [notificationType, receiverId] = message.content.split('-');

  const { account } = useContext(AccountContext);
  const [{ conversation }] = useConversation({
    conversationId: message.conversation || message.conversationId,
  });

  const [{ friend }] = useFriend({
    conversationId: message.conversation || message.conversationId,
  });
  const participant = conversation.members?.find(m => m.id !== account.id) || friend;

  switch (notificationType) {
    case Notification.NOTIFICATION_MISS_CALL:
      return (
        <BubbleMessage message={message} showStatus={false} showSeenUsers={false} ref={ref}>
          {account.id === message.sender ? (
            <Text>
              {participant.userName}
              missed your video chat
            </Text>
          ) : (
            <Text>{`you missed a video chat with ${participant.userName}`}</Text>
          )}
        </BubbleMessage>
      );
    case Notification.NOTIFICATION_ENDED_CALL:
      return (
        <BubbleMessage ref={ref} message={message}>
          <Text fontSize="sm" color="gray.700" fontStyle="italic">
            <Icon as={VideoCallIcon} mr="2" fontSize="1.2rem" />
            The video chat ended
          </Text>
          )
          {showStatusMessage && (
            <MessageStatus message={message} showStatus={false} showSeenUsers={false} />
          )}
        </BubbleMessage>
      );
    case Notification.NOTIFICATION_DECLINE_CALL:
      return (
        <BubbleMessage ref={ref} message={message}>
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
            <MessageStatus message={message} showStatus={false} showSeenUsers={false} />
          )}
        </BubbleMessage>
      );
    case Notification.NOTIFICATION_MEMBER_ADDITION:
      return (
        <MemberAdditionNotificationMessage receiverId={receiverId} senderId={message.sender} />
      );
    default:
      return (
        <BubbleMessage ref={ref} message={message}>
          <Text>{Notification.NOTIFICATION_INCOMING_CALL}</Text>
        </BubbleMessage>
      );
  }
});

const MemberAdditionNotificationMessage = ({ receiverId, senderId }) => {
  const [{ user: receiver }] = useUser(receiverId);
  const [{ user: sender }] = useUser(senderId);
  const { account } = useContext(AccountContext);

  switch (account.id) {
    case receiverId:
      return (
        <Text
          fontSize="xs"
          color="blackAlpha.700"
          bg="gray.100"
          borderRadius="lg"
          px="1.5"
          py="0.5"
          fontStyle="italic"
        >
          you was added the group by &nbsp;
          <strong>{sender.userName}</strong>
        </Text>
      );
    case senderId:
      return (
        <Text
          fontSize="xs"
          color="blackAlpha.700"
          bg="gray.100"
          borderRadius="lg"
          px="1.5"
          py="0.5"
          fontStyle="italic"
        >
          you added &nbsp;
          <strong>{receiver.userName}</strong>
          &nbsp; in the group
        </Text>
      );
    default:
      return (
        <Text
          fontSize="xs"
          color="blackAlpha.700"
          bg="gray.100"
          borderRadius="lg"
          px="1.5"
          py="0.5"
          fontStyle="italic"
        >
          <strong>{receiver.userName}</strong>
          &nbsp; was added in the group
        </Text>
      );
  }
};

export default NotificationMessage;
