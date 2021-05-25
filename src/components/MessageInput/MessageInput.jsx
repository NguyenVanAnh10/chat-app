import React, { useContext, useEffect as useReactEffect, useRef } from "react";
import { Box, Button, HStack, IconButton, Input } from "@chakra-ui/react";
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
    console.log(typeof imageUrls[0]);
    try {
      const base64Image = (await getBase64(imageUrls[0])).replace(
        /^data(.)*base64,/,
        ""
      );
      console.log("base64Image", typeof base64Image);
      onSendMessage({
        contentType: "image",
        content: URL.createObjectURL(imageUrls[0]),
        base64Image,
      });
    } catch (error) {
      console.error(error);
    }
  };
  const onSendMessage = ({ content, contentType, base64Image }) => {
    sendMessage({
      roomId,
      content,
      contentType,
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

const UploadImage = ({ onSendImage }) => {
  const inputImageRef = useRef();
  useReactEffect(() => {}, []);
  const handleClick = () => inputImageRef.current.click();
  const handleChange = () => {
    if (!inputImageRef.current.files.length) return;
    const imageUrls = [];
    const images = inputImageRef.current.files;
    for (const image of images) {
      console.log(typeof image);
      imageUrls.push(image);
    }
    onSendImage(imageUrls);
  };
  return (
    <Box>
      <IconButton
        onClick={handleClick}
        icon={<ImageIcon color="pink.400" fontSize="3.2rem" />}
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
