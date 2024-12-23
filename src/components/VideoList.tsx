import { VideoCard } from "@/components/VideoCard";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const VideoList = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const { toast } = useToast();

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select(`
          *,
          profiles:user_id (
            id,
            avatar_url,
            display_name,
            username
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const processedVideos = data.map(video => {
          // If profile exists, use its data, otherwise fallback to video data
          const profile = video.profiles;
          return {
            ...video,
            displayName: profile?.display_name || video.display_name || video.username,
            // Only use placeholder if both profile and video avatar_url are null/undefined
            avatarUrl: profile?.avatar_url || video.avatar_url || "/placeholder.svg",
          };
        });
        
        console.log('Fetched videos with profiles:', processedVideos);
        setVideos(processedVideos);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
      toast({
        title: "Error fetching videos",
        description: "There was a problem loading the videos.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('videos-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'videos' },
        () => fetchVideos()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="w-full mx-auto space-y-4">
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          id={video.id}
          username={video.username}
          videoUrl={video.video_url}
          description={video.description}
          userId={video.user_id}
          avatarUrl={video.avatarUrl}
          displayName={video.displayName}
          onDelete={fetchVideos}
        />
      ))}
    </div>
  );
};

export default VideoList;