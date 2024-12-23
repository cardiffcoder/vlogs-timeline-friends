import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { VideoUpload as VideoUploader } from "@/components/VideoUpload";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const VideoUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleVideoUpload = async (videoUrl: string) => {
    try {
      toast({
        title: "Success!",
        description: "Your video has been uploaded.",
      });
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center p-4">
      <VideoUploader
        onVideoUploaded={handleVideoUpload}
      />
    </div>
  );
};

export default VideoUpload;