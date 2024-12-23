import { useEffect, useRef, useState } from 'react';
import VideoLoadingIndicator from './VideoLoadingIndicator';

interface VideoContainerProps {
  children: React.ReactNode;
  onVisibilityChange: (isVisible: boolean) => void;
}

const VideoContainer = ({ children, onVisibilityChange }: VideoContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const isIntersecting = entries[0].isIntersecting;
        if (isIntersecting && !hasBeenVisible) {
          setHasBeenVisible(true);
        }
        setIsVisible(isIntersecting);
        onVisibilityChange(isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '50% 0px',
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [onVisibilityChange, hasBeenVisible]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {children}
      {!hasBeenVisible && <VideoLoadingIndicator />}
    </div>
  );
};

export default VideoContainer;