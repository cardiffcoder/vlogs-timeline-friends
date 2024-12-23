import VideoListItem from "./VideoListItem";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import VideoLoadingIndicator from "./VideoLoadingIndicator";

const VIDEOS_PER_PAGE = 3;

const VideoList = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { toast } = useToast();
  const loadingRef = useRef<HTMLDivElement>(null);

  const fetchVideos = async (pageNumber: number = 0) => {
    if (isLoading || !hasMore) return;
    
    try {
      setIsLoading(true);
      
      const from = pageNumber * VIDEOS_PER_PAGE;
      const to = from + VIDEOS_PER_PAGE - 1;
      
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
        .range(from, to);

      if (error) throw error;

      if (data) {
        const processedVideos = data.map(video => ({
          ...video,
          displayName: video.profiles?.display_name || '',
          username: video.profiles?.username || '',
          avatarUrl: video.profiles?.avatar_url || '/placeholder.svg',
          authUserId: video.profiles?.user_id,
        }));
        
        setVideos(prev => pageNumber === 0 ? processedVideos : [...prev, ...processedVideos]);
        setHasMore(data.length === VIDEOS_PER_PAGE);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
      toast({
        title: "Error fetching videos",
        description: "There was a problem loading the videos.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !isLoading && hasMore) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => observer.disconnect();
  }, [isLoading, hasMore]);

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
          setHasMore(true);
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
        <VideoListItem
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
            setHasMore(true);
            fetchVideos(0);
          }}
        />
      ))}
      {hasMore && (
        <div ref={loadingRef} className="w-full py-4 flex justify-center">
          {isLoading && <VideoLoadingIndicator />}
        </div>
      )}
    </div>
  );
};

export default VideoList;