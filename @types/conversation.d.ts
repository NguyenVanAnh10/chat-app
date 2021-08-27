interface IConversation {
  id: string;
  creator: string;
  name?: string;
  createdAt: string;
  members: [IUser];
}
