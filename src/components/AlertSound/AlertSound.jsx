import React, { useRef, useEffect } from 'react';

export default function AlertSound({ src, isPlay }) {
  const ref = useRef();
  useEffect(() => {
    if (!isPlay) {
      ref.current?.pause();
      return;
    }
    ref.current?.play();
  }, [isPlay]);
  return (
    <div style={{ display: 'none' }}>
      <audio ref={ref} autoPlay loop controls src={src} />
    </div>
  );
}
