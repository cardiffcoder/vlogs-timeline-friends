import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import VideoList from "@/components/VideoList";
import AddVideoButton from "@/components/AddVideoButton";
import { useEffect, useState } from "react";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showSplash, setShowSplash] = useState(true);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      toast({
        title: "Logged out successfully",
        description: "Come back soon!",
      });
      
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      
      localStorage.clear();
      navigate('/login', { replace: true });
      
      toast({
        title: "Logged out",
        description: "You have been signed out.",
      });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 10000); // Show splash screen for 10 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleAddVideo = () => {
    navigate('/video-upload');
  };

  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-[#111111] flex items-center justify-center z-50 animate-fadeIn">
        <div className="text-center space-y-6 p-4">
          <h1 className="text-vlogs text-4xl md:text-5xl font-bold text-vlogs-text mb-4">
            Vlogs
          </h1>
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-6">
            Make social-media social again
          </h2>
          <div className="relative inline-block">
            <p className="text-gray-300 text-sm md:text-base max-w-md leading-relaxed">
              Keep up with your actual friends' lives on Vlogs. Share your life{" "}
              <span className="relative">
                <span className="absolute -left-0.5 -top-0.5 text-gray-600 opacity-50">
                  again
                </span>
                <span className="relative z-10 text-white font-semibold">
                  again
                </span>
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  }

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