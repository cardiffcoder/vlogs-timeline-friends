import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Checking for existing profile with name:', name);
      
      // First, check if a profile with this name exists
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('user_id, display_name')
        .eq('display_name', name)
        .maybeSingle();

      if (profileError) {
        console.error('Error checking profile:', profileError);
        throw profileError;
      }

      console.log('Profile check result:', existingProfile);

      // Generate deterministic email and password
      const email = `${name.toLowerCase().replace(/\s+/g, '.')}.user@example.com`;
      const password = `${name.toLowerCase()}_password`;

      if (existingProfile) {
        console.log('Existing user found, attempting sign in');
        
        // User exists, try to sign in
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (signInError) {
          console.error('Sign in error:', signInError);
          throw signInError;
        }

        toast({
          title: "Welcome back!",
          description: `Hey ${name}, good to see you again!`,
        });

        // Existing users go straight to home
        navigate('/', { replace: true });
      } else {
        // New user, create account
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name,
            }
          }
        });

        if (signUpError) {
          console.error('Sign up error:', signUpError);
          throw signUpError;
        }

        // Check if the signup was successful and a session was created
        if (signUpData.session) {
          toast({
            title: "Welcome!",
            description: "Let's set up your profile!",
          });
          // New users are directed to create profile
          navigate('/photo-upload', { replace: true });
        } else {
          // If no session, something went wrong
          throw new Error("Failed to create account");
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Welcome to Vlogs 🎥</h1>
          <p className="text-muted-foreground">Enter your name to continue</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full"
              disabled={isLoading}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading || !name.trim()}
          >
            {isLoading ? 'Loading...' : 'Continue'}
          </Button>
        </form>
      </div>
    </div>
  );
}
