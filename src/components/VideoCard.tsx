import React from 'react';
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface VideoCardProps {
  username: string;
  avatarUrl: string;
  videoUrl: string;
  description?: string;
}

export const VideoCard = ({ username, avatarUrl, videoUrl, description }: VideoCardProps) => {
  return (
    <Card className="relative overflow-hidden rounded-lg">
      <div className="aspect-[9/16] relative">
        <video
          src={videoUrl}
          className="absolute inset-0 h-full w-full object-cover"
          controls
          playsInline
        />
        <div className="absolute bottom-4 left-4 flex items-center gap-2 z-10">
          <Avatar className="h-10 w-10 border-2 border-white">
            <AvatarImage src={avatarUrl} alt={username} />
            <AvatarFallback>{username[0]}</AvatarFallback>
          </Avatar>
          <span className="text-white font-medium drop-shadow-lg">
            {username}
          </span>
        </div>
        {description && (
          <div className="absolute bottom-16 left-4 right-4 text-white text-sm">
            <p className="line-clamp-2 drop-shadow-lg">{description}</p>
          </div>
        )}
      </div>
    </Card>
  );
};