import React, { useContext, useRef, useState, useCallback, useEffect, memo } from 'react';
import {
  Button,
  HStack,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  useBreakpointValue,
} from '@chakra-ui/react';
import { v4 as uuid } from 'uuid';
import { Editor, EditorState, Modifier } from 'draft-js';

import { useModel } from 'model';
import { AccountContext } from 'App';
import Message from 'entities/Message';
import UploadImage from 'components/UploadImage';
import { ImageIcon, PaperPlaneIcon } from 'components/CustomIcons';
import decorator, { getResetEditorState } from './emojiDecorator';

import styles from './MessageInput.module.scss';
import 'draft-js/dist/Draft.css';
import { MenuContext } from 'contexts/menuContext';
import LazyMount from 'components/LazyMount';
import EmojiPickerLoading from 'components/EmojiPicker/EmojiPickerLoading';
import bindKeyDraft from 'utils/keyBindingDraft';

const EmojiPicker = React.lazy(() => import('components/EmojiPicker'));

const MessageInput = ({ bottomMessagesBoxRef, ...rest }) => {
  const { menuState } = useContext(MenuContext);
  const { conversationId } = menuState[menuState.active];

  const { account } = useContext(AccountContext);
  const isMobileScreen = useBreakpointValue({ base: true, md: false });

  const [editorState, setEditorState] = useState(() => EditorState.createEmpty(decorator));

  const domEditorRef = useRef();
  const editorStateRef = useRef();

  const [, { sendMessage }] = useModel('message', () => ({}));

  useEffect(() => {
    editorStateRef.current = editorState;
  }, [editorState]);

  const handleKeyCommand = command => {
    if (command === 'send-message') {
      handleSendMessage();
    }
  };
  const handleSendMessage = useCallback(() => {
    const message = editorStateRef.current.getCurrentContent().getPlainText(' ');
    if (!message) {
      domEditorRef.current.focus();
      return;
    }
    sendMessage({
      conversationId,
      keyMsg: uuid(),
      contentType: Message.CONTENT_TYPE_TEXT,
      content: message,
      sender: account.id,
    });
    setEditorState(getResetEditorState(editorStateRef.current));
    setTimeout(() => {
      bottomMessagesBoxRef.current?.scrollIntoView(false);
    });
  }, [conversationId]);

  const handleSendImage = useCallback(
    imageSource => {
      if (!imageSource.imageUrl || !imageSource.contentBlob) return;
      sendMessage({
        conversationId,
        keyMsg: uuid(),
        contentType: Message.CONTENT_TYPE_IMAGE,
        contentBlob: imageSource.contentBlob,
        imageUrl: imageSource.imageUrl,
        sender: account.id,
      });
      setTimeout(() => {
        bottomMessagesBoxRef.current?.scrollIntoView(false);
      });
    },
    [conversationId],
  );

  const onSelectEmoji = useCallback(({ key }) => {
    const newContentState = Modifier.insertText(
      editorStateRef.current.getCurrentContent(),
      editorStateRef.current.getSelection(),
      `${key} `,
    );

    const newState = EditorState.push(editorStateRef.current, newContentState, 'insert-characters');
    setEditorState(newState);
  }, []);

  return (
    <HStack
      w="100%"
      py="3"
      px="3"
      spacing="0"
      borderTop="1px solid #EDF2F7"
      className={styles.MessageInput}
      align="flex-start"
      {...rest}
    >
      <Editor
        ref={domEditorRef}
        placeholder="Type message..."
        editorState={editorState}
        onChange={setEditorState}
        handleKeyCommand={handleKeyCommand}
        keyBindingFn={
          isMobileScreen
            ? bindKeyDraft.bindOneKey('split-block', 'Enter')
            : bindKeyDraft.bindOneKey(['send-message', 'split-block'], 'Enter', {
                shiftKey: true,
              })
        }
      />
      <HStack spacing="0">
        <EmojiPickerButton onSelectEmoji={onSelectEmoji} />
        <UploadImage
          onSelectImage={handleSendImage}
          renderButton={() => (
            <IconButton
              colorScheme="blue"
              variant="ghost"
              _focus="none"
              fontSize="1.9rem"
              size="md"
              icon={<ImageIcon />}
            />
          )}
        />
        <IconButton
          colorScheme="blue"
          variant="ghost"
          fontSize="1.5rem"
          size="md"
          _focus="none"
          icon={<PaperPlaneIcon />}
          onClick={handleSendMessage}
        />
      </HStack>
    </HStack>
  );
};

const EmojiPickerButton = memo(({ onSelectEmoji }) => {
  const [trigger, setTrigger] = useState(false);
  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <Button
          colorScheme="blue"
          variant="ghost"
          _focus="none"
          fontSize="1.3rem"
          size="md"
          px="0"
          onClick={() => setTrigger(true)}
        >
          &#x1F604;
        </Button>
      </PopoverTrigger>
      <PopoverContent className={styles.Picker} _focus="none" border="none">
        <PopoverArrow />
        <LazyMount trigger={trigger} fallback={<EmojiPickerLoading />}>
          <EmojiPicker onSelect={onSelectEmoji} />
        </LazyMount>
      </PopoverContent>
    </Popover>
  );
});
export default MessageInput;
