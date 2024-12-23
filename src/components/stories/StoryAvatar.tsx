import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface StoryAvatarProps {
  username: string;
  avatarUrl: string;
  videoUrl?: string;
  isCurrentUser: boolean;
  onClick: () => void;
  hasVideos: boolean;
}

const StoryAvatar = ({ username, avatarUrl, videoUrl, isCurrentUser, onClick, hasVideos }: StoryAvatarProps) => {
  return (
    <div 
      className="flex flex-col items-center scale-140 transform-gpu cursor-pointer"
      onClick={onClick}
    >
      <div className="rounded-full p-[2px]" style={{ backgroundColor: hasVideos ? '#F0FCFE' : 'transparent' }}>
        <Avatar className="h-14 w-14 ring-2 ring-vlogs-text-light">
          <AvatarImage 
            src={hasVideos ? videoUrl : avatarUrl} 
            alt={username} 
            className="object-cover"
          />
          <AvatarFallback>{username[0]}</AvatarFallback>
        </Avatar>
      </div>
      <span className={`text-[10px] text-gray-200 mt-1 font-mona-sans ${
        isCurrentUser ? "font-bold" : "font-medium"
      }`}>
        {username}
      </span>
    </div>
  );
};

export default StoryAvatar;