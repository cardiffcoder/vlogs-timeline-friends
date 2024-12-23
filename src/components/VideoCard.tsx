import React, { useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

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
  const defaultAvatarUrl = "/lovable-uploads/dc3f5a45-fb4f-4499-a1ff-66f5113b9983.png";

  useEffect(() => {
    if (!videoRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            if (videoRef.current) {
              videoRef.current.muted = false;
              videoRef.current.play().catch(console.error);
            }
          } else {
            if (videoRef.current) {
              videoRef.current.muted = true;
            }
          }
        });
      },
      {
        threshold: 0.5
      }
    );

    observer.observe(videoRef.current);

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

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

  // Use avatarUrl if it exists, otherwise use default
  const finalAvatarUrl = avatarUrl || defaultAvatarUrl;
  console.log("Final avatar URL:", finalAvatarUrl);

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
          <Avatar className="h-10 w-10 border-2 border-white">
            <AvatarImage 
              src={finalAvatarUrl} 
              alt={displayName || username}
            />
            <AvatarFallback>
              <img 
                src={defaultAvatarUrl} 
                alt="Default profile" 
                className="h-full w-full object-cover"
              />
            </AvatarFallback>
          </Avatar>
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