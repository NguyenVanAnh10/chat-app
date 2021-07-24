import React, { Suspense, useRef } from 'react';

const LazyMount = ({ children, trigger = false, fallback }) => {
  const mountRef = useRef(trigger);
  if (trigger) {
    mountRef.current = true;
  }

  if (!mountRef.current) return null;
  if (fallback && mountRef.current) {
    return (
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    );
  }
  return (
    <>
      {children}
    </>
  );
};
export default LazyMount;
