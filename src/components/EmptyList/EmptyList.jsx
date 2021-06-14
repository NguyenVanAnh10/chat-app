import React from 'react';
import { Image, Text, VStack } from '@chakra-ui/react';

import emptyImg from 'statics/images/empty.png';

const EmptyList = ({ content, ...rest }) => (
  <VStack pt="20" {...rest}>
    <Image src={emptyImg} maxW="3rem" opacity="0.3" />
    <Text fontSize="sm" color="gray.500">{content || 'No item'}</Text>
  </VStack>
);
export default EmptyList;
