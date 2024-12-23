import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { VideoUpload as VideoUploader } from "@/components/VideoUpload";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const VideoUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleVideoUpload = async (
    videoFile: File,
    description: string,
    onProgress: (progress: number) => void
  ) => {
    try {
      setIsUploading(true);

      // First, get the current user's profile ID
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error("No user session found");

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', session.user.id)
        .single();

      if (profileError || !profile) {
        throw new Error("Could not find user profile");
      }

      // Upload video file
      const videoFileName = `${Math.random()}.${videoFile.name.split('.').pop()}`;
      const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(videoFileName, videoFile, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: ({ loaded, total }) => {
            if (total) {
              onProgress((loaded / total) * 100);
            }
          },
        });

      if (uploadError) throw uploadError;

      // Get video URL
      const { data: { publicUrl: videoUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(videoFileName);

      // Create video record
      const { error: insertError } = await supabase
        .from('videos')
        .insert({
          video_url: videoUrl,
          description,
          user_id: profile.id // Use profile.id instead of auth.uid()
        });

      if (insertError) throw insertError;

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
        onVideoUpload={handleVideoUpload}
        isUploading={isUploading}
      />
    </div>
  );
};

export default VideoUpload;