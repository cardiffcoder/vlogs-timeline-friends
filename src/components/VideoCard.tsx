import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { formatDistanceToNowStrict } from "date-fns";

interface VideoCardProps {
  username: string;
  avatarUrl: string;
  videoUrl: string;
  timestamp: Date;
  description: string;
}

const VideoCard = ({ username, avatarUrl, videoUrl, timestamp, description }: VideoCardProps) => {
  const getFormattedTime = (date: Date) => {
    const minutesAgo = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60));
    if (minutesAgo >= 60) {
      return formatDistanceToNowStrict(date, { 
        addSuffix: true,
        unit: 'hour'
      });
    }
    return formatDistanceToNowStrict(date, { 
      addSuffix: true,
      unit: 'minute'
    });
  };

  return (
    <Card className="relative w-full h-[calc(100vh-8rem)] mb-1 overflow-hidden animate-fadeIn bg-black border-none">
      <div className="relative w-full h-full">
        <video
          className="w-full h-full object-cover"
          src={videoUrl}
          controls
          playsInline
          loop
          autoPlay
          muted
          preload="metadata"
        />
        
        {/* Overlay gradient for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
        
        {/* User info overlay */}
        <div className="absolute bottom-8 left-4 right-4 z-10 pointer-events-none">
          <div className="flex items-center space-x-4">
            <div className="rounded-full p-[2px]" style={{ backgroundColor: '#E1F9FC' }}>
              <Avatar className="h-14 w-14 ring-2 ring-[#E1F9FC]">
                <AvatarImage 
                  src={avatarUrl} 
                  alt={username}
                  className="object-cover object-center scale-125"
                />
                <AvatarFallback>{username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-1">
              <h3 className="text-sm text-gray-300">{username}</h3>
              <p className="text-xs text-gray-400">
                {getFormattedTime(timestamp)}
              </p>
              <p className="text-sm text-gray-300 mt-1">{description}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default VideoCard;