import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

interface VideoCardProps {
  username: string;
  avatarUrl: string;
  videoUrl: string;
  timestamp: Date;
  description: string;
}

const VideoCard = ({ username, avatarUrl, videoUrl, timestamp, description }: VideoCardProps) => {
  return (
    <Card className="relative w-full h-[calc(100vh-8rem)] mb-1 overflow-hidden animate-fadeIn bg-black border-none">
      <div className="relative w-full h-full">
        <video
          className="w-full h-full object-cover"
          src={videoUrl}
          autoPlay
          muted
          loop
          playsInline
        />
        
        {/* Overlay gradient for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* User info overlay */}
        <div className="absolute bottom-8 left-4 right-4 z-10">
          <div className="flex items-center space-x-4">
            <div className="p-0.5 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full">
              <Avatar className="h-12 w-12 ring-2 ring-black">
                <AvatarImage src={avatarUrl} alt={username} />
                <AvatarFallback>{username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-xl text-white">{username}</h3>
              <p className="text-sm text-gray-200">
                {formatDistanceToNow(timestamp, { addSuffix: true })}
              </p>
            </div>
          </div>
          {description && (
            <p className="mt-2 text-white text-sm line-clamp-2 pl-16">{description}</p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default VideoCard;