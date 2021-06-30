import React, { useRef, memo } from 'react';
import { Box, Input, useToast } from '@chakra-ui/react';

import { getBase64 } from 'utils';

const UploadImage = memo(({
  maxSize = 5,
  onSelectImage,
  renderButton = () => {},
  ...rest
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
    if (imageUrls[0].type !== 'image/jpeg' && imageUrls[0].type !== 'image/png') {
      toast({
        description: 'The file format must be jpeg(jpg) or png',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (sizeImages > maxSize * 1024 * 1024) {
      toast({
        description: `The image size has to less ${maxSize}MB`,
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
    <>
      <Box onClick={handleClick} width="min-content" {...rest}>
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
    </>
  );
});

export default UploadImage;
