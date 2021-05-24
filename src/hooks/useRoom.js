import { AccountContext } from "App";
import { useModel } from "model";
import { useContext } from "react";

// TODO refactor
const useRoom = (roomId) => {
  const { account } = useContext(AccountContext);

  const [{ messages, rooms }, { haveSeenNewMessages }] = useModel(
    "message",
    ({ messages, rooms }) => ({ messages, rooms })
  );
  if (!roomId || !account._id || !rooms[roomId] || !rooms[roomId].members)
    return [{ room: {} }, {}];

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
        ...rooms[roomId],
        otherMembers: rooms[roomId].members.filter(
          (m) => m._id !== account._id
        ),
        newMessageNumber: newNumberMessagesInRoom,
        userName:
          rooms[roomId]?.userName ||
          rooms[roomId]?.members?.find((m) => m._id !== account._id)?.userName,
      },
    },
    { haveSeenNewMessages },
  ];
};

export default useRoom;
