import React, { useRef } from 'react';
import { Box, Input, useToast } from '@chakra-ui/react';

import { getBase64 } from 'utils';

const UploadImage = ({
  maxSize = 1,
  onSelectImage,
  renderButton = () => {},
}) => {
  const toast = useToast();

  const inputImageRef = useRef();
  const handleClick = () => inputImageRef.current.click();
  const handleChange = async () => {
    if (!inputImageRef.current.files.length) return;
    const imageUrls = [];
    const images = inputImageRef.current.files;
    let sizeImages = 0;
    for (const image of images) {
      imageUrls.push(image);
      sizeImages += image.size;
    }
    inputImageRef.current.value = '';
    // 1B
    if (sizeImages > maxSize * 1024 * 1024) {
      toast({
        description: `Size file has to less ${maxSize}MB`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    try {
    // TODO return images array
      const base64Image = (await getBase64(imageUrls[0])).replace(
        /^data:image\/[a-z]+;base64,/,
        '',
      );
      const contentBlob = URL.createObjectURL(imageUrls[0]);
      onSelectImage({ base64Image, contentBlob });
    } catch (error) {
      console.error(error);
      return {};
    }
  };
  return (
    <Box>
      <Box onClick={handleClick} width="auto" cursor="pointer">
        {renderButton()}
      </Box>
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

export default UploadImage;
