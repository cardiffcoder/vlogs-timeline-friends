import { forwardRef, useEffect, useState } from 'react';
import VideoContainer from './VideoContainer';

interface VideoPlayerProps {
  videoUrl: string;
}

const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(({ videoUrl }, ref) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleVisibilityChange = (isVisible: boolean) => {
    const videoElement = ref as React.RefObject<HTMLVideoElement>;
    if (!videoElement?.current) return;

    if (isVisible) {
      // Reset video to beginning and play
      videoElement.current.currentTime = 0;
      videoElement.current.play().catch(error => {
        console.error("Playback error:", error);
        setHasError(true);
      });
    } else {
      videoElement.current.pause();
    }
  };

  useEffect(() => {
    const videoElement = ref as React.RefObject<HTMLVideoElement>;
    if (!videoElement?.current) return;

    const handleLoadStart = () => {
      setIsLoading(true);
      setHasError(false);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      setHasError(false);
    };

    const handleError = () => {
      setIsLoading(false);
      setHasError(true);
      console.error("Video loading error for URL:", videoUrl);
    };

    videoElement.current.addEventListener('loadstart', handleLoadStart);
    videoElement.current.addEventListener('canplay', handleCanPlay);
    videoElement.current.addEventListener('error', handleError);

    return () => {
      if (videoElement.current) {
        videoElement.current.removeEventListener('loadstart', handleLoadStart);
        videoElement.current.removeEventListener('canplay', handleCanPlay);
        videoElement.current.removeEventListener('error', handleError);
        videoElement.current.pause();
      }
    };
  }, [ref, videoUrl]);

  return (
    <VideoContainer onVisibilityChange={handleVisibilityChange}>
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {hasError && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <p className="text-white text-sm">Failed to load video</p>
        </div>
      )}
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