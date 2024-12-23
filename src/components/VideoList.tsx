import { VideoCard } from "@/components/VideoCard";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const VideoList = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const { toast } = useToast();

  const fetchVideos = async () => {
    try {
      console.log("Fetching videos...");
      const { data, error } = await supabase
        .from('videos')
        .select('*, profiles:user_id(id)')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching videos:", error);
        throw error;
      }

      console.log("Raw videos data:", data);

      if (data) {
        // Check if each video exists in storage before adding it to state
        const validVideos = await Promise.all(
          data.map(async (video) => {
            const videoPath = video.video_url.split('/').pop();
            if (!videoPath) {
              console.log("Invalid video path for video:", video);
              return null;
            }

            const { data: exists } = await supabase.storage
              .from('videos')
              .list('public', {
                search: videoPath
              });

            console.log("Storage check for video", videoPath, ":", exists);

            if (exists && exists.length > 0) {
              return {
                ...video,
                timestamp: new Date(video.created_at),
                userId: video.profiles?.id
              };
            }
            console.log("Video file not found in storage:", videoPath);
            return null;
          })
        );

        const filteredVideos = validVideos.filter(video => video !== null);
        console.log("Filtered valid videos:", filteredVideos);
        setVideos(filteredVideos);
      }
    } catch (error) {
      console.error("Error in fetchVideos:", error);
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
        {
          event: '*',
          schema: 'public',
          table: 'videos'
        },
        (payload) => {
          console.log('Real-time update:', payload);
          if (payload.eventType === 'DELETE') {
            setVideos(currentVideos => 
              currentVideos.filter(video => video.id !== payload.old.id)
            );
          } else {
            fetchVideos();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="w-full mx-auto">
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          username={video.username}
          avatarUrl={video.avatar_url}
          videoUrl={video.video_url}
          description={video.description}
        />
      ))}
    </div>
  );
};

export default VideoList;
