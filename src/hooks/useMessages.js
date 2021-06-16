import { useContext, useEffect as useReactEffect } from 'react';

import { useModel } from 'model';
import { AccountContext } from 'App';

const opts = { fetchData: false };

const selector = cachedKey => ({ messages, getMessages, rooms }) => {
  console.log('cachedKey', cachedKey, 'room', rooms[cachedKey]?.id);
  return ({
    mesagesState: getMessages,
    messages,
    total: rooms[cachedKey]?.messageIds?.length || 0,
  });
};
const useMessages = (roomId, options = opts) => {
  const {
    account: { id: userId },
  } = useContext(AccountContext);

  const cachedKey = roomId || 'all';
  const [
    { messages, mesagesState, total },
    { getMessages, sendMessage, haveSeenNewMessages },
  ] = useModel('message', selector(cachedKey), [cachedKey]);
  // TODO
  useReactEffect(() => {
    roomId
      && userId
      && options.fetchData
      && !mesagesState[cachedKey]
      && getMessages({ roomId, userId, limit: 20, skip: 0, cachedKey });
  }, [roomId, userId]);
  // TODO
  const loadMoreMessages = ({ limit, skip }) => {
    roomId
      && userId
      && options.fetchData
      && getMessages({ roomId, userId, limit, skip, cachedKey });
  };

  if (!roomId || !userId) return [{ messages: [] }, {}];
  return [
    {
      total,
      messages: (mesagesState[cachedKey]?.ids || [])
        .map(id => messages[id])
        .sort((msg1, msg2) => {
          if (msg1.createAt > msg2.createAt) return 1;
          if (msg1.createAt < msg2.createAt) return -1;
          return 0;
        }),
      loading: mesagesState[cachedKey]?.loading,
    },
    { getMessages, sendMessage, haveSeenNewMessages, loadMoreMessages },
  ];
};
export default useMessages;
