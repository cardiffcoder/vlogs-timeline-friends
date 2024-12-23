import { VideoCard } from "@/components/VideoCard";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const VIDEOS_PER_PAGE = 5;

const VideoList = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const { toast } = useToast();

  const fetchVideos = async (pageNumber: number = 0) => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select(`
          *,
          profiles:user_id (
            id,
            avatar_url,
            display_name,
            username,
            user_id
          )
        `)
        .order('created_at', { ascending: false })
        .range(pageNumber * VIDEOS_PER_PAGE, (pageNumber + 1) * VIDEOS_PER_PAGE - 1);

      if (error) throw error;

      if (data) {
        const processedVideos = data.map(video => {
          const profile = video.profiles;
          return {
            ...video,
            displayName: profile?.display_name || video.display_name || video.username,
            avatarUrl: profile?.avatar_url || video.avatar_url || "/placeholder.svg",
            authUserId: profile?.user_id,
          };
        });
        
        setVideos(prev => pageNumber === 0 ? processedVideos : [...prev, ...processedVideos]);
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
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        === document.documentElement.offsetHeight
      ) {
        setPage(prev => prev + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (page > 0) {
      fetchVideos(page);
    }
  }, [page]);

  useEffect(() => {
    const channel = supabase
      .channel('videos-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'videos' },
        () => {
          setPage(0);
          fetchVideos(0);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="w-full mx-auto space-y-1">
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          id={video.id}
          username={video.username}
          videoUrl={video.video_url}
          description={video.description}
          userId={video.user_id}
          authUserId={video.authUserId}
          avatarUrl={video.avatarUrl}
          displayName={video.displayName}
          onDelete={() => {
            setPage(0);
            fetchVideos(0);
          }}
        />
      ))}
    </div>
  );
};

export default VideoList;