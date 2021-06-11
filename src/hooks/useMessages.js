import { useContext, useEffect as useReactEffect } from 'react';
import qs from 'query-string';

import { useModel } from 'model';
import { AccountContext } from 'App';

const opts = { fetchData: false };

const useMessages = (roomId, options = opts) => {
  const {
    account: { _id: userId },
  } = useContext(AccountContext);

  const cachedKey = qs.stringify({ roomId, userId });
  const [
    { messages, mesagesState },
    { getMessages, sendMessage, haveSeenNewMessages },
  ] = useModel('message', ({ messages, getMessages }) => ({
    mesagesState: getMessages,
    messages,
  }));

  useReactEffect(() => {
    roomId
      && userId
      && options.fetchData
      && !mesagesState[cachedKey]
      && getMessages({ roomId, userId });
  }, [roomId, userId]);

  if (!roomId || !userId) return [{ messages: [] }, {}];
  return [
    {
      messages: (mesagesState[cachedKey]?.ids || [])
        .map(id => messages[id])
        .filter(m => m.roomId === roomId),
      loading: mesagesState[cachedKey]?.loading,
    },
    { getMessages, sendMessage, haveSeenNewMessages },
  ];
};
export default useMessages;
