import React, { memo, useCallback, useEffect, useRef, useState, useMemo, createRef } from 'react';
import {
  SimpleGrid,
  Text,
  VStack,
  Box,
  HStack,
  Button,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import debounce from 'lodash.debounce';

import Emoji from 'components/Emoji';
import emojiBlocks from './emoji';
import emojiData from './data';

import useObserver from 'hooks/useObserver';
import { useModel } from 'model';

import styles from './EmojiPicker.module.scss';

const { catagory, emojis } = emojiData;

const EmojiPicker = memo(({ onSelect }) => {
  const containerRef = useRef();

  const [{ frequentlyUsedIcons }, { updateStatic }] = useModel('account', state => ({
    frequentlyUsedIcons: state.statics.icons,
  }));

  const data = useMemo(
    () =>
      emojiBlocks
        .map(e =>
          e.key === 'frequently_used'
            ? {
                ...e,
                emojiIds: frequentlyUsedIcons,
                emojiBlockRef: createRef(),
                topSentinelRef: createRef(),
                bottomSentinelRef: createRef(),
              }
            : {
                ...e,
                emojiIds: catagory[e.key],
                emojiBlockRef: createRef(),
                topSentinelRef: createRef(),
                bottomSentinelRef: createRef(),
              },
        )
        .filter(e => !!e.emojiIds.length),
    [],
  );

  return (
    <Box w="100%" p="3" boxShadow="lg" className={styles.EmojiPicker}>
      <PickerHeader containerRef={containerRef} data={data} />
      <VStack
        ref={containerRef}
        h="300px"
        spacing="3"
        overflowY="auto"
        overflowX="hidden"
        className="emojis"
      >
        {data.map(e => (
          <VStack w="100%" key={e.key} ref={e.emojiBlockRef} spacing="0" justify="start">
            <div ref={e.topSentinelRef} />
            <Text
              size="sm"
              py="1"
              color="gray.600"
              pos="sticky"
              top="0"
              left="0"
              right="0"
              bg="whiteAlpha.900"
              w="100%"
            >
              {e.title}
            </Text>
            <SimpleGrid columns={8} spacing="3">
              {e.emojiIds.map(id => (
                <Emoji
                  key={id}
                  coordinates={emojis[id]}
                  text={id}
                  onClick={() => {
                    onSelect({
                      key: id,
                      coordinates: emojis[id],
                    });
                    e.key !== 'frequently_used' &&
                      !frequentlyUsedIcons.includes(id) &&
                      updateStatic({ icon: id });
                  }}
                />
              ))}
            </SimpleGrid>
            <div ref={e.bottomSentinelRef} />
          </VStack>
        ))}
      </VStack>
    </Box>
  );
});

// TODO refactor
const PickerHeader = memo(({ containerRef, data: d }) => {
  const data = d.map(dd => ({ ...dd, tabRef: createRef() }));
  const containerScrollDebounceRef = useRef();

  // container observer
  const [{ observeTarget }, { setObserveTarget }] = useObserver({
    containerRef,
    sentinels: {
      top: data.map(dd => dd.topSentinelRef),
      bottom: data.map(dd => dd.bottomSentinelRef),
    },
  });

  const selectedTabRef = useRef();

  const [{ left, right }, setDisableNavigationBar] = useState({
    left: true,
    right: false,
  });

  const scrollEmojiTabRef = useRef();
  const prevScrollTopContainerRef = useRef();

  useEffect(() => {
    const activedTabRef = data.find(dd => dd.emojiBlockRef.current === observeTarget);
    if (!activedTabRef) return;
    selectedTabRef.current = activedTabRef.tabRef.current;
  }, [observeTarget]);

  const onScrollEmojiTabListener = () => {
    if (
      scrollEmojiTabRef.current.scrollWidth - scrollEmojiTabRef.current.scrollLeft ===
      scrollEmojiTabRef.current.clientWidth
    ) {
      !right && setDisableNavigationBar({ left: false, right: true });
      return;
    }
    if (scrollEmojiTabRef.current.scrollLeft <= 0) {
      !left && setDisableNavigationBar({ left: true, right: false });
      return;
    }
    (right || left) && setDisableNavigationBar({ left: false, right: false });
  };

  useEffect(() => {
    containerRef.current.addEventListener('scroll', onScrollEmojiListener);
    return () => {
      containerRef.current?.removeEventListener('scroll', onScrollEmojiListener);
    };
  }, []);

  const onScrollEmojiListener = e => {
    containerScrollDebounceRef.current?.cancel();
    containerScrollDebounceRef.current = debounce(() => {
      const selectedTabRect = selectedTabRef.current.getBoundingClientRect();
      const tabContainerRect = selectedTabRef.current.parentElement.getBoundingClientRect();
      const selectedTabLeftPosition = selectedTabRect.left - tabContainerRect.left;
      const selectedTabRightPosition = selectedTabLeftPosition + selectedTabRect.width;
      if (e.target.scrollTop < prevScrollTopContainerRef.current && selectedTabLeftPosition < 0) {
        scrollEmojiTabRef.current.scrollLeft += selectedTabLeftPosition;
      }
      if (
        e.target.scrollTop > prevScrollTopContainerRef.current &&
        selectedTabRightPosition > tabContainerRect.width
      ) {
        scrollEmojiTabRef.current.scrollLeft += selectedTabRightPosition - tabContainerRect.width;
      }
      prevScrollTopContainerRef.current = e.target.scrollTop;
    }, 300);
    containerScrollDebounceRef.current();
  };

  useEffect(() => {
    scrollEmojiTabRef.current.addEventListener('scroll', onScrollEmojiTabListener);
    return () => {
      scrollEmojiTabRef.current?.removeEventListener('scroll', onScrollEmojiTabListener);
    };
  }, [left, right]);

  const onHandleNext = useCallback(() => {
    if (
      scrollEmojiTabRef.current.scrollWidth - scrollEmojiTabRef.current.scrollLeft ===
      scrollEmojiTabRef.current.clientWidth
    ) {
      return;
    }
    scrollEmojiTabRef.current.scrollLeft += 300;
  }, []);
  const onHandlePrev = useCallback(() => {
    if (scrollEmojiTabRef.current.scrollLeft <= 0) {
      return;
    }
    scrollEmojiTabRef.current.scrollLeft -= 300;
  }, []);

  return (
    <HStack spacing="0" mx="-2.5" align="center" py="1" className={styles.PickerHeader}>
      <Button
        size="xs"
        colorScheme="blue"
        variant="ghost"
        _focus="none"
        _hover="none"
        _active="none"
        isDisabled={left}
        onClick={onHandlePrev}
      >
        ❮
      </Button>
      <HStack overflowX="auto" ref={scrollEmojiTabRef} className="icons-bar" spacing="2" py="2">
        {data.map(e => (
          <Tooltip key={e.key} label={e.title} fontSize="sm">
            <IconButton
              size="sm"
              p="2"
              colorScheme="blue"
              variant="ghost"
              ref={e.tabRef}
              isActive={e.emojiBlockRef.current === observeTarget}
              icon={e.icon}
              fontSize="xl"
              border="none"
              _focus="none"
              onClick={() => {
                setObserveTarget(e.emojiBlockRef.current);
                selectedTabRef.current = e.tabRef.current;
                e.emojiBlockRef.current?.scrollIntoView(true);
              }}
            />
          </Tooltip>
        ))}
      </HStack>
      <Button
        size="xs"
        colorScheme="blue"
        variant="ghost"
        _focus="none"
        _hover="none"
        _active="none"
        onClick={onHandleNext}
        isDisabled={right}
      >
        ❯
      </Button>
    </HStack>
  );
});
export default EmojiPicker;
