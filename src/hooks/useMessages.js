import { useEffect as useReactEffect } from "react";

import { useModel } from "model";

const useMessages = (roomId, userId) => {
  const [{ msgs, loading }, { getMessages, sendMessage, haveSeenNewMessages }] =
    useModel("message", ({ messages, getMessages }) => ({
      messages,
      loading: getMessages.loading,
      msgs: (getMessages.ids || []).map((id) => messages[id]),
    }));

  useReactEffect(() => {
    roomId && userId && getMessages({ roomId, userId });
  }, [roomId, userId]);

  if (!roomId || !userId) return [{ messages: [] }, {}];
  return [
    { messages: msgs.filter((m) => m.roomId === roomId), loading },
    { getMessages, sendMessage, haveSeenNewMessages },
  ];
};
export default useMessages;
