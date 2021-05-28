import React, { useEffect as useReactEffect, useRef } from "react";
import videojs from "video.js";

const VideoPlayer = ({ videoSrc, options = {}, ...rest }) => {
  const playerRef = useRef();
  const videoNode = useRef({});

  useReactEffect(() => {
    videoNode.current.srcObject = videoSrc;

    playerRef.current = videojs(
      videoNode.current,
      {
        autoplay: true,
        controls: true,
        muted: true,
        playsInline: true,
        autoPlay: true,
        loadingSpinner: false,
        errorDisplay: false,
        textTrackSettings: false,
        bigPlayButton: false,
        responsive: true,
        fluid: false,
        // aspectRatio: '9:16',
        // height: 300,
        width: "300px",
        fill: false,
        controlBar: {
          currentTimeDisplay: false,
          playToggle: true,
          captionsButton: false,
          chaptersButton: false,
          subtitlesButton: false,
          remainingTimeDisplay: false,
          durationDisplay: false,
          audioTrackButton: false,
          descriptionsButton: false,
          volumePanel: false,
          children: false,
          customControlSpacer: false,
          liveDisplay: false,
          pictureInPictureToggle: false,
          seekToLive: false,
          subsCapsButton: false,
          timeDivider: false,
          progressControl: {
            seekBar: true,
          },
          fullscreenToggle: false,
          playbackRateMenuButton: false,
        },
        ...options,
      },
      function onPlayerReady() {
        // console.log("onPlayerReady", videoNode.current);
      }
    );
    return () => {
      playerRef.current.dispose();
    };
  }, [videoSrc]);
  // wrap the player in a div with a `data-vjs-player` attribute
  // so videojs won't create additional wrapper in the DOM
  // see https://github.com/videojs/video.js/pull/3856
  return (
    <div data-vjs-player>
      <video ref={videoNode} className="video-js"></video>
    </div>
  );
};

export default VideoPlayer;
