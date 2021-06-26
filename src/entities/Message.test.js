import expect from 'expect';
import isEqual from 'lodash.isequal';

import Message from './Message';

it('getInputMessage input "a b c" --> ["a b c"]', () => {
  expect(isEqual(Message.getInputMessage('a b c'), ['a b c'])).toBeTruthy();
});

it('getInputMessage input "   hi hi :A0 hi " --> ["   hi hi" ,":A0", " hi  "]', () => {
  expect(isEqual(Message.getInputMessage('  hi hi  :A0  hi  '), ['  hi hi  ', ':A0', '  hi  '])).toBeTruthy();
});

it('getInputMessage input ":A2:A243 " --> [":A2",":A24", "3 "]', () => {
  expect(isEqual(Message.getInputMessage(':A2:A243 '), [':A2', ':A24', '3 '])).toBeTruthy();
});
