import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { VideoUpload } from "@/components/VideoUpload";

export default function VideoUploadPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleVideoUploaded = async (url: string) => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No session found');
      }

      // Get user profile with maybeSingle() instead of single()
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        throw profileError;
      }

      if (!profileData) {
        console.error('No profile found for user');
        throw new Error('Profile not found. Please try logging out and back in.');
      }

      // Ensure we have an avatar_url
      const avatarUrl = profileData.avatar_url || '/placeholder.svg';

      // Insert video
      const { error: videoError } = await supabase
        .from('videos')
        .insert({
          username: profileData.username,
          avatar_url: avatarUrl,
          video_url: url,
          user_id: profileData.id
        });

      if (videoError) {
        console.error('Video insert error:', videoError);
        throw videoError;
      }

      toast({
        title: "Video uploaded successfully",
        description: "Your video will be visible on the feed shortly!",
      });
      
      navigate('/');
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error saving video",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Upload your video 🎥</h1>
          <p className="text-muted-foreground">Share your latest vlog with the world</p>
        </div>
        
        <VideoUpload onVideoUploaded={handleVideoUploaded} />
      </div>
    </div>
  );
}