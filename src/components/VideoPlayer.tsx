import { forwardRef, useEffect, useRef } from 'react';

interface VideoPlayerProps {
  videoUrl: string;
}

const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(({ videoUrl }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const videoElement = ref as React.RefObject<HTMLVideoElement>;
    if (!videoElement.current || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio >= 0.5) {
            videoElement.current?.play();
          } else {
            videoElement.current?.pause();
          }
        });
      },
      {
        threshold: [0, 0.5, 1], // Observe at 0%, 50%, and 100% visibility
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <video
        ref={ref}
        src={videoUrl}
        className="absolute inset-0 h-full w-full object-cover"
        playsInline
        loop
        muted={false}
      />
    </div>
  );
});

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;