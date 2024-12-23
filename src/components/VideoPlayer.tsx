import { forwardRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoPlayerProps {
  videoUrl: string;
}

const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(({ videoUrl }, ref) => {
  const [isMuted, setIsMuted] = useState(true); // Start muted to allow autoplay

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="relative w-full h-full">
      <video
        ref={ref}
        src={videoUrl}
        className="absolute inset-0 h-full w-full object-cover"
        playsInline
        autoPlay
        loop
        muted={isMuted}
      />
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMute}
        className="absolute bottom-16 right-4 z-20 bg-black/50 hover:bg-black/70 text-white"
      >
        {isMuted ? (
          <VolumeX className="h-4 w-4" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
});

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;