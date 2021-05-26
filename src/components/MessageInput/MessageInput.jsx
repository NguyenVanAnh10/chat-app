import React, { useContext, useRef } from "react";
import {
  Box,
  Button,
  HStack,
  IconButton,
  Input,
  useToast,
} from "@chakra-ui/react";
import { v4 as uuid } from "uuid";
import { useForm, Controller } from "react-hook-form";

import { ImageIcon } from "components/CustomIcons";
import useMessages from "hooks/useMessages";
import { AccountContext } from "App";
import { getBase64 } from "utils";

const MessageInput = ({ roomId, onFocusInput }) => {
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
    <HStack w="100%" pb="2" pr="3" mt="0" spacing="2">
      <form className="form" onSubmit={handleSubmitMessage}>
        <Controller
          name="message"
          control={control}
          defaultValue=""
          rules={{ required: true }}
          render={({ field }) => (
            <Input
              placeholder="Type message..."
              onFocus={onFocusInput}
              {...field}
            />
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
