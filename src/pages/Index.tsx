import Header from "@/components/Header";
import VideoList from "@/components/VideoList";
import AddVideoButton from "@/components/AddVideoButton";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
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
    } catch (error) {
      console.error('Error checking auth status:', error);
      navigate('/login');
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

  const handleAddVideo = () => {
    navigate('/photo-upload');
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