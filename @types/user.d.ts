interface IUser {
  id: string;
  userName: string;
  email: string;
  avatar: string;
  online: boolean;
  conversation?: string;
}

interface IAccount {
  id: string;
  userName: string;
  online: boolean;
  avatar: string;
  email: string;
  createdAt: string;
}
