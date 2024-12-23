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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        console.log('Checking auth status...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }

        if (!mounted) return;
        
        const isAuth = !!session;
        console.log('Is authenticated:', isAuth);
        setIsAuthenticated(isAuth);

        if (session?.user) {
          console.log('Checking profile for user:', session.user.id);
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id, avatar_url')
            .eq('user_id', session.user.id)
            .maybeSingle();

          if (profileError) {
            console.error('Profile error:', profileError);
            throw profileError;
          }
          
          if (!mounted) return;
          
          const hasCompleteProfile = !!profile && !!profile.avatar_url;
          console.log('Has complete profile:', hasCompleteProfile);
          setHasProfile(hasCompleteProfile);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        if (!mounted) return;
        setIsAuthenticated(false);
        setHasProfile(false);
      } finally {
        if (mounted) {
          console.log('Setting loading to false');
          setIsLoading(false);
        }
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      
      const isAuth = !!session;
      console.log('Auth state changed. Is authenticated:', isAuth);
      setIsAuthenticated(isAuth);
      
      if (session?.user) {
        try {
          console.log('Checking profile after auth change for user:', session.user.id);
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id, avatar_url')
            .eq('user_id', session.user.id)
            .maybeSingle();

          if (profileError) {
            console.error('Profile error after auth change:', profileError);
            throw profileError;
          }
          
          if (!mounted) return;
          
          const hasCompleteProfile = !!profile && !!profile.avatar_url;
          console.log('Has complete profile after auth change:', hasCompleteProfile);
          setHasProfile(hasCompleteProfile);
        } catch (error) {
          console.error('Profile check error after auth change:', error);
          if (!mounted) return;
          setHasProfile(false);
        }
      } else {
        if (mounted) {
          setHasProfile(false);
        }
      }
      
      if (mounted) {
        console.log('Setting loading to false after auth change');
        setIsLoading(false);
      }
    });

    return () => {
      console.log('Cleaning up auth effect');
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
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (isAuthenticated && !hasProfile && window.location.pathname !== '/photo-upload') {
    console.log('Authenticated but no profile, redirecting to photo upload');
    return <Navigate to="/photo-upload" replace />;
  }

  console.log('Rendering protected content');
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