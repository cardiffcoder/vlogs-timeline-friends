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
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Logged out successfully",
        description: "Come back soon!",
      });
      
      navigate('/login');
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error logging out",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
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