import React from 'react';
import { Box, VStack } from '@chakra-ui/react';

import EmptyList from 'components/EmptyList';

const ListItem = ({
  header,
  footer,
  data = [],
  emptyText,
  // onClickItem,
  spacing,
  mt,
  renderItem = () => {},
}) => (
  <Box h="100%">
    {header && <Box>{header}</Box>}
    {data.length
      ? (
        <VStack mt={mt || '5'} spacing={spacing || 2} alignItems="flex-start">
          {data.map(d => renderItem(d))}
        </VStack>
      )
      : <EmptyList content={emptyText} />}
    {footer && <Box>{footer}</Box>}
  </Box>
);

export default ListItem;
