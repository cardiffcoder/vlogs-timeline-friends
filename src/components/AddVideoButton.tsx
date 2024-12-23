import { Circle } from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { useToast } from "./ui/use-toast";

interface AddVideoProps {
  onVideoAdd: (video: {
    username: string;
    avatarUrl: string;
    videoUrl: string;
    description: string;
  }) => void;
}

const AddVideoButton = ({ onVideoAdd }: AddVideoProps) => {
  const [description, setDescription] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        setSelectedVideo(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select a video file.",
          variant: "destructive"
        });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedVideo) {
      toast({
        title: "No video selected",
        description: "Please select a video from your camera roll.",
        variant: "destructive"
      });
      return;
    }

    // For now, we'll use placeholder data for username and avatar
    // In a real app, these would come from user authentication
    const newVideo = {
      username: "TEJES",
      avatarUrl: "/lovable-uploads/f8624281-c4d8-4e78-8b29-c0d8ef3ba36a.png",
      videoUrl: URL.createObjectURL(selectedVideo), // Create a temporary URL for the video
      description: description,
    };

    onVideoAdd(newVideo);
    setDescription("");
    setSelectedVideo(null);
    setIsOpen(false);
    
    toast({
      title: "Video added successfully!",
      description: "Your video has been added to the feed.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-vlogs-text/10 border-[0.5px] border-vlogs-text/15 hover:bg-vlogs-text/30 backdrop-blur-[1px]"
          size="icon"
        >
          <Circle className="h-4 w-4 text-vlogs-text opacity-80" strokeWidth={0.6} fill="currentColor" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new video</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="video">Select Video</Label>
            <Input
              id="video"
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              ref={fileInputRef}
              className="mt-2"
            />
            {selectedVideo && (
              <p className="text-sm text-muted-foreground mt-1">
                Selected: {selectedVideo.name}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's happening in your video?"
              className="mt-2"
            />
          </div>
          <Button type="submit" className="w-full">
            Post Video
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddVideoButton;