import React from "react";
import { Box, SkeletonText } from "@chakra-ui/react";

const MessageListCard = ({ loading, className, children, ...rest }) => {
  if (loading)
    return (
      <Box className={className} {...rest}>
        <SkeletonText mt="8" w="40%" noOfLines={3} spacing="3" />
        <SkeletonText mt="8" ml="auto" w="40%" noOfLines={3} spacing="3" />
        <SkeletonText mt="8" w="40%" noOfLines={3} spacing="3" />
        <SkeletonText mt="8" ml="auto" w="40%" noOfLines={3} spacing="3" />
      </Box>
    );
  return (
    <Box className={className} {...rest}>
      {children}
    </Box>
  );
};
export default MessageListCard;
