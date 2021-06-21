import { useContext, useEffect as useReactEffect, useMemo } from 'react';

import { AccountContext } from 'App';
import { useModel } from 'model';
import { menuKeys } from 'configs/configs';
import useUsers from './useUsers';

const roomSelector = ({ messages, rooms, seeMessages }) => ({
  messages,
  rooms,
  seeMessages,
});
const useRoom = roomId => {
  const { account } = useContext(AccountContext);
  const [{ users }] = useUsers();
  const [{ messages, rooms, seeMessages: seeMessagesState }, { seeMessages }] = useModel('message',
    roomSelector);

  if (!roomId || !account.id || !rooms[roomId]) {
    return [{ room: {}, seeMessagesState: {} }, {}];
  }

  return [
    {
      room: {
        ...rooms[roomId],
        membersObj: rooms[roomId]
          .userIds?.reduce((s, id) => ({
            ...s,
            [id]: id !== account.id ? users[id] || {} : account,
          }), {}) || {},
        members: rooms[roomId]
          .userIds?.map(id => id !== account.id ? users[id] || {} : account) || [],
        otherMembers: rooms[roomId].userIds?.filter(id => id !== account.id)
          .map(id => users[id] || {}),
        newMessageNumber: Object.keys(messages).filter(
          id => messages[id]?.roomId === roomId
            && !!messages[id]?.usersSeenMessage
            && !messages[id].usersSeenMessage.includes(account.id),
        ).length,
        userName:
          rooms[roomId].name
          || users[rooms[roomId].userIds?.find(id => id !== account.id)]?.userName,
      },
      seeMessagesState: seeMessagesState[roomId] || {},
    },
    { seeMessages },
  ];
};

const roomsSelector = account => ({ messages, getRooms, rooms }) => ({
  messages,
  rooms: (getRooms.ids || []).map(id => ({
    ...rooms[id],
    newMessageNumber: rooms[id].messageIds?.filter(
      msgId => !!messages[msgId]?.usersSeenMessage
      && !messages[msgId].usersSeenMessage.includes(account.id),
    )?.length,
  })),
});
// typeRooms: messages | notMessages | contactBook |all
export const useRooms = typeRooms => {
  const { account } = useContext(AccountContext);
  const [{ users }, { getUsers }] = useUsers();
  const [
    { rooms },
    { getRooms, seeMessages },
  ] = useModel('message', roomsSelector(account));

  useReactEffect(() => {
    account.id && !rooms.length && getRooms(account.id);
  }, [account.id]);

  useReactEffect(() => {
    const userIds = [];
    rooms.forEach(room => room.userIds?.forEach(id => {
      if (!users[id] && !userIds.includes(id) && account.id !== id) userIds.push(id);
    }));
    if (!userIds.length) return;
    getUsers({ cachedKey: userIds.join(','), userIds: userIds.join(',') });
  }, [rooms]);

  if (!account.id) return [{}, {}];

  const aggregateRooms = useMemo(() => rooms.map(room => ({
    ...room,
    members: room.userIds?.map(id => id !== account.id ? users[id] || {} : account),
    otherMembers: room.userIds?.filter(id => id !== account.id)
      .map(id => users[id] || {}),
    userName: room.name
       || users.[room.userIds?.find(id => id !== account.id)]?.userName,
  })), [rooms, users]);

  switch (typeRooms) {
    case menuKeys.MESSAGES:
      return [{ rooms: aggregateRooms.filter(room => !!room.messageIds?.length
        || room.userIds?.length > 2) }, { seeMessages }];
    case 'notMessages':
      return [{ rooms: aggregateRooms.filter(room => !room.messageIds?.length) }, { seeMessages }];
    case menuKeys.CONTACT_BOOK:
      return [{
        rooms: aggregateRooms.filter(room => room.members?.length === 2),
      },
      { seeMessages }];
    case 'all':
      return [{ rooms }, { seeMessages }];
    default:
      // no params
      return [
        {
          messageRooms: aggregateRooms.filter(room => !!room.messageIds?.length),
          notMessageRooms: aggregateRooms.filter(room => !room.messageIds?.length),
          rooms: aggregateRooms,
        },
        { seeMessages },
      ];
  }
};

export default useRoom;
