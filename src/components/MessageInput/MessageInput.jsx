import React, { useContext, useRef } from "react";
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
} from "@chakra-ui/react";
import { v4 as uuid } from "uuid";
import { useForm, Controller } from "react-hook-form";
import { Picker } from "mr-emoji";

import { ImageIcon, EmojiIcon, PaperPlaneIcon } from "components/CustomIcons";
import useMessages from "hooks/useMessages";
import { AccountContext } from "App";
import { getBase64 } from "utils";

import styles from "./MessageInput.module.scss";

const MessageInput = ({ roomId, onFocusInput, ...rest }) => {
  const { account } = useContext(AccountContext);

  const [, { sendMessage }] = useMessages(roomId, account._id);

  const { control, handleSubmit, reset } = useForm({ message: "" });
  const handleSubmitMessage = handleSubmit((data) => {
    if (!data.message) return;
    onSendMessage({ contentType: "text", content: data.message });
    reset({ message: "" });
  });
  const handleSendImage = async (imageUrls) => {
    if (!imageUrls.length) return;
    try {
      const base64Image = (await getBase64(imageUrls[0])).replace(
        /^data:image\/[a-z]+;base64,/,
        ""
      );
      onSendMessage({
        contentType: "image",
        contentBlob: URL.createObjectURL(imageUrls[0]),
        base64Image,
      });
    } catch (error) {
      console.error(error);
    }
  };
  const onSendMessage = ({
    content,
    contentType,
    base64Image,
    contentBlob,
  }) => {
    sendMessage({
      roomId,
      content,
      contentType,
      contentBlob,
      base64Image,
      keyMsg: uuid(),
      status: false,
      createAt: Date.now(),
      senderId: account._id,
      hadSeenMessageUsers: [account._id],
    });
  };
  const hanleKeyDown = (e) => {
    if (e.keyCode !== 13) return;
    handleSubmitMessage();
  };
  return (
    <HStack w="100%" pb="2" pr="3" mt="0" spacing="2" {...rest}>
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
                      icon={
                        <EmojiIcon
                          color="pink.700"
                          fontSize="1.8rem"
                          borderRadius="full"
                          bg="yellow.300"
                        />
                      }
                    />
                  </PopoverTrigger>
                  <PopoverContent
                    className={styles.Picker}
                    w="100%"
                    _focus="none"
                    border="none"
                  >
                    <PopoverArrow />
                    <Picker
                      set="apple"
                      sheetSize={32}
                      onClick={(icon) =>
                        field.onChange(`${field.value}${icon.native}`)
                      }
                    />
                  </PopoverContent>
                </Popover>
              </InputRightElement>
              <Input
                placeholder="Type message..."
                onFocus={onFocusInput}
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
        color="pink.500"
        fontSize="1.5rem"
        _hover={{ bg: "pink.100" }}
        icon={<PaperPlaneIcon />}
        onClick={handleSubmitMessage}
      >
        Send
      </IconButton>
    </HStack>
  );
};

const UploadImage = ({ onSendImage, maxSize = 1 }) => {
  const toast = useToast();

  const inputImageRef = useRef();
  const handleClick = () => inputImageRef.current.click();
  const handleChange = (e) => {
    if (!inputImageRef.current.files.length) return;
    const imageUrls = [];
    const images = inputImageRef.current.files;
    let sizeImages = 0;
    for (const image of images) {
      imageUrls.push(image);
      sizeImages += image.size;
    }
    inputImageRef.current.value = "";
    // 1B
    if (sizeImages > maxSize * 1024 * 1024) {
      return toast({
        description: `Size file has to less ${maxSize}MB`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    onSendImage(imageUrls);
  };
  return (
    <Box>
      <IconButton
        bg="pink.50"
        _hover={{ bg: "pink.100" }}
        onClick={handleClick}
        icon={<ImageIcon color="pink.400" fontSize="2rem" />}
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
