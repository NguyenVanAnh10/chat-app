import React, { useContext } from "react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Avatar,
  AvatarBadge,
  Box,
  Button,
  IconButton,
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
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { ChatIcon } from "@chakra-ui/icons";

import { AccountContext } from "App";
import { useModel } from "model";

const SubSideNav = ({ isActive, onShowMainSideNav }) => {
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
    <VStack bg="red.100" w="65px" py="4">
      <AvatarMenu />
      <Box
        w="100%"
        py="4"
        position="relative"
        bg={isActive ? "pink.200" : "transparent"}
      >
        <IconButton
          margin="0 auto !important"
          display="block"
          _focus="none"
          _active="none"
          _hover="none"
          bg="transparent !important"
          variant="ghost"
          borderRadius="none"
          onClick={onShowMainSideNav}
          icon={<ChatIcon boxSize="7" color="pink.500" />}
        />
        {!!newMessageNumber && (
          <Text
            position="absolute"
            left="10"
            top="2"
            borderRadius="100%"
            bg="red.500"
            color="white"
            fontSize="sm"
            fontWeight="bold"
            width="5"
            height="5"
            textAlign="center"
          >
            {newMessageNumber}
          </Text>
        )}
      </Box>
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
