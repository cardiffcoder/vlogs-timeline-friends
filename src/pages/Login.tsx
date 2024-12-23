import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AuthForm } from '@/components/auth/AuthForm';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

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
    try {
      setLoading(true);
      
      // Generate a random email and password for anonymous auth
      const email = `${crypto.randomUUID()}@anonymous.com`;
      const password = crypto.randomUUID();
      
      // Create a new user account
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;
      if (!user) throw new Error('No user created');

      // Create the user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          username: name.toLowerCase().replace(/\s+/g, ''),
          full_name: name,
          updated_at: new Date().toISOString(),
        });

      if (profileError) throw profileError;

      toast({
        title: "Profile created successfully",
        description: "Now let's add a profile photo!",
      });
      
      navigate('/photo-upload');
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

        <AuthForm 
          onSubmit={handleSubmit}
          isLoading={loading}
        />
      </div>
    </div>
  );
}