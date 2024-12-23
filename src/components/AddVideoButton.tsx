import { Plus } from "lucide-react";
import { useState } from "react";
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
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For now, we'll use placeholder data
    const newVideo = {
      username: "TEJES", // Using existing username for demo
      avatarUrl: "/lovable-uploads/f8624281-c4d8-4e78-8b29-c0d8ef3ba36a.png", // Using existing avatar
      videoUrl: "/lovable-uploads/6d7ec786-9bb0-45e9-9913-6dd8a840be78.png", // Using existing image
      description: description,
    };

    onVideoAdd(newVideo);
    setDescription("");
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
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-vlogs-text/50 border-2 border-vlogs-text hover:bg-vlogs-text/60"
          size="icon"
        >
          <Plus className="h-6 w-6 text-vlogs-text" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new video</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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