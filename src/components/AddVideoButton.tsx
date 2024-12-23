import { Circle } from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/lib/supabaseClient";

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
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Selected file:', { 
        name: file.name, 
        type: file.type, 
        size: file.size 
      });
      
      // Accept any video/* MIME type
      if (file.type.startsWith('video/') || file.type === 'video') {
        setSelectedVideo(file);
      } else {
        toast({
          title: "Invalid file type",
          description: `File type ${file.type} is not supported. Please select a video file.`,
          variant: "destructive"
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedVideo) {
      toast({
        title: "No video selected",
        description: "Please select a video from your camera roll.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      console.log('Starting upload for file:', {
        name: selectedVideo.name,
        type: selectedVideo.type,
        size: selectedVideo.size
      });

      // Upload video to Supabase Storage
      const fileExt = selectedVideo.name.split('.').pop() || 'mp4';
      const fileName = `${Math.random()}.${fileExt}`;
      
      console.log('Uploading to storage with filename:', fileName);
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('videos')
        .upload(fileName, selectedVideo, {
          cacheControl: '3600',
          contentType: selectedVideo.type || 'video/mp4'
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw uploadError;
      }

      console.log('Upload successful:', uploadData);

      // Get the public URL for the uploaded video
      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(fileName);

      console.log('Generated public URL:', publicUrl);

      // Insert video metadata into the database
      const { error: dbError } = await supabase
        .from('videos')
        .insert([
          {
            username: "TEJES",
            avatar_url: "/lovable-uploads/f8624281-c4d8-4e78-8b29-c0d8ef3ba36a.png",
            video_url: publicUrl,
            description: description,
          }
        ]);

      if (dbError) {
        console.error('Database insert error:', dbError);
        throw dbError;
      }

      // Update UI
      onVideoAdd({
        username: "TEJES",
        avatarUrl: "/lovable-uploads/f8624281-c4d8-4e78-8b29-c0d8ef3ba36a.png",
        videoUrl: publicUrl,
        description: description,
      });

      setDescription("");
      setSelectedVideo(null);
      setIsOpen(false);
      
      toast({
        title: "Video added successfully!",
        description: "Your video has been uploaded and added to the feed.",
      });
    } catch (error) {
      console.error('Detailed upload error:', error);
      toast({
        title: "Error uploading video",
        description: error.message || "There was a problem uploading your video. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
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
              capture="environment"
              onChange={handleFileSelect}
              ref={fileInputRef}
              className="mt-2"
              disabled={isUploading}
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
              disabled={isUploading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isUploading}>
            {isUploading ? "Uploading..." : "Post Video"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddVideoButton;