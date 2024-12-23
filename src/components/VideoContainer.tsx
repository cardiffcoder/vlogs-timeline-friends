import { useEffect, useRef, useState } from 'react';
import VideoLoadingIndicator from './VideoLoadingIndicator';

interface VideoContainerProps {
  children: React.ReactNode;
  onVisibilityChange: (isVisible: boolean) => void;
}

const VideoContainer = ({ children, onVisibilityChange }: VideoContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const isIntersecting = entries[0].isIntersecting;
        setIsVisible(isIntersecting);
        onVisibilityChange(isIntersecting);
      },
      {
        threshold: [0, 1],
        rootMargin: '25% 0px',
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [onVisibilityChange]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {children}
      {!isVisible && <VideoLoadingIndicator />}
    </div>
  );
};

export default VideoContainer;