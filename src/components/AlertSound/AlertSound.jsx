import React, { useRef, useEffect } from 'react';

export default function AlertSound({ src, isPlay, volume = 0.5 }) {
  const ref = useRef();
  useEffect(() => {
    if (!ref.current) return;
    if (!isPlay) {
      ref.current.pause();
      return;
    }
    ref.current.volume = volume;
    ref.current.play();
  }, [isPlay]);
  return (
    <div style={{ display: 'none' }}>
      <audio ref={ref} autoPlay loop controls src={src} />
    </div>
  );
}
