import React from 'react';
import {
  Box, Button, Heading, Image, Text, VStack,
} from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';

import exceptionImage from 'statics/images/warning.png';

const ExceptionPage = () => {
  const history = useHistory();
  return (
    <VStack minH="100vh" justify="center" spacing="5" bg="white">
      <Image w="8rem" src={exceptionImage} alt="excepion page" />
      <Box textAlign="center">
        <Heading as="h3" fontSize="3xl">
          404
        </Heading>
        <Text color="gray.600">
          Sorry, the page you visited does not exist.
        </Text>
      </Box>
      <Button colorScheme="blue" onClick={() => history.push('/')}>
        Go Home
      </Button>
    </VStack>
  );
};
export default ExceptionPage;
