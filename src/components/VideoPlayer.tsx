import { forwardRef } from 'react';

interface VideoPlayerProps {
  videoUrl: string;
}

const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(({ videoUrl }, ref) => (
  <div className="relative w-full h-full">
    <video
      ref={ref}
      src={videoUrl}
      className="absolute inset-0 h-full w-full object-cover"
      playsInline
      autoPlay
      loop
      muted={false}
    />
  </div>
));

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;