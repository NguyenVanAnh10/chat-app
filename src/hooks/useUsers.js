import { useState } from 'react';

import { useModel } from 'model';

const selector = ({ users, getUsers }) => ({
  users,
  getUsersState: getUsers,
});

const useUsers = () => {
  const [{ users, getUsersState }, { getUsers, getUser }] = useModel('user', selector);
  const [kw, setKw] = useState('');

  const getUsersByKeyword = ({ keyword }) => {
    setKw(keyword);
    if (getUsersState[keyword]) return;
    getUsers({ keyword });
  };

  return [
    {
      users,
      getUsersState: getUsersState[kw] || {},
      arrayUsers: (getUsersState[kw]?.ids || []).map(id => users[id] || {}),
    },
    { getUsers: getUsersByKeyword, getUser },
  ];
};

/**
 *
 * @param {string} id
 * @returns {[{user: IUser}]}
 */
export const useUser = id => {
  const [{ user }] = useModel('user', ({ users }) => ({
    user: users[id] || {},
  }));
  return [{ user }];
};

export default useUsers;
