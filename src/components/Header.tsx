import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import VideoStoriesViewer from "./VideoStoriesViewer";
import { format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

interface HeaderProps {
  onLogout: () => void;
}

interface Story {
  id: number;
  username: string;
  avatarUrl: string;
  displayName?: string;
  videoUrl?: string;
  videoThumbnail?: string;
  position?: string;
}

const Header = ({ onLogout }: HeaderProps) => {
  const isVisible = useScrollDirection();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStoryVideos, setSelectedStoryVideos] = useState<any[]>([]);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null);

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
    const pstDate = utcToZonedTime(new Date(), 'America/Los_Angeles');
    const todayStart = new Date(pstDate);
    todayStart.setHours(0, 0, 0, 0);
    
    const { data: videos, error } = await supabase
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
      .gte('created_at', todayStart.toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching videos:', error);
      return;
    }

    // Group videos by user
    const userVideos = new Map();
    videos?.forEach(video => {
      const username = video.profiles?.username || video.username;
      if (!userVideos.has(username)) {
        userVideos.set(username, {
          id: video.id,
          username,
          avatarUrl: video.profiles?.avatar_url || video.avatar_url,
          displayName: video.profiles?.display_name || video.display_name,
          videoUrl: video.video_url,
          videos: []
        });
      }
      userVideos.get(username).videos.push(video);
    });

    // Convert to array and add current user if not present
    const storyList = Array.from(userVideos.values());
    
    if (currentUser && !userVideos.has(currentUser.username)) {
      storyList.unshift({
        id: currentUser.id,
        username: currentUser.username,
        avatarUrl: currentUser.avatar_url,
        displayName: currentUser.display_name,
        videos: []
      });
    }

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

  const handleStoryClick = (story: Story) => {
    const userVideos = stories.find(s => s.username === story.username)?.videos || [];
    if (userVideos.length > 0) {
      setSelectedStoryVideos(userVideos);
      setSelectedUsername(story.username);
      setIsViewerOpen(true);
    }
  };

  return (
    <>
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
          
          <div className="flex space-x-6 overflow-x-auto pb-4 pr-4 scrollbar-hide scale-[1.2] origin-left mt-6">
            {stories.map((story) => (
              <div 
                key={story.id} 
                className="flex flex-col items-center scale-140 transform-gpu cursor-pointer"
                onClick={() => handleStoryClick(story)}
              >
                <div className="rounded-full p-[2px]" style={{ backgroundColor: story.videos?.length ? '#F0FCFE' : 'transparent' }}>
                  <Avatar className="h-14 w-14 ring-2 ring-vlogs-text-light">
                    <AvatarImage 
                      src={story.videos?.length ? story.videos[0].video_url : story.avatarUrl} 
                      alt={story.username} 
                      className={`object-cover ${story.position || ''}`}
                    />
                    <AvatarFallback>{story.username[0]}</AvatarFallback>
                  </Avatar>
                </div>
                <span className={`text-[10px] text-gray-200 mt-1 font-mona-sans ${
                  currentUser?.username === story.username ? "font-bold" : "font-medium"
                }`}>
                  {story.username}
                </span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {isViewerOpen && selectedStoryVideos.length > 0 && (
        <VideoStoriesViewer
          videos={selectedStoryVideos}
          onClose={() => {
            setIsViewerOpen(false);
            setSelectedStoryVideos([]);
            setSelectedUsername(null);
          }}
        />
      )}
    </>
  );
};

export default Header;