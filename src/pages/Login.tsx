import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PhoneInput } from "@/components/auth/PhoneInput";
import { toast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Check for existing session on component mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Generate a random email and password since Supabase requires them
      const randomString = Math.random().toString(36).substring(7);
      const randomEmail = `${randomString}@temporary.com`;
      const randomPassword = Math.random().toString(36).slice(-12);

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: randomEmail,
        password: randomPassword,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (signUpError) {
        toast({
          title: "Error",
          description: signUpError.message,
          variant: "destructive",
        });
        return;
      }

      if (signUpData.user) {
        // Generate a username from the full name (removing spaces and special characters)
        const username = fullName.toLowerCase().replace(/[^a-z0-9]/g, '');
        
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: signUpData.user.id,
            full_name: fullName,
            username: username
          });

        if (profileError) {
          toast({
            title: "Warning",
            description: "Account created but failed to save profile information",
            variant: "destructive",
          });
        }

        toast({
          title: "Success",
          description: "Account created successfully!",
        });
        
        // The navigation will be handled by the auth state change listener
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-black/50 p-8 rounded-lg backdrop-blur-sm border border-gray-800">
        <h1 className="text-3xl font-semibold text-vlogs-text mb-8 text-center">
          Vlogs
        </h1>

        <form onSubmit={handleLogin} className="space-y-6">
          <PhoneInput
            fullName={fullName}
            setFullName={setFullName}
            isLoading={isLoading}
          />
          <button
            type="submit"
            className="w-full bg-vlogs-primary text-white py-2 px-4 rounded-md hover:bg-vlogs-primary/90 transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;