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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    let mounted = true;

    // Initial session check
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!mounted) return;
      
      if (error) {
        console.error('Session error:', error);
        setIsLoading(false);
        return;
      }

      setIsAuthenticated(!!session);
      
      if (session?.user) {
        // Check for profile
        supabase
          .from('profiles')
          .select('id')
          .eq('user_id', session.user.id)
          .maybeSingle()
          .then(({ data: profile }) => {
            if (mounted) {
              setHasProfile(!!profile);
              setIsLoading(false);
            }
          });
      } else {
        setIsLoading(false);
      }
    });

    // Auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      
      setIsAuthenticated(!!session);
      
      if (session?.user) {
        supabase
          .from('profiles')
          .select('id')
          .eq('user_id', session.user.id)
          .maybeSingle()
          .then(({ data: profile }) => {
            if (mounted) {
              setHasProfile(!!profile);
            }
          });
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-vlogs-text border-t-transparent rounded-full animate-spin" />
      </div>
    );
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