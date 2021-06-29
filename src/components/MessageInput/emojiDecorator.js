/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { CompositeDecorator, EditorState, Modifier, RichUtils } from 'draft-js';

import Emoji from 'components/Emoji';
import data from 'components/EmojiPicker/data';
import Message from 'entities/Message';

const { emojis } = data;

function emojiStrategy(contentBlock, callback) {
  findWithRegex(Message.EMOJI_CODE_REGEX, contentBlock, callback);
}

function findWithRegex(regex, contentBlock, callback) {
  const text = contentBlock.getText();
  let matchArr;
  let start;
  // eslint-disable-next-line no-cond-assign
  while ((matchArr = regex.exec(text)) !== null) {
    if (emojis[matchArr[0]]) {
      start = matchArr.index;
      callback(start, start + matchArr[0].length);
    }
  }
}

const EmojiComponent = ({ decoratedText, ...rest }) => (
  <Emoji
    coordinates={emojis[decoratedText]}
    text={decoratedText}
    {...rest}
  />
);

const emojiDecorator = new CompositeDecorator([
  {
    strategy: emojiStrategy,
    component: EmojiComponent,
  },
]);

export const getResetEditorState = editorState => {
  const blocks = editorState
    .getCurrentContent()
    .getBlockMap()
    .toList();
  const updatedSelection = editorState.getSelection().merge({
    anchorKey: blocks.first().get('key'),
    anchorOffset: 0,
    focusKey: blocks.last().get('key'),
    focusOffset: blocks.last().getLength(),
    hasFocus: true,
  });
  const newContentState = Modifier.removeRange(
    editorState.getCurrentContent(),
    updatedSelection,
    'forward', // backward
  );

  const newState = EditorState.push(editorState, newContentState, 'remove-range');
  return removeSelectedBlocksStyle(newState);
};

const removeSelectedBlocksStyle = editorState => {
  const newContentState = RichUtils.tryToRemoveBlockStyle(editorState);
  if (newContentState) {
    return EditorState.push(editorState, newContentState, 'change-block-type');
  }
  return editorState;
};

export default emojiDecorator;
