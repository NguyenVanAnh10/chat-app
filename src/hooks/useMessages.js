import { useContext, useEffect as useReactEffect, useMemo } from 'react';

import { useModel } from 'model';
import { AccountContext } from 'App';

const opts = { fetchData: false };

const selector = ({ messages, getMessages, rooms }) => ({
  mesagesState: getMessages,
  messages,
  rooms,
});
const useMessages = (roomId, options = opts) => {
  const {
    account: { id: userId },
  } = useContext(AccountContext);

  const cachedKey = roomId || 'all';
  const [
    { messages, mesagesState, rooms },
    { getMessages, sendMessage, seeMessages },
  ] = useModel('message', selector);

  const total = rooms[cachedKey]?.messageIds?.length || 0;
  // TODO
  useReactEffect(() => {
    roomId
      && userId
      && options.fetchData
      && (!mesagesState[cachedKey]
      || (mesagesState[cachedKey]?.ids?.length < 20
        && mesagesState[cachedKey]?.ids?.length < total))
      && getMessages({ roomId, userId, limit: 20, skip: 0, cachedKey });
  }, [roomId, userId]);

  const loadMoreMessages = ({ roomId: chatRoomId, limit, skip }) => {
    chatRoomId
      && userId
      && getMessages({ roomId: chatRoomId, userId, limit, skip, cachedKey });
  };

  if (!roomId || !userId) return [{ messages: [] }, {}];

  const aggregateMessages = useMemo(() => (mesagesState[cachedKey]?.ids || [])
    .map(id => messages[id])
    .sort((msg1, msg2) => {
      if (msg1.createAt > msg2.createAt) return 1;
      if (msg1.createAt < msg2.createAt) return -1;
      return 0;
    }).reduce((s, c, index, msgArr) => {
      if (!index || msgArr[index - 1].senderId !== c.senderId) {
        return [...s, c];
      }
      return [
        ...(s.length > 1 ? s.slice(0, s.length - 1) : []),
        {
          ...c,
          aggregateMsg: s[s.length - 1]?.aggregateMsg
            ? [...s[s.length - 1]?.aggregateMsg, c]
            : [s[s.length - 1], c],
        },
      ];
    }, []), [messages, cachedKey]);

  return [
    {
      total,
      aggregateMessages,
      messages: (mesagesState[cachedKey]?.ids || [])
        .map(id => messages[id])
        .sort((msg1, msg2) => {
          if (msg1.createAt > msg2.createAt) return 1;
          if (msg1.createAt < msg2.createAt) return -1;
          return 0;
        }),
      getMessagesState: mesagesState[cachedKey] || {},
    },
    { getMessages, sendMessage, seeMessages, loadMoreMessages },
  ];
};
export default useMessages;
