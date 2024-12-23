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
      
      if (showSignUp) {
        // Check if a user with this name already exists
        const { data: existingProfiles } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('full_name', name)
          .maybeSingle();

        if (existingProfiles) {
          toast({
            title: "Name already taken",
            description: "Please choose a different name or log in instead",
            variant: "destructive",
          });
          return;
        }

        // Generate a random email and password for anonymous auth
        const email = `${crypto.randomUUID()}@anonymous.com`;
        const password = crypto.randomUUID();
        
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

        // Create the user profile with a unique username
        const username = `${name.toLowerCase().replace(/\s+/g, '')}_${crypto.randomUUID().slice(0, 8)}`;
        
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: user.id,
            username: username,
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
        
        navigate('/photo-upload');
      } else {
        // Login flow - find user by name
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('user_id, full_name')
          .eq('full_name', name)
          .maybeSingle();

        if (!profile) {
          toast({
            title: "User not found",
            description: "No account found with that name. Please sign up instead.",
            variant: "destructive",
          });
          return;
        }

        if (profileError) {
          console.error("Profile lookup error:", profileError);
          toast({
            title: "Error looking up profile",
            description: "Please try again",
            variant: "destructive",
          });
          return;
        }

        // Since we found the profile, we can proceed with login
        const { data: { session }, error: signInError } = await supabase.auth.signInWithPassword({
          email: `${profile.user_id}@anonymous.com`,
          password: profile.user_id, // Using user_id as password for simplicity
        });

        if (signInError) {
          console.error("Login error:", signInError);
          toast({
            title: "Login failed",
            description: "Please try again",
            variant: "destructive",
          });
          return;
        }

        if (session) {
          toast({
            title: "Welcome back!",
            description: `Successfully logged in as ${profile.full_name}`,
          });
          navigate('/');
        }
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