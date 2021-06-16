import React, { useContext } from 'react';

import { AccountContext } from 'App';
import ImageMessage from 'components/ImageMessage';
import Message from 'entities/Message';
import NotificationMessage from 'components/NotificationMessage';
import TextMessage from 'components/TextMessage';

const MessageContent = ({
  roomId,
  message,
  members,
  containerRef,
  onImageClick,
  showSeenUsers = true,
  showStatusMessage = true,
}) => {
  const { account } = useContext(AccountContext);
  switch (message.contentType) {
    case Message.CONTENT_TYPE_IMAGE:
      // TODO not show .svg
      return (
        <ImageMessage
          showStatusMessage={showStatusMessage}
          message={message}
          members={members}
          account={account}
          containerRef={containerRef}
          onClick={onImageClick}
        />
      );
    case Message.CONTENT_TYPE_NOTIFICATION:
      return (
        <NotificationMessage
          roomId={roomId}
          showStatusMessage={showStatusMessage}
          message={message}
          members={members}
          account={account}
        />
      );
    default:
      return (
        <TextMessage
          message={message}
          members={members}
          account={account}
          showSeenUsers={showSeenUsers}
          showStatusMessage={showStatusMessage}
        />
      );
  }
};

export default MessageContent;
