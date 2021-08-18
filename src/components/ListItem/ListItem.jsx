import React from 'react';
import { Box, Center, Spinner, VStack } from '@chakra-ui/react';

import EmptyList from 'components/EmptyList';

const ListItem = ({
  header,
  footer,
  data = [],
  emptyText,
  spacing,
  loading,
  hideEmptyBox = false,
  bodyCss = {},
  renderItem = () => {},
  ...rest
}) => (
  <VStack w="100%" h="100%" {...rest}>
    {header && (
      <Box w="100%" p="1">
        {header}
      </Box>
    )}
    {loading && (
      <Center w="100%">
        <Spinner thickness="3px" speed="0.65s" emptyColor="gray.200" color="blue.300" size="lg" />
      </Center>
    )}
    {data.length && !loading && (
      <VStack
        w="100%"
        mt="5"
        spacing={spacing || 2}
        alignItems="flex-start"
        overflow="auto"
        {...bodyCss}
      >
        {data.map(d => renderItem(d))}
      </VStack>
    )}
    {!data.length && !loading && !hideEmptyBox && <EmptyList pt="6" content={emptyText} />}
    {footer && <Box w="100%">{footer}</Box>}
  </VStack>
);

export default ListItem;
