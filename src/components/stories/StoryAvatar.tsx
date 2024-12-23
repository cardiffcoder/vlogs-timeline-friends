import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface StoryAvatarProps {
  username: string;
  displayName: string;
  avatarUrl: string;
  videoUrl?: string;
  isCurrentUser: boolean;
  onClick: () => void;
  hasVideos: boolean;
}

const StoryAvatar = ({ username, displayName, avatarUrl, videoUrl, isCurrentUser, onClick, hasVideos }: StoryAvatarProps) => {
  return (
    <div 
      className="flex flex-col items-center scale-140 transform-gpu cursor-pointer"
      onClick={onClick}
    >
      <div 
        className={`rounded-full p-[2px] ${hasVideos ? 'bg-vlogs-text-light' : 'bg-transparent'}`}
      >
        <Avatar className="h-14 w-14 ring-2 ring-vlogs-text-light">
          <AvatarImage 
            src={hasVideos && videoUrl ? videoUrl : avatarUrl} 
            alt={displayName} 
            className="object-cover"
          />
          <AvatarFallback className="bg-gray-200 text-gray-600">
            {displayName[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
      <span className={`text-[10px] text-gray-200 mt-1 font-mona-sans ${
        isCurrentUser ? "font-bold" : "font-medium"
      }`}>
        {displayName}
      </span>
    </div>
  );
};

export default StoryAvatar;