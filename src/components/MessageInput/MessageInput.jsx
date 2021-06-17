import React, { useContext, useRef } from 'react';
import {
  Box,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  useToast,
} from '@chakra-ui/react';
import { v4 as uuid } from 'uuid';
import { useForm, Controller } from 'react-hook-form';
import Message from 'entities/Message';

import { useModel } from 'model';
import { getBase64 } from 'utils';
import { AccountContext } from 'App';
import { ImageIcon, EmojiIcon, PaperPlaneIcon } from 'components/CustomIcons';
import useRoom from 'hooks/useRoom';
import NimblePicker from 'components/EmojiPicker';

import styles from './MessageInput.module.scss';

const MessageInput = ({ roomId, bottomMessagesBoxRef, ...rest }) => {
  const { account } = useContext(AccountContext);
  const [{ room }] = useRoom(roomId);

  const [, { sendMessage, haveSeenNewMessages }] = useModel(
    'message',
    () => ({}),
  );

  const onHandleFocusInput = () => {
    if (!room.newMessageNumber) return;
    haveSeenNewMessages({ roomId, userId: account.id });
  };
  const { control, handleSubmit, reset, setFocus } = useForm({ message: '' });

  const handleSubmitMessage = handleSubmit(data => {
    if (!data.message) return;
    sendMessage({
      roomId,
      keyMsg: uuid(),
      contentType: Message.CONTENT_TYPE_TEXT,
      content: data.message,
      createAt: Date.now(),
      senderId: account.id,
      hadSeenMessageUsers: [account.id],
    });
    reset({ message: '' });
    setFocus('message');
    bottomMessagesBoxRef.current?.scrollIntoView(false);
  });

  const handleSendImage = async imageUrls => {
    if (!imageUrls.length) return;
    try {
      const base64Image = (await getBase64(imageUrls[0])).replace(
        /^data:image\/[a-z]+;base64,/,
        '',
      );
      sendMessage({
        roomId,
        keyMsg: uuid(),
        contentType: Message.CONTENT_TYPE_IMAGE,
        contentBlob: URL.createObjectURL(imageUrls[0]),
        base64Image,
        createAt: Date.now(),
        senderId: account.id,
        hadSeenMessageUsers: [account.id],
      });
      bottomMessagesBoxRef.current?.scrollIntoView(false);
    } catch (error) {
      console.error(error);
    }
  };
  const hanleKeyDown = e => {
    if (e.keyCode !== 13) return;
    handleSubmitMessage();
  };
  return (
    <HStack
      w="100%"
      py="3"
      pr="3"
      spacing="2"
      borderTop="1px solid #EDF2F7"
      {...rest}
    >
      <form className="form" onSubmit={handleSubmitMessage}>
        <Controller
          name="message"
          control={control}
          defaultValue=""
          rules={{ required: true }}
          render={({ field }) => (
            <InputGroup>
              <InputRightElement>
                <Popover placement="bottom-end">
                  <PopoverTrigger>
                    <IconButton
                      bg="transparent"
                      _active="none"
                      _hover="none"
                      _focus="none"
                      color="black"
                      icon={(
                        <EmojiIcon
                          fontSize="1.8rem"
                          bg="yellow"
                          borderRadius="full"
                        />
                      )}
                    />
                  </PopoverTrigger>
                  <PopoverContent
                    className={styles.Picker}
                    _focus="none"
                    border="none"
                  >
                    <PopoverArrow />
                    {/* TODO: remove emoji mart, build own emoji */}
                    <NimblePicker
                      sheetSize={32}
                      onClick={icon => field.onChange(`${field.value}${icon.native}`)}
                    />
                  </PopoverContent>
                </Popover>
              </InputRightElement>
              <Input
                border="none"
                _focus="none"
                _focusWithin="none"
                bg="transparent"
                placeholder="Type message..."
                onFocus={onHandleFocusInput}
                onKeyDown={hanleKeyDown}
                {...field}
              />
            </InputGroup>
          )}
        />
      </form>
      <UploadImage onSendImage={handleSendImage} />
      <IconButton
        bg="transparent"
        color="blue.400"
        fontSize="1.6rem"
        _hover={{ bg: 'blue.50' }}
        icon={<PaperPlaneIcon />}
        onClick={handleSubmitMessage}
      />
    </HStack>
  );
};

const UploadImage = ({ onSendImage, maxSize = 1 }) => {
  const toast = useToast();

  const inputImageRef = useRef();
  const handleClick = () => inputImageRef.current.click();
  const handleChange = () => {
    if (!inputImageRef.current.files.length) return;
    const imageUrls = [];
    const images = inputImageRef.current.files;
    let sizeImages = 0;
    for (const image of images) {
      imageUrls.push(image);
      sizeImages += image.size;
    }
    inputImageRef.current.value = '';
    // 1B
    if (sizeImages > maxSize * 1024 * 1024) {
      toast({
        description: `Size file has to less ${maxSize}MB`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    onSendImage(imageUrls);
  };
  return (
    <Box>
      <IconButton
        bg="transparent"
        _hover={{ bg: 'blue.100' }}
        onClick={handleClick}
        icon={<ImageIcon color="blue.400" fontSize="2rem" />}
      />
      <Input
        ref={inputImageRef}
        onChange={handleChange}
        type="file"
        accept="image/*"
        multiple
        display="none"
      />
    </Box>
  );
};

export default MessageInput;
