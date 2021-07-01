import { useEffect, useRef, useState } from 'react';
import debounce from 'lodash.debounce';

// TODO return [stuck, target] + refactor
const useObserver = ({
  containerRef,
  sentinels = { top: [], bottom: [] },
}) => {
  const [state, setState] = useState();
  const isScrollDownRef = useRef(false);
  const prevScrollTopRef = useRef(0);
  const isSetStateByScrollEventListener = useRef(true);
  const debounceRef = useRef();

  const setObserveTarget = target => {
    setState(target);
    isSetStateByScrollEventListener.current = false;
  };

  const scrollListener = e => {
    isScrollDownRef.current = e.target.scrollTop > prevScrollTopRef.current;
    prevScrollTopRef.current = e.target.scrollTop;
    debounceRef.current?.cancel();
    debounceRef.current = debounce(() => {
      if (!isSetStateByScrollEventListener.current) {
        isSetStateByScrollEventListener.current = true;
      }
    }, 300);
    debounceRef.current();
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
        if (!isSetStateByScrollEventListener.current) return;

        for (const record of records) {
          const targetInfo = record.boundingClientRect;
          const stickyTarget = record.target.parentElement;
          const rootBoundsInfo = record.rootBounds;

          if (targetInfo.bottom < rootBoundsInfo.top) {
            // setState([true, stickyTarget]);
            setState(stickyTarget);
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
        if (!isSetStateByScrollEventListener.current) return;

        for (const record of records) {
          const targetInfo = record.boundingClientRect;
          const stickyTarget = record.target.parentElement;
          const rootBoundsInfo = record.rootBounds;
          const ratio = record.intersectionRatio;

          if (targetInfo.bottom > rootBoundsInfo.top
            && !isScrollDownRef.current && ratio === 1) {
            // setState([true, stickyTarget]);
            setState(stickyTarget);
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

  return [{ observeTarget: state }, { setObserveTarget }];
};

export default useObserver;
