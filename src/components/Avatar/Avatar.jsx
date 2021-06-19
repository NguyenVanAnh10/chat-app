import React from 'react';
import { Avatar as CAvatar } from '@chakra-ui/react';

const Avatar = props => (
  <CAvatar
    loading="lazy"
    showBorder
    {...props}
  />
);

export default Avatar;
