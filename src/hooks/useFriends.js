import { useEffect, useEffect as useReactEffect } from 'react';

import { useModel } from 'model';

const selector = ({ getFriends, addressees, requesters, confirmFriendRequest }) => ({
  friends: getFriends.ids,
  addressees: addressees.ids,
  requesters: requesters.ids,
  addFriendRequestState: {
    error: addressees.error,
    loading: addressees.loading,
  },
  getFriendState: {
    error: getFriends.error,
    loading: getFriends.loading,
  },
  getFriendRequesterState: {
    error: requesters.error,
    loading: requesters.loading,
  },
  confirmFriendRequestState: confirmFriendRequest,
});

/**
 *
 * @param {{forceFetchingFriends: boolean}} options
 * @returns {[
 *   {
 *    getFriendState: {loading: boolean, error: object},
 *    addFriendRequestState: {loading: boolean, error: object},
 *    friendRequestAddressees: [IUser],
 *    friendRequestRequesters: [IUser],
 *    friends: [IUser],
 *    confirmFriendRequest: {loading: boolean, error: object},
 *  },
 *  { confirmFriendRequest: () => ({}), addFriendRequest: () => ({}) },
 *  ]}
 */
const usefriends = options => {
  const [
    {
      friends,
      getFriendState,
      addressees,
      requesters,
      addFriendRequestState,
      getFriendRequesterState,
      confirmFriendRequestState,
    },
    { getFriends, confirmFriendRequest, addFriendRequest, getFriendRequester },
  ] = useModel('account', selector);

  const [{ users }] = useModel('user', state => ({
    users: state.users,
  }));

  useReactEffect(() => {
    if (getFriendState.loading || !options?.forceFetchingFriends || friends.length) return;
    getFriends();
  }, []);

  useReactEffect(() => {
    if (
      getFriendRequesterState.loading ||
      !options?.forceFetchingFriendRequesters ||
      requesters.length
    )
      return;
    getFriendRequester();
  }, []);

  return [
    {
      getFriendState,
      addFriendRequestState,
      friendRequestAddressees: addressees.map(friendId => users[friendId] || {}),
      friendRequestRequesters: requesters.map(friendId => users[friendId] || {}),
      friends: friends.map(friendId => users[friendId] || {}),
      confirmFriendRequest: confirmFriendRequestState,
    },
    { confirmFriendRequest, addFriendRequest },
  ];
};

export default usefriends;

/**
 *
 * @param {{conversationId?: string, friendId?: string}}
 * @param {{forceFetching: boolean}} options
 * @returns {[{friend: IUser}]}
 */
export const useFriend = ({ conversationId, friendId }, options = { forceFetching: false }) => {
  const [{ friendIds }, { getFriend }] = useModel('account', state => ({
    friendIds: state.getFriends.ids,
  }));
  const [{ users }] = useModel('user', state => ({
    users: state.users,
  }));
  const friend =
    users[friendIds.find(id => id === friendId || users[id].conversation === conversationId)] || {};

  useEffect(() => {
    if (!options.forceFetching || friend.id || !friendId) return;
    getFriend(friendId);
  }, [friendId]);

  return [{ friend }];
};
