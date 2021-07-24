import React, { forwardRef } from 'react';
import { Box, Text } from '@chakra-ui/react';

import BubbleMessage from 'components/BubbleMessage';
import MessageStatus from 'components/MessageStatus';
import Message from 'entities/Message';
import Emoji from 'components/Emoji';
import { v4 as uuid } from 'uuid';

import data from 'components/EmojiPicker/data';

const { emojis } = data;

const TextMessage = forwardRef(({ message, showStatusMessage, showSeenUsers }, ref) => {
  const messageBlocks = Message.getInputMessage(message.content);
  return (
    <BubbleMessage message={message} ref={ref}>
      <Box>
        {messageBlocks.map(b => emojis[b] ? (
          <Emoji
            key={uuid()}
            d="inline-block"
            coordinates={emojis[b]}
            text={b}
          />
        ) : <Text key={uuid()} w="max-content" d="inline">{b}</Text>)}
      </Box>

      {showStatusMessage && (
      <MessageStatus
        message={message}
        showSeenUsers={showSeenUsers}
      />
      )}
    </BubbleMessage>
  );
});

export default TextMessage;
