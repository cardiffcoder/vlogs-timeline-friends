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
              // Only load metadata initially
              videoElement.current.preload = 'metadata';
              // Start loading the full video when in view
              videoElement.current.load();
              
              // Add a small delay before playing to ensure proper loading
              setTimeout(() => {
                if (videoElement.current) {
                  const playPromise = videoElement.current.play();
                  if (playPromise !== undefined) {
                    playPromise.catch(error => {
                      console.log("Playback error:", error);
                    });
                  }
                }
              }, 100);
            }
          } else {
            if (videoElement.current) {
              videoElement.current.pause();
              // Reset the video when out of view to free up memory
              videoElement.current.currentTime = 0;
              videoElement.current.preload = 'none';
            }
          }
        });
      },
      {
        threshold: [0, 0.5, 1],
        rootMargin: '50% 0px', // Reduced preload margin to save resources
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
        preload="none" // Start with no preload
        poster={videoUrl + '?poster=1'} // Add poster support
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
    </div>
  );
});

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;