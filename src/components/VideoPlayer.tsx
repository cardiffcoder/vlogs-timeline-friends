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
            if (videoElement.current) {
              videoElement.current.load(); // Force load when visible
              videoElement.current.play();
            }
          } else {
            videoElement.current?.pause();
          }
        });
      },
      {
        threshold: [0, 0.5, 1],
        rootMargin: '100% 0px', // Preload when within 100% of viewport
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
        className="absolute inset-0 h-full w-full object-cover"
        playsInline
        loop
        muted={false}
        preload="metadata"
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
    </div>
  );
});

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;