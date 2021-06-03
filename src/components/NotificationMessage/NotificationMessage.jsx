import React, { useContext } from "react";
import { Icon, Text } from "@chakra-ui/react";

import BubbleMessage from "components/BubbleMessage";
import Notification from "entities/Notification";
import { AccountContext } from "App";
import useRoom from "hooks/useRoom";
import MessageStatus from "components/MessageStatus";
import { MissedCallIcon, VideoCallIcon } from "components/CustomIcons";

const NotificationMessage = ({
  message,
  numbers,
  roomId,
  members,
  showStatusMessage,
}) => {
  const { account } = useContext(AccountContext);
  const [{ room }] = useRoom(roomId);

  switch (message.content) {
    case Notification.NOTIFICATION_MISS_CALL:
      return (
        <BubbleMessage
          message={message}
          showStatus={false}
          showSeenUsers={false}
        >
          {account._id === message.senderId ? (
            <Text>
              {room.otherMembers?.length > 1
                ? room.name
                : room.otherMembers?.[0]?.userName}
              missed your video chat
            </Text>
          ) : (
            <Text>
              you missed a video chat with{" "}
              {room.otherMembers?.length > 1
                ? room.name
                : room.otherMembers?.[0]?.userName}
            </Text>
          )}
        </BubbleMessage>
      );
    case Notification.NOTIFICATION_ENDED_CALL:
      return (
        <BubbleMessage message={message}>
          <Text fontWeight="bold">
            <Icon
              as={VideoCallIcon}
              mr="2"
              fontSize="1.5rem"
              color="blue.900"
            />
            The video chat ended
          </Text>
          )
          {showStatusMessage && (
            <MessageStatus
              message={message}
              account={account}
              members={members}
              showStatus={false}
              showSeenUsers={false}
            />
          )}
        </BubbleMessage>
      );
    case Notification.NOTIFICATION_DECLINE_CALL:
      return (
        <BubbleMessage message={message}>
          {account._id === message.senderId ? (
            <Text color="blue.500" fontWeight="bold">
              <Icon as={MissedCallIcon} mr="2" />
              {room.otherMembers?.length > 1
                ? room.name
                : room.otherMembers?.[0]?.userName}
              &nbsp; missed your video chat
            </Text>
          ) : (
            <Text color="red" fontWeight="bold">
              <Icon as={MissedCallIcon} mr="2" />
              you missed a video chat with &nbsp;
              {room.otherMembers?.length > 1
                ? room.name
                : room.otherMembers?.[0]?.userName}
            </Text>
          )}
          {showStatusMessage && (
            <MessageStatus
              message={message}
              account={account}
              members={members}
              showStatus={false}
              showSeenUsers={false}
              show
            />
          )}
        </BubbleMessage>
      );
    default:
      return <Text>{Notification.NOTIFICATION_INCOMING_CALL}</Text>;
  }
};

export default NotificationMessage;
