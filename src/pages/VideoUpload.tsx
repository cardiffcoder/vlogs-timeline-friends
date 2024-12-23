import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function VideoUpload() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Upload your video 🎥</h1>
          <p className="text-muted-foreground">Share your latest vlog with the world</p>
        </div>
        
        {/* Video upload component will be implemented in the next iteration */}
        <div className="text-center text-muted-foreground">
          Video upload coming soon!
        </div>
      </div>
    </div>
  );
}