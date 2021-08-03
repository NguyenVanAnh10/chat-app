import React from 'react';
import { Box, HStack, useBreakpointValue, VStack } from '@chakra-ui/react';

import configs, { menuKeys } from 'configs/configs';
import UserMenu from 'layouts/Navigation/UserMenu';

const SubSideNav = () => {
  const isMobileScreen = useBreakpointValue({ base: true, md: false });
  let { menus } = configs;
  if (isMobileScreen) {
    menus = [...menus, {
      id: menuKeys.ACCOUNT,
      render: ({ id }) => <UserMenu key={id} />,
    }];
    return (
      <Box
        bg="blue.600"
        w="100%"
        zIndex="4"
        pos="fixed"
        bottom="0"
        left="0"
        right="0"
      >
        <HStack spacing="0" fontSize="xl">
          {menus.map(m => m.render(m))}
        </HStack>
      </Box>
    );
  }
  menus = [{
    id: menuKeys.ACCOUNT,
    render: ({ id }) => <UserMenu key={id} />,
  }, ...menus];
  return (
    <Box bg="blue.600" w="65px" py="4" zIndex="4">
      <VStack spacing="0" mt="7">
        {menus.map(m => m.render(m))}
      </VStack>
    </Box>
  );
};

export default SubSideNav;
