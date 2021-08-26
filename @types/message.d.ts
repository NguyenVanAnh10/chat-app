enum ContentTypeMessage {
  CONTENT_TYPE_NOTIFICATION = 'NOTIFICATION',
  CONTENT_TYPE_IMAGE = 'IMAGE',
  CONTENT_TYPE_VIDEO = 'VIDEO',
  CONTENT_TYPE_AUDIO = 'AUDIO',
  CONTENT_TYPE_TEXT = 'TEXT',
}

interface IMessage {
  id: string;
  sender: string;
  conversation: string;
  contentType?: ContentTypeMessage;
  content?: string;
  usersSeen?: [string];
  createdAt?: string;
  aggregateMsg?: [IMessage];
}
