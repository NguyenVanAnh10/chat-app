import data from 'components/EmojiPicker/data';

const { emojis } = data;
export default class Message {
  static CONTENT_TYPE_NOTIFICATION = 'CONTENT_TYPE_NOTIFICATION';
  static CONTENT_TYPE_IMAGE = 'CONTENT_TYPE_IMAGE';
  static CONTENT_TYPE_VIDEO = 'CONTENT_TYPE_VIDEO';
  static CONTENT_TYPE_AUDIO = 'CONTENT_TYPE_AUDIO';
  static CONTENT_TYPE_TEXT = 'CONTENT_TYPE_TEXT';
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
  }
}
