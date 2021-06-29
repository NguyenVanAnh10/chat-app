import { useEffect, useRef, useState } from 'react';

// TODO return [stuck, target] IntersectionObserver.callback observer bottom always run after the observer header
const useObserver = ({
  containerRef,
  sentinels = { top: [], bottom: [] },
}) => {
  const [state, setState] = useState([]);
  const isScrollDownRef = useRef(false);
  const prevScrollTopRef = useRef(0);

  const scrollListener = e => {
    isScrollDownRef.current = e.target.scrollTop > prevScrollTopRef.current;
    prevScrollTopRef.current = e.target.scrollTop;
  };

  useEffect(() => {
    containerRef.current.addEventListener('scroll', scrollListener);
    return () => {
      containerRef.current?.removeEventListener('scroll', scrollListener);
    };
  }, []);

  useEffect(() => {
    const observerHeader = new IntersectionObserver(
      records => {
        for (const record of records) {
          const targetInfo = record.boundingClientRect;
          const stickyTarget = record.target.parentElement;
          const rootBoundsInfo = record.rootBounds;

          if (targetInfo.bottom < rootBoundsInfo.top) {
            // setState([true, stickyTarget]);
            setState([stickyTarget]);
            return;
          }

          if (
            targetInfo.bottom >= rootBoundsInfo.top
              && targetInfo.bottom < rootBoundsInfo.bottom
              && !isScrollDownRef.current
          ) {
            // setState([false, stickyTarget]);
            return;
          }
        }
      },
      {
        rootMargin: '-12px 0px 0px 0px',
        threshold: [0],
        root: containerRef.current,
      },
    );
    sentinels.top.forEach(el => observerHeader.observe(el.current));

    const observerBottom = new IntersectionObserver(
      records => {
        for (const record of records) {
          const targetInfo = record.boundingClientRect;
          const stickyTarget = record.target.parentElement;
          const rootBoundsInfo = record.rootBounds;
          const ratio = record.intersectionRatio;

          if (targetInfo.bottom > rootBoundsInfo.top
            && !isScrollDownRef.current && ratio === 1) {
            // setState([true, stickyTarget]);
            setState([stickyTarget]);
            return;
          }

          if (
            targetInfo.top < rootBoundsInfo.top
          && targetInfo.bottom < rootBoundsInfo.bottom
          ) {
            // setState([false, stickyTarget]);
            return;
          }
        }
      },
      {
        rootMargin: '-12px 0px 0px 0px',
        threshold: [1],
        root: containerRef.current,
      },
    );
    sentinels.bottom.forEach(el => observerBottom.observe(el.current));
  }, []);

  return state;
};

export default useObserver;
