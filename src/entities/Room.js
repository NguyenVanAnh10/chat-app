// TODO refactor
// export default class Room {
//   constructor(room) {
//     this.room = room;
//   }

//   set otherMembers(account) {
//     return this.room.members?.filter(m => m.id !== account.id);
//   }

//   get newMessageNumber() {
//     return this.room.messageIds?.filter(
//       msgId => !messages[msgId]?.usersSeenMessage?.includes(account.id),
//     )?.length;
//   }
//   get userName() {
//     return this.room.name
//         || rooms[id].members?.find(m => m.id !== account.id)?.userName;
//   }
// }
