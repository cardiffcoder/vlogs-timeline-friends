import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { formatDistanceToNowStrict } from "date-fns";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface VideoCardProps {
  id: number;
  username: string;
  avatarUrl: string;
  videoUrl: string;
  timestamp: Date;
  description: string;
  onDelete?: () => void;
  userId?: number | null;
}

const VideoCard = ({ id, username, avatarUrl, videoUrl, timestamp, description, onDelete, userId }: VideoCardProps) => {
  const { toast } = useToast();

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

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast({
        title: "Video deleted",
        description: "Your video has been removed successfully.",
      });

      if (onDelete) {
        onDelete();
      }
    } catch (error: any) {
      console.error('Error deleting video:', error);
      toast({
        title: "Error",
        description: "Failed to delete the video. Please try again.",
        variant: "destructive",
      });
    }
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
          preload="metadata"
        />
        
        {/* Overlay gradient for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
        
        {/* User info overlay */}
        <div className="absolute bottom-8 left-4 right-4 z-10">
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
            {userId && (
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                onClick={handleDelete}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default VideoCard;