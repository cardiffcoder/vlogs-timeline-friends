import { useRef } from 'react';
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
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <div className="flex flex-col gap-0">
            <ProfileInfo
              username={username}
              avatarUrl={avatarUrl}
              displayName={displayName}
            />
            {description && (
              <p className="text-white text-[10px] pl-[1.3rem] -mt-1 line-clamp-2 drop-shadow-lg font-mona-sans font-light italic">
                {description}
              </p>
            )}
          </div>
          <div className="absolute right-0 bottom-0">
            <VideoActionsMenu
              videoId={id}
              videoUrl={videoUrl}
              userId={userId}
              authUserId={authUserId}
              onDelete={onDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
};