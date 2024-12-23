import { useNavigate } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface VideoActionsMenuProps {
  videoId: number;
  videoUrl: string;
  onDelete?: () => void;
  userId?: number;
  authUserId?: string;
}

const VideoActionsMenu = ({ videoId, videoUrl, onDelete, userId, authUserId }: VideoActionsMenuProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

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
        .eq('id', videoId);

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

  const handlePostVideo = () => {
    navigate('/video-upload');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-1 hover:bg-gray-100/10 rounded-full transition-colors">
          <MoreHorizontal className="h-5 w-5 text-white" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuItem onClick={handlePostVideo}>
          Post another video
        </DropdownMenuItem>
        {authUserId && (
          <DropdownMenuItem
            onClick={handleDelete}
            className="text-red-600 focus:text-red-600"
          >
            Delete video
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default VideoActionsMenu;