import { useEffect, useRef } from 'react';
import debounce from 'lodash.debounce';

// direction: up, down
const useUserScroll = (
  ref,
  callback = () => {},
  dependencies,
  options = { direction: 'up' },
) => {
  const scrollDebouceRef = useRef();
  const wheelDebouceRef = useRef();
  const keydownDebouceRef = useRef();
  const mousedownDebouceRef = useRef();
  const mouseupDebouceRef = useRef();
  const prevScrollTopRef = useRef(0);
  const touchmoveDebouceRef = useRef();

  const keydownRef = useRef();
  const wheelRef = useRef(false);
  const mousedownScrollbarRef = useRef(false);
  const touchmoveRef = useRef(false);

  useEffect(() => {
    ref.current.addEventListener('touchmove', () => {
      touchmoveDebouceRef.current?.cancel();
      touchmoveDebouceRef.current = debounce(() => {
        touchmoveRef.current = true;
      }, 50);
      touchmoveDebouceRef.current();
    });

    ref.current.addEventListener('mouseup', () => {
      mouseupDebouceRef.current?.cancel();
      mouseupDebouceRef.current = debounce(() => {
        setTimeout(() => {
          mousedownScrollbarRef.current = false;
        }, 100);
      }, 50);
      mouseupDebouceRef.current();
    });

    ref.current.addEventListener('mousedown', e => {
      mousedownDebouceRef.current?.cancel();
      mousedownDebouceRef.current = debounce(() => {
        if (ref.current.clientWidth < e.clientX) {
          mousedownScrollbarRef.current = true;
        }
      }, 50);
      mousedownDebouceRef.current();
    });

    ref.current.addEventListener('wheel', () => {
      wheelDebouceRef.current?.cancel();
      wheelDebouceRef.current = debounce(() => {
        wheelRef.current = true;
      }, 50);
      wheelDebouceRef.current();
    });
    window.addEventListener('keydown', e => {
      keydownDebouceRef.current?.cancel();
      keydownDebouceRef.current = debounce(() => {
        keydownRef.current = e.keyCode;
      }, 50);
      keydownDebouceRef.current();
    });
    ref.current.addEventListener('scroll', () => {
      if (prevScrollTopRef.current <= ref.current?.scrollTop
            && options.direction === 'up') {
        prevScrollTopRef.current = ref.current?.scrollTop;
        return;
      }
      if (prevScrollTopRef.current > ref.current?.scrollTop
            && options.direction === 'down') {
        prevScrollTopRef.current = ref.current?.scrollTop;
        return;
      }
      scrollDebouceRef.current?.cancel();
      scrollDebouceRef.current = debounce(() => {
        if (wheelRef.current) {
          wheelRef.current = false;
          callback();
          return;
        }
        if (touchmoveRef.current) {
          touchmoveRef.current = false;
          callback();
          return;
        }
        if (
          keydownRef.current === 38
          || keydownRef.current === 39
          || keydownRef.current === 40
          || keydownRef.current === 41
        ) {
          keydownRef.current = undefined;
          callback();
          return;
        }
        if (mousedownScrollbarRef.current) {
          callback();
        }
      }, 50);
      scrollDebouceRef.current();
    });
  }, dependencies);
};

export default useUserScroll;
