/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/jsx-filename-extension */
import {
  SymbolIcon, EmojiIcon, ActivityIcon,
  TravelIcon, CakeIcon, ObjectIcon,
  FlagIcon, AnimalIcon, ClockIcon,
} from 'components/CustomIcons';

export default [
  {
    key: 'frequently_used',
    title: 'Frequently Used',
    icon: <ClockIcon />,
  },
  {
    key: 'feelings_and_people',
    title: 'Feelings & People',
    icon: <EmojiIcon />,
  },
  {
    key: 'symbols',
    title: 'Symbols',
    icon: <SymbolIcon />,
  },
  {
    key: 'travel_and_places',
    title: 'Travel & Places',
    icon: <TravelIcon />,
  },
  {
    key: 'food_and_drink',
    title: 'Food & Drink',
    icon: <CakeIcon />,
  },
  {
    key: 'objects',
    title: 'Objects',
    icon: <ObjectIcon />,
  },
  {
    key: 'activity',
    title: 'Activity',
    icon: <ActivityIcon />,
  },
  {
    key: 'animals_and_nature',
    title: 'Animals & Nature',
    icon: <AnimalIcon />,
  },
  {
    key: 'flags',
    title: 'Flags',
    icon: <FlagIcon />,
  },

];
