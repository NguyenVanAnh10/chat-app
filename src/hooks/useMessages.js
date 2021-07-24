import { useEffect as useReactEffect, useMemo } from 'react';

import { useModel } from 'model';
import { useConversation } from './useConversations';

const selector = ({ getUnseenMessages, getMessages, messages, seeMessages, sendMessage }) => ({
  unseenMessagesState: getUnseenMessages,
  messagesState: getMessages,
  messages,
  seeMessagesState: seeMessages,
  sendMessageState: sendMessage,
});
const useMessages = ({ conversationId, friendId, skip = 0, limit = 20 }, options) => {
  const [{ conversation }] = useConversation({ friendId, conversationId });
  let cachedKey = conversationId || conversation.id || 'all';
  if (!options?.forceFetchingUnseenMessages && !conversationId && !conversation.id) {
    cachedKey = friendId;
  }
  const [
    { messages, unseenMessagesState, messagesState, seeMessagesState, sendMessageState },
    { getUnseenMessages, getMessages, seeMessages, sendMessage },
  ] = useModel('message', selector);

  useReactEffect(() => {
    if (!options?.forceFetchingUnseenMessages || unseenMessagesState[cachedKey]
      || unseenMessagesState[cachedKey]?.loading) return;
    getUnseenMessages({ cachedKey, conversationId });
  }, []);

  useReactEffect(() => {
    if ((!conversationId && !conversation.id) || !options?.forceFetchingMessages
    || messagesState[cachedKey]?.loading || sendMessageState.loading) return;
    if ((messagesState[cachedKey]
        && !(messagesState[cachedKey].ids?.length < messagesState[cachedKey].total
        && messagesState[cachedKey].ids?.length < limit))) return;

    getMessages({
      limit,
      skip,
      cachedKey,
      conversationId: conversationId || conversation.id,
    });
  }, [cachedKey]);

  const aggregateMessages = useMemo(() => (messagesState[cachedKey]?.ids || [])
    .map(id => messages[id])
    .reduce((s, c, index, arr) => {
      if (index === 0 || arr[index - 1].sender !== c.sender) {
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
    },
    []),
  [messages, cachedKey]);

  return [
    {
      messages: aggregateMessages,
      messagesState: messagesState[cachedKey] || {},
      unseenMessagesState: unseenMessagesState[cachedKey] || {},
      seeMessagesState: seeMessagesState[cachedKey] || {},
      conversation,
    },
    { getMessages, seeMessages, sendMessage },
  ];
};
export default useMessages;
