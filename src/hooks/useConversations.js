import { useContext, useEffect as useReactEffect } from 'react';
import isEqual from 'lodash.isequal';

import { useModel } from 'model';
import { AccountContext } from 'App';

const conversationsSelector = ({ conversations, getConversations, createConversation }) => ({
  conversations: (getConversations.ids || []).map(id => ({
    ...conversations[id],
  })),
  getState: {
    loading: getConversations.loading,
    error: getConversations.error,
  },
  createState: createConversation,
});

const useConversations = options => {
  const [
    { conversations, createState, getState },
    { getConversations, createConversation },
  ] = useModel('conversation', conversationsSelector);
  const [{ users }] = useModel('user', state => ({ users: state.users }));

  useReactEffect(() => {
    if (!options?.forceFetchingConversations
      || getState.loading || conversations.length) return;
    getConversations();
  }, []);

  return [{
    conversations: conversations.map(con => ({
      ...con,
      members: con.members.map(id => users[id] || {}),
    })),
    createState,
  }, { createConversation }];
};

export const useConversation = ({ conversationId, friendId }) => {
  const { account } = useContext(AccountContext);
  const [
    { conversations, getConversationState, getConversations },
    { getConversation, createConversation },
  ] = useModel('conversation', state => ({
    conversations: state.conversations,
    getConversationState: state.getConversation,
    getConversations: state.getConversations,
  }));
  const [{ users }] = useModel('user', state => ({ users: state.users }));

  let conversation = { ...conversations[conversationId] };
  if (friendId && !conversation.id) {
    conversation = (getConversations.ids
      .map(id => conversations[id])
      .find(conv => isEqual([...conv.members].sort(), [friendId, account.id].sort()))
    ) || {};
  }

  useReactEffect(() => {
    if (!conversationId || getConversationState.loading || conversation.id) return;
    getConversation(conversationId);
  }, [conversationId]);

  return [{
    conversation: {
      ...conversation,
      members: conversation.members?.map(id => users[id] || {}) || [],
    },
  }, { createConversation }];
};

export default useConversations;
