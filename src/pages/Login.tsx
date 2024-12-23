import { useState, useEffect } from 'react';
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

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    checkAuth();
  }, [navigate]);

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
      
      // First, create an anonymous session
      const { data: { session }, error: authError } = await supabase.auth.signInWithPassword({
        email: `${crypto.randomUUID()}@anonymous.com`,
        password: crypto.randomUUID(),
      });

      if (authError) throw authError;
      if (!session?.user) throw new Error('No session created');

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          user_id: session.user.id,
          username: name.toLowerCase().replace(/\s+/g, ''),
          full_name: name,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        });

      if (profileError) throw profileError;

      toast({
        title: "Profile created successfully",
        description: "Welcome to the platform!",
      });
      
      navigate('/');
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error creating profile",
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