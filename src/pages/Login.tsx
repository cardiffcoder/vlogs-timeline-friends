import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProfilePhotoUpload } from '@/components/ProfilePhotoUpload';
import { AuthForm } from '@/components/auth/AuthForm';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (name: string, vlogName: string) => {
    if (!avatarUrl) {
      toast({
        title: "Profile photo required",
        description: "Please upload a profile photo to continue.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          username: name.toLowerCase().replace(/\s+/g, ''),
          full_name: name,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Profile created successfully",
        description: "Welcome to the platform!",
      });
      
      navigate('/');
    } catch (error) {
      toast({
        title: "Error creating profile",
        description: "Please try again.",
        variant: "destructive",
      });
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Start your vlog 🤳</h1>
        </div>
        
        <ProfilePhotoUpload
          onPhotoUploaded={setAvatarUrl}
          currentPhotoUrl={avatarUrl || undefined}
        />

        <AuthForm 
          onSubmit={handleSubmit}
          isLoading={loading}
        />
      </div>
    </div>
  );
}