import { useContext, useEffect as useReactEffect, useMemo } from 'react';

import { useModel } from 'model';
import { AccountContext } from 'App';

const opts = { fetchData: false };

const selector = ({ messages, getMessages, conversations }) => ({
  mesagesState: getMessages,
  messages,
  conversations,
});
const useMessages = (conversationId, options = opts) => {
  const {
    account: { id: userId },
  } = useContext(AccountContext);

  const cachedKey = conversationId || 'all';
  const [
    { messages, mesagesState, conversations },
    { getMessages, sendMessage, seeMessages },
  ] = useModel('message', selector);

  const total = conversations[cachedKey]?.messageIds?.length || 0;
  // TODO
  useReactEffect(() => {
    conversationId
      && userId
      && options.fetchData
      && (!mesagesState[cachedKey]
      || (mesagesState[cachedKey]?.ids?.length < 20
        && mesagesState[cachedKey]?.ids?.length < total))
      && getMessages({ conversationId, userId, limit: 20, skip: 0, cachedKey });
  }, [conversationId, userId]);

  const loadMoreMessages = ({ conversationId: chatconversationId, limit, skip }) => {
    chatconversationId
      && userId
      && getMessages({ conversationId: chatconversationId, userId, limit, skip, cachedKey });
  };

  if (!conversationId || !userId) return [{ messages: [] }, {}];

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
