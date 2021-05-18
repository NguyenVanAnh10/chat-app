import React from "react";
import { Button, HStack, Input } from "@chakra-ui/react";

import { useForm, Controller } from "react-hook-form";

const MessageInput = ({ onSendMessage }) => {
  const { control, handleSubmit, reset } = useForm({ message: "" });
  const handleSubmitMessage = handleSubmit((data) => {
    if (!data.message) return;
    onSendMessage(data.message);
    reset({ message: "" });
  });

  return (
    <HStack w="100%" pb="2" pr="3" mt="0" spacing="2">
      <form className="form" onSubmit={handleSubmitMessage}>
        <Controller
          name="message"
          control={control}
          defaultValue=""
          rules={{ required: true }}
          render={({ field }) => (
            <Input placeholder="Type message..." {...field} />
          )}
        />
      </form>
      <Button background="red.100" onClick={handleSubmitMessage}>
        Send
      </Button>
    </HStack>
  );
};

export default MessageInput;
