import { forwardRef, useEffect } from 'react';
import VideoContainer from './VideoContainer';

interface VideoPlayerProps {
  videoUrl: string;
}

const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(({ videoUrl }, ref) => {
  const handleVisibilityChange = (isVisible: boolean) => {
    const videoElement = ref as React.RefObject<HTMLVideoElement>;
    if (!videoElement?.current) return;

    if (isVisible) {
      videoElement.current.play().catch(error => {
        console.error("Playback error:", error);
      });
    } else {
      videoElement.current.pause();
    }
  };

  useEffect(() => {
    return () => {
      const videoElement = ref as React.RefObject<HTMLVideoElement>;
      if (videoElement?.current) {
        videoElement.current.pause();
      }
    };
  }, [ref]);

  return (
    <VideoContainer onVisibilityChange={handleVisibilityChange}>
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full object-cover"
        playsInline
        loop
        muted={false}
        preload="auto"
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
    </VideoContainer>
  );
});

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;