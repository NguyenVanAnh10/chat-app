import { useEffect as useReactEffect } from 'react';

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
