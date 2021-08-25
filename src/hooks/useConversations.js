import { useEffect as useReactEffect } from 'react';

import { useModel } from 'model';

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
  const [{ conversations, createState, getState }, { getConversations, createConversation }] =
    useModel('conversation', conversationsSelector);
  const [{ users }] = useModel('user', state => ({ users: state.users }));

  useReactEffect(() => {
    if (!options?.forceFetchingConversations || getState.loading || conversations.length) return;
    getConversations();
  }, []);

  return [
    {
      conversations: conversations.map(con => ({
        ...con,
        members: con.members.map(id => users[id] || {}),
      })),
      createState,
    },
    { createConversation },
  ];
};

/**
 *
 * @param {string} conversationId
 * @param {{forceFetching: boolean}} options
 * @returns {[{conversation: IConversation},{createConversation: () => ({})}]}
 */
export const useConversation = ({ conversationId }, options = {}) => {
  const [{ conversation, getConversationState }, { getConversation, createConversation }] =
    useModel('conversation', state => ({
      conversation: state.conversations[conversationId] || {},
      getConversationState: state.getConversation,
      getConversations: state.getConversations,
    }));
  const [{ users }] = useModel('user', state => ({ users: state.users }));

  useReactEffect(() => {
    if (getConversationState.loading || conversation.id || !options.forceFetching) return;
    getConversation({ id: conversationId });
  }, [conversationId]);

  return [
    {
      conversation: conversation.id
        ? {
            ...conversation,
            members: conversation.members?.map(id => users[id] || {}) || [],
          }
        : {},
    },
    { createConversation },
  ];
};

export default useConversations;
