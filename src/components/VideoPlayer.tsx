import { forwardRef } from 'react';

interface VideoPlayerProps {
  videoUrl: string;
}

const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(({ videoUrl }, ref) => (
  <video
    ref={ref}
    src={videoUrl}
    className="absolute inset-0 h-full w-full object-cover"
    playsInline
    autoPlay
    loop
    muted
  />
));

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;