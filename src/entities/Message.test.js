import isEqual from 'lodash.isequal';

import Message from './Message';
import Notification from './Notification';

describe('getInputMessage', () => {
  it('input "a b c" --> ["a b c"]', () => {
    expect(isEqual(Message.getInputMessage('a b c'), ['a b c'])).toBeTruthy();
  });

  it('input "   hi hi :A0 hi " --> ["   hi hi" ,":A0", " hi  "]', () => {
    expect(
      isEqual(Message.getInputMessage('  hi hi  :A0  hi  '), ['  hi hi  ', ':A0', '  hi  ']),
    ).toBeTruthy();
  });

  it('input ":A2:A243 " --> [":A2",":A24", "3 "]', () => {
    expect(isEqual(Message.getInputMessage(':A2:A243 '), [':A2', ':A24', '3 '])).toBeTruthy();
  });
});

describe('aggregateMessages', () => {
  it('different senders --> messages are not aggregated', () => {
    const aggregatedMessages = Message.aggregateMessages(['1', '2'], {
      1: {
        id: '1',
        sender: 'sender-1',
        contentType: 'TEXT',
        content: 'a-1',
      },
      2: {
        id: '2',
        sender: 'sender-2',
        contentType: 'TEXT',
        content: 'a-2',
      },
    });
    expect(aggregatedMessages).toEqual([
      {
        id: '1',
        sender: 'sender-1',
        contentType: 'TEXT',
        content: 'a-1',
      },
      {
        id: '2',
        sender: 'sender-2',
        contentType: 'TEXT',
        content: 'a-2',
      },
    ]);
  });

  it('same senders --> messages are aggregated', () => {
    const aggregatedMessages = Message.aggregateMessages(['1', '2'], {
      1: {
        id: '1',
        sender: 'sender-1',
        contentType: 'TEXT',
        content: 'a-1',
      },
      2: {
        id: '2',
        sender: 'sender-1',
        contentType: 'TEXT',
        content: 'a-2',
      },
    });
    expect(aggregatedMessages).toEqual([
      {
        id: expect.toBeString(),
        sender: 'sender-1',
        aggregateMsg: [
          {
            id: expect.toBeString(),
            sender: 'sender-1',
            contentType: 'TEXT',
            content: 'a-1',
          },
          {
            id: expect.toBeString(),
            sender: 'sender-1',
            contentType: 'TEXT',
            content: 'a-2',
          },
        ],
      },
    ]);
  });

  it('same senders but content is NOTIFICATION_MEMBER_ADDITION --> messages are not aggregated', () => {
    const aggregatedMessages = Message.aggregateMessages(['1', '2', '3'], {
      1: {
        id: '1',
        sender: 'sender-1',
        contentType: 'TEXT',
        content: 'a-1',
      },
      2: {
        id: '2',
        sender: 'sender-1',
        contentType: Message.CONTENT_TYPE_NOTIFICATION,
        content: Notification.NOTIFICATION_MEMBER_ADDITION,
      },
      3: {
        id: '3',
        sender: 'sender-1',
        contentType: 'TEXT',
        content: 'a-2',
      },
    });
    expect(aggregatedMessages).toEqual([
      {
        id: expect.toBeString(),
        sender: 'sender-1',
        contentType: 'TEXT',
        content: 'a-1',
      },
      {
        id: expect.toBeString(),
        sender: 'sender-1',
        contentType: Message.CONTENT_TYPE_NOTIFICATION,
        content: Notification.NOTIFICATION_MEMBER_ADDITION,
      },
      {
        id: expect.toBeString(),
        sender: 'sender-1',
        contentType: 'TEXT',
        content: 'a-2',
      },
    ]);
  });
});
