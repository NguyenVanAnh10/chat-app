import React, { useContext } from 'react';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AvatarBadge,
  Box,
  Button,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useBreakpointValue,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';

import { AccountContext } from 'App';
import { useModel } from 'model';
import configs, { menuKeys } from 'configs/configs';
import NewMessageBadge from 'components/NewMessageBadge';
import { MenuContext } from 'contexts/menuContext';
import NotificationDrawers from 'components/NotificationDrawer';
import NewNotificationBadge from 'components/NewNotificationsBadge';
import { UserIcon } from 'components/CustomIcons';
import UpdateAccountInfoModal from 'components/UpdateAccountInfoModal';
import Avatar from 'components/Avatar';

const badges = {
  [menuKeys.MESSAGES]: <NewMessageBadge />,
  [menuKeys.NOTIFICATION]: <NewNotificationBadge />,
};

const SubSideNav = () => {
  const { menuState, setMenuState } = useContext(MenuContext);
  const menus = configs.menus.map(m => ({ ...m, badge: badges[m.id] }));
  const {
    onClose: onCloseNotificationDrawer,
    onOpen: onOpenNotificationDrawer,
    isOpen: isOpenNotificationDrawer,
  } = useDisclosure();
  const isMobileScreen = useBreakpointValue({ base: true, md: false });
  const {
    onClose: onCloseAccountModal,
    onOpen: onOpenAccountModal,
    isOpen: isOpenAccountModal,
  } = useDisclosure();

  const handleClick = menu => {
    switch (menu?.id || menu) {
      case menuKeys.NOTIFICATION:
        onOpenNotificationDrawer();
        return;
      case menuKeys.ACCOUNT:
        onOpenAccountModal();
        return;
      default:
        menuState.active !== menu.id
          && setMenuState(prev => ({ ...prev, active: menu.id }));
    }
  };
  if (isMobileScreen) {
    return (
      <Box
        bg="orange.200"
        w="100%"
        zIndex="4"
        pos="fixed"
        bottom="0"
        left="0"
        right="0"
      >
        <HStack spacing="0">
          {menus.map(m => (
            <Button
              key={m.id}
              py="4"
              w="100%"
              h="auto"
              color="white"
              _focus="none"
              bg="transparent"
              borderRadius="none"
              _active={{ bg: 'orange.400' }}
              _hover={{ bg: 'orange.300' }}
              isActive={menuState.active === m.id}
              onClick={() => handleClick(m)}
            >
              <Icon fontSize="1.3rem" as={m.icon} />
              {!!m.badge && m.badge}
            </Button>
          ))}
          <Button
            py="4"
            w="100%"
            h="auto"
            color="white"
            _focus="none"
            bg="transparent"
            borderRadius="none"
            _active={{ bg: 'orange.400' }}
            _hover={{ bg: 'orange.300' }}
            onClick={() => handleClick(menuKeys.ACCOUNT)}
          >
            <Icon fontSize="1.3rem" as={UserIcon} />
          </Button>
        </HStack>
        <NotificationDrawers
          isOpen={isOpenNotificationDrawer}
          onClose={onCloseNotificationDrawer}
        />
        <UpdateAccountInfoModal isOpen={isOpenAccountModal} onClose={onCloseAccountModal} />
      </Box>
    );
  }
  return (
    <Box bg="orange.200" w="65px" py="4" zIndex="4">
      <AvatarMenu onOpenProfile={() => handleClick(menuKeys.ACCOUNT)} />
      <VStack spacing="0" mt="10">
        {menus.map(m => (
          <Button
            key={m.id}
            py="5"
            w="100%"
            h="auto"
            color="white"
            _focus="none"
            bg="transparent"
            borderRadius="none"
            _active={{ bg: 'orange.400' }}
            _hover={{ bg: 'orange.300' }}
            isActive={menuState.active === m.id}
            onClick={() => handleClick(m)}
          >
            <Icon fontSize="1.7rem" as={m.icon} />
            {!!m.badge && m.badge}
          </Button>
        ))}
      </VStack>
      <NotificationDrawers
        isOpen={isOpenNotificationDrawer}
        onClose={onCloseNotificationDrawer}
      />
      <UpdateAccountInfoModal isOpen={isOpenAccountModal} onClose={onCloseAccountModal} />
    </Box>
  );
};

const AvatarMenu = ({ onOpenProfile }) => {
  const { account } = useContext(AccountContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Menu>
        <MenuButton h="fit-content" d="block" mx="auto">
          <Avatar name={account.userName} src={account.avatar} onClick={onOpen}>
            <AvatarBadge boxSize="0.8em" bg="green.500" />
          </Avatar>
        </MenuButton>
        <MenuList>
          <MenuItem onClick={onOpenProfile}>Profile</MenuItem>
          <MenuDivider />
          <MenuItem onClick={onOpen}>Logout</MenuItem>
        </MenuList>
      </Menu>
      <LogoutModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};
const selectorLogout = ({ logout }) => ({
  loading: logout.loading,
  error: logout.error,
});
const LogoutModal = ({ isOpen, onClose }) => {
  const [{ loading, error }, { logout }] = useModel('account', selectorLogout);
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Logout</ModalHeader>
        <ModalCloseButton />
        {error && (
          <ModalBody>
            <Alert status="error" marginTop="5">
              <AlertIcon />
              <AlertDescription>
                {error.message || 'Something went wrong'}
              </AlertDescription>
            </Alert>
          </ModalBody>
        )}
        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            cancel
          </Button>
          <Button colorScheme="red" isLoading={loading} onClick={logout}>
            Logout
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default SubSideNav;
