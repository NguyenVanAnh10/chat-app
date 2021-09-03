import React, { useEffect, useRef } from 'react';
import { Box } from '@chakra-ui/layout';
import videojs from 'videojs';

import styles from './VideoPlayer.module.scss';
import 'video.js/dist/video-js.css';

/**
 *
 * @param {{videoSrc: object, options: object} & import('@chakra-ui/react/dist/types').BoxProps} props
 * @returns
 */
const VideoPlayer = ({ videoSrc, options, ...rest }) => {
  const playerRef = useRef();
  const videoNode = useRef();

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.aspectRatio(options.aspectRatio);
      videoNode.current.srcObject = videoSrc;
      return;
    }
    videoNode.current.srcObject = videoSrc;
    playerRef.current = videojs(
      videoNode.current,
      {
        autoplay: true,
        controls: true,
        muted: false,
        responsive: true,
        aspectRatio: '4:3',
        fluid: false,
        bigPlayButton: false,
        controlBar: {
          fullscreenToggle: true,
          pictureInPictureToggle: true,
          volumePanel: false,
          playToggle: false,
          liveDisplay: false,
        },
        ...options,
      },
      () => {
        // console.log("onPlayerReady", videoNode.current);
      },
    );
  }, [videoSrc, options]);

  useEffect(
    () => () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    },
    [],
  );

  return (
    <Box w="100%" className={styles.VideoPlayer} {...rest}>
      <div data-vjs-player>
        <video ref={videoNode} className="video-js vjs-big-play-centered" />
      </div>
    </Box>
  );
};

export default VideoPlayer;
