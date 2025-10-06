import { useRef, forwardRef, useImperativeHandle } from 'react';
import {
  MediaController,
  MediaControlBar,
  MediaTimeRange,
  MediaTimeDisplay,
  MediaVolumeRange,
  MediaPlaybackRateButton,
  MediaPlayButton,
  MediaSeekBackwardButton,
  MediaSeekForwardButton,
  MediaMuteButton,
  MediaFullscreenButton,
} from "media-chrome/react";

export interface VideoPlayerProps {
  src: string;
  onTimeUpdate?: (currentTime: number) => void;
}

export interface VideoPlayerRef {
  seekTo: (seconds: number) => void;
  getCurrentTime: () => number;
  play: () => void;
  pause: () => void;
}

export const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(({ src, onTimeUpdate }, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useImperativeHandle(ref, () => ({
    seekTo(seconds: number) {
      if (videoRef.current) {
        videoRef.current.currentTime = seconds;
      }
    },
    getCurrentTime() {
      return videoRef.current?.currentTime || 0;
    },
    play() {
      videoRef.current?.play();
    },
    pause() {
      videoRef.current?.pause();
    },
  }));

  return (
    <MediaController
      style={{
        height: "100%",
        aspectRatio: "16/9",
        backgroundColor: "black",
      }}
    >
      <video
        onTimeUpdate={(e) =>{
          if(onTimeUpdate)
            onTimeUpdate((e.target as HTMLVideoElement).currentTime);
        }}
        ref={videoRef}
        slot="media"
        src={src}
        preload="auto"
        style={{
          width: "100%",
          height: "100%",
        }}
      />

      <MediaControlBar>
        <MediaPlayButton />
        <MediaSeekBackwardButton seekOffset={5} />
        <MediaSeekForwardButton seekOffset={5} />
        <MediaTimeRange />
        <MediaTimeDisplay showDuration />
        <MediaMuteButton />
        <MediaVolumeRange />
        <MediaPlaybackRateButton rates={[0.5, 1, 1.5, 2]}/>
        <MediaFullscreenButton />
      </MediaControlBar>
    </MediaController>
  );
});