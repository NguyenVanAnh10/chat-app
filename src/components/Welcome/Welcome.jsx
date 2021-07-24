import React from 'react';
import { VStack, Heading, Text, Image, Center, AspectRatio, Box } from '@chakra-ui/react';
import Slider from 'react-slick';

import messageChatImg from 'statics/images/welcome_alorice.jpg';
import videoCallImg from 'statics/images/video_call.jpg';

export default function Welcome() {
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    autoplay: true,
    arrows: false,
    autoplaySpeed: 5000,
  };
  const carousels = [
    {
      key: 'message',
      src: messageChatImg,
    },
    {
      key: 'video',
      src: videoCallImg,
    },
  ];
  return (
    <Center w="100%" px="5" py="8" flexDir="column" flex="1" minW="0">
      <VStack fontWeight="light" userSelect="none">
        <Heading fontSize="x-large">Welcome to Alo Rice</Heading>
        <Text fontSize="md">The application allows you to chat with your friends and family</Text>
      </VStack>
      <Box w="100%" maxW="800px" mt="10" px="10">
        <Slider {...carouselSettings}>
          {carousels.map(c => (
            <Box key={c.key} px="5">
              <AspectRatio ratio={16 / 9}>
                <Image src={c.src} objectFit="cover" borderRadius="lg" />
              </AspectRatio>
            </Box>
          ))}
        </Slider>
      </Box>
    </Center>
  );
}
