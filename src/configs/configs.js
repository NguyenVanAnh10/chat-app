import { ContactBookIcon, NotificationBellIcon } from 'components/CustomIcons';
import { ChatIcon } from '@chakra-ui/icons';

export const menuKeys = {
  MESSAGES: 'MESSAGES',
  CONTACT_BOOK: 'CONTACT_BOOK',
  NOTIFICATION: 'NOTIFICATION',
  ACCOUNT: 'ACCOUNT',
};

const configs = {
  baseAPI: process.env.REACT_APP_BASE_API,
  menus: [
    {
      id: menuKeys.MESSAGES,
      title: 'Messages',
      icon: ChatIcon,
    },
    {
      id: menuKeys.CONTACT_BOOK,
      title: 'Contact Book',
      icon: ContactBookIcon,
    },
    {
      id: menuKeys.NOTIFICATION,
      title: 'Notification',
      icon: NotificationBellIcon,
    },
  ],
};

export default configs;
