import React, { useContext } from "react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Avatar,
  AvatarBadge,
  Badge,
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
import { ChatIcon } from "@chakra-ui/icons";

import { AccountContext } from "App";
import { useModel } from "model";

const SubSideNav = () => {
  const { account } = useContext(AccountContext);
  const [{ messages }] = useModel("message", ({ messages }) => ({ messages }));
  let newMessageNumber = 0;
  if (account._id) {
    newMessageNumber = Object.keys(messages).filter(
      (id) =>
        messages[id]?.hadSeenMessageUsers &&
        !messages[id].hadSeenMessageUsers?.includes(account._id)
    ).length;
  }
  return (
    <VStack bg="orange.200" w="65px" py="4" zIndex="4">
      <AvatarMenu />
      <Button
        isActive
        w="100%"
        d="block"
        h="auto"
        borderRadius="none"
        py="5"
        _focus="none"
        _active={{ bg: "orange.300" }}
        bg="orange.200 !important"
        colorScheme="orange"
      >
        <Icon fontSize="1.7rem" as={ChatIcon} />
        {!!newMessageNumber && (
          <Badge
            bg="red"
            color="white"
            padding="1px 3px"
            fontWeight="bold"
            textAlign="center"
            borderRadius="100%"
            fontSize="0.7rem"
            top="-3"
            pos="relative"
          >
            {newMessageNumber > 9 ? "+9" : newMessageNumber}
          </Badge>
        )}
      </Button>
    </VStack>
  );
};
const AvatarMenu = () => {
  const { account } = useContext(AccountContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Menu>
        <MenuButton h="fit-content">
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
