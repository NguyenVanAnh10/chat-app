import React, { forwardRef } from 'react';

import ImageMessage from 'components/ImageMessage';
import Message from 'entities/Message';
import NotificationMessage from 'components/NotificationMessage';
import TextMessage from 'components/TextMessage';

const MessageContent = forwardRef(({
  message,
  containerRef,
  onImageClick,
  showSeenUsers = true,
  showStatusMessage = true,
}, ref) => {
  switch (message.contentType) {
    case Message.CONTENT_TYPE_IMAGE:
      // TODO not show .svg
      return (
        <ImageMessage
          ref={ref}
          showStatusMessage={showStatusMessage}
          message={message}
          containerRef={containerRef}
          onClick={onImageClick}
        />
      );
    case Message.CONTENT_TYPE_NOTIFICATION:
      return (
        <NotificationMessage
          ref={ref}
          showStatusMessage={showStatusMessage}
          message={message}
        />
      );
    default:
      return (
        <TextMessage
          ref={ref}
          message={message}
          showSeenUsers={showSeenUsers}
          showStatusMessage={showStatusMessage}
        />
      );
  }
});

export default MessageContent;
