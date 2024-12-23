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
            display_name
          )
        `)
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

            // Remove 'public/' from the path if it exists
            const cleanPath = videoPath.replace('public/', '');
            console.log("Checking storage for video path:", cleanPath);

            const { data: exists } = await supabase.storage
              .from('videos')
              .list('', {
                search: cleanPath
              });

            console.log("Storage check for video", cleanPath, ":", exists);

            if (exists && exists.length > 0) {
              // Use the profile's display_name or full_name instead of username
              const displayName = video.profiles?.display_name || video.profiles?.full_name || video.username;
              return {
                ...video,
                timestamp: new Date(video.created_at),
                userId: video.profiles?.id,
                displayName // Add the display name to the video object
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
          username={video.displayName} // Use displayName instead of username
          avatarUrl={video.avatar_url}
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