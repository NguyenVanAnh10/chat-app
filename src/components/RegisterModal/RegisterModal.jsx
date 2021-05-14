import React, { useState, useEffect } from "react";
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
} from "@chakra-ui/react";

import api from "services/api";
import useQuery from "hooks/useQuery";

const RegisterModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({});
  const [{ error, success }, setStatus] = useState({});
  const [, setCheckToken] = useState({});
  const { token } = useQuery();

  const onHandleSubmit = (e) => {
    e.preventDefault();
    api
      .POST("/register", formData)
      .then(({ error }) => setStatus({ success: !error, error }));
  };

  useEffect(() => {
    token &&
      api
        .GET("/register", { token })
        .then(({ error }) => setCheckToken({ success: !error, error }));
  }, [token]);

  if (success) {
    return (
      <div>
        We just have sent a mail to you for confirmation, please check email
      </div>
    );
  }

  //   if (checkToken.success) {
  //     return <Redirect to="/login" />;
  //   }

  //   if (checkToken.error) {
  //     return (
  //       <div>
  //         Token can be expired time or is not exactly, please register again.
  //       </div>
  //     );
  //   }
  return (
    <Modal size="xl" isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Register account</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {success ? (
            <div>
              We just have sent a mail to you for confirmation, please check
              email
            </div>
          ) : (
            <form>
              <FormControl id="user" isRequired>
                <Input
                  placeholder="User name"
                  value={formData.userName}
                  onChange={(e) =>
                    setFormData({ ...formData, userName: e.target.value })
                  }
                />
              </FormControl>
              <FormControl id="user" isRequired marginTop="5">
                <Input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </FormControl>
              <FormControl id="user" isRequired marginTop="5">
                <Input
                  type="password"
                  placeholder="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </FormControl>
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
          <Button variant="ghost" ml={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default RegisterModal;
