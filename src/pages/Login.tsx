import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PhoneInput } from "@/components/auth/PhoneInput";
import { toast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Generate email and password based on username
      const email = `${username}@temporary.app`;
      const password = username;

      // First try to sign in
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        if (signInError.message.includes("Invalid login credentials")) {
          // If login fails, try to sign up
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                username: username,
              },
            },
          });

          if (signUpError) {
            if (signUpError.message.includes("User already registered")) {
              // If user exists but password is wrong, show error
              toast({
                title: "Error",
                description: "Invalid username or password",
                variant: "destructive",
              });
              return;
            }
            throw signUpError;
          }

          if (signUpData.user) {
            // Create profile after successful signup
            const { error: profileError } = await supabase
              .from('profiles')
              .insert({
                user_id: signUpData.user.id,
                username: username
              });

            if (profileError) {
              toast({
                title: "Warning",
                description: "Account created but failed to save profile information",
                variant: "destructive",
              });
            } else {
              toast({
                title: "Success",
                description: "Account created successfully!",
              });
            }
            navigate("/");
          }
        } else {
          throw signInError;
        }
      } else {
        // Successful login
        toast({
          title: "Welcome back!",
          description: "Successfully logged in.",
        });
        navigate("/");
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
            username={username}
            setUsername={setUsername}
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