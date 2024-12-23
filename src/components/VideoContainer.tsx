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
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const isIntersecting = entries[0].isIntersecting;
        setIsVisible(isIntersecting);
        onVisibilityChange(isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
      observer.disconnect();
    };
  }, [onVisibilityChange]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {children}
      {!isVisible && <VideoLoadingIndicator />}
    </div>
  );
};

export default VideoContainer;