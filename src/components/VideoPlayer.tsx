import { forwardRef, useEffect, useRef, useState } from 'react';

interface VideoPlayerProps {
  videoUrl: string;
}

const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(({ videoUrl }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasStartedLoading, setHasStartedLoading] = useState(false);

  useEffect(() => {
    const videoElement = ref as React.RefObject<HTMLVideoElement>;
    if (!videoElement.current || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
          
          if (entry.isIntersecting && !hasStartedLoading) {
            if (videoElement.current) {
              setHasStartedLoading(true);
              
              // Start with lowest quality settings
              videoElement.current.preload = 'metadata';
              videoElement.current.currentTime = 0;
              
              // Delay full loading to ensure smooth scrolling
              setTimeout(() => {
                if (videoElement.current && entry.isIntersecting) {
                  videoElement.current.load();
                  
                  const playPromise = videoElement.current.play();
                  if (playPromise !== undefined) {
                    playPromise.catch(error => {
                      console.error("Playback error:", error);
                      // Reset loading state on error
                      setHasStartedLoading(false);
                    });
                  }
                }
              }, 250); // Increased delay for better performance
            }
          } else if (!entry.isIntersecting && videoElement.current) {
            videoElement.current.pause();
            videoElement.current.currentTime = 0;
            videoElement.current.preload = 'none';
            setHasStartedLoading(false);
          }
        });
      },
      {
        threshold: [0, 1],
        rootMargin: '25% 0px', // Reduced margin to improve performance
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      if (videoElement.current) {
        videoElement.current.pause();
        videoElement.current.currentTime = 0;
        videoElement.current.preload = 'none';
      }
    };
  }, [ref, hasStartedLoading]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
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
      {!isVisible && !hasStartedLoading && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-gray-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
});

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;