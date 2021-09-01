import data from 'components/EmojiPicker/data';
import Notification from './Notification';

const { emojis } = data;
export default class Message {
  static CONTENT_TYPE_NOTIFICATION = 'NOTIFICATION';
  static CONTENT_TYPE_IMAGE = 'IMAGE';
  static CONTENT_TYPE_VIDEO = 'VIDEO';
  static CONTENT_TYPE_AUDIO = 'AUDIO';
  static CONTENT_TYPE_TEXT = 'TEXT';
  // eslint-disable-next-line no-useless-escape
  static EMOJI_CODE_REGEX = /\:([A-U]|[a-t])[0-9]{1,2}/g;

  static getInputMessage = (input = '', regex = Message.EMOJI_CODE_REGEX) => {
    const result = [];
    let matchArr;
    let start;
    let prev = 0;
    // eslint-disable-next-line no-cond-assign
    while ((matchArr = regex.exec(input)) !== null) {
      if (emojis[matchArr[0]]) {
        start = matchArr.index;
        !!input.slice(prev, start) && result.push(input.slice(prev, start));
        result.push(matchArr[0]);

        prev = start + matchArr[0].length;
      }
    }

    if (prev !== input.length && !!prev) {
      !!input.slice(prev) && result.push(input.slice(prev));
    }
    return result.length ? result : [input];
  };

  /**
   * @param {[string]} messageIds message order
   * @param {object} messages
   * @returns {[IMessage]}
   */
  static aggregateMessages = (messageIds = [], messages = {}) =>
    messageIds
      .map(id => messages[id])
      .reduce((s, c, index, arr) => {
        if (
          index === 0 ||
          arr[index - 1].sender !== c.sender ||
          arr[index - 1].content?.includes(Notification.NOTIFICATION_MEMBER_ADDITION) ||
          c.content?.includes(Notification.NOTIFICATION_MEMBER_ADDITION)
        ) {
          return [...s, c];
        }
        return [
          ...(s.length > 1 ? s.slice(0, s.length - 1) : []),
          {
            id: c.id,
            conversation: c.conversation,
            sender: c.sender,
            aggregateMsg: s[s.length - 1]?.aggregateMsg
              ? [...s[s.length - 1]?.aggregateMsg, c]
              : [s[s.length - 1], c],
          },
        ];
      }, []);
}
