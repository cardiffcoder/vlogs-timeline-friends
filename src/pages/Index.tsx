import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import VideoList from "@/components/VideoList";
import AddVideoButton from "@/components/AddVideoButton";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      // Attempt to sign out
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      toast({
        title: "Logged out successfully",
        description: "Come back soon!",
      });
      
      // Force navigation to login page
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      
      // Even if there's an error, we'll clear local storage and redirect
      localStorage.clear();
      navigate('/login', { replace: true });
      
      toast({
        title: "Logged out",
        description: "You have been signed out.",
      });
    }
  };

  const handleAddVideo = () => {
    navigate('/video-upload');
  };

  return (
    <div className="min-h-screen bg-[#111111]">
      <Header onLogout={handleLogout} />
      <main className="pt-0">
        <VideoList />
      </main>
      <AddVideoButton onVideoAdd={handleAddVideo} />
    </div>
  );
};

export default Index;