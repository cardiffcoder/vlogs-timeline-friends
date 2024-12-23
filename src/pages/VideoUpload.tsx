import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { VideoUpload } from "@/components/VideoUpload";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function VideoUploadPage() {
  const [loading, setLoading] = useState(false);
  const [caption, setCaption] = useState('');
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleVideoUploaded = async (url: string) => {
    setUploadedVideoUrl(url);
    toast({
      title: "Video uploaded successfully",
      description: "You can now add a caption before saving.",
    });
  };

  const saveVideoWithCaption = async () => {
    if (!uploadedVideoUrl) {
      toast({
        title: "Please upload a video first",
        description: "Upload a video before saving the caption.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No session found');
      }

      // Get user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        throw profileError;
      }

      if (!profileData) {
        console.error('No profile found for user');
        throw new Error('Profile not found. Please try logging out and back in.');
      }

      console.log('Profile data for video upload:', profileData);

      // Make sure we have an avatar_url, use a default if none exists
      const avatarUrl = profileData.avatar_url || '/placeholder.svg';

      // Insert video with the profile data and caption
      const { error: videoError } = await supabase
        .from('videos')
        .insert({
          username: profileData.username,
          avatar_url: avatarUrl,
          video_url: uploadedVideoUrl,
          user_id: profileData.id,
          display_name: profileData.display_name || profileData.full_name || profileData.username,
          description: caption.trim() || null
        });

      if (videoError) {
        console.error('Video insert error:', videoError);
        throw videoError;
      }

      toast({
        title: "Video saved successfully",
        description: "Your video and caption have been saved!",
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
        
        <div className="space-y-6">
          <VideoUpload onVideoUploaded={handleVideoUploaded} />
          
          <div className="space-y-2">
            <Label htmlFor="caption">Caption</Label>
            <Textarea
              id="caption"
              placeholder="Write a caption for your video..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="resize-none"
              rows={3}
              disabled={loading}
            />
          </div>

          {uploadedVideoUrl && (
            <button
              onClick={saveVideoWithCaption}
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
            >
              {loading ? 'Saving...' : 'Save Video with Caption'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}