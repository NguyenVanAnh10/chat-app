import { useContext, useEffect as useReactEffect } from 'react';

import { AccountContext } from 'App';
import { useModel } from 'model';
import { menuKeys } from 'configs/configs';

const roomSelector = ({ messages, rooms, seeMessages }) => ({
  messages,
  rooms,
  seeMessages,
});

const useRoom = roomId => {
  const { account } = useContext(AccountContext);

  const [{ messages, rooms, seeMessages: seeMessagesState }, { seeMessages }] = useModel('message',
    roomSelector);

  if (!roomId || !account.id || !rooms[roomId]) {
    return [{ room: {}, seeMessagesState: {} }, {}];
  }

  return [
    {
      room: {
        ...rooms[roomId],
        otherMembers: rooms[roomId].members.filter(
          m => m.id !== account.id,
        ),
        newMessageNumber: Object.keys(messages).filter(
          id => messages[id]?.roomId === roomId
            && !!messages[id]?.usersSeenMessage
            && !messages[id].usersSeenMessage.includes(account.id),
        ).length,
        userName:
          rooms[roomId]?.userName
          || rooms[roomId]?.members?.find(m => m.id !== account.id)?.userName,
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
    otherMembers: rooms[id].members?.filter(m => m.id !== account.id),
    newMessageNumber: rooms[id].messageIds?.filter(
      msgId => !!messages[msgId]?.usersSeenMessage
      && !messages[msgId].usersSeenMessage.includes(account.id),
    )?.length,
    userName:
      rooms[id].name
      || rooms[id].members?.find(m => m.id !== account.id)?.userName,
  })),
});
// typeRooms: messages | notMessages | contactBook |all
export const useRooms = typeRooms => {
  const { account } = useContext(AccountContext);
  const [
    { rooms },
    { getRooms, seeMessages },
  ] = useModel('message', roomsSelector(account));

  useReactEffect(() => {
    account.id && getRooms(account.id);
  }, [account.id]);

  if (!account.id) return [{}, {}];

  switch (typeRooms) {
    case menuKeys.MESSAGES:
      return [{ rooms: rooms.filter(room => !!room.messageIds?.length) }, { seeMessages }];
    case 'notMessages':
      return [{ rooms: rooms.filter(room => !room.messageIds?.length) }, { seeMessages }];
    case menuKeys.CONTACT_BOOK:
      return [{ rooms: rooms.filter(room => room.members?.length === 2) }, { seeMessages }];
    case 'all':
      return [{ rooms }, { seeMessages }];
    default:
      // no params
      return [
        {
          messageRooms: rooms.filter(room => !!room.messageIds?.length),
          notMessageRooms: rooms.filter(room => !room.messageIds?.length),
          rooms,
        },
        { seeMessages },
      ];
  }
};

export default useRoom;
