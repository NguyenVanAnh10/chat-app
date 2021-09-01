import React, { useRef, useEffect } from 'react';

export default function Video({ srcObject }) {
  const ref = useRef();
  useEffect(() => {
    if (!ref.current) return;
    ref.current.srcObject = srcObject;
    ref.current.play();
  }, [srcObject]);
  return <video ref={ref} style={{ height: 200, width: 200 }} />;
}
