import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import VideoPlayer from "./VideoPlayer";
import { ProfileInfo } from "./ProfileInfo";

interface Video {
  id: number;
  video_url: string;
  description?: string;
  username: string;
  avatarUrl?: string;
  displayName?: string;
  created_at: string;
}

interface VideoStoriesViewerProps {
  videos: Video[];
  onClose: () => void;
  initialVideoIndex?: number;
}

const VideoStoriesViewer = ({ videos, onClose, initialVideoIndex = 0 }: VideoStoriesViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialVideoIndex);
  const currentVideo = videos[currentIndex];

  const handleNext = () => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrevious();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex]);

  if (!currentVideo) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="absolute top-4 right-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-white hover:bg-white/10"
        >
          <X className="h-6 w-6" />
        </Button>
      </div>
      
      <div 
        className="w-full h-full relative"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          if (x < rect.width / 2) {
            handlePrevious();
          } else {
            handleNext();
          }
        }}
      >
        <div className="absolute top-4 left-4 right-4 z-50">
          <ProfileInfo
            username={currentVideo.username}
            avatarUrl={currentVideo.avatarUrl}
            displayName={currentVideo.displayName}
          />
        </div>
        <VideoPlayer videoUrl={currentVideo.video_url} />
      </div>
    </div>
  );
};

export default VideoStoriesViewer;