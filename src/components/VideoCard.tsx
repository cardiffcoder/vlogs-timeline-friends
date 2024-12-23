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
  authUserId?: string;
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
  authUserId,
  avatarUrl,
  displayName,
  onDelete 
}: VideoCardProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="relative overflow-hidden -mx-4 sm:mx-0">
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
            authUserId={authUserId}
            onDelete={onDelete}
          />
        </div>
        {description && (
          <div className="absolute bottom-20 left-4 right-4 text-white">
            <p className="line-clamp-2 drop-shadow-lg font-mona-sans text-sm">{description}</p>
          </div>
        )}
      </div>
    </div>
  );
};