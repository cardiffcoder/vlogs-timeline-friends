import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { formatDistanceToNowStrict } from "date-fns";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useRef } from "react";

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
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handlePlayback = async () => {
      try {
        if (videoRef.current) {
          videoRef.current.muted = false; // Changed from true to false
          await videoRef.current.load();
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              console.log("Autoplay prevented");
            });
          }
        }
      } catch (error) {
        console.error("Video playback error:", error);
      }
    };

    handlePlayback();
  }, [videoUrl]);

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
      // Extract the file path from the video URL
      const videoPath = videoUrl.split('/').pop();
      if (!videoPath) throw new Error('Invalid video URL');

      // Delete the video file from storage
      const { error: storageError } = await supabase.storage
        .from('videos')
        .remove([`public/${videoPath}`]);

      if (storageError) {
        console.error('Storage deletion error:', storageError);
      }

      // Delete the database record
      const { error: dbError } = await supabase
        .from('videos')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

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

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  return (
    <Card className="relative w-full h-[calc(100vh-8rem)] mb-1 overflow-hidden animate-fadeIn bg-black border-none">
      <div className="relative w-full h-full">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src={videoUrl}
          playsInline
          loop
          muted={false} // Changed from muted to muted={false}
          preload="auto"
          onClick={handleVideoClick}
          poster={avatarUrl}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
        
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