import React, { forwardRef } from 'react';
import {
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  useDisclosure,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

const PasswordInput = forwardRef(({ placeholder, ...rest }, ref) => {
  const { isOpen, onToggle } = useDisclosure();
  return (
    <InputGroup size="md" ref={ref}>
      <Input
        pr="4.5rem"
        type={isOpen ? 'text' : 'password'}
        placeholder={placeholder || 'Enter password'}
        {...rest}
      />
      <InputRightElement width="4.5rem">
        <IconButton
          bg="transparent"
          _focus="none"
          _hover="none"
          h="1.75rem"
          size="lg"
          onClick={onToggle}
          icon={isOpen ? <ViewIcon /> : <ViewOffIcon />}
        />
      </InputRightElement>
    </InputGroup>
  );
});

export default PasswordInput;
