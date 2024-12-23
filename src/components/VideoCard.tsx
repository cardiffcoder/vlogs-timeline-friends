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
        <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <ProfileInfo
                username={username}
                avatarUrl={avatarUrl}
                displayName={displayName}
              />
              {description && (
                <p className="text-[#8E9196] text-sm font-mona-sans -mt-2 ml-14 line-clamp-2">
                  {description}
                </p>
              )}
            </div>
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