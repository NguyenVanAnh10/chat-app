import React, { useContext } from 'react';
import { Alert,
  AlertDescription,
  AlertIcon,
  Avatar,
  AvatarBadge,
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
  useBreakpointValue,
  useDisclosure } from '@chakra-ui/react';
import { ProfileIcon, LogoutIcon, UserIcon } from 'components/CustomIcons';

import { AccountContext } from 'App';
import { useModel } from 'model';
import UpdateAccountInfoModal from 'components/UpdateAccountInfoModal/UpdateAccountInfoModal';

const UserMenu = () => {
  const isMobileScreen = useBreakpointValue({ base: true, md: false });
  const { account } = useContext(AccountContext);

  if (isMobileScreen) {
    return (
      <UserMenuContainer
        p="5"
        flex="1"
        color="white"
        _focus="none"
        h="auto"
        lineHeight="0"
        bg="transparent"
        borderRadius="none"
        _active={{ bg: 'blue.400' }}
        _hover={{ bg: 'blue.300' }}
      >
        <Icon fontSize="1.5rem" as={UserIcon} />
      </UserMenuContainer>
    );
  }
  return (
    <UserMenuContainer
      w="100%"
      pb="7"
    >
      <Avatar name={account.userName} src={account.avatar}>
        <AvatarBadge boxSize="0.8em" bg={account.online ? 'green.500' : 'gray.300'} />
      </Avatar>
    </UserMenuContainer>
  );
};

const UserMenuContainer = ({ children, ...rest }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    onClose: onCloseAccountModal,
    onOpen: onOpenAccountModal,
    isOpen: isOpenAccountModal,
  } = useDisclosure();
  return (
    <>
      <Menu>
        <MenuButton
          {...rest}
        >
          {children}
        </MenuButton>
        <MenuList>
          <MenuItem
            p="3"
            lineHeight="0"
            icon={<ProfileIcon verticalAlign="middle" />}
            onClick={onOpenAccountModal}
          >
            Profile
          </MenuItem>
          <MenuDivider />
          <MenuItem
            p="3"
            lineHeight="0"
            icon={<LogoutIcon verticalAlign="middle" />}
            onClick={onOpen}
            color="red"
          >
            Logout
          </MenuItem>
        </MenuList>
      </Menu>
      <LogoutModal isOpen={isOpen} onClose={onClose} />
      <UpdateAccountInfoModal isOpen={isOpenAccountModal} onClose={onCloseAccountModal} />
    </>
  );
};

const selector = ({ logout }) => ({
  loading: logout.loading,
  error: logout.error,
});

const LogoutModal = ({ isOpen, onClose }) => {
  const [{ loading, error }, { logout }] = useModel('account', selector);
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
export default UserMenu;
