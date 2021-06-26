import React, { memo } from 'react';
import { Box } from '@chakra-ui/layout';

import styles from './Emoji.module.scss';

import emojiImage from 'statics/images/emoji.png';

const Emoji = memo(({ coordinates, children, onClick = () => {}, ...rest }) => (
  <Box
    className={styles.Emoji}
    w="26px"
    h="26px"
    textAlign="center"
    bgImage={`url(${emojiImage})`}
    bgPosition={`${coordinates[0]}% ${coordinates[1]}%`}
    bgRepeat="no-repeat"
    bgSize="5100%"
    overflow="hidden"
    userSelect="none"
    onClick={onClick}
    verticalAlign="middle"
    whiteSpace="nowrap"
    d="inline-flex"
    lineHeight="0"
    {...rest}
  >
    {children}
  </Box>
));
export default Emoji;
