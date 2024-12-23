import Header from "@/components/Header";
import VideoCard from "@/components/VideoCard";
import AddVideoButton from "@/components/AddVideoButton";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status when component mounts
    checkUser();
    
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }
      fetchVideos();
    } catch (error) {
      console.error('Error checking auth status:', error);
      navigate('/login');
    }
  };

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

  const fetchVideos = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }

      // First, get all videos
      const { data, error } = await supabase
        .from('videos')
        .select('*, profiles:user_id(id)')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        // Check if each video exists in storage before adding it to state
        const validVideos = await Promise.all(
          data.map(async (video) => {
            const videoPath = video.video_url.split('/').pop();
            if (!videoPath) return null;

            const { data: exists } = await supabase.storage
              .from('videos')
              .list('', {
                search: videoPath
              });

            if (exists && exists.length > 0) {
              return {
                ...video,
                timestamp: new Date(video.created_at),
                userId: video.profiles?.id
              };
            }
            return null;
          })
        );

        // Filter out null values (videos that don't exist in storage)
        setVideos(validVideos.filter(video => video !== null));
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
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', session.user.id)
        .single();

      if (profileError) throw profileError;

      const videoFile = await fetch(newVideoData.videoUrl).then(r => r.blob());
      const videoFileName = `${Date.now()}-video`;
      
      const { data: videoData, error: videoError } = await supabase.storage
        .from('videos')
        .upload(videoFileName, videoFile);

      if (videoError) throw videoError;

      const { data: { publicUrl: videoPublicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(videoFileName);

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
              onDelete={() => {
                setVideos(currentVideos => 
                  currentVideos.filter(v => v.id !== video.id)
                );
              }}
            />
          ))}
        </div>
      </main>
      <AddVideoButton onVideoAdd={handleAddVideo} />
    </div>
  );
};

export default Index;