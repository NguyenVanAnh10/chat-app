import React from 'react';
import { Box, VStack } from '@chakra-ui/react';

const ListItem = ({
  header,
  footer,
  data = [],
  onClickItem,
  spacing,
  mt,
  renderItem = () => {},
}) => (
  <Box>
    {header && <Box>{header}</Box>}
    <VStack mt={mt || '5'} spacing={spacing || 2} alignItems="flex-start">
      {data.map(d => renderItem(d))}
    </VStack>
    {footer && <Box>{footer}</Box>}
  </Box>
);

export default ListItem;
