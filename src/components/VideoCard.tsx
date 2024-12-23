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
    <Card className="w-full max-w-md mx-auto mb-6 overflow-hidden animate-fadeIn hover:shadow-lg transition-shadow duration-300">
      <div className="p-4 flex items-center space-x-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={avatarUrl} alt={username} />
          <AvatarFallback>{username[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{username}</h3>
          <p className="text-sm text-gray-500">
            {formatDistanceToNow(timestamp, { addSuffix: true })}
          </p>
        </div>
      </div>
      <div className="relative aspect-video">
        <video
          className="w-full h-full object-cover"
          src={videoUrl}
          controls
          preload="metadata"
        />
      </div>
      {description && (
        <div className="p-4">
          <p className="text-sm text-gray-700">{description}</p>
        </div>
      )}
    </Card>
  );
};

export default VideoCard;