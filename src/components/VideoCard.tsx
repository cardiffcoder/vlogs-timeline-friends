import React, { useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ProfileAvatar } from "./ProfileAvatar";

interface VideoCardProps {
  id: number;
  username: string;
  avatarUrl: string | null;
  videoUrl: string;
  description?: string;
  displayName?: string;
  userId?: number;
  onDelete?: () => void;
}

export const VideoCard = ({ 
  id, 
  username, 
  avatarUrl, 
  videoUrl, 
  description,
  displayName,
  userId,
  onDelete 
}: VideoCardProps) => {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleDelete = async () => {
    try {
      const videoFileName = videoUrl.split('/').pop();
      if (!videoFileName) throw new Error('Invalid video URL');

      const { error: storageError } = await supabase.storage
        .from('videos')
        .remove([videoFileName]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from('videos')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      toast({
        title: "Video deleted",
        description: "Your video has been removed successfully.",
      });

      if (onDelete) onDelete();
    } catch (error) {
      console.error('Error deleting video:', error);
      toast({
        title: "Error deleting video",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="relative overflow-hidden rounded-lg -mx-4 sm:mx-0">
      <div className="aspect-[9/16] relative">
        <video
          ref={videoRef}
          src={videoUrl}
          className="absolute inset-0 h-full w-full object-cover"
          playsInline
          autoPlay
          loop
          muted
        />
        <div className="absolute bottom-4 left-4 flex items-center gap-2 z-10">
          <ProfileAvatar 
            url={avatarUrl}
            username={username}
            size="md"
          />
          <span className="text-white font-medium drop-shadow-lg">
            {displayName || username}
          </span>
        </div>
        {description && (
          <div className="absolute bottom-16 left-4 right-4 text-white text-sm">
            <p className="line-clamp-2 drop-shadow-lg">{description}</p>
          </div>
        )}
        {userId && (
          <div className="absolute top-4 right-4 z-10">
            <Button
              variant="destructive"
              size="icon"
              onClick={handleDelete}
              className="h-8 w-8"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};