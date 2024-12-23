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
      }
    };
    checkAuth();
  }, [navigate]);

  const handleSubmit = async (name: string, vlogName: string) => {
    try {
      setLoading(true);
      console.log("Starting authentication process...");
      
      if (showSignUp) {
        // Generate a unique email and password for the user
        const email = `${name.toLowerCase().replace(/\s+/g, '')}_${Date.now()}@vlog.local`;
        const password = crypto.randomUUID();
        
        const { data: { user }, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
              password: password // Store password in metadata for login
            }
          }
        });

        if (signUpError) throw signUpError;
        if (!user) throw new Error('No user created');

        toast({
          title: "Profile created successfully",
          description: "Now let's add a profile photo!",
        });
        
        navigate('/photo-upload');
      } else {
        // Login flow
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('user_id, full_name')
          .eq('full_name', name)
          .maybeSingle();

        if (profileError) throw profileError;

        if (!profiles) {
          toast({
            title: "User not found",
            description: "No account found with that name. Please sign up instead.",
            variant: "destructive",
          });
          return;
        }

        // Get user metadata to retrieve the password
        const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
        const user = users?.find(u => u.id === profiles.user_id);
        
        if (!user) {
          toast({
            title: "Error finding user",
            description: "Please try signing up instead",
            variant: "destructive",
          });
          return;
        }

        // Use the stored password from metadata
        const password = user.user_metadata.password;
        const email = user.email;

        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        toast({
          title: "Welcome back!",
          description: `Successfully logged in as ${name}`,
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Please try again",
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