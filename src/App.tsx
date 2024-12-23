import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import Login from "./pages/Login";
import PhotoUpload from "./pages/PhotoUpload";
import VideoUpload from "./pages/VideoUpload";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (!mounted) return;
        
        setIsAuthenticated(!!session);

        if (session?.user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id, avatar_url')
            .eq('user_id', session.user.id)
            .maybeSingle();

          if (profileError) throw profileError;
          
          if (!mounted) return;
          
          setHasProfile(!!profile && !!profile.avatar_url);
        } else {
          setHasProfile(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        if (!mounted) return;
        setIsAuthenticated(false);
        setHasProfile(false);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      
      setIsAuthenticated(!!session);
      
      if (session?.user) {
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id, avatar_url')
            .eq('user_id', session.user.id)
            .maybeSingle();

          if (profileError) throw profileError;
          
          if (!mounted) return;
          
          setHasProfile(!!profile && !!profile.avatar_url);
        } catch (error) {
          console.error('Profile check error:', error);
          if (!mounted) return;
          setHasProfile(false);
        }
      } else {
        setHasProfile(false);
      }
      
      if (mounted) {
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return <div className="min-h-screen bg-[#111111] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-vlogs-text border-t-transparent rounded-full animate-spin" />
    </div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isAuthenticated && !hasProfile && window.location.pathname !== '/photo-upload') {
    return <Navigate to="/photo-upload" replace />;
  }

  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/photo-upload" element={
            <ProtectedRoute>
              <PhotoUpload />
            </ProtectedRoute>
          } />
          <Route path="/video-upload" element={
            <ProtectedRoute>
              <VideoUpload />
            </ProtectedRoute>
          } />
          <Route path="/" element={
            <ProtectedRoute>
              <Index />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;