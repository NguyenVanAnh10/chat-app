import { AccountContext } from "App";
import { useModel } from "model";
import { useContext } from "react";

// TODO refactor
const useRoom = (roomId) => {
  const { account } = useContext(AccountContext);

  const [{ messages, room }, { haveSeenNewMessages }] = useModel(
    "message",
    ({ messages, rooms, getRooms }) => ({
      messages,
      room: rooms[roomId] || {},
    })
  );
  if (!roomId || !account._id) return [{}, {}];

  const newNumberMessagesInRoom = Object.keys(messages).filter(
    (id) =>
      messages[id] &&
      messages[id].roomId === roomId &&
      messages[id].hadSeenMessageUsers &&
      !messages[id].hadSeenMessageUsers.includes(account._id)
  ).length;
  return [
    {
      room: {
        ...room,
        otherMembers: room.members.filter((m) => m._id !== account._id),
        newMessageNumber: newNumberMessagesInRoom,
        userName:
          room.userName ||
          room.members.find((m) => m._id !== account._id)?.userName,
      },
    },
    { haveSeenNewMessages },
  ];
};

export default useRoom;
