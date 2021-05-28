import React, { useContext, useRef } from "react";
import {
  Box,
  Button,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  Portal,
  useToast,
} from "@chakra-ui/react";
import { v4 as uuid } from "uuid";
import { useForm, Controller } from "react-hook-form";
// import data from "emoji-mart/data/twitter.json";
// import { Picker } from "emoji-mart/dist-modern/index.js";

import { ImageIcon, EmojiIcon } from "components/CustomIcons";
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
                  <Portal>
                    <PopoverContent className={styles.Picker}>
                      <PopoverArrow />
                      {/* <Picker
                        set="twitter"
                        data={data}
                        sheetSize={32}
                        onSelect={(icon) =>
                          field.onChange(`${field.value}${icon.native}`)
                        }
                      /> */}
                    </PopoverContent>
                  </Portal>
                </Popover>
              </InputRightElement>
              <Input
                placeholder="Type message..."
                onFocus={onFocusInput}
                {...field}
              />
            </InputGroup>
          )}
        />
      </form>
      <UploadImage onSendImage={handleSendImage} />
      <Button background="red.100" onClick={handleSubmitMessage}>
        Send
      </Button>
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
