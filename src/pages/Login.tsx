import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AuthForm } from '@/components/auth/AuthForm';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [showSignUp, setShowSignUp] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.log("User is authenticated:", session.user);
        navigate('/');
      } else {
        console.log("No active session found");
      }
    };
    checkAuth();
  }, [navigate]);

  const handleSubmit = async (name: string, vlogName: string) => {
    try {
      setLoading(true);
      console.log("Starting authentication process...");
      
      // Generate a random email and password for anonymous auth
      const email = `${crypto.randomUUID()}@anonymous.com`;
      const password = crypto.randomUUID();
      
      if (showSignUp) {
        // Create a new user account
        const { data: { user }, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) {
          console.error("Signup error:", signUpError);
          throw signUpError;
        }
        if (!user) throw new Error('No user created');

        console.log("User created successfully:", user.id);

        // Create the user profile
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            user_id: user.id,
            username: name.toLowerCase().replace(/\s+/g, ''),
            full_name: name,
            updated_at: new Date().toISOString(),
          });

        if (profileError) {
          console.error("Profile creation error:", profileError);
          throw profileError;
        }

        console.log("Profile created successfully");
        toast({
          title: "Profile created successfully",
          description: "Now let's add a profile photo!",
        });
      } else {
        // Login flow - find user by name
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('user_id')
          .eq('full_name', name)
          .single();

        if (profileError || !profiles) {
          throw new Error('User not found');
        }

        // Sign in with the found user's credentials
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          throw signInError;
        }

        toast({
          title: "Welcome back!",
          description: "Successfully logged in",
        });
      }
      
      // Only navigate after confirming the user is actually logged in
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.log("Session confirmed, navigating to home");
        navigate('/');
      } else {
        throw new Error('Failed to create session');
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
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
          {showSignUp ? (
            <>
              <h1 className="text-2xl font-bold">Start your vlog 🤳</h1>
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <button 
                  onClick={() => setShowSignUp(false)}
                  className="text-primary hover:underline"
                >
                  Log in
                </button>
              </p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold">Welcome back! 👋</h1>
              <p className="text-muted-foreground">
                Don't have an account?{" "}
                <button 
                  onClick={() => setShowSignUp(true)}
                  className="text-primary hover:underline"
                >
                  Sign up
                </button>
              </p>
            </>
          )}
        </div>

        <AuthForm 
          onSubmit={handleSubmit}
          isLoading={loading}
          isLogin={!showSignUp}
        />
      </div>
    </div>
  );
}