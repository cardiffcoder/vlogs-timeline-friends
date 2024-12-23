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
            full_name,
            display_name,
            avatar_url,
            user_id
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const processedVideos = data.map(video => ({
          ...video,
          displayName: video.profiles?.display_name || video.profiles?.full_name || video.username,
          avatarUrl: video.profiles?.avatar_url,
          userId: video.profiles?.id
        }));

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
          avatarUrl={video.avatarUrl}
          videoUrl={video.video_url}
          description={video.description}
          displayName={video.displayName}
          userId={video.userId}
          onDelete={fetchVideos}
        />
      ))}
    </div>
  );
};

export default VideoList;