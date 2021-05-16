import React, { forwardRef } from "react";
import {
  Button,
  Input,
  InputGroup,
  InputRightElement,
  useDisclosure,
} from "@chakra-ui/react";

const PasswordInput = forwardRef(({ placeholder, ...rest }, ref) => {
  const { isOpen, onToggle } = useDisclosure();
  return (
    <InputGroup size="md" ref={ref}>
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
});

export default PasswordInput;
