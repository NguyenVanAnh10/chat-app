/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/react-in-jsx-scope */
import { ContactBookIcon, NotificationBellIcon } from 'components/CustomIcons';
import { ChatIcon } from '@chakra-ui/icons';
import Message from 'layouts/Navigation/Message';
import ContactBook from 'layouts/Navigation/ContactBook';
import Notification from 'layouts/Navigation/Notification';

export const menuKeys = {
  MESSAGES: 'MESSAGES',
  CONTACT_BOOK: 'CONTACT_BOOK',
  NOTIFICATION: 'NOTIFICATION',
  ACCOUNT: 'ACCOUNT',
};

const configs = {
  baseAPI: process.env.REACT_APP_BASE_API || '/api/v1',
  menus: [
    {
      id: menuKeys.MESSAGES,
      title: 'Messages',
      render: ({ id }) => <Message key={id} icon={ChatIcon} />,
    },
    {
      id: menuKeys.CONTACT_BOOK,
      title: 'Contact Book',
      render: ({ id }) => <ContactBook key={id} icon={ContactBookIcon} />,
    },
    {
      id: menuKeys.NOTIFICATION,
      title: 'Notification',
      render: ({ id }) => <Notification key={id} icon={NotificationBellIcon} />,
    },
  ],
};

export default configs;
