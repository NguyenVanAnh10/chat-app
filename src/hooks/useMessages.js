import { useEffect as useReactEffect } from "react";
import qs from "query-string";

import { useModel } from "model";

const opts = { fetchData: false };

const useMessages = (roomId, userId, options = opts) => {
  const cachedKey = qs.stringify({ roomId, userId });
  const [
    { messages, mesagesState },
    { getMessages, sendMessage, haveSeenNewMessages },
  ] = useModel("message", ({ messages, getMessages }) => ({
    mesagesState: getMessages,
    messages,
  }));

  useReactEffect(() => {
    roomId &&
      userId &&
      options.fetchData &&
      !mesagesState[cachedKey] &&
      getMessages({ roomId, userId });
  }, [roomId, userId]);

  if (!roomId || !userId) return [{ messages: [] }, {}];
  return [
    {
      messages: (mesagesState[cachedKey]?.ids || [])
        .map((id) => messages[id])
        .filter((m) => m.roomId === roomId),
      loading: mesagesState[cachedKey]?.loading,
    },
    { getMessages, sendMessage, haveSeenNewMessages },
  ];
};
export default useMessages;
