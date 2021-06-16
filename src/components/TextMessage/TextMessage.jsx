import React from 'react';

import BubbleMessage from 'components/BubbleMessage';
import MessageStatus from 'components/MessageStatus';
import { Text } from '@chakra-ui/react';

const TextMessage = ({ message, members, account, showStatusMessage, showSeenUsers }) => (
  <BubbleMessage message={message}>
    <Text>{message.content}</Text>
    {showStatusMessage && (
    <MessageStatus
      message={message}
      account={account}
      members={members}
      showSeenUsers={showSeenUsers}
    />
    )}
  </BubbleMessage>
);

export default TextMessage;
