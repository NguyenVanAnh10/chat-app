import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  Input,
  Alert,
  AlertIcon,
  AlertDescription,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";

import api from "services/api";

const RegisterModal = ({ isOpen, onClose }) => {
  const [{ error, success }, setStatus] = useState({});
  const { control, handleSubmit, reset } = useForm({ defaultValues: {} });

  const onHandleSubmit = handleSubmit((data) => {
    api.POST("/register", data).then(({ error }) => {
      setStatus({ success: !error, error });
      !error && reset({});
    });
  });
  const onHandleClose = () => {
    onClose();
    setStatus({});
  };

  return (
    <Modal size="xl" isCentered isOpen={isOpen} onClose={onHandleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Register account</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {success ? (
            <div>
              We just have sent a mail for register confirmation, please check
              email
            </div>
          ) : (
            <form>
              <Controller
                name="userName"
                control={control}
                defaultValue=""
                rules={{ required: "User name is required" }}
                render={({ field, fieldState: { error, invalid } }) => (
                  <FormControl isInvalid={invalid}>
                    <Input placeholder="User name" {...field} />
                    {error && (
                      <FormErrorMessage>{error.message}</FormErrorMessage>
                    )}
                  </FormControl>
                )}
              />
              <Controller
                name="email"
                control={control}
                defaultValue=""
                rules={{ required: "Email is required" }}
                render={({ field, fieldState: { error, invalid } }) => (
                  <FormControl isInvalid={invalid} marginTop="5">
                    <Input placeholder="Email" {...field} />
                    {error && (
                      <FormErrorMessage>{error.message}</FormErrorMessage>
                    )}
                  </FormControl>
                )}
              />
            </form>
          )}
          {error && (
            <Alert status="error" marginTop="5">
              <AlertIcon />
              <AlertDescription>
                {error.message || "Something went wrong"}
              </AlertDescription>
            </Alert>
          )}
        </ModalBody>

        <ModalFooter>
          {!success && (
            <Button colorScheme="blue" onClick={onHandleSubmit}>
              Register
            </Button>
          )}
          <Button variant="ghost" ml={3} onClick={onHandleClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default RegisterModal;
