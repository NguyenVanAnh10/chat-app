export default class Conversation {
  constructor(conversation = {}) {
    Object.assign(this, conversation, {
      members: (conversation.members || []).map(m => m.id),
    });
  }
}
