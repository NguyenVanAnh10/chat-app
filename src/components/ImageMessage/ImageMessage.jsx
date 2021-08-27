import React, { useContext, forwardRef } from 'react';
import { VStack } from '@chakra-ui/react';

import MessageStatus from 'components/MessageStatus';
import { AccountContext } from 'App';

import styles from './ImageMessage.module.scss';
import classNames from 'classnames';

const ImageMessage = forwardRef(({ message, onClick }, ref) => {
  const { account } = useContext(AccountContext);
  return (
    <VStack
      className={styles.ImageMessage}
      ref={ref}
      alignItems="flex-end"
      cursor="pointer"
      onClick={onClick}
    >
      <img
        alt="loading.."
        src={message.content || message.contentBlob}
        className={classNames('image', {
          'object-position-right': message.sender === account.id,
          'object-position-left': message.sender !== account.id,
        })}
      />
      <MessageStatus message={message} />
    </VStack>
  );
});

export default ImageMessage;
