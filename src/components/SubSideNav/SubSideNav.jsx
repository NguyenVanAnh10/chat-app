import React, { useContext } from "react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Avatar,
  AvatarBadge,
  Box,
  Button,
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
  useDisclosure,
  VStack,
} from "@chakra-ui/react";

import { AccountContext } from "App";
import { useModel } from "model";
import configs from "configs/configs";
import NewMessageBadge from "components/NewMessageBadge";
import { MenuContext } from "contexts/menuContext";
import { menuKeys } from "configs/configs";
import NotificationDrawers from "components/NotificationDrawer/NotificationDrawers";

const badges = {
  [menuKeys.MESSAGES]: <NewMessageBadge />,
};

const SubSideNav = () => {
  const { menuState, setMenuState } = useContext(MenuContext);
  const menus = configs.menus.map((m) => ({ ...m, badge: badges[m.id] }));
  const {
    onClose: onCloseNotificationDrawer,
    onOpen: onOpenNotificationDrawer,
    isOpen: isOpenNotificationDrawer,
  } = useDisclosure();
  const handleClick = (menu) => {
    if (menuKeys.NOTIFICATION === menu.id) {
      onOpenNotificationDrawer();
      return;
    }
    menuState.active !== menu.id &&
      setMenuState((prev) => ({ ...prev, active: menu.id }));
  };
  return (
    <Box bg="orange.200" w="65px" py="4" zIndex="4">
      <AvatarMenu />
      <VStack spacing="0" mt="10">
        {menus.map((m) => {
          return (
            <Button
              key={m.id}
              py="5"
              w="100%"
              h="auto"
              color="white"
              _focus="none"
              bg="transparent"
              borderRadius="none"
              _active={{ bg: "orange.400" }}
              _hover={{ bg: "orange.300" }}
              isActive={menuState.active === m.id}
              onClick={() => handleClick(m)}
            >
              <Icon fontSize="1.7rem" as={m.icon} />
              {!!m.badge && m.badge}
            </Button>
          );
        })}
      </VStack>
      <NotificationDrawers
        isOpen={isOpenNotificationDrawer}
        onClose={onCloseNotificationDrawer}
      />
    </Box>
  );
};

const AvatarMenu = () => {
  const { account } = useContext(AccountContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Menu>
        <MenuButton h="fit-content" d="block" mx="auto">
          <Avatar name={account.userName} onClick={onOpen}>
            <AvatarBadge boxSize="0.8em" bg="green.500" />
          </Avatar>
        </MenuButton>
        <MenuList>
          <MenuItem>Profile</MenuItem>
          <MenuDivider />
          <MenuItem onClick={onOpen}>Logout</MenuItem>
        </MenuList>
      </Menu>
      <LogoutModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};
const LogoutModal = ({ isOpen, onClose }) => {
  const [{ loading, error }, { logout }] = useModel(
    "account",
    ({ logout: { loading, error } }) => ({
      loading,
      error,
    })
  );
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
                {error.message || "Something went wrong"}
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
