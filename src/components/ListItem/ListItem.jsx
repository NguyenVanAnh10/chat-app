import React from "react";
import { Box, VStack } from "@chakra-ui/react";

const ListItem = ({
  header,
  footer,
  data = [],
  onClickItem,
  renderItem = () => {},
}) => {
  return (
    <Box>
      {header && <Box>{header}</Box>}
      <VStack marginTop="5" alignItems="flex-start">
        {data.map((d) => renderItem(d))}
      </VStack>
      {footer && <Box>{footer}</Box>}
    </Box>
  );
};

export default ListItem;
