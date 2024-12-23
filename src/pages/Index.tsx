import Header from "@/components/Header";
import VideoCard from "@/components/VideoCard";
import AddVideoButton from "@/components/AddVideoButton";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('videos')
        .select('*, profiles:user_id(id)')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        const videosWithDates = data.map(video => ({
          ...video,
          timestamp: new Date(video.created_at),
          // Check if the video belongs to the current user
          userId: video.profiles?.id
        }));
        setVideos(videosWithDates);
      }
    } catch (error) {
      toast({
        title: "Error fetching videos",
        description: "There was a problem loading the videos.",
        variant: "destructive"
      });
    }
  };

  const handleAddVideo = async (newVideoData: {
    username: string;
    avatarUrl: string;
    videoUrl: string;
    description: string;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (profileError) throw profileError;

      // Upload video file to Supabase Storage
      const videoFile = await fetch(newVideoData.videoUrl).then(r => r.blob());
      const videoFileName = `${Date.now()}-video`;
      
      const { data: videoData, error: videoError } = await supabase.storage
        .from('videos')
        .upload(videoFileName, videoFile);

      if (videoError) throw videoError;

      // Get public URL for the uploaded video
      const { data: { publicUrl: videoPublicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(videoFileName);

      // Save video metadata to the database
      const { error: dbError } = await supabase
        .from('videos')
        .insert([
          {
            username: newVideoData.username,
            avatar_url: newVideoData.avatarUrl,
            video_url: videoPublicUrl,
            description: newVideoData.description,
            created_at: new Date().toISOString(),
            user_id: profileData.id
          }
        ]);

      if (dbError) throw dbError;

      // Refresh the videos list
      fetchVideos();
      
      toast({
        title: "Video added successfully!",
        description: "Your video has been added to the feed.",
      });
    } catch (error: any) {
      toast({
        title: "Error adding video",
        description: "There was a problem uploading your video.",
        variant: "destructive"
      });
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive"
      });
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-[#111111]">
      <Header onLogout={handleLogout} />
      <main className="pt-0">
        <div className="w-full mx-auto">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              id={video.id}
              username={video.username}
              avatarUrl={video.avatar_url}
              videoUrl={video.video_url}
              timestamp={video.timestamp}
              description={video.description}
              userId={video.userId}
              onDelete={fetchVideos}
            />
          ))}
        </div>
      </main>
      <AddVideoButton onVideoAdd={handleAddVideo} />
    </div>
  );
};

export default Index;