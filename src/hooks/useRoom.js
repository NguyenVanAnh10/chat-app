import { useContext, useEffect as useReactEffect } from 'react';

import { AccountContext } from 'App';
import { useModel } from 'model';
import { menuKeys } from 'configs/configs';

// TODO refactor
const useRoom = roomId => {
  const { account } = useContext(AccountContext);

  const [{ messages, rooms }, { haveSeenNewMessages }] = useModel(
    'message',
    ({ messages, rooms }) => ({ messages, rooms }),
  );
  if (!roomId || !account._id || !rooms[roomId] || !rooms[roomId].members) { return [{ room: {} }, {}]; }

  const newNumberMessagesInRoom = Object.keys(messages).filter(
    id => messages[id]
      && messages[id].roomId === roomId
      && messages[id].hadSeenMessageUsers
      && !messages[id].hadSeenMessageUsers.includes(account._id),
  ).length;
  return [
    {
      room: {
        ...rooms[roomId],
        otherMembers: rooms[roomId].members.filter(
          m => m._id !== account._id,
        ),
        newMessageNumber: newNumberMessagesInRoom,
        userName:
          rooms[roomId]?.userName
          || rooms[roomId]?.members?.find(m => m._id !== account._id)?.userName,
      },
    },
    { haveSeenNewMessages },
  ];
};
// typeRooms: messages | notMessages | contactBook |all
export const useRooms = typeRooms => {
  const { account } = useContext(AccountContext);
  const [
    { messageRooms, notMessageRooms, withoutGroupRooms, rooms },
    { getRooms, haveSeenNewMessages },
  ] = useModel('message', ({ messages, getRooms, rooms }) => ({
    messages,
    messageRooms: (getRooms.ids || [])
      .filter(id => !!rooms[id]?.messageIds?.length)
      .map(id => rooms[id])
      .map(room => ({
        ...room,
        newMessageNumber: room.messageIds?.filter(
          msgId => messages[msgId]?.hadSeenMessageUsers
            && !messages[msgId].hadSeenMessageUsers?.includes(account._id),
        )?.length,
        otherMembers: room.members?.filter(m => m._id !== account._id),
        userName:
          room.name
          || room.members?.find(m => m._id !== account._id)?.userName,
      })),
    notMessageRooms: (getRooms.ids || [])
      .filter(id => !rooms[id]?.messageIds?.length)
      .map(id => ({
        ...rooms[id],
        otherMembers: rooms[id].members?.filter(m => m._id !== account._id),
        userName:
          rooms[id].name
          || rooms[id].members?.find(m => m._id !== account._id)?.userName,
      })),
    withoutGroupRooms: (getRooms.ids || [])
      .filter(id => rooms[id].members?.length === 2)
      .map(id => ({
        ...rooms[id],
        otherMembers: rooms[id].members?.filter(m => m._id !== account._id),
        userName:
          rooms[id].name
          || rooms[id].members?.find(m => m._id !== account._id)?.userName,
      })),
    rooms: (getRooms.ids || []).map(id => ({
      ...rooms[id],
      otherMembers: rooms[id].members?.filter(m => m._id !== account._id),
      userName:
        rooms[id].name
        || rooms[id].members?.find(m => m._id !== account._id)?.userName,
    })),
  }));

  useReactEffect(() => {
    account._id && getRooms(account._id);
  }, [account._id]);

  if (!account._id) return [{}, {}];

  switch (typeRooms) {
    case menuKeys.MESSAGES:
      return [{ rooms: messageRooms }, { haveSeenNewMessages }];
    case 'notMessages':
      return [{ rooms: notMessageRooms }, { haveSeenNewMessages }];
    case 'all':
      return [{ rooms }, { haveSeenNewMessages }];
    case menuKeys.CONTACT_BOOK:
      return [{ rooms: withoutGroupRooms }, { haveSeenNewMessages }];
    default:
      // no params
      return [
        { messageRooms, notMessageRooms, rooms },
        { haveSeenNewMessages },
      ];
  }
};

export default useRoom;
