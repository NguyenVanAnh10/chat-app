import React from 'react';
import { Center, Spinner } from '@chakra-ui/react';

export default function EmojiPickerLoading() {
  return (
    <Center w="320px" h="380px">
      <Spinner
        thickness="2px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.400"
        size="md"
      />
    </Center>
  );
}
