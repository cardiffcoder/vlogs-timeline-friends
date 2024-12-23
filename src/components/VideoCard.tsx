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
    <Card className="relative w-full h-[calc(100vh-4rem)] mb-6 overflow-hidden animate-fadeIn">
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
        <div className="absolute bottom-6 left-4 right-4 z-10">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12 ring-2 ring-white">
              <AvatarImage src={avatarUrl} alt={username} />
              <AvatarFallback>{username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-xl text-white">{username}</h3>
              <p className="text-sm text-gray-200">
                {formatDistanceToNow(timestamp, { addSuffix: true })}
              </p>
            </div>
          </div>
          {description && (
            <p className="mt-2 text-white text-sm line-clamp-2">{description}</p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default VideoCard;