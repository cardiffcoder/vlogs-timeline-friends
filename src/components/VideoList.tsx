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
        .select(`
          *,
          profiles:user_id (
            id,
            full_name,
            display_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching videos:", error);
        throw error;
      }

      console.log("Raw videos data:", data);

      if (data) {
        const validVideos = await Promise.all(
          data.map(async (video) => {
            const videoPath = video.video_url.split('/').pop();
            if (!videoPath) {
              console.log("Invalid video path for video:", video);
              return null;
            }

            const cleanPath = videoPath.replace('public/', '');
            console.log("Checking storage for video path:", cleanPath);

            const { data: exists } = await supabase.storage
              .from('videos')
              .list('', {
                search: cleanPath
              });

            console.log("Storage check for video", cleanPath, ":", exists);

            if (exists && exists.length > 0) {
              const displayName = video.profiles?.display_name || video.profiles?.full_name || video.username;
              
              // Get the avatar URL from either profiles or video, with proper fallback
              const avatarUrl = video.profiles?.avatar_url || video.avatar_url || null;
              console.log("Video ID:", video.id, "Avatar URL:", avatarUrl);
              
              return {
                ...video,
                timestamp: new Date(video.created_at),
                userId: video.profiles?.id,
                displayName,
                avatarUrl
              };
            }
            console.log("Video file not found in storage:", cleanPath);
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
        async (payload) => {
          console.log('Real-time update:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newVideo = payload.new;
            // Verify the video exists in storage
            const videoPath = newVideo.video_url.split('/').pop();
            if (!videoPath) return;

            // Remove 'public/' from the path if it exists
            const cleanPath = videoPath.replace('public/', '');
            console.log("Checking storage for new video path:", cleanPath);

            const { data: exists } = await supabase.storage
              .from('videos')
              .list('', {
                search: cleanPath
              });

            console.log("Storage check for new video:", exists);

            if (exists && exists.length > 0) {
              setVideos(currentVideos => [
                {
                  ...newVideo,
                  timestamp: new Date(newVideo.created_at),
                },
                ...currentVideos
              ]);
            }
          } else if (payload.eventType === 'DELETE') {
            setVideos(currentVideos => 
              currentVideos.filter(video => video.id !== payload.old.id)
            );
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
          id={video.id}
          username={video.username}
          avatarUrl={video.avatarUrl}
          videoUrl={video.video_url}
          description={video.description}
          displayName={video.displayName}
          userId={video.userId}
          onDelete={() => fetchVideos()}
        />
      ))}
    </div>
  );
};

export default VideoList;