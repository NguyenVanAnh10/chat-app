import { useContext, useEffect as useReactEffect } from 'react';

import { AccountContext } from 'App';
import { useModel } from 'model';
import { menuKeys } from 'configs/configs';

const roomSelector = ({ messages, rooms }) => ({ messages, rooms });

const useRoom = roomId => {
  const { account } = useContext(AccountContext);

  const [{ messages, rooms }, { haveSeenNewMessages }] = useModel('message', roomSelector);
  if (!roomId || !account.id || !rooms[roomId]) {
    return [{ room: {} }, {}];
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
            && !!messages[id]?.hadSeenMessageUsers
            && !messages[id].hadSeenMessageUsers.includes(account.id),
        ).length,
        userName:
          rooms[roomId]?.userName
          || rooms[roomId]?.members?.find(m => m.id !== account.id)?.userName,
      },
    },
    { haveSeenNewMessages },
  ];
};

const roomsSelector = account => ({ messages, getRooms, rooms }) => ({
  messages,
  rooms: (getRooms.ids || []).map(id => ({
    ...rooms[id],
    otherMembers: rooms[id].members?.filter(m => m.id !== account.id),
    newMessageNumber: rooms[id].messageIds?.filter(
      msgId => !!messages[msgId]?.hadSeenMessageUsers
      && !messages[msgId].hadSeenMessageUsers.includes(account.id),
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
    { getRooms, haveSeenNewMessages },
  ] = useModel('message', roomsSelector(account));

  useReactEffect(() => {
    account.id && getRooms(account.id);
  }, [account.id]);

  if (!account.id) return [{}, {}];

  switch (typeRooms) {
    case menuKeys.MESSAGES:
      return [{ rooms: rooms.filter(room => !!room.messageIds?.length) }, { haveSeenNewMessages }];
    case 'notMessages':
      return [{ rooms: rooms.filter(room => !room.messageIds?.length) }, { haveSeenNewMessages }];
    case menuKeys.CONTACT_BOOK:
      return [{ rooms: rooms.filter(room => room.members?.length === 2) }, { haveSeenNewMessages }];
    case 'all':
      return [{ rooms }, { haveSeenNewMessages }];
    default:
      // no params
      return [
        {
          messageRooms: rooms.filter(room => !!room.messageIds?.length),
          notMessageRooms: rooms.filter(room => !room.messageIds?.length),
          rooms,
        },
        { haveSeenNewMessages },
      ];
  }
};

export default useRoom;
