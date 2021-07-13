import { useContext, useEffect as useReactEffect, useMemo } from 'react';

import { AccountContext } from 'App';
import { useModel } from 'model';
import { menuKeys } from 'configs/configs';
import useUsers from './useUsers';

const conversationSelector = ({ messages, conversations, seeMessages }) => ({
  messages,
  conversations,
  seeMessages,
});
const useConversation = conversationId => {
  const { account } = useContext(AccountContext);
  const [{ users }] = useUsers();
  const [{ messages, conversations, seeMessages: seeMessagesState }, { seeMessages }] = useModel('message',
    conversationSelector);

  if (!conversationId || !account.id || !conversations[conversationId]) {
    return [{ conversation: {}, seeMessagesState: {} }, {}];
  }

  return [
    {
      conversation: {
        ...conversations[conversationId],
        membersObj: conversations[conversationId]
          .userIds?.reduce((s, id) => ({
            ...s,
            [id]: id !== account.id ? users[id] || {} : account,
          }), {}) || {},
        members: conversations[conversationId]
          .userIds?.map(id => id !== account.id ? users[id] || {} : account) || [],
        otherMembers: conversations[conversationId].userIds?.filter(id => id !== account.id)
          .map(id => users[id] || {}),
        newMessageNumber: Object.keys(messages).filter(
          id => messages[id]?.conversationId === conversationId
            && !!messages[id]?.usersSeenMessage
            && !messages[id].usersSeenMessage.includes(account.id),
        ).length,
        userName:
          conversations[conversationId].name
          || users[conversations[conversationId].userIds?.find(id => id !== account.id)]?.userName,
      },
      seeMessagesState: seeMessagesState[conversationId] || {},
    },
    { seeMessages },
  ];
};

const conversationsSelector = account => ({ messages, getConversations, conversations }) => ({
  messages,
  conversations: (getConversations.ids || []).map(id => ({
    ...conversations[id],
    newMessageNumber: conversations[id].messageIds?.filter(
      msgId => !!messages[msgId]?.usersSeenMessage
      && !messages[msgId].usersSeenMessage.includes(account.id),
    )?.length,
  })),
});
// typeConversations: messages | notMessages | contactBook |all
export const useConversations = typeConversations => {
  const { account } = useContext(AccountContext);
  const [{ users }, { getUsers }] = useUsers();
  const [
    { conversations },
    { getConversations, seeMessages },
  ] = useModel('message', conversationsSelector(account));

  useReactEffect(() => {
    account.id && !conversations.length && getConversations(account.id);
  }, [account.id]);

  useReactEffect(() => {
    const userIds = [];
    conversations.forEach(conversation => conversation.userIds?.forEach(id => {
      if (!users[id] && !userIds.includes(id) && account.id !== id) userIds.push(id);
    }));
    if (!userIds.length) return;
    getUsers({ cachedKey: userIds.join(','), userIds: userIds.join(',') });
  }, [conversations]);

  if (!account.id) return [{}, {}];

  const aggregateConversations = useMemo(() => conversations.map(conversation => ({
    ...conversation,
    members: conversation.userIds?.map(id => id !== account.id ? users[id] || {} : account),
    otherMembers: conversation.userIds?.filter(id => id !== account.id)
      .map(id => users[id] || {}),
    userName: conversation.name
       || users.[conversation.userIds?.find(id => id !== account.id)]?.userName,
  })), [conversations, users, account]);

  switch (typeConversations) {
    case menuKeys.MESSAGES:
      return [{
        conversations: aggregateConversations
          .filter(conversation => !!conversation.messageIds?.length
        || conversation.userIds?.length > 2) }, { seeMessages }];
    case 'notMessages':
      return [{ conversations:
        aggregateConversations
          .filter(conversation => !conversation.messageIds?.length) }, { seeMessages }];
    case menuKeys.CONTACT_BOOK:
      return [{
        conversations:
        aggregateConversations
          .filter(conversation => conversation.members?.length === 2),
      },
      { seeMessages }];
    case 'all':
      return [{ conversations }, { seeMessages }];
    default:
      // no params
      return [
        {
          messageConversations:
          aggregateConversations
            .filter(conversation => !!conversation.messageIds?.length),
          notMessageConversations:
           aggregateConversations
             .filter(conversation => !conversation.messageIds?.length),
          conversations: aggregateConversations,
        },
        { seeMessages },
      ];
  }
};

export default useConversation;
