import { useEffect, useRef, useState } from 'react';
import debounce from 'lodash.debounce';

/**
 * @returns {{width: number, height: number}}
 */
const useResize = () => {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const debouceRef = useRef();

  useEffect(() => {
    window.addEventListener('resize', e => {
      debouceRef.current?.cancel();
      debouceRef.current = debounce(() => {
        setSize({ width: e.target.innerWidth, height: e.target.innerHeight });
      }, 300);
      debouceRef.current();
    });
  }, []);

  return size;
};

export default useResize;
