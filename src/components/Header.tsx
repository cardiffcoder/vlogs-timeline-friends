import { useEffect, useState } from "react";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toZonedTime } from "date-fns-tz";
import StoriesBar from "./stories/StoriesBar";

interface HeaderProps {
  onLogout: () => void;
}

const Header = ({ onLogout }: HeaderProps) => {
  const isVisible = useScrollDirection();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [stories, setStories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        
        setCurrentUser(profile);
      }
    };

    fetchCurrentUser();
  }, []);

  const fetchTodayVideos = async () => {
    const pstDate = toZonedTime(new Date(), 'America/Los_Angeles');
    const todayStart = new Date(pstDate);
    todayStart.setHours(0, 0, 0, 0);

    // First, get all videos with their associated profiles
    const { data: videos, error } = await supabase
      .from('videos')
      .select(`
        *,
        profiles!inner (
          id,
          user_id,
          avatar_url,
          display_name,
          username
        )
      `)
      .gte('created_at', todayStart.toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching videos:', error);
      return;
    }

    console.log('Raw videos data:', videos);

    // Group videos by user and filter out any videos where profile data is invalid
    const userVideos = new Map();
    videos?.forEach(video => {
      const profile = video.profiles;
      // Skip if profile is missing or user_id is null (indicating deleted user)
      if (!profile || !profile.user_id) return;
      
      const username = profile.username;
      
      if (!userVideos.has(username)) {
        userVideos.set(username, {
          id: profile.id,
          username: username,
          avatarUrl: profile.avatar_url || '/placeholder.svg',
          displayName: profile.display_name || username,
          videoUrl: video.video_url, // Make sure this is set from the first video
          videos: []
        });
      }
      userVideos.get(username).videos.push({
        ...video,
        username: username,
        avatarUrl: profile.avatar_url || '/placeholder.svg',
        displayName: profile.display_name || username
      });
    });

    // Convert to array and add current user if not present and valid
    const storyList = Array.from(userVideos.values());
    
    if (currentUser && currentUser.user_id && !userVideos.has(currentUser.username)) {
      storyList.unshift({
        id: currentUser.id,
        username: currentUser.username,
        avatarUrl: currentUser.avatar_url || '/placeholder.svg',
        displayName: currentUser.display_name || currentUser.username,
        videos: []
      });
    }

    console.log('Stories with videos:', storyList);
    setStories(storyList);
  };

  useEffect(() => {
    fetchTodayVideos();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('videos-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'videos' },
        () => {
          fetchTodayVideos();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 border-b border-gray-800 transition-transform duration-500 ease-in-out ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      <div className="absolute inset-0 bg-black/92 backdrop-blur-sm" />
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center opacity-25 blur-md"
        style={{
          backgroundImage: "url('/lovable-uploads/0e1be55a-6ca2-4b99-92f1-534f17c1ea5a.png')",
          transform: 'scale(1.1)'
        }}
      />
      <div className="relative z-10 px-4 pt-4 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-semibold font-poppins text-vlogs-text-light">Vlogs</h1>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onLogout}
            className="text-vlogs-text-light hover:bg-vlogs-text-light/10"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
        
        <StoriesBar stories={stories} currentUser={currentUser} />
      </div>
    </header>
  );
};

export default Header;