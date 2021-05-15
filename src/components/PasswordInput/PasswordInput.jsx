import {
  Button,
  Input,
  InputGroup,
  InputRightElement,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";

const PasswordInput = ({ placeholder, ...rest }) => {
  const { isOpen, onToggle } = useDisclosure();
  return (
    <InputGroup size="md">
      <Input
        pr="4.5rem"
        type={isOpen ? "text" : "password"}
        placeholder={placeholder || "Enter password"}
        {...rest}
      />
      <InputRightElement width="4.5rem">
        <Button h="1.75rem" size="sm" onClick={onToggle}>
          {isOpen ? "Hide" : "Show"}
        </Button>
      </InputRightElement>
    </InputGroup>
  );
};

export default PasswordInput;
