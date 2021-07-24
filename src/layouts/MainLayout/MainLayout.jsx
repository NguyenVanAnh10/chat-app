import React, { useEffect, useRef, useState } from 'react';
import { Box, useBreakpointValue } from '@chakra-ui/react';

const MainLayout = ({ children }) => {
  const [height, setHeight] = useState(() => window.innerHeight || '100vh');
  const isMobileScreen = useBreakpointValue({ base: true, md: false });

  const chatBoxRef = useRef();

  useEffect(() => {
    window.addEventListener('resize', e => {
      if (!chatBoxRef.current || !isMobileScreen) return;
      setHeight(e.target.innerHeight);
    });
  }, [isMobileScreen]);

  return (
    <Box
      ref={chatBoxRef}
      h={`${height}px`}
      w="100%"
    >
      {children}
    </Box>
  );
};
export default MainLayout;
