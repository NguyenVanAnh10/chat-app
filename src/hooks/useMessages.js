import { useEffect as useReactEffect, useMemo } from 'react';

import { useModel } from 'model';
import Message from 'entities/Message';

const selector = ({ getUnseenMessages, getMessages, messages, seeMessages, sendMessage }) => ({
  unseenMessagesState: getUnseenMessages,
  messagesState: getMessages,
  messages,
  seeMessagesState: seeMessages,
  sendMessageState: sendMessage,
});
const useMessages = ({ conversationId, skip = 0, limit = 20 }, options) => {
  const cachedKey = conversationId || 'all';

  const [
    { messages, unseenMessagesState, messagesState, seeMessagesState, sendMessageState },
    { getUnseenMessages, getMessages, seeMessages, sendMessage },
  ] = useModel('message', selector);

  useReactEffect(() => {
    if (
      !options?.forceFetchingUnseenMessages ||
      unseenMessagesState[cachedKey] ||
      unseenMessagesState[cachedKey]?.loading
    )
      return;
    getUnseenMessages({ cachedKey, conversationId });
  }, []);

  useReactEffect(() => {
    if (
      !conversationId ||
      !options?.forceFetchingMessages ||
      messagesState[cachedKey]?.loading ||
      sendMessageState.loading
    )
      return;
    if (
      messagesState[cachedKey] &&
      !(
        messagesState[cachedKey].ids?.length < messagesState[cachedKey].total &&
        messagesState[cachedKey].ids?.length < limit
      )
    )
      return;

    getMessages({ limit, skip, cachedKey, conversationId });
  }, [cachedKey]);

  const aggregateMessages = useMemo(
    () => Message.aggregateMessages(messagesState[cachedKey]?.ids || [], messages),
    [messages, cachedKey],
  );

  return [
    {
      messages: aggregateMessages,
      messagesState: messagesState[cachedKey] || {},
      unseenMessagesState: unseenMessagesState[cachedKey] || {},
      seeMessagesState: seeMessagesState[cachedKey] || {},
    },
    { getMessages, seeMessages, sendMessage },
  ];
};

export default useMessages;
