import { forwardRef, useEffect, useState } from 'react';
import VideoContainer from './VideoContainer';

interface VideoPlayerProps {
  videoUrl: string;
}

const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(({ videoUrl }, ref) => {
  const [hasStartedLoading, setHasStartedLoading] = useState(false);

  const handleVisibilityChange = (isVisible: boolean) => {
    const videoElement = ref as React.RefObject<HTMLVideoElement>;
    if (!videoElement.current) return;

    if (isVisible && !hasStartedLoading) {
      setHasStartedLoading(true);
      videoElement.current.preload = 'metadata';
      videoElement.current.currentTime = 0;

      setTimeout(() => {
        if (videoElement.current && isVisible) {
          videoElement.current.load();
          const playPromise = videoElement.current.play();
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.error("Playback error:", error);
              setHasStartedLoading(false);
            });
          }
        }
      }, 250);
    } else if (!isVisible && videoElement.current) {
      videoElement.current.pause();
      videoElement.current.currentTime = 0;
      videoElement.current.preload = 'none';
      setHasStartedLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      const videoElement = ref as React.RefObject<HTMLVideoElement>;
      if (videoElement.current) {
        videoElement.current.pause();
        videoElement.current.currentTime = 0;
        videoElement.current.preload = 'none';
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
        preload="none"
        poster={videoUrl + '?poster=1'}
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
    </VideoContainer>
  );
});

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;