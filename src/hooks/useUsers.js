import { useEffect, useState } from 'react';

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

  return [{
    users,
    getUsersState: getUsersState[kw] || {},
    arrayUsers: (getUsersState[kw]?.ids || []).map(id => users[id] || {}),

  }, { getUsers: getUsersByKeyword, getUser }];
};

const userSelector = id => ({ users }) => ({
  user: users[id] || {},
});

export const useUser = id => {
  const [{ user }, { getUser }] = useModel('user', userSelector(id));
  useEffect(() => {
    if (!id || user.id) return;
    getUser({ id });
  }, [id]);
  return [{ user }];
};

export default useUsers;
