import { useRef } from 'react';
import { Card } from "@/components/ui/card";
import { ProfileInfo } from "./ProfileInfo";
import VideoPlayer from "./VideoPlayer";
import VideoActionsMenu from "./VideoActionsMenu";

interface VideoCardProps {
  id: number;
  username: string;
  videoUrl: string;
  description?: string;
  userId?: number;
  avatarUrl?: string;
  displayName?: string;
  onDelete?: () => void;
}

export const VideoCard = ({ 
  id, 
  username,
  videoUrl, 
  description,
  userId,
  avatarUrl,
  displayName,
  onDelete 
}: VideoCardProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <Card className="relative overflow-hidden rounded-lg -mx-4 sm:mx-0">
      <div className="aspect-[9/16] relative">
        <VideoPlayer ref={videoRef} videoUrl={videoUrl} />
        <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-between items-center">
          <ProfileInfo
            username={username}
            avatarUrl={avatarUrl}
            displayName={displayName}
          />
          <VideoActionsMenu
            videoId={id}
            videoUrl={videoUrl}
            userId={userId}
            onDelete={onDelete}
          />
        </div>
        {description && (
          <div className="absolute bottom-20 left-4 right-4 text-white">
            <p className="line-clamp-2 drop-shadow-lg font-mona-sans text-sm">{description}</p>
          </div>
        )}
      </div>
    </Card>
  );
};