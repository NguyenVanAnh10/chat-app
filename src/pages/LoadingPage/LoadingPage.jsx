import React from 'react';
import { Center, Spinner } from '@chakra-ui/react';

export default function LoadingPage() {
  return (
    <Center minH="100vh">
      <Spinner
        thickness="3px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.400"
        size="lg"
      />
    </Center>
  );
}
