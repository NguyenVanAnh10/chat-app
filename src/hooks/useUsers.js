import { useModel } from 'model';
import { useRef, useState } from 'react';

const selector = ({ users, getUsers, me }) => ({
  users,
  me,
  getUsersState: getUsers,
});

const useUsers = () => {
  const [{ users, me, getUsersState }, { getUsers }] = useModel('account', selector);
  const cachedKey = useRef('');
  const [, forceRender] = useState({});

  const getCachedUsers = params => {
    cachedKey.current = params.keyword;
    if (getUsersState[params.keyword]) {
      forceRender({});
      return;
    }
    getUsers(params);
  };

  return [{
    users,
    friends: (me.friendIds || []).map(id => users[id] || {}),
    usersArray: getUsersState[cachedKey.current]?.ids?.sort((userId1, userId2) => {
      if (me.friendIds?.includes(userId1) && !me.friendIds?.includes(userId2)) return 1;
      if (!me.friendIds?.includes(userId1) && me.friendIds?.includes(userId2)) return -1;
      return 0;
    })?.map(id => users[id]) || [],
    getUsersState: {
      loading: getUsersState.loading,
      error: getUsersState.error,
    },
  },
  {
    getUsers: getCachedUsers,
  },
  ];
};

export default useUsers;
