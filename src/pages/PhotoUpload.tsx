import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { ProfilePhotoUpload } from '@/components/ProfilePhotoUpload';
import { useToast } from "@/hooks/use-toast";

export default function PhotoUpload() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
      }
    };
    checkAuth();
  }, [navigate]);

  const handlePhotoUploaded = async (url: string) => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No session found');
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .update({ avatar_url: url })
        .eq('user_id', session.user.id);

      if (profileError) throw profileError;

      toast({
        title: "Profile photo updated",
        description: "Your profile is now complete!",
      });
      
      navigate('/');
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error updating profile photo",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Add a profile photo 📸</h1>
          <p className="text-muted-foreground">Choose a photo that represents you</p>
        </div>
        
        <ProfilePhotoUpload
          onPhotoUploaded={handlePhotoUploaded}
        />
      </div>
    </div>
  );
}